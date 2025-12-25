import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = asyncHandler(async(req,_,next)=>{
    try{
        console.log("Full URL:", req.originalUrl);
				console.log("Path:", req.path);
				console.log("Base URL:", req.baseUrl);
				console.log("IP:", req.ip);
				console.log("Origin:", req.get("origin"));
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"Unauthorized Error")
        }
        console.log("Token received:",token)
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user){
            throw new ApiError(401,"Invalid access token")
        }

        req.user = user
        next()
    }catch(err){
        throw new ApiError(401,err?.message || "Invalid access token")
    }
})