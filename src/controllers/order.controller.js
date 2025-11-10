import {Order} from "../models/order.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Cart} from "../models/cart.model.js";
import {Product} from "../models/product.model.js";

const createOrder = asyncHandler(async(req,res)=>{
    const {shippingAddress,paymentMethod} = req.body;
    const cart = await Cart.findOne({user:req.user._id}).populate('items.product')
    if(!cart || cart.items.length === 0){
        throw new ApiError(400,"Cart is empty")
    }
    const itemsPrice = cart.items.reduce((total,item)=> total + item.product.price * item.qty,0)
    const taxPrice = itemsPrice * 0.15
    const shippingPrice = itemsPrice > 100 ? 0 : 10
    const totalPrice = itemsPrice + taxPrice + shippingPrice

    const order = await Order.create({
        user:req.user._id,
        orderItems:cart.items.map(item=>({
            product:item.product._id,
            name:item.product.name,
            qty:item.qty,
            price:item.product.price
        })),
        shippingAddress,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice
    })
    cart.items = []
    await cart.save()
    return res
    .status(201)
    .json(new ApiResponse(201,order,"Order created successfully"))
})

export {
    createOrder
}