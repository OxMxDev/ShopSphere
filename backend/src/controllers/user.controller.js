import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { DeleteFile } from "../utils/cloudinary.js";

function extractPublicId(cloudinaryUrl) {
	const parts = cloudinaryUrl.split("/");
	const uploadIndex = parts.indexOf("upload");
	const publicIdWithExtension = parts.slice(uploadIndex + 2).join("/");
	const publicId = publicIdWithExtension.split(".")[0];
	return publicId;
}

const generateAccessAndRefeshTokens = async (userId) => {
	try {
		const user = await User.findById(userId);
		const accessToken = user.generateAccessToken();
		const refreshToken = user.generateRefreshToken();

		user.refreshToken = refreshToken;
		await user.save({ validateBeforeSave: false });

		return { accessToken, refreshToken };
	} catch (error) {
		throw new ApiError(
			500,
			"Something went wrong while generating refresh and access tokens"
		);
	}
};

// User functions

const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password, address, phone } = req.body;

	if (
		[name, email, password, address, phone].some(
			(field) => field?.trim() === ""
		)
	) {
		throw new ApiError(400, "All fields are required");
	}

	const existingUser = await User.findOne({
		$or: [{ phone }, { email }],
	});

	if (existingUser) {
		throw new ApiError(400, "User already exists with same phone no. or email");
	}

	const avatarLocalPath = req.files?.avatar?.[0].path;

	console.log(req.files);

	if (!avatarLocalPath) {
		throw new ApiError(400, "Avatar file is required");
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		throw new ApiError(400, "Invalid email format");
	}

	if (phone.length !== 10) {
		throw new ApiError(400, "Invalid phone number");
	}

	const avatar = await uploadOnCloudinary(avatarLocalPath);
	console.log(avatar);
	if (!avatar?.url) {
		throw new ApiError(500, "Failed to upload avatar to cloud storage");
	}

	const user = await User.create({
		name,
		avatar: avatar.url,
		email,
		password,
		phone,
		address,
		role: "user",
	});

	const createdUser = await User.findById(user._id).select(
		"-password -refreshToken"
	);

	if (!createdUser) {
		throw new ApiError(500, "Something went wrong registering the user");
	}

	return res
		.status(201)
		.json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new ApiError(400, "Email and password are required");
	}

	const user = await User.findOne({
		email,
	});

	if (!user) {
		throw new ApiError(401, "Invalid email or password");
	}

	const isPasswordValid = await user.isPasswordCorrect(password);

	if (!isPasswordValid) {
		throw new ApiError(401, "Invalid email or password");
	}

	const { accessToken, refreshToken } = await generateAccessAndRefeshTokens(
		user._id
	);

	const loggedInUser = await User.findById(user._id).select(
		"-password -refreshToken"
	);

	const options = {
		httpOnly: true,
		secure: true,
		sameSite:"none",
		maxAge: 7 * 24 * 60 * 60 * 1000
	};

	return res
		.status(200)
		.cookie("accessToken", accessToken, options)
		.cookie("refreshToken", refreshToken, options)
		.json(
			new ApiResponse(
				200,
				{ user: loggedInUser, accessToken, refreshToken },
				"User logged in successfully"
			)
		);
});

