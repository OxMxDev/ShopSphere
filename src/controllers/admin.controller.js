import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";
const getAllUsers = asyncHandler(async(req,res)=>{
    const users = await User.find().select("-password -refreshToken")
    return res
    .status(200)
    .json(new ApiResponse(200,users,"Users fetched successfully"))
})

const getAllOrders = asyncHandler(async (req, res) => {
	if (req.user.role !== "admin") {
		throw new ApiError(403, "Not authorized");
	}

	const orders = await Order.find({})
		.populate("user", "name email")
		.sort({ createdAt: -1 });

	return res
		.status(200)
		.json(new ApiResponse(200, orders, "All orders fetched"));
});


export {
    getAllUsers,
    getAllOrders
}