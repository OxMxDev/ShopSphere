import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"

export const verifyAdmin = asyncHandler(async(req,_,next)=>{
    if(!req.user){
        throw new ApiError(401,"Authentication required")
    }

    if(req.user.role !== "admin"){
        throw new ApiError(403,"Admin access required")
    }

    next()
})
