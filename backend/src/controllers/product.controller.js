import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Product} from "../models/product.model.js"
import jwt from "jsonwebtoken"
import { DeleteFile } from "../utils/cloudinary.js";

const createProduct = asyncHandler(async(req,res)=>{
    const {name,description,price,brand,category,stock} = req.body
    if (
			!name ||
			!description ||
			price === undefined ||
			!brand ||
			!category ||
			stock === undefined
		) {
			throw new ApiError(400, "All fields are required");
		}

    const productImage = req.files?.images?.[0].path

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
        images:[proImage.url]
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
    const {keyword,category,brand,minPrice,maxPrice,page = 1,limit = 10} = req.query
    const query = {}
    if(keyword) query.name = {$regex:keyword,$options:"i"};
    if(category) query.category = category
    if(brand) query.brand = brand
    if(minPrice || maxPrice) query.price = {$gte:minPrice || 0,$lte:maxPrice||999999}
    const products = await Product.find(query)
        .skip((page-1)*limit)
        .limit(Number(limit))
    const total = await Product.countDocuments(query)

    return res
    .status(200)
    .json(new ApiResponse(200,{products,total},"Products fetched successfully"))
})

const getProductById = asyncHandler(async(req,res)=>{
    const {id} = req.params
    if(!id){
        throw new ApiError(400,"Product ID is required")
    }
    const product = await Product.findById(id)

    if (!product) {
		throw new ApiError(404, "Product not found");
	}
    return res
    .status(200)
    .json(new ApiResponse(200,product,"Product fetched successfully"))
})

const updateProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params
    const {name,price,stock,description,category,brand} = req.body

    if(!id){
        throw new ApiError(400,"Product Id is required")
    }

    if (
			price === undefined &&
			stock === undefined &&
			description === undefined &&
			category === undefined &&
			brand === undefined
		) {
			throw new ApiError(400, "No fields to update");
		}
    const updatedFields = {}
    if(name !== undefined){
        updatedFields.name = name
    }
    if(price !== undefined){
        updatedFields.price = price
    }
    if(stock !== undefined){
        updatedFields.stock = stock
    }
    if(description !== undefined){
        updatedFields.description = description
    }
    if(category !== undefined){
        updatedFields.category = category
    }
    if(brand !== undefined){
        updatedFields.brand = brand
    }
    const updateProduct = await Product.findByIdAndUpdate(
        id,
        {
            $set:updatedFields,
        },
        {new:true}
    )
    if(!updateProduct){
        throw new ApiError(400,"Product not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,updateProduct,"Product updated successfully"))
})

const deleteProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params
    const product = await Product.findById(id)
    if(!product){
        throw new ApiError(404,"Product not found")
    }
    if (product.images && product.images.length > 0) {
			const imageUrl = product.images[0];
			const parts = imageUrl.split("/");
			const fileName = parts[parts.length - 1];
			const publicId = fileName.split(".")[0];

			await DeleteFile(publicId);
		}

    await Product.findByIdAndDelete(id)
    return res
    .status(200)
    .json(new ApiResponse(200,{},"Product deleted successfully"))
})

export
{
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
}