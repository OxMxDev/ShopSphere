import { useEffect, useState } from "react";
import { getUserOrders } from "../api/order.api";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../components/ui/Loader";
import { FiPackage, FiChevronRight } from "react-icons/fi";

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

	if (error)
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<p className="text-gray-500">{error}</p>
			</div>
		);

	if (orders.length === 0) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="text-center">
					<FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-800 mb-2">
						No orders yet
					</h2>
					<p className="text-gray-500 mb-6">
						Place your first order to see it here.
					</p>
					<Link
						to="/products"
						className="inline-block bg-slate-800 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors"
					>
						Start Shopping
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-4xl mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

				<div className="space-y-4">
					{orders.map((order) => (
						<div
							key={order._id}
							className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
							onClick={() => navigate(`/order/${order._id}`)}
						>
							<div className="flex items-center justify-between mb-4">
								<div>
									<p className="text-sm text-gray-500">
										Order #{order._id.slice(-6).toUpperCase()}
									</p>
									<p className="text-sm text-gray-500">
										{new Date(order.createdAt).toLocaleDateString("en-IN", {
											day: "numeric",
											month: "short",
											year: "numeric",
										})}
									</p>
								</div>
								<FiChevronRight className="text-gray-400" />
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-4">
									<div className="flex gap-2">
										{/* Status Badges */}
										<span
											className={`px-3 py-1 rounded-full text-xs font-medium ${
												order.isPaid
													? "bg-green-100 text-green-700"
													: "bg-yellow-100 text-yellow-700"
											}`}
										>
											{order.isPaid ? "Paid" : "Unpaid"}
										</span>
										<span
											className={`px-3 py-1 rounded-full text-xs font-medium ${
												order.isDelievered
													? "bg-green-100 text-green-700"
													: "bg-blue-100 text-blue-700"
											}`}
										>
											{order.isDelievered ? "Delivered" : "In Progress"}
										</span>
									</div>
								</div>
								<p className="font-semibold text-gray-900">
									₹{order.totalPrice?.toLocaleString()}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default MyOrders;
