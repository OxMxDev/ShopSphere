import {Order} from "../models/order.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Cart} from "../models/cart.model.js";
import {Product} from "../models/product.model.js";

const createOrder = asyncHandler(async (req, res) => {
	const { shippingAddress, paymentMethod } = req.body;

	// 1️⃣ Get cart with populated products
	const cart = await Cart.findOne({ user: req.user._id }).populate(
		"items.product"
	);

	if (!cart || cart.items.length === 0) {
		throw new ApiError(400, "Cart is empty");
	}

	// 2️⃣ REMOVE INVALID (DELETED) PRODUCTS
	cart.items = cart.items.filter((item) => item.product !== null);

	if (cart.items.length === 0) {
		throw new ApiError(400, "Cart contains invalid products");
	}

	// 3️⃣ CALCULATE PRICE SAFELY
	const itemsPrice = cart.items.reduce(
		(total, item) => total + item.product.price * item.qty,
		0
	);

	const taxPrice = itemsPrice * 0.15;
	const shippingPrice = itemsPrice > 100 ? 0 : 10;
	const totalPrice = itemsPrice + taxPrice + shippingPrice;

	// 4️⃣ REDUCE STOCK (CRITICAL BUSINESS LOGIC)
	for (const item of cart.items) {
		const product = await Product.findById(item.product._id);

		if (!product) {
			throw new ApiError(404, "Product no longer exists");
		}

		if (product.stock < item.qty) {
			throw new ApiError(400, `Insufficient stock for ${product.name}`);
		}

		product.stock -= item.qty;
		await product.save();
	}

	// 5️⃣ CREATE ORDER
	const order = await Order.create({
		user: req.user._id,
		orderItems: cart.items.map((item) => ({
			product: item.product._id,
			name: item.product.name,
			qty: item.qty,
			price: item.product.price,
		})),
		shippingAddress,
		paymentMethod,
		taxPrice,
		shippingPrice,
		totalPrice,
	});

	// 6️⃣ CLEAR CART AFTER SUCCESS
	cart.items = [];
	await cart.save();

	return res
		.status(201)
		.json(new ApiResponse(201, order, "Order created successfully"));
});


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

const updateOrderToPaid = asyncHandler(async(req,res)=>{
    const {orderId} = req.params
    const order = await Order.findById(orderId)
    if(!order){
        throw new ApiError(404,"Order not found")
    }
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
        id:req.body.id,
        status:req.body.status,
        update_time:req.body.update_time,
        email_address:req.body.email_address
    }
    const updatedOrder = await order.save()
    return res
    .status(200)
    .json(new ApiResponse(200,updatedOrder,"Order payment updated successfully"))
})

const updateOrderToDelivered = asyncHandler(async(req,res)=>{
    const {orderId} = req.params
    const order = await Order.findById(orderId)
    if(!order){
        throw new ApiError(404,"Order not found")
    }
    order.isDelievered = true;
    order.delieveredAt = Date.now();
    const updatedOrder = await order.save()
    return res
    .status(200)
    .json(new ApiResponse(200,updatedOrder,"Order delivery updated successfully"))
})

export {
    createOrder,
    getOrderById,
    getUserOrders,
    updateOrderToPaid,
    updateOrderToDelivered
}