const logoutUser = asyncHandler(async (req, res) => {
	await User.findByIdAndUpdate(
		req.user._id,
		{
			$unset: {
				refreshToken: 1,
			},
		},
		{
			new: true,
		}
	);
	const options = {
		httpOnly: true,
		secure: true,
		sameSite:"none",
		maxAge: 7 * 24 * 60 * 60 * 1000
	};

	return res
		.status(200)
		.clearCookie("accessToken", options)
		.clearCookie("refreshToken", options)
		.json(new ApiResponse(200, {}, "User logged out successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
	const { oldPassword, newPassword } = req.body;

	if (!oldPassword || !newPassword) {
		throw new ApiError(400, "Old password and new password are required");
	}

	if (newPassword.length < 3) {
		throw new ApiError(400, "New password must be at least 3 characters");
	}

	if (oldPassword === newPassword) {
		throw new ApiError(400, "New password must be different from old password");
	}
	const user = await User.findById(req.user?._id);
	const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
	if (!isPasswordCorrect) {
		throw new ApiError(401, "Invalid old password");
	}
	user.password = newPassword;
	await user.save({ validateModifiedOnly: true });

	return res
		.status(200)
		.json(new ApiResponse(200, {}, "Password changed successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
	const { name, email, address, phone } = req.body;

	if (!name || !email || !address || !phone) {
		throw new ApiError(401, "All fields are required");
	}

	const user = await User.findByIdAndUpdate(
		req.user._id,
		{
			$set: {
				name,
				email,
				address,
				phone,
			},
		},
		{ new: true }
	).select("-password");

	return res
		.status(200)
		.json(new ApiResponse(200, user, "User details updated successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
	const incomingRefreshToken =
		req.cookies.refreshToken || req.body.refreshToken;

	if (!incomingRefreshToken) {
		throw new ApiError(401, "Unauthorized request");
	}

	try {
		const decodedToken = jwt.verify(
			incomingRefreshToken,
			process.env.REFRESH_TOKEN_SECRET
		);
		const user = await User.findById(decodedToken?._id);
		if (!user) {
			throw new ApiError(401, "Invalid refresh token");
		}

		if (incomingRefreshToken !== user?.refreshToken) {
			throw new ApiError(401, "Refresh token is expired or used");
		}

		const options = {
			httpOnly: true,
			secure: true,
			sameSite:"none",
			maxAge: 7 * 24 * 60 * 60 * 1000
		};

		const { accessToken, refreshToken } =
			await generateAccessAndRefeshTokens(user._id);

		return res
			.status(200)
			.cookie("accessToken", accessToken, options)
			.cookie("refreshToken", refreshToken, options)
			.json(
				new ApiResponse(
					200,
					{ accessToken, refreshToken},
					"Access token refreshed successfully"
				)
			);
	} catch (error) {
		throw new ApiError(401, error?.message || "Invalid refresh Token");
	}
});

const updateUserAvatar = asyncHandler(async (req, res) => {
	const avatarLocalPath = req.file?.path;
	if (!avatarLocalPath) {
		throw new ApiError(400, "Avatar field is missing");
	}
	const oldUser = await User.findById(req.user._id);
	const oldAvatarUrl = oldUser?.avatar;
	const avatar = await uploadOnCloudinary(avatarLocalPath);
	if (!avatar || !avatar.url) {
		throw new ApiError(
			500,
			"Something went wrong while uploading avatar to cloud storage"
		);
	}

	const user = await User.findByIdAndUpdate(
		req.user._id,
		{
			$set: {
				avatar: avatar.url,
			},
		},
		{ new: true }
	).select("-password");

	if (oldAvatarUrl) {
		try {
			const publicId = extractPublicId(oldAvatarUrl);
			await DeleteFile(publicId);
		} catch (error) {
			console.error("Failed to delete old avatar:", error.message);
		}
	}

	return res
		.status(200)
		.json(new ApiResponse(200, user, "User avatar updated successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
	console.log(req.user);
	return res
		.status(200)
		.json(new ApiResponse(200, req.user, "Current User fetched successfully"));
});

const forgotPassword = asyncHandler(async(req,res)=>{
    // to be implemented
})

const registerAdmin = asyncHandler(async(req,res)=>{
    const {name,email,password,address,phone,adminKey} = req.body

    if (adminKey !== process.env.ADMIN_REGISTRATION_KEY) {
			throw new ApiError(403, "Invalid admin registration key");
		}

    if([name,email,password,address,phone].some(field=>field?.trim() === "")){
        throw new ApiError(400,"All fields are required")
    }
    const existingUser = await User.findOne({
        $or:[{phone},{email}]
    })
    if(existingUser){
        throw new ApiError(400,"User already exists with same phone no. or email")
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			throw new ApiError(400, "Invalid email format");
		}

		// Validate phone number
		if (phone.length !== 10) {
			throw new ApiError(400, "Invalid phone number");
		}

    const avatarLocalPath = req.files?.avatar?.[0].path

    console.log(req.files)
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    console.log(avatar)
    if(!avatar?.url){
        throw new ApiError(500,"Failed to upload avatar to cloud storage")
    }
    const user = await User.create({
        name,
        avatar:avatar.url,
        email,
        password,
        phone,
        address,
        role:"admin"
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new ApiError(500,"Something went wrong registering the user")
    }
    return res
    .status(201)
    .json(new ApiResponse(201,createdUser,"Admin registered successfully"))
})
export {
	registerUser,
	loginUser,
	logoutUser,
	getCurrentUser,
	changeCurrentPassword,
	updateAccountDetails,
	refreshAccessToken,
	updateUserAvatar,
    registerAdmin
};
