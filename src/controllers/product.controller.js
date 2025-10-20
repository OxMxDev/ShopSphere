import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { asyncHandler } from "../utils/asyncHandler";
import {Product} from "../models/product.model.js"
import jwt from "jsonwebtoken"
import { DeleteFile } from "../utils/cloudinary";

const createProduct = asyncHandler(async(req,res)=>{
    const {name,} = req.body

})

export
{
    createProduct
}