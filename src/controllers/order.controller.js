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

const getOrderById = asyncHandler(async (req, res) => {
	const { orderId } = req.params;
    console.log(orderId);
	const order = await Order.findById(orderId)
		.populate("user", "name email")
		.populate("orderItems.product");
	if (!order) {
		throw new ApiError(404, "Order not found");
	}
	if (
		order.user._id.toString() !== req.user._id.toString() &&
		req.user.role !== "admin"
	) {
		throw new ApiError(403, "Not authorized to view this order");
	}

	return res
		.status(200)
		.json(new ApiResponse(200, order, "Order fetched successfully"));
});

const getUserOrders = asyncHandler(async(req,res)=>{
    const orders = await Order.find({user:req.user._id}).sort({createdAt:-1})

    return res
    .status(200)
    .json(new ApiResponse(200,orders,"Orders fetched successfully"))
})
export {
    createOrder,
    getOrderById,
    getUserOrders
}