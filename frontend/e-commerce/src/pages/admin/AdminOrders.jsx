import { useEffect, useState } from "react";
import { getAllOrders, updateOrderToDelivered } from "../../api/order.api";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/ui/Loader";
import PageContainer from "../../components/layout/PageContainer";
const AdminOrders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const fetchOrders = async () => {
		const res = await getAllOrders();
		setOrders(res.data.data);
		setLoading(false);
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	const handleDeliver = async (orderId) => {
		await updateOrderToDelivered(orderId);
		fetchOrders(); // refresh list
	};

	if (loading) return <Loader />;

	return (
		<PageContainer>
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Admin Orders</h1>

			<table className="w-full border">
				<thead className="bg-gray-100">
					<tr>
						<th className="border p-2">User</th>
						<th className="border p-2">Email</th>
						<th className="border p-2">Total</th>
						<th className="border p-2">Paid</th>
						<th className="border p-2">Delivered</th>
						<th className="border p-2">Actions</th>
					</tr>
				</thead>

				<tbody>
					{orders.map((order) => (
						<tr key={order._id} className="text-center">
							<td className="border p-2">{order.user?.name}</td>
							<td className="border p-2">{order.user?.email}</td>
							<td className="border p-2">₹{order.totalPrice}</td>
							<td className="border p-2">{order.isPaid ? "Yes" : "No"}</td>
							<td className="border p-2">
								{order.isDelievered ? "Yes" : "No"}
							</td>
							<td className="border p-2 flex gap-2 justify-center">
								<button
									onClick={() => navigate(`/order/${order._id}`)}
									className="text-blue-600 underline"
								>
									View
								</button>

								{!order.isDelievered && (
									<button
										onClick={() => handleDeliver(order._id)}
										className="bg-green-600 text-white px-2 py-1 rounded"
									>
										Mark Delivered
									</button>
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

export default AdminOrders;
