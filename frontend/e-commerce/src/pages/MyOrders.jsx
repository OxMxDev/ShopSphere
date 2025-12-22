import { useEffect, useState } from "react";
import { getUserOrders } from "../api/order.api";
import { useNavigate } from "react-router-dom";
import Badge from "../components/ui/Badege";
import Loader from "../components/ui/Loader";
import PageContainer from "../components/layout/PageContainer";
const MyOrders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		getUserOrders()
			.then((res) => {
				setOrders(res.data.data);
				setLoading(false);
			})
			.catch((err) => {
				setError("Failed to fetch orders");
				setLoading(false);
			});
	}, []);

	if (loading) return <Loader />;
	if (error) return <p>{error}</p>;

	if (orders.length === 0) {
		return (
			<div className="text-center py-10">
				<p className="text-lg font-semibold">No orders yet</p>
				<p className="text-gray-500 mt-2">
					Place your first order to see it here.
				</p>
			</div>
		);
	}

	return (
		<PageContainer>
		<div className="p-6 max-w-4xl mx-auto">
			<h1 className="text-2xl font-bold mb-4">My Orders</h1>

			<table className="w-full border">
				<thead className="bg-gray-100">
					<tr>
						<th className="border p-2">Order ID</th>
						<th className="border p-2">Date</th>
						<th className="border p-2">Total</th>
						<th className="border p-2">Paid</th>
						<th className="border p-2">Delivered</th>
						<th className="border p-2">Details</th>
					</tr>
				</thead>

				<tbody>
					{orders.map((order) => (
						<tr key={order._id} className="text-center">
							<td className="border p-2">{order._id.slice(-6)}</td>
							<td className="border p-2">
								{new Date(order.createdAt).toLocaleDateString()}
							</td>
							<td className="border p-2">₹{order.totalPrice}</td>
							<td className="border p-2">{order.isPaid ? "Yes" : "No"}</td>
							<td className="border p-2">
								{order.isDelievered ? "Yes" : "No"}
							</td>

							<td className="border p-2">
								<button
									onClick={() => navigate(`/order/${order._id}`)}
									className="text-blue-600 underline"
								>
									View
								</button>
							</td>
							<td>
								{order.isPaid ? (
									<Badge text="Paid" type="success" />
								) : (
									<Badge text="Unpaid" type="warning" />
								)}
							</td>
							<td>
								{order.isDelievered ? (
									<Badge text="Delivered" type="success" />
								) : (
									<Badge text="Pending" type="info" />
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

export default MyOrders;
