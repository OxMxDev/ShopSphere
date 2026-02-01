import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../api/product.api";
import { useCart } from "../context/cartContext";
import { createReview } from "../api/review.api";
import Rating from "../components/ui/Rating";
import { getProductReviews } from "../api/review.api";
import { useAuth } from "../context/authContext";
import { updateReview, deleteReview } from "../api/review.api";
import Loader from "../components/ui/Loader";
import { FiArrowLeft, FiShoppingCart, FiStar, FiEdit2, FiTrash2 } from "react-icons/fi";

const ProductDetails = () => {
	const { user, isAuthenticated } = useAuth();
	const [product, setProduct] = useState(null);
	const [userRating, setUserRating] = useState(0);
	const [comment, setComment] = useState("");
	const [reviews, setReviews] = useState([]);
	const [loadingReviews, setLoadingReviews] = useState(true);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [hasReviewed, setHasReviewed] = useState(false);
	const [editingReviewId, setEditingReviewId] = useState(null);
	const [editRating, setEditRating] = useState(0);
	const [editComment, setEditComment] = useState("");

	const { id } = useParams();
	const { addToCart } = useCart();

	const fetchReviews = async () => {
		if (!product?._id) return;

		try {
			setLoadingReviews(true);
			const res = await getProductReviews(product._id);
			setReviews(res.data.data);
		} finally {
			setLoadingReviews(false);
		}
	};

	useEffect(() => {
		if (!reviews.length || !user) return;

		const reviewed = reviews.some(
			(review) => review.user === user._id || review.user?._id === user._id
		);

		setHasReviewed(reviewed);
	}, [reviews, user]);

	const handleUpdateReview = async (reviewId) => {
		try {
			await updateReview(reviewId, editRating, editComment);
			toast.success("Review updated");

			setEditingReviewId(null);
			fetchReviews();
			refreshRatings();
		} catch (err) {
			toast.error(err.response?.data?.message || "Update failed");
		}
	};

	const handleDeleteReview = async (reviewId) => {
		if (!confirm("Delete this review?")) return;

		try {
			await deleteReview(reviewId);
			toast.success("Review deleted");

			fetchReviews();
			refreshRatings();
		} catch (err) {
			toast.error(err.response?.data?.message || "Delete failed");
			console.error("Error deleting review:", err.message);
		}
	};

	const refreshRatings = async () => {
		try {
			const res = await getProductById(id);
			setProduct(res.data.data);
		} catch (err) {
			console.error("Error refreshing ratings:", err.message);
		}
	};

	useEffect(() => {
		if (product?._id) {
			fetchReviews();
		}
	}, [product?._id]);

	const submitRating = async () => {
		if (userRating === 0) {
			toast.error("Please select a rating");
			return;
		}

		try {
			setLoading(true);

			await createReview(product._id, userRating, comment);

			toast.success("Review submitted successfully");
			refreshRatings();
			fetchReviews();
			setUserRating(0);
			setComment("");
		} catch (err) {
			toast.error(err.response?.data?.message || "Review failed");
			console.error("Error submitting rating:", err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getProductById(id)
			.then((res) => {
				setProduct(res.data.data);
			})
			.catch((err) => {
				setError(err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [id]);

	if (loading) {
		return <Loader />;
	}
	if (error) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<p className="text-gray-500">Error: {error}</p>
			</div>
		);
	}
	if (!product) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<p className="text-gray-500">No product found</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-6xl mx-auto px-4 py-8">
				{/* Back Link */}
				<Link
					to="/products"
					className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-6"
				>
					<FiArrowLeft />
					Back to Products
				</Link>

				{/* Product Section */}
				<div className="grid md:grid-cols-2 gap-12 mb-12">
					{/* Product Image */}
					<div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center">
						<img
							src={product.images?.[0]}
							alt={product.name}
							className="max-h-96 object-contain"
						/>
					</div>

					{/* Product Info */}
					<div>
						<h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
						
						<div className="flex items-center gap-2 mb-4">
							<Rating value={product.ratings} />
							<span className="text-sm text-gray-500">
								({product.numReviews} reviews)
							</span>
						</div>

						<p className="text-3xl font-bold text-gray-900 mb-4">
							₹{product.price?.toLocaleString()}
						</p>

						<p className="text-gray-600 mb-6">{product.description}</p>

						<div className="space-y-2 mb-6 text-sm">
							<p className="flex gap-2">
								<span className="text-gray-500">Brand:</span>
								<span className="font-medium">{product.brand}</span>
							</p>
							<p className="flex gap-2">
								<span className="text-gray-500">Category:</span>
								<span className="font-medium">{product.category}</span>
							</p>
							<p className="flex gap-2">
								<span className="text-gray-500">Availability:</span>
								<span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
									{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
								</span>
							</p>
						</div>

						{/* Add to Cart Button */}
						<button
							onClick={() => addToCart(product._id)}
							disabled={product.stock === 0}
							className="w-full bg-slate-800 text-white py-3 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							<FiShoppingCart />
							Add to Cart
						</button>
					</div>
				</div>

				{/* Reviews Section */}
				<div className="border-t pt-12">
					<h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
						<FiStar />
						Reviews ({reviews.length})
					</h2>

					<div className="grid md:grid-cols-3 gap-8">
						{/* Write Review */}
						<div className="md:col-span-1">
							<div className="bg-gray-50 rounded-lg p-6">
								<h3 className="font-semibold text-gray-900 mb-4">Write a Review</h3>

								{!isAuthenticated ? (
									<p className="text-sm text-gray-500">
										Please <Link to="/login" className="text-slate-800 underline">login</Link> to write a review
									</p>
								) : hasReviewed ? (
									<p className="text-sm text-gray-500">
										You have already reviewed this product
									</p>
								) : (
									<>
										<Rating
											value={userRating}
											editable
											onRate={(rating) => setUserRating(rating)}
										/>

										<textarea
											className="w-full px-4 py-3 border border-gray-300 rounded-md mt-4 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
											rows={3}
											placeholder="Write your review (optional)"
											value={comment}
											onChange={(e) => setComment(e.target.value)}
										/>

										<button
											disabled={loading}
											onClick={submitRating}
											className="w-full mt-4 bg-slate-800 text-white py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors disabled:bg-gray-300"
										>
											{loading ? "Submitting..." : "Submit Review"}
										</button>
									</>
								)}
							</div>
						</div>

						{/* Reviews List */}
						<div className="md:col-span-2">
							{loadingReviews ? (
								<p className="text-gray-500">Loading reviews...</p>
							) : reviews.length === 0 ? (
								<p className="text-gray-500">No reviews yet. Be the first to review!</p>
							) : (
								<div className="space-y-4">
									{reviews.map((review) => {
										const isOwner =
											user &&
											(review.user === user._id || review.user?._id === user._id);

										return (
											<div key={review._id} className="bg-gray-50 rounded-lg p-4">
												<div className="flex justify-between items-start mb-2">
													<div>
														<p className="font-medium text-gray-900">{review.name}</p>
														<Rating value={review.rating} />
													</div>
													{isOwner && !editingReviewId && (
														<div className="flex gap-2">
															<button
																onClick={() => {
																	setEditingReviewId(review._id);
																	setEditRating(review.rating);
																	setEditComment(review.comment);
																}}
																className="text-gray-400 hover:text-gray-600"
															>
																<FiEdit2 size={16} />
															</button>
															<button
																onClick={() => handleDeleteReview(review._id)}
																className="text-gray-400 hover:text-red-500"
															>
																<FiTrash2 size={16} />
															</button>
														</div>
													)}
												</div>

												{/* Edit Mode */}
												{editingReviewId === review._id ? (
													<div className="mt-2">
														<Rating
															value={editRating}
															editable
															onRate={(value) => setEditRating(value)}
														/>

														<textarea
															className="w-full px-3 py-2 border border-gray-300 rounded-md mt-2 text-sm"
															value={editComment}
															onChange={(e) => setEditComment(e.target.value)}
														/>

														<div className="flex gap-2 mt-2">
															<button
																onClick={() => handleUpdateReview(review._id)}
																className="bg-slate-800 text-white px-3 py-1 rounded text-sm"
															>
																Save
															</button>
															<button
																onClick={() => setEditingReviewId(null)}
																className="bg-gray-200 px-3 py-1 rounded text-sm"
															>
																Cancel
															</button>
														</div>
													</div>
												) : (
													<p className="text-sm text-gray-600 mt-2">{review.comment}</p>
												)}
											</div>
										);
									})}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;
