import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../../api/product.api";
import Badge from "../../components/ui/Badege";
import Loader from "../../components/ui/Loader";
import PageContainer from "../../components/layout/PageContainer";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
const AdminProducts = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const fetchProducts = async () => {
		try {
			const res = await getAllProducts();
			setProducts(res.data.data.products);
		} catch (err) {
			console.error("Failed to fetch products");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	const handleDelete = async (id) => {
		if (!window.confirm("Delete this product?")) return;

		try {
			await deleteProduct(id);
			fetchProducts();
		} catch (err) {
			toast.error(error.response?.data?.message || "Something went wrong");
		}
	};

	if (loading) return <Loader />;

	return (
		<PageContainer>
			<div className="p-6">
				<h1 className="text-2xl font-bold mb-4">Admin Products</h1>

				<table className="w-full overflow-hidden bg-white rounded-lg shadow-xl">
					<thead className="bg-gray-100">
						<tr>
							<th className="p-2">Product</th>
							<th className="p-2">Description</th>
							<th className="p-2">Name</th>
							<th className="p-2">Category</th>
							<th className="p-2">Price</th>
							<th className="p-2">Stock</th>
							<th className="p-2">Actions</th>
							<th className="p-2">Status</th>
						</tr>
					</thead>

					<tbody className="shadow-xl bg-white">
						{products.map((product) => (
							<tr key={product._id} className="text-center">
								<td className=" p-2">
									<img
										src={product.images[0]}
										alt={product.name}
										className="w-16 h-16 object-cover mx-auto"
									/>
								</td>
								<td className=" p-2">{product.description}</td>
								<td className=" p-2">{product.name}</td>
								<td className=" p-2">{product.category}</td>
								<td className=" p-2">₹{product.price}</td>
								<td className=" p-2">{product.stock}</td>
								<td className="  p-2 mx-auto flex gap-4 justify-center">
									<button
										onClick={() =>
											navigate(`/admin/products/${product._id}/edit`)
										}
										className="text-blue-600 underline mt-4 cursor-pointer"
									>
										<FaEdit />
									</button>

									<button
										onClick={() => handleDelete(product._id)}
										className="text-red-600 underline mt-4 cursor-pointer"
									>
										<MdDelete />
									</button>
								</td>
								<td>
									{product.stock > 0 ? (
										<Badge text="In Stock" type="success" />
									) : (
										<Badge text="Out of Stock" type="danger" />
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</PageContainer>
	);
};

export default AdminProducts;
