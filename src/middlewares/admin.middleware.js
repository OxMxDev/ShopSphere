import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyAdmin = asyncHandler(async(req,_,next) => {
    // Check if user exists and has admin role
    if (!req.user) {
        throw new ApiError(401, "User not authenticated");
    }
    
    if (req.user.role !== 'admin') {
        throw new ApiError(403, "Admin access required");
    }
    
    next();
});