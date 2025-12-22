import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../api/product.api";
import PageContainer from "../../components/layout/PageContainer";
const CreateProduct = () => {
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		price: "",
		brand: "",
		category: "",
		stock: "",
	});

	const [image, setImage] = useState(null);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleImageChange = (e) => {
		setImage(e.target.files[0]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!image) {
			toast.error(error.response?.data?.message || "Something went wrong");
			return;
		}

		const data = new FormData();
		Object.keys(formData).forEach((key) => {
			data.append(key, formData[key]);
		});
		data.append("images", image); // backend expects `images`

		try {
			setLoading(true);
			await createProduct(data);
			toast.success("Product created successfully");
			navigate("/admin/products");
		} catch (err) {
			toast.error(error.response?.data?.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<PageContainer>
		<div className="p-6 max-w-2xl mx-auto">
			<h1 className="text-2xl font-bold mb-4">Create Product</h1>

			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<input
					type="text"
					name="name"
					placeholder="Product Name"
					value={formData.name}
					onChange={handleChange}
					className="border p-2 rounded"
					required
				/>

				<textarea
					name="description"
					placeholder="Description"
					value={formData.description}
					onChange={handleChange}
					className="border p-2 rounded"
					rows={4}
					required
				/>

				<input
					type="number"
					name="price"
					placeholder="Price"
					value={formData.price}
					onChange={handleChange}
					className="border p-2 rounded"
					required
				/>

				<input
					type="number"
					name="stock"
					placeholder="Stock"
					value={formData.stock}
					onChange={handleChange}
					className="border p-2 rounded"
					required
				/>

				<input
					type="text"
					name="brand"
					placeholder="Brand"
					value={formData.brand}
					onChange={handleChange}
					className="border p-2 rounded"
					required
				/>

				<input
					type="text"
					name="category"
					placeholder="Category"
					value={formData.category}
					onChange={handleChange}
					className="border p-2 rounded"
					required
				/>

				<input
					type="file"
					accept="image/*"
					onChange={handleImageChange}
					className="border p-2 rounded"
					required
				/>

				<div className="flex gap-4">
					<button
						disabled={loading}
						className={`px-4 py-2 rounded text-white ${
							loading ? "bg-gray-400" : "bg-green-600"
						}`}
					>
						{loading ? "Processing..." : "Submit"}
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
		</PageContainer>
	);
};

export default CreateProduct;
