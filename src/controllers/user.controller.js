import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {User} from "../models/user.model.js"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"

const registerUser = asyncHandler(async(req,res)=>{
    const { name, email, password, address, phone } = req.body;

    if([name,email,password,address,phone].some((field)=>field?.trim() === "")){
        throw new ApiError(400,"All fields are required")
    }

    const existingUser = await User.findOne({
        $or:[{phone},{email}],
    })

    if(existingUser){
        throw new ApiError(400,"User already exists with same phone no. or email")
    }

    const avatarLocalPath = req.files?.avatar[0].path

    console.log(req.files)

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }

    const user = await User.create({
        name,
        email,
        password,
        phone,
        address,
        avatar:avatar.url,
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500,"Something went wrong registering the user")
    }

    return res
    .status(201)
    .json(new ApiResponse(201,createdUser,"User registered successfully"))
})


export {registerUser} 