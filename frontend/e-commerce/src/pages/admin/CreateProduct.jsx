import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createProduct } from "../../api/product.api";
import toast from "react-hot-toast";
import { FiArrowLeft, FiUpload } from "react-icons/fi";

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
	const [imagePreview, setImagePreview] = useState(null);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setImage(file);
		if (file) {
			setImagePreview(URL.createObjectURL(file));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!image) {
			toast.error("Please select an image");
			return;
		}

		const data = new FormData();
		Object.keys(formData).forEach((key) => {
			data.append(key, formData[key]);
		});
		data.append("images", image);

		try {
			setLoading(true);
			await createProduct(data);
			toast.success("Product created successfully");
			navigate("/admin/products");
		} catch (err) {
			toast.error(err.response?.data?.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-2xl mx-auto px-4 py-8">
				{/* Back Link */}
				<Link
					to="/admin/products"
					className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-6"
				>
					<FiArrowLeft />
					Back to Products
				</Link>

				{/* Header */}
				<div className="mb-8">
					<h1 className="text-2xl font-bold text-gray-900">Create Product</h1>
					<p className="text-gray-500 mt-1">Add a new product to your store</p>
				</div>

				{/* Form */}
				<div className="bg-white rounded-xl shadow-sm p-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Product Name */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Product Name *
							</label>
							<input
								type="text"
								name="name"
								placeholder="Enter product name"
								value={formData.name}
								onChange={handleChange}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
								required
							/>
						</div>

						{/* Description */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Description *
							</label>
							<textarea
								name="description"
								placeholder="Enter product description"
								value={formData.description}
								onChange={handleChange}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
								rows={4}
								required
							/>
						</div>

						{/* Price & Stock */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Price (₹) *
								</label>
								<input
									type="number"
									name="price"
									placeholder="0.00"
									value={formData.price}
									onChange={handleChange}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Stock *
								</label>
								<input
									type="number"
									name="stock"
									placeholder="0"
									value={formData.stock}
									onChange={handleChange}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
									required
								/>
							</div>
						</div>

						{/* Brand & Category */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Brand *
								</label>
								<input
									type="text"
									name="brand"
									placeholder="Enter brand"
									value={formData.brand}
									onChange={handleChange}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Category *
								</label>
								<input
									type="text"
									name="category"
									placeholder="Enter category"
									value={formData.category}
									onChange={handleChange}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
									required
								/>
							</div>
						</div>

						{/* Image Upload */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Product Image *
							</label>
							<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
								{imagePreview ? (
									<div className="space-y-4">
										<img
											src={imagePreview}
											alt="Preview"
											className="w-32 h-32 object-contain mx-auto"
										/>
										<p className="text-sm text-gray-500">{image?.name}</p>
										<label className="inline-block cursor-pointer">
											<span className="text-sm text-slate-600 hover:text-slate-800 underline">
												Change image
											</span>
											<input
												type="file"
												accept="image/*"
												onChange={handleImageChange}
												className="hidden"
											/>
										</label>
									</div>
								) : (
									<label className="cursor-pointer">
										<FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
										<p className="text-sm text-gray-500">Click to upload image</p>
										<p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
										<input
											type="file"
											accept="image/*"
											onChange={handleImageChange}
											className="hidden"
											required
										/>
									</label>
								)}
							</div>
						</div>

						{/* Buttons */}
						<div className="flex gap-4 pt-4">
							<button
								type="submit"
								disabled={loading}
								className={`flex-1 py-3 rounded-lg text-white font-medium transition-colors ${
									loading ? "bg-gray-400" : "bg-slate-800 hover:bg-slate-700"
								}`}
							>
								{loading ? "Creating..." : "Create Product"}
							</button>

							<button
								type="button"
								onClick={() => navigate("/admin/products")}
								className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CreateProduct;
