import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../../api/product.api";
import Loader from "../../components/ui/Loader";
import PageContainer from "../../components/layout/PageContainer";
import { FaEdit, FaPlus, FaBox } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";

const AdminProducts = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const fetchProducts = async () => {
		try {
			const res = await getAllProducts();
			setProducts(res.data.data.products || []);
		} catch (err) {
			console.error("Failed to fetch products");
			setProducts([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this product?")) return;

		try {
			await deleteProduct(id);
			toast.success("Product deleted successfully");
			fetchProducts();
		} catch (error) {
			toast.error(error.response?.data?.message || "Something went wrong");
		}
	};

	if (loading) return <Loader />;

	return (
		<PageContainer>
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
				{/* Header Section */}
				<div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-8 mb-8 shadow-xl">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<h1 className="text-3xl font-bold text-white mb-2">
								Product Management
							</h1>
							<p className="text-indigo-100">
								Manage your store inventory • {products.length} products
							</p>
						</div>
						<button
							onClick={() => navigate("/admin/products/create")}
							className="flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
						>
							<FaPlus />
							Add New Product
						</button>
					</div>
				</div>

				{/* Products Grid */}
				{products.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
						<FaBox className="w-20 h-20 text-gray-300 mb-4" />
						<h2 className="text-2xl font-semibold text-gray-700 mb-2">No Products Yet</h2>
						<p className="text-gray-500 mb-6">Start by adding your first product</p>
						<button
							onClick={() => navigate("/admin/products/create")}
							className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all"
						>
							<FaPlus />
							Add Product
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
						{products.map((product) => (
							<div
								key={product._id}
								className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
							>
								{/* Product Image */}
								<div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
									<img
										src={product.images[0]}
										alt={product.name}
										className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
									/>
									{/* Stock Badge */}
									<div className="absolute top-3 right-3">
										{product.stock > 0 ? (
											<span className="px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full shadow-lg">
												In Stock ({product.stock})
											</span>
										) : (
											<span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-lg">
												Out of Stock
											</span>
										)}
									</div>
									{/* Category Badge */}
									<div className="absolute top-3 left-3">
										<span className="px-3 py-1 bg-indigo-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
											{product.category}
										</span>
									</div>
								</div>

								{/* Product Details */}
								<div className="p-5">
									<h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
										{product.name}
									</h3>
									<p className="text-gray-500 text-sm mb-4 line-clamp-2">
										{product.description}
									</p>

									{/* Price */}
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-baseline gap-1">
											<span className="text-2xl font-bold text-indigo-600">
												₹{product.price.toLocaleString()}
											</span>
										</div>
										<div className="text-sm text-gray-400">
											{product.brand && `Brand: ${product.brand}`}
										</div>
									</div>

									{/* Action Buttons */}
									<div className="flex gap-3">
										<button
											onClick={() => navigate(`/admin/products/${product._id}/edit`)}
											className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-100 transition-colors"
										>
											<FaEdit />
											Edit
										</button>
										<button
											onClick={() => handleDelete(product._id)}
											className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl font-medium hover:bg-red-100 transition-colors"
										>
											<MdDelete className="text-lg" />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Quick Stats */}
				{products.length > 0 && (
					<div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="bg-white rounded-xl p-5 shadow-lg">
							<p className="text-gray-500 text-sm">Total Products</p>
							<p className="text-2xl font-bold text-gray-800">{products.length}</p>
						</div>
						<div className="bg-white rounded-xl p-5 shadow-lg">
							<p className="text-gray-500 text-sm">In Stock</p>
							<p className="text-2xl font-bold text-emerald-600">
								{products.filter(p => p.stock > 0).length}
							</p>
						</div>
						<div className="bg-white rounded-xl p-5 shadow-lg">
							<p className="text-gray-500 text-sm">Out of Stock</p>
							<p className="text-2xl font-bold text-red-600">
								{products.filter(p => p.stock === 0).length}
							</p>
						</div>
						<div className="bg-white rounded-xl p-5 shadow-lg">
							<p className="text-gray-500 text-sm">Total Value</p>
							<p className="text-2xl font-bold text-indigo-600">
								₹{products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}
							</p>
						</div>
					</div>
				)}
			</div>
		</PageContainer>
	);
};

export default AdminProducts;
