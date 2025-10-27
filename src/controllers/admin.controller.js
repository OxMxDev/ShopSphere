import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllUsers = asyncHandler(async(req,res)=>{
    const users = await User.find().select("-password -refreshToken")
    return res
    .status(200)
    .json(new ApiResponse(200,users,"Users fetched successfully"))
})

export {
    getAllUsers
}