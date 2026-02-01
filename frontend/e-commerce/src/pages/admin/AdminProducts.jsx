import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../../api/product.api";
import Loader from "../../components/ui/Loader";
import { FiEdit2, FiPlus, FiPackage, FiTrash2 } from "react-icons/fi";
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
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 py-8">
				{/* Header Section */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
						<p className="text-gray-500 mt-1">
							Manage your store inventory • {products.length} products
						</p>
					</div>
					<button
						onClick={() => navigate("/admin/products/create")}
						className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-slate-700 transition-colors"
					>
						<FiPlus />
						Add New Product
					</button>
				</div>

				{/* Products Grid */}
				{products.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm">
						<FiPackage className="w-16 h-16 text-gray-300 mb-4" />
						<h2 className="text-xl font-semibold text-gray-700 mb-2">No Products Yet</h2>
						<p className="text-gray-500 mb-6">Start by adding your first product</p>
						<button
							onClick={() => navigate("/admin/products/create")}
							className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-slate-700 transition-colors"
						>
							<FiPlus />
							Add Product
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{products.map((product) => (
							<div
								key={product._id}
								className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
							>
								{/* Product Image */}
								<div className="relative h-48 bg-gray-50 overflow-hidden">
									<img
										src={product.images[0]}
										alt={product.name}
										className="w-full h-full object-contain p-4"
									/>
									{/* Stock Badge */}
									<div className="absolute top-3 right-3">
										{product.stock > 0 ? (
											<span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
												In Stock ({product.stock})
											</span>
										) : (
											<span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
												Out of Stock
											</span>
										)}
									</div>
									{/* Category Badge */}
									<div className="absolute top-3 left-3">
										<span className="px-2.5 py-1 bg-slate-800 text-white text-xs font-medium rounded-full">
											{product.category}
										</span>
									</div>
								</div>

								{/* Product Details */}
								<div className="p-5">
									<h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
										{product.name}
									</h3>
									<p className="text-gray-500 text-sm mb-4 line-clamp-2">
										{product.description}
									</p>

									{/* Price & Brand */}
									<div className="flex items-center justify-between mb-4">
										<span className="text-xl font-bold text-gray-900">
											₹{product.price.toLocaleString()}
										</span>
										<span className="text-sm text-gray-400">
											{product.brand && `${product.brand}`}
										</span>
									</div>

									{/* Action Buttons */}
									<div className="flex gap-2">
										<button
											onClick={() => navigate(`/admin/products/${product._id}/edit`)}
											className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
										>
											<FiEdit2 size={16} />
											Edit
										</button>
										<button
											onClick={() => handleDelete(product._id)}
											className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
										>
											<FiTrash2 size={16} />
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
						<div className="bg-white rounded-xl p-5 shadow-sm">
							<p className="text-gray-500 text-sm">Total Products</p>
							<p className="text-2xl font-bold text-gray-900">{products.length}</p>
						</div>
						<div className="bg-white rounded-xl p-5 shadow-sm">
							<p className="text-gray-500 text-sm">In Stock</p>
							<p className="text-2xl font-bold text-green-600">
								{products.filter(p => p.stock > 0).length}
							</p>
						</div>
						<div className="bg-white rounded-xl p-5 shadow-sm">
							<p className="text-gray-500 text-sm">Out of Stock</p>
							<p className="text-2xl font-bold text-red-600">
								{products.filter(p => p.stock === 0).length}
							</p>
						</div>
						<div className="bg-white rounded-xl p-5 shadow-sm">
							<p className="text-gray-500 text-sm">Total Value</p>
							<p className="text-2xl font-bold text-gray-900">
								₹{products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminProducts;
