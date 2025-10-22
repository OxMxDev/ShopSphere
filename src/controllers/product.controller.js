import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Product} from "../models/product.model.js"
import {Review} from "../models/review.model.js"
import jwt from "jsonwebtoken"
import { DeleteFile } from "../utils/cloudinary.js";

const createProduct = asyncHandler(async(req,res)=>{
    const {name,description,price,brand,category,stock,sku,discount,attributes,tags} = req.body
    if(!name || !description || !price || !brand || !category || !stock){
        throw new ApiError(400,"All field are required")
    }
    
    // Handle multiple images
    const productImages = req.files?.images || []
    if(productImages.length === 0){
        throw new ApiError(400,"At least one Product Image is required")
    }
    
    const imageUrls = []
    for(const image of productImages) {
        const uploadedImage = await uploadOnCloudinary(image.path)
        if(!uploadedImage?.url){
            throw new ApiError(500,"Failed to upload image to cloud storage")
        }
        imageUrls.push(uploadedImage.url)
    }

    const product = await Product.create({
        name,
        description,
        price,
        brand,
        category,
        stock,
        sku,
        discount: discount || 0,
        attributes: attributes ? JSON.parse(attributes) : [],
        tags: tags ? JSON.parse(tags) : [],
        images: imageUrls
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
    const {price,stock} = req.body

    if(!id){
        throw new ApiError(400,"Product Id is required")
    }

    if(!price && !stock){
        throw new ApiError(400,"No fields to update")
    }
    const updatedFields = {}
    if(price !== undefined){
        updatedFields.price = price
    }
    if(stock !== undefined){
        updatedFields.stock = stock
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

// Update all product details
const updateProductDetails = asyncHandler(async(req,res)=>{
    const {id} = req.params
    const {name,description,price,brand,category,stock,sku,discount,attributes,tags,isActive} = req.body

    if(!id){
        throw new ApiError(400,"Product Id is required")
    }

    const updatedFields = {}
    if(name !== undefined) updatedFields.name = name
    if(description !== undefined) updatedFields.description = description
    if(price !== undefined) updatedFields.price = price
    if(brand !== undefined) updatedFields.brand = brand
    if(category !== undefined) updatedFields.category = category
    if(stock !== undefined) updatedFields.stock = stock
    if(sku !== undefined) updatedFields.sku = sku
    if(discount !== undefined) updatedFields.discount = discount
    if(attributes !== undefined) updatedFields.attributes = JSON.parse(attributes)
    if(tags !== undefined) updatedFields.tags = JSON.parse(tags)
    if(isActive !== undefined) updatedFields.isActive = isActive

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
            $set:updatedFields,
        },
        {new:true}
    )
    
    if(!updatedProduct){
        throw new ApiError(404,"Product not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,updatedProduct,"Product details updated successfully"))
})

// Add additional images to a product
const addProductImages = asyncHandler(async(req,res)=>{
    const {id} = req.params
    
    if(!id){
        throw new ApiError(400,"Product Id is required")
    }
    
    const product = await Product.findById(id)
    if(!product){
        throw new ApiError(404,"Product not found")
    }
    
    const productImages = req.files?.images || []
    if(productImages.length === 0){
        throw new ApiError(400,"At least one image is required")
    }
    
    const imageUrls = [...product.images]
    for(const image of productImages) {
        const uploadedImage = await uploadOnCloudinary(image.path)
        if(!uploadedImage?.url){
            throw new ApiError(500,"Failed to upload image to cloud storage")
        }
        imageUrls.push(uploadedImage.url)
    }
    
    product.images = imageUrls
    await product.save()
    
    return res
    .status(200)
    .json(new ApiResponse(200,product,"Product images added successfully"))
})

// Remove specific image from product
const removeProductImage = asyncHandler(async(req,res)=>{
    const {id, imageIndex} = req.params
    
    if(!id){
        throw new ApiError(400,"Product Id is required")
    }
    
    const product = await Product.findById(id)
    if(!product){
        throw new ApiError(404,"Product not found")
    }
    
    if(!product.images || product.images.length === 0){
        throw new ApiError(400,"No images found for this product")
    }
    
    const index = parseInt(imageIndex)
    if(index < 0 || index >= product.images.length){
        throw new ApiError(400,"Invalid image index")
    }
    
    // Delete image from cloudinary
    const imageUrl = product.images[index]
    const parts = imageUrl.split('/')
    const fileName = parts[parts.length - 1]
    const publicId = fileName.split(".")[0]
    await DeleteFile(publicId)
    
    // Remove image from array
    product.images.splice(index, 1)
    await product.save()
    
    return res
    .status(200)
    .json(new ApiResponse(200,product,"Product image removed successfully"))
})

const deleteProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params
    const product = await Product.findById(id)
    if(!product){
        throw new ApiError(404,"Product not found")
    }
    
    // Delete all images from cloudinary
    if(product.images && product.images.length > 0){
        for(const imageUrl of product.images) {
            const parts = imageUrl.split('/')
            const fileName = parts[parts.length - 1]
            const publicId = fileName.split(".")[0]
            await DeleteFile(publicId)
        }
    }
    
    await Product.findByIdAndDelete(id)
    return res
    .status(200)
    .json(new ApiResponse(200,{},"Product deleted successfully"))
})

// Review Management Functions

// Create a review for a product
const createProductReview = asyncHandler(async(req,res)=>{
    const {id} = req.params
    const {rating, comment} = req.body
    
    if(!id){
        throw new ApiError(400,"Product ID is required")
    }
    
    if(!rating || rating < 1 || rating > 5){
        throw new ApiError(400,"Rating must be between 1 and 5")
    }
    
    const product = await Product.findById(id)
    if(!product){
        throw new ApiError(404,"Product not found")
    }
    
    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
        product: id,
        user: req.user._id
    })
    
    if(alreadyReviewed){
        throw new ApiError(400,"You have already reviewed this product")
    }
    
    // Create review
    const review = await Review.create({
        product: id,
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    })
    
    // Update product's rating and numReviews
    const reviews = await Review.find({product: id})
    const numReviews = reviews.length
    const ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews
    
    await Product.findByIdAndUpdate(id, {
        numReviews,
        ratings
    })
    
    return res
    .status(201)
    .json(new ApiResponse(201,review,"Review created successfully"))
})

// Get all reviews for a product
const getProductReviews = asyncHandler(async(req,res)=>{
    const {id} = req.params
    
    if(!id){
        throw new ApiError(400,"Product ID is required")
    }
    
    const product = await Product.findById(id)
    if(!product){
        throw new ApiError(404,"Product not found")
    }
    
    const reviews = await Review.find({product: id}).populate('user', 'name email')
    
    return res
    .status(200)
    .json(new ApiResponse(200,reviews,"Product reviews fetched successfully"))
})

// Delete a review
const deleteReview = asyncHandler(async(req,res)=>{
    const {reviewId} = req.params
    
    if(!reviewId){
        throw new ApiError(400,"Review ID is required")
    }
    
    const review = await Review.findById(reviewId)
    if(!review){
        throw new ApiError(404,"Review not found")
    }
    
    // Check if user is review owner or admin
    if(review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin'){
        throw new ApiError(401,"Not authorized to delete this review")
    }
    
    const productId = review.product
    
    await Review.findByIdAndDelete(reviewId)
    
    // Update product's rating and numReviews
    const reviews = await Review.find({product: productId})
    let numReviews = reviews.length
    let ratings = 0
    
    if(numReviews > 0){
        ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews
    }
    
    await Product.findByIdAndUpdate(productId, {
        numReviews,
        ratings
    })
    
    return res
    .status(200)
    .json(new ApiResponse(200,{},"Review deleted successfully"))
})

// Inventory Management Functions

// Update stock levels
const updateStock = asyncHandler(async(req,res)=>{
    const {id} = req.params
    const {stock} = req.body
    
    if(!id){
        throw new ApiError(400,"Product ID is required")
    }
    
    if(stock < 0){
        throw new ApiError(400,"Stock cannot be negative")
    }
    
    const product = await Product.findByIdAndUpdate(
        id,
        {stock},
        {new:true}
    )
    
    if(!product){
        throw new ApiError(404,"Product not found")
    }
    
    return res
    .status(200)
    .json(new ApiResponse(200,product,"Stock updated successfully"))
})

// Get low stock products
const getLowStockProducts = asyncHandler(async(req,res)=>{
    const {threshold = 5} = req.query
    
    const products = await Product.find({
        stock: {$lte: Number(threshold)}
    }).sort({stock: 1})
    
    return res
    .status(200)
    .json(new ApiResponse(200,products,"Low stock products fetched successfully"))
})

// Enhanced Search and Filtering Functions

// Advanced product search with sorting
const searchProducts = asyncHandler(async(req,res)=>{
    const {
        keyword,
        category,
        brand,
        minPrice,
        maxPrice,
        minRating,
        tags,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10
    } = req.query
    
    const query = {}
    
    if(keyword) query.name = {$regex:keyword,$options:"i"}
    if(category) query.category = category
    if(brand) query.brand = brand
    if(minPrice || maxPrice) query.price = {$gte:minPrice || 0,$lte:maxPrice||999999999}
    if(minRating) query.ratings = {$gte: Number(minRating)}
    if(tags) query.tags = {$in: tags.split(',')}
    query.isActive = true
    
    // Sorting options
    const sortOptions = {}
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1
    
    const products = await Product.find(query)
        .sort(sortOptions)
        .skip((page-1)*limit)
        .limit(Number(limit))
    
    const total = await Product.countDocuments(query)
    
    return res
    .status(200)
    .json(new ApiResponse(200,{products,total,page,limit,totalPages: Math.ceil(total/limit)},"Products searched successfully"))
})

// Get products by category with details
const getProductsByCategory = asyncHandler(async(req,res)=>{
    const {category} = req.params
    const {page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc'} = req.query
    
    if(!category){
        throw new ApiError(400,"Category is required")
    }
    
    const sortOptions = {}
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1
    
    const products = await Product.find({category, isActive: true})
        .sort(sortOptions)
        .skip((page-1)*limit)
        .limit(Number(limit))
    
    const total = await Product.countDocuments({category, isActive: true})
    
    return res
    .status(200)
    .json(new ApiResponse(200,{
        products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total/limit),
        category
    },"Products by category fetched successfully"))
})

// Get products by brand with details
const getProductsByBrand = asyncHandler(async(req,res)=>{
    const {brand} = req.params
    const {page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc'} = req.query
    
    if(!brand){
        throw new ApiError(400,"Brand is required")
    }
    
    const sortOptions = {}
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1
    
    const products = await Product.find({brand, isActive: true})
        .sort(sortOptions)
        .skip((page-1)*limit)
        .limit(Number(limit))
    
    const total = await Product.countDocuments({brand, isActive: true})
    
    return res
    .status(200)
    .json(new ApiResponse(200,{
        products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total/limit),
        brand
    },"Products by brand fetched successfully"))
})

// Get featured/special products
const getFeaturedProducts = asyncHandler(async(req,res)=>{
    const {limit = 10} = req.query
    
    const products = await Product.find({isActive: true})
        .sort({ratings: -1, numReviews: -1})
        .limit(Number(limit))
    
    return res
    .status(200)
    .json(new ApiResponse(200,products,"Featured products fetched successfully"))
})

// Get related products based on category or brand
const getRelatedProducts = asyncHandler(async(req,res)=>{
    const {id} = req.params
    const {limit = 5} = req.query
    
    if(!id){
        throw new ApiError(400,"Product ID is required")
    }
    
    const product = await Product.findById(id)
    if(!product){
        throw new ApiError(404,"Product not found")
    }
    
    // Find products in the same category or brand, excluding the current product
    const relatedProducts = await Product.find({
        $and: [
            {_id: {$ne: id}},
            {$or: [
                {category: product.category},
                {brand: product.brand}
            ]},
            {isActive: true}
        ]
    }).limit(Number(limit))
    
    return res
    .status(200)
    .json(new ApiResponse(200,relatedProducts,"Related products fetched successfully"))
})

export
{
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    updateProductDetails,
    addProductImages,
    removeProductImage,
    createProductReview,
    getProductReviews,
    deleteReview,
    updateStock,
    getLowStockProducts,
    searchProducts,
    getProductsByCategory,
    getProductsByBrand,
    getFeaturedProducts,
    getRelatedProducts
}