import React from "react";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { useState } from "react";
import {useParams} from "react-router-dom";
import { getProductById } from "../api/product.api";
import { useCart } from "../context/cartContext";
import { createReview } from "../api/review.api";
import Rating from "../components/ui/Rating";
const ProductDetails = () => {
    const [product,setProduct] = useState(null);
	const [userRating, setUserRating] = useState(0);
	const [comment, setComment] = useState("");

    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);
    const {id} = useParams()
    const {addToCart} = useCart();

	const refreshRatings = async () => {
		try {
			const res = await getProductById(id);
			setProduct(res.data.data);
		} catch (err) {
			console.error("Error refreshing ratings:", err.message);
		}
	};

	const refreshReviews = async () => {
		// This function can be implemented to refresh the reviews section if needed
	};
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
            console.log(res.data.data)
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

						<Rating
							value={userRating}
							editable
							onRate={(rating) => setUserRating(rating)}
						/>
						<button
							disabled={loading}
							onClick={submitRating}
							className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
						>
							{loading ? "Submitting..." : "Submit Rating"}
						</button>
						<textarea
							className="border p-2 w-full mt-2 rounded"
							rows={3}
							placeholder="Write your review (optional)"
							value={comment}
							onChange={(e) => setComment(e.target.value)}
						/>

						<button
							onClick={() => {
								console.log("Add to cart clicked", product);
								addToCart(product);
							}}
							className="mt-4 bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
						>
							Add to Cart
						</button>
						<p>
							Review Comment: {comment}
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProductDetails;
