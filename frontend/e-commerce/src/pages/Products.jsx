import React, { useEffect, useState } from "react";
import { getAllProducts } from "../api/product.api";

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

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error}</div>;
	return (
		<div>
			{products.length === 0 ? (
				<p>No products found</p>
			) : (
				products.map((product) => (
					<div key={product._id} className="border w-[20%] p-4 m-4 rounded-lg min-h-[300px]">
                        <img className="w-full h-[60%] object-cover rounded" src={product.images[0]} alt={product.name} />
						<p className="font-bold">{product.name}</p>
						<p>{product.description}</p>
						<p className="text-green-500 font-semibold">₹{product.price}</p>
					</div>
				))
			)}
		</div>
	);
};

export default Products;
