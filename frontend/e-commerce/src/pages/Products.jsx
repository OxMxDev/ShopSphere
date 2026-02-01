import React, { useEffect, useState } from "react";
import { getAllProducts } from "../api/product.api";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/ui/Loader";
import PageContainer from "../components/layout/PageContainer";

const Products = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		getAllProducts()
			.then((res) => {
				setProducts(res.data.data.products || []);
				setError(null);
			})
			.catch((err) => {
				// Only show error for actual errors, not for empty products
				if (err.response?.status !== 401) {
					setError("Error fetching products");
				}
				setProducts([]);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	if (loading) return <Loader />;
	
	if (error) return (
		<PageContainer>
			<div className="flex flex-col items-center justify-center py-20">
				<svg className="w-24 h-24 text-red-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
				</svg>
				<h2 className="text-xl font-semibold text-gray-700 mb-2">Oops! Something went wrong</h2>
				<p className="text-gray-500">{error}</p>
			</div>
		</PageContainer>
	);

	return (
		<PageContainer>
			{products.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20">
					{/* Shopping Bag Icon */}
					<svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
					</svg>
					<h2 className="text-2xl font-semibold text-gray-700 mb-2">No Products Listed Yet</h2>
					<p className="text-gray-500 text-center max-w-md">
						Our shop is getting ready! Check back soon for amazing products.
					</p>
				</div>
			) : (
				<div className="flex flex-wrap gap-4">
					{products.map((product) => (
						<ProductCard key={product._id} product={product} />
					))}
				</div>
			)}
		</PageContainer>
	);
};

export default Products;
