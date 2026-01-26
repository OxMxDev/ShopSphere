import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createReview = asyncHandler(async (req, res) => {
	const { productId } = req.params;
	const { rating, comment } = req.body;
	console.log("Creating review for productId:", productId);
	if (!rating || !comment) {
		throw new ApiError(400, "Rating and comment are required");
	}

	if (rating < 1 || rating > 5) {
		throw new ApiError(400, "Rating must be between 1 and 5");
	}

	const product = await Product.findById(productId);
	if (!product) {
		throw new ApiError(404, "Product not found");
	}

	const existingReview = await Review.findOne({
		product: productId,
		user: req.user._id,
	});

	if (existingReview) {
		throw new ApiError(400, "You have already reviewed this product");
	}
	const review = await Review.create({
		product: productId,
		user: req.user._id,
		name: req.user.name,
		rating,
		comment: comment?.trim() || "",
	});

	const createdReview = await Review.findById(review._id)
		.populate("user", "name")
		.populate("product", "name");

	await updateProductRating(productId);

	return res
		.status(201)
		.json(new ApiResponse(201, createdReview, "Review created successfully"));
});

const getProductReviews = asyncHandler(async (req, res) => {
	const { productId } = req.params;

	if (!productId) {
		throw new ApiError(400, "Product ID is required");
	}

	const product = await Product.findById(productId);
	if (!product) {
		throw new ApiError(404, "Product not found");
	}

	const reviews = await Review.find({ product: productId })
		.populate("user", "name")
		.sort({ createdAt: -1 });

	return res
		.status(200)
		.json(
			new ApiResponse(200, reviews, "Product reviews fetched successfully")
		);
});

const updateReview = asyncHandler(async (req, res) => {
	const { reviewId } = req.params;
	const { rating, comment } = req.body;

	if (!reviewId) {
		throw new ApiError(400, "Review ID is required");
	}

	if (!rating) {
		throw new ApiError(400, "Rating is required");
	}

	if (rating < 1 || rating > 5) {
		throw new ApiError(400, "Rating must be between 1 and 5");
	}

	const review = await Review.findById(reviewId);

	if (!review) {
		throw new ApiError(404, "Review not found");
	}

	if (review.user.toString() !== req.user._id.toString()) {
		throw new ApiError(403, "You can only update your own review");
	}

	review.rating = rating;
	review.comment = comment?.trim() || review.comment;

	await review.save();

	const updatedReview = await Review.findById(reviewId)
		.populate("user", "name")
		.populate("product", "name");

	// Update product's rating
	await updateProductRating(review.product);

	return res
		.status(200)
		.json(new ApiResponse(200, updatedReview, "Review updated successfully"));
});

const deleteReview = asyncHandler(async (req, res) => {
	const { reviewId } = req.params;

	if (!reviewId) {
		throw new ApiError(400, "Review ID is required");
	}

	const review = await Review.findById(reviewId);

	if (!review) {
		throw new ApiError(404, "Review not found");
	}

	if (
		review.user.toString() !== req.user._id.toString() &&
		req.user.role !== "admin"
	) {
		throw new ApiError(403, "You can only delete your own review");
	}

	const productId = review.product;

	await Review.findByIdAndDelete(reviewId);

	// Update product's rating
	await updateProductRating(productId);

	return res
		.status(200)
		.json(new ApiResponse(200, {}, "Review deleted successfully"));
});

const getUserReviews = asyncHandler(async (req, res) => {
	const reviews = await Review.find({ user: req.user._id })
		.populate("product", "name images")
		.sort({ createdAt: -1 });

	return res
		.status(200)
		.json(new ApiResponse(200, reviews, "User reviews fetched successfully"));
});

const updateProductRating = async (productId) => {
	const reviews = await Review.find({ product: productId });

	if (reviews.length === 0) {
		await Product.findByIdAndUpdate(productId, {
			ratings: 0,
			numReviews: 0,
		});
		return;
	}

	const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
	const averageRating = totalRating / reviews.length;

	await Product.findByIdAndUpdate(productId, {
		ratings: Number(averageRating.toFixed(1)),
		numReviews: reviews.length,
	});
};

export {
	createReview,
	getProductReviews,
	updateReview,
	deleteReview,
	getUserReviews,
};