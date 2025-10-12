import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";

export const verifyJWT = asyncHandler(async(req,_,next)=>{
    try{
        const token = req.cookie?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(404,"Unauthorized Error")
        }
        console.log("Token received:",token)
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user){
            // discuss about frontend
            throw new ApiError(401,"Invalid access token")
        }

        req.user = user
        next()
    }catch(err){
        throw new ApiError(401,err?.message || "Invalid access token")
    }
})