import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProductById, updateProduct } from "../../api/product.api";
import Loader from "../../components/ui/Loader";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";

const EditProduct = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);

	const [formData, setFormData] = useState({
		name: "",
		price: "",
		stock: "",
		description: "",
		category: "",
		brand: "",
	});

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
			setSaving(true);
			await updateProduct(id, formData);
			toast.success("Product updated successfully");
			navigate("/admin/products");
		} catch (err) {
			toast.error(err.response?.data?.message || "Something went wrong");
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <Loader />;
	
	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<p className="text-gray-500">{error}</p>
			</div>
		);
	}

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
					<h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
					<p className="text-gray-500 mt-1">Update product information</p>
				</div>

				{/* Form */}
				<div className="bg-white rounded-xl shadow-sm p-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Product Name */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Product Name
							</label>
							<input
								type="text"
								name="name"
								placeholder="Enter product name"
								value={formData.name}
								onChange={handleChange}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
							/>
						</div>

						{/* Description */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Description
							</label>
							<textarea
								name="description"
								placeholder="Enter product description"
								value={formData.description}
								onChange={handleChange}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
								rows={4}
							/>
						</div>

						{/* Price & Stock */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Price (₹)
								</label>
								<input
									type="number"
									name="price"
									placeholder="0.00"
									value={formData.price}
									onChange={handleChange}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Stock
								</label>
								<input
									type="number"
									name="stock"
									placeholder="0"
									value={formData.stock}
									onChange={handleChange}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
								/>
							</div>
						</div>

						{/* Brand & Category */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Brand
								</label>
								<input
									type="text"
									name="brand"
									placeholder="Enter brand"
									value={formData.brand}
									onChange={handleChange}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Category
								</label>
								<input
									type="text"
									name="category"
									placeholder="Enter category"
									value={formData.category}
									onChange={handleChange}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
								/>
							</div>
						</div>

						{/* Buttons */}
						<div className="flex gap-4 pt-4">
							<button
								type="submit"
								disabled={saving}
								className={`flex-1 py-3 rounded-lg text-white font-medium transition-colors ${
									saving ? "bg-gray-400" : "bg-slate-800 hover:bg-slate-700"
								}`}
							>
								{saving ? "Saving..." : "Save Changes"}
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

export default EditProduct;
