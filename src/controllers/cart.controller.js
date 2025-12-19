import { Cart } from "../models/cart.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Product} from "../models/product.model.js";

const addProductToCart = asyncHandler(async(req,res)=>{
    const {productId,qty} = req.body;
    const product = await Product.findById(productId)
    if(!product){
        throw new ApiError(400,"Product not found")
    }
    if(product.stock < qty){
        throw new ApiError(400,"Insufficient stock")
    }

    let cart = await Cart.findOne({user:req.user._id})
    if(!cart){
        cart = await Cart.create({
            user:req.user._id,
            items:[]
        })
    }
    const existingItemIndex = cart.items.findIndex(item=>item.product.toString()===productId)
    if(existingItemIndex > -1){
        const newQty = cart.items[existingItemIndex].qty + qty
        if(newQty > product.stock){
            throw new ApiError(400,"Insufficient stock")
        }
        cart.items[existingItemIndex].qty = newQty
    }else{
        cart.items.push({product:productId,qty})
    }
    await cart.save();

		cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

		return res
			.status(200)
			.json(new ApiResponse(200, cart, "Product added to cart successfully"));
}) 

const removeProductFromCart = asyncHandler(async(req,res)=>{
    const {productId} = req.body;
    let cart = await Cart.findOne({user:req.user._id})
    if(!cart){
        throw new ApiError(400,"Cart not found")
    }
    const itemIndex = cart.items.findIndex(item=>item.product.toString()===productId)
    if(itemIndex > -1){
        cart.items.splice(itemIndex,1)
    }else{
        throw new ApiError(400,"Product not found in cart")
    }
    await cart.save();

		cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

		return res
			.status(200)
			.json(
				new ApiResponse(200, cart, "Product removed from cart successfully")
			);
})

const getUserCart = asyncHandler(async(req,res)=>{
    let cart = await Cart.findOne({user:req.user._id}).populate('items.product')
    if(!cart){
        return res
        .status(200)
        .json(new ApiResponse(200,{items:[]},"Cart is empty"))
    }
    return res
    .status(200)
    .json(new ApiResponse(200,cart,"Cart fetched successfully"))
})
export {
    addProductToCart,
    removeProductFromCart,
    getUserCart
}