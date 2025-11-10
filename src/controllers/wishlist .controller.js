import { Wishlist } from "../models/wishlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";

const addToWishlist = asyncHandler(async (req, res) => {
	const { productId } = req.body;

	if (!productId) {
		throw new ApiError(400, "Product ID is required");
	}

	const product = await Product.findById(productId);
	if (!product) {
		throw new ApiError(404, "Product not found");
	}

	let wishlist = await Wishlist.findOne({ user: req.user._id });

	if (!wishlist) {
		wishlist = await Wishlist.create({
			user: req.user._id,
			products: [],
		});
	}

	if (wishlist.products.includes(productId)) {
		throw new ApiError(400, "Product already in wishlist");
	}

	wishlist.products.push(productId);
	await wishlist.save();

	const populatedWishlist = await Wishlist.findById(wishlist._id).populate(
		"products"
	);

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				populatedWishlist,
				"Product added to wishlist successfully"
			)
		);
});

const removeFromWishlist = asyncHandler(async (req, res) => {
	const { productId } = req.body;

	if (!productId) {
		throw new ApiError(400, "Product ID is required");
	}

	const wishlist = await Wishlist.findOne({ user: req.user._id });

	if (!wishlist) {
		throw new ApiError(404, "Wishlist not found");
	}

	if (!wishlist.products.includes(productId)) {
		throw new ApiError(400, "Product not found in wishlist");
	}

	wishlist.products = wishlist.products.filter(
		(product) => product.toString() !== productId
	);

	await wishlist.save();

	const populatedWishlist = await Wishlist.findById(wishlist._id).populate(
		"products"
	);

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				populatedWishlist,
				"Product removed from wishlist successfully"
			)
		);
});

const getUserWishlist = asyncHandler(async (req, res) => {
	const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
		"products"
	);

	if (!wishlist) {
		return res
			.status(200)
			.json(new ApiResponse(200, { products: [] }, "Wishlist is empty"));
	}

	return res
		.status(200)
		.json(new ApiResponse(200, wishlist, "Wishlist fetched successfully"));
});

const moveToCart = asyncHandler(async (req, res) => {
	const { productId, qty = 1 } = req.body;

	if (!productId) {
		throw new ApiError(400, "Product ID is required");
	}

	const product = await Product.findById(productId);
	if (!product) {
		throw new ApiError(404, "Product not found");
	}

	if (product.stock < qty) {
		throw new ApiError(400, "Insufficient stock");
	}

	const wishlist = await Wishlist.findOne({ user: req.user._id });

	if (!wishlist) {
		throw new ApiError(404, "Wishlist not found");
	}

	if (!wishlist.products.includes(productId)) {
		throw new ApiError(400, "Product not found in wishlist");
	}

	let cart = await Cart.findOne({ user: req.user._id });

	if (!cart) {
		cart = await Cart.create({
			user: req.user._id,
			items: [],
		});
	}

	const existingItemIndex = cart.items.findIndex(
		(item) => item.product.toString() === productId
	);

	if (existingItemIndex > -1) {
		const newQty = cart.items[existingItemIndex].qty + qty;
		if (newQty > product.stock) {
			throw new ApiError(400, "Insufficient stock");
		}
		cart.items[existingItemIndex].qty = newQty;
	} else {
		cart.items.push({ product: productId, qty });
	}

	await cart.save();

	wishlist.products = wishlist.products.filter(
		(product) => product.toString() !== productId
	);
	await wishlist.save();

	const populatedCart = await Cart.findById(cart._id).populate("items.product");
	const populatedWishlist = await Wishlist.findById(wishlist._id).populate(
		"products"
	);

	return res.status(200).json(
		new ApiResponse(
			200,
			{
				cart: populatedCart,
				wishlist: populatedWishlist,
			},
			"Product moved to cart successfully"
		)
	);
});

const clearWishlist = asyncHandler(async (req, res) => {
	const wishlist = await Wishlist.findOne({ user: req.user._id });

	if (!wishlist) {
		throw new ApiError(404, "Wishlist not found");
	}

	wishlist.products = [];
	await wishlist.save();

	return res
		.status(200)
		.json(new ApiResponse(200, wishlist, "Wishlist cleared successfully"));
});

export {
	addToWishlist,
	removeFromWishlist,
	getUserWishlist,
	moveToCart,
	clearWishlist,
};