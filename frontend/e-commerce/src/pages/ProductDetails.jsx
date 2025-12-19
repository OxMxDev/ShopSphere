import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {useParams} from "react-router-dom";
import { getProductById } from "../api/product.api";
import { useCart } from "../context/cartContext";

const ProductDetails = () => {
    const [product,setProduct] = useState(null);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);
    const {id} = useParams()
    const {addToCart} = useCart();

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
			<div className="max-w-4xl mx-auto p-6">
				<img
					src={product.images?.[0]}
					alt={product.name}
					className="w-full  h-106 object-contain rounded"
				/>

				<h1 className="text-2xl font-bold mt-4">{product.name}</h1>
				<p className="text-gray-600 mt-2">{product.description}</p>

				<p className="text-green-600 text-xl font-semibold mt-2">
					₹{product.price}
				</p>

				<div className="mt-4">
					<p>
						<strong>Brand:</strong> {product.brand}
					</p>
					<p>
						<strong>Category:</strong> {product.category}
					</p>
					<p>
						<strong>Stock:</strong> {product.stock}
					</p>
					<p>
						<strong>Rating:</strong> ⭐ {product.ratings}
					</p>
					<button
						onClick={() => {
							console.log("Add to cart clicked", product);
							addToCart(product);
						}}
						className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
					>
						Add to Cart
					</button>
				</div>
			</div>
		</>
	);
};

export default ProductDetails;
