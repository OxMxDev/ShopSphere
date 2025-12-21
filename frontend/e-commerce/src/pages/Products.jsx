import React, { useEffect, useState } from "react";
import { getAllProducts } from "../api/product.api";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/ui/Loader";
const Products = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		getAllProducts()
			.then((res) => {
				setProducts(res.data.data.products);
			})
			.catch(() => {
				setError("Error fetching products");
				setProducts([]);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	if (loading) return <Loader />;
	if (error) return <div>{error}</div>;
	return (
		<div className="flex flex-wrap gap-4">
			{products.length === 0 ? (
				<p>No products found</p>
			) : (
				products.map((product) => (
					<ProductCard key={product._id} product={product} />
				))
			)}
		</div>
	);
};

export default Products;
