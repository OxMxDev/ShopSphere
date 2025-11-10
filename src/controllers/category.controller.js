import {Category} from "../models/category.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { DeleteFile } from "../utils/cloudinary.js";

const createCategory = asyncHandler(async(req,res)=>{
    const {name,description} = req.body
    if(!name?.trim()){
        throw new ApiError(400,"Category name is required")
    }
    const existingCategory = await Category.findOne({name:name.trim()})
    if(existingCategory){
        throw new ApiError(400,"Category with this name already exists")
    }
    let categoryImage = ""
    const categoryImageLocalPath = req.file?.path
    if(categoryImageLocalPath){
        const uploadedImage = await uploadOnCloudinary(categoryImageLocalPath)
        if(!uploadedImage.url){
            throw new ApiError(500,"Failed to upload category image")
        }
        categoryImage = uploadedImage.url
    }
    const category = await Category.create({
        name:name.trim(),
        description:description?.trim() || "",
        image: categoryImage
    })
    const createdCategory = await Category.findById(category._id)
    if(!createdCategory){
        throw new ApiError(500,"Something went wrong while creating category")
    }
    return res
    .status(201)
    .json(new ApiResponse(201,createdCategory,"Category created successfully"))
})

export{
    createCategory
}