import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Product} from "../models/product.model.js"
import jwt from "jsonwebtoken"
import { DeleteFile } from "../utils/cloudinary.js";

const createProduct = asyncHandler(async(req,res)=>{
    const {name,description,price,brand,category,stock} = req.body
    if(!name || !description || !price || !brand || !category || !stock){
        throw new ApiError(400,"All field are required")
    }
    const productImage = req.files?.image?.[0].path

    console.log(req.files)
    if(!productImage){
        throw new ApiError(400,"Product Image is required")
    }
    const proImage = await uploadOnCloudinary(productImage)
    console.log(proImage)

    if(!proImage?.url){
        throw new ApiError(500,"Failed to upload image to cloud storage")
    }

    const product = await Product.create({
        name,
        description,
        price,
        brand,
        category,
        stock,
        images:proImage.url
    })

    const createdProduct = await Product.findById(
        product._id
    )

    if(!createdProduct){
        throw new ApiError(500,"Something went wrong while creating the product")
    }

    return res
    .status(201)
    .json(new ApiResponse(201,createdProduct,"Product created successfully"))
})

const getAllProducts = asyncHandler(async(req,res)=>{
    const products = await Product.find()

    if(!products || products.length === 0){
        throw new Error(404,"No products found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,products,"Products fetched successfully"))
})

export
{
    createProduct,
    getAllProducts
}