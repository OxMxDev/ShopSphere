import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { useState } from "react";
import {useParams} from "react-router-dom";
import { getProductById } from "../api/product.api";
import { useCart } from "../context/cartContext";
import { createReview } from "../api/review.api";
import Rating from "../components/ui/Rating";
import { getProductReviews } from "../api/review.api";
import { useAuth } from "../context/authContext";
import { updateReview, deleteReview } from "../api/review.api";

const ProductDetails = () => {
	const {user, isAuthenticated} = useAuth();
    const [product,setProduct] = useState(null);
	const [userRating, setUserRating] = useState(0);
	const [comment, setComment] = useState("");
	const [reviews, setReviews] = useState([]);
	const [loadingReviews, setLoadingReviews] = useState(true);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);
	const [hasReviewed, setHasReviewed] = useState(false);
	const [editingReviewId, setEditingReviewId] = useState(null);
	const [editRating, setEditRating] = useState(0);
	const [editComment, setEditComment] = useState("");

    const {id} = useParams()
    const {addToCart} = useCart();

	const fetchReviews = async () => {
		if (!product?._id) return; // 🔑 IMPORTANT

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

			toast.success("Rating submitted successfully");
			refreshRatings(); 
			refreshReviews(); 
			setUserRating(0);
			setComment("");

		} catch (err) {
			toast.error(err.response?.data?.message || "Rating failed");
			console.error("Error submitting rating:", err.message);
		} finally {
			setLoading(false);
		}
	};


    useEffect(()=>{
        getProductById(id)
        .then((res)=>{
            setProduct(res.data.data)
        })
        .catch((err)=>{
            setError(err.message)
        })
        .finally(()=>{
            setLoading(false)
        })
    },[id])

    if(loading){
        return <div>Loading...</div>
    }
    if(error){
        return <div>Error: {error}</div>
    }
    if(!product){
        return <div>No product found</div>
    }
	return (
		<>
			<div className="flex pl-5">
				<img
					src={product.images?.[0]}
					alt={product.name}
					className="  h-106 object-contain rounded-lg"
				/>
				<div className="flex flex-col ml-6 gap-3">
					<h1 className="text-2xl uppercase mt-4">{product.name}</h1>
					<p className="text-gray-600 mt-2">{product.description}</p>

					<p className="text-xl font-semibold mt-2">₹{product.price}</p>
					<div className="mt-4">
						<p>
							<strong>Brand:</strong> {product.brand}
						</p>
						<p>
							<strong>Category:</strong> {product.category}
						</p>
						<p>
							<strong>Stock:</strong> {product.stock} available
						</p>
						<Rating value={product.ratings} />
						<p className="text-sm text-gray-500">
							{product.numReviews} reviews
						</p>

						<h3 className="text-lg font-semibold mt-6">Rate this product</h3>

						{hasReviewed ? (
							<p className="text-sm text-gray-500 mt-2">
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
									className="border p-2 w-full mt-2 rounded"
									rows={3}
									placeholder="Write your review (optional)"
									value={comment}
									onChange={(e) => setComment(e.target.value)}
								/>

								<button
									disabled={loading}
									onClick={submitRating}
									className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
								>
									{loading ? "Submitting..." : "Submit Review"}
								</button>
							</>
						)}

						<button
							onClick={() => {
								console.log("Add to cart clicked", product);
								addToCart(product);
							}}
							className="mt-4 bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
						>
							Add to Cart
						</button>
						<p>Review Comment: {comment}</p>
						<h3 className="text-lg font-semibold mt-6">
							Reviews ({reviews.length})
						</h3>

						{loadingReviews ? (
							<p>Loading reviews...</p>
						) : reviews.length === 0 ? (
							<p className="text-gray-500">No reviews yet</p>
						) : (
							reviews.map((review) => {
								const isOwner =
									user &&
									(review.user === user._id || review.user?._id === user._id);

								return (
									<div key={review._id} className="border p-3 mt-2 rounded">
										<div className="flex justify-between items-center">
											<strong>{review.name}</strong>
											<Rating value={review.rating} />
										</div>

										{/* EDIT MODE */}
										{editingReviewId === review._id ? (
											<div className="mt-2">
												<Rating
													value={editRating}
													editable
													onRate={(value) => setEditRating(value)}
												/>

												<textarea
													className="border p-2 w-full mt-2 rounded"
													value={editComment}
													onChange={(e) => setEditComment(e.target.value)}
												/>

												<div className="flex gap-3 mt-2">
													<button
														onClick={() => handleUpdateReview(review._id)}
														className="bg-green-600 text-white px-3 py-1 rounded"
													>
														Save
													</button>

													<button
														onClick={() => setEditingReviewId(null)}
														className="bg-gray-300 px-3 py-1 rounded"
													>
														Cancel
													</button>
												</div>
											</div>
										) : (
											<>
												<p className="text-sm mt-1">{review.comment}</p>

												{isOwner && (
													<div className="flex gap-3 mt-2">
														<button
															onClick={() => {
																setEditingReviewId(review._id);
																setEditRating(review.rating);
																setEditComment(review.comment);
															}}
															className="text-blue-600 text-sm"
														>
															Edit
														</button>

														<button
															onClick={() => handleDeleteReview(review._id)}
															className="text-red-600 text-sm"
														>
															Delete
														</button>
													</div>
												)}
											</>
										)}
									</div>
								);
							})
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default ProductDetails;
