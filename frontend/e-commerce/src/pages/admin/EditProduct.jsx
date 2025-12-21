import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct } from "../../api/product.api";

const EditProduct = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [formData, setFormData] = useState({
		name: "",
		price: "",
		stock: "",
		description: "",
		category: "",
		brand: "",
	});

	// Fetch product details
	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const res = await getProductById(id);
				const product = res.data.data;

				setFormData({
					name: product.name || "",
					price: product.price || "",
					stock: product.stock || "",
					description: product.description || "",
					category: product.category || "",
					brand: product.brand || "",
				});

				setLoading(false);
			} catch (err) {
				setError("Failed to fetch product");
				setLoading(false);
			}
		};

		fetchProduct();
	}, [id]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await updateProduct(id, formData);
			alert("Product updated successfully");
			navigate("/admin/products");
		} catch (err) {
			alert(err.response?.data?.message || "Update failed");
		}
	};

	if (loading) return <p>Loading product...</p>;
	if (error) return <p>{error}</p>;

	return (
		<div className="p-6 max-w-2xl mx-auto">
			<h1 className="text-2xl font-bold mb-4">Edit Product</h1>

			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<input
					type="text"
					name="name"
					placeholder="Product Name"
					value={formData.name}
					onChange={handleChange}
					className="border p-2 rounded"
				/>

				<input
					type="number"
					name="price"
					placeholder="Price"
					value={formData.price}
					onChange={handleChange}
					className="border p-2 rounded"
				/>

				<input
					type="number"
					name="stock"
					placeholder="Stock"
					value={formData.stock}
					onChange={handleChange}
					className="border p-2 rounded"
				/>

				<input
					type="text"
					name="brand"
					placeholder="Brand"
					value={formData.brand}
					onChange={handleChange}
					className="border p-2 rounded"
				/>

				<input
					type="text"
					name="category"
					placeholder="Category"
					value={formData.category}
					onChange={handleChange}
					className="border p-2 rounded"
				/>

				<textarea
					name="description"
					placeholder="Description"
					value={formData.description}
					onChange={handleChange}
					className="border p-2 rounded"
					rows={4}
				/>

				<div className="flex gap-4">
					<button
						type="submit"
						className="bg-blue-600 text-white px-4 py-2 rounded"
					>
						Update Product
					</button>

					<button
						type="button"
						onClick={() => navigate("/admin/products")}
						className="bg-gray-300 px-4 py-2 rounded"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditProduct;
