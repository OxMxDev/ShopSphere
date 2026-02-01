import { useEffect, useState } from "react";
import { getAllOrders, updateOrderToDelivered } from "../../api/order.api";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/ui/Loader";
import { FiEye, FiCheck, FiPackage } from "react-icons/fi";
import toast from "react-hot-toast";

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
		try {
			await updateOrderToDelivered(orderId);
			toast.success("Order marked as delivered");
			fetchOrders();
		} catch (err) {
			toast.error("Failed to update order");
		}
	};

	if (loading) return <Loader />;

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
					<p className="text-gray-500 mt-1">Manage and track all customer orders</p>
				</div>

				{orders.length === 0 ? (
					<div className="bg-white rounded-xl p-12 text-center">
						<FiPackage className="w-12 h-12 text-gray-300 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-gray-800 mb-2">No orders yet</h3>
						<p className="text-gray-500">Orders will appear here when customers make purchases</p>
					</div>
				) : (
					<div className="space-y-4">
						{/* Desktop Table View */}
						<div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="bg-gray-50 border-b">
											<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
											<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
											<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
											<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
											<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery</th>
											<th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
										</tr>
									</thead>

									<tbody className="divide-y divide-gray-100">
										{orders.map((order) => (
											<tr key={order._id} className="hover:bg-gray-50 transition-colors">
												<td className="px-6 py-4">
													<span className="text-sm font-medium text-gray-900">
														#{order._id.slice(-8).toUpperCase()}
													</span>
												</td>
												<td className="px-6 py-4">
													<div>
														<p className="text-sm font-medium text-gray-900">{order.user?.name}</p>
														<p className="text-xs text-gray-500">{order.user?.email}</p>
													</div>
												</td>
												<td className="px-6 py-4">
													<span className="text-sm font-semibold text-gray-900">
														₹{order.totalPrice?.toLocaleString()}
													</span>
												</td>
												<td className="px-6 py-4">
													<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
														order.isPaid 
															? "bg-green-100 text-green-800" 
															: "bg-yellow-100 text-yellow-800"
													}`}>
														{order.isPaid ? "Paid" : "Pending"}
													</span>
												</td>
												<td className="px-6 py-4">
													<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
														order.isDelievered 
															? "bg-green-100 text-green-800" 
															: "bg-blue-100 text-blue-800"
													}`}>
														{order.isDelievered ? "Delivered" : "In Progress"}
													</span>
												</td>
												<td className="px-6 py-4">
													<div className="flex items-center justify-end gap-2">
														<button
															onClick={() => navigate(`/order/${order._id}`)}
															className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
															title="View Details"
														>
															<FiEye size={18} />
														</button>

														{!order.isDelievered && (
															<button
																onClick={() => handleDeliver(order._id)}
																className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md hover:bg-slate-700 transition-colors"
															>
																<FiCheck size={14} />
																Mark Delivered
															</button>
														)}
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>

						{/* Mobile Card View */}
						<div className="md:hidden space-y-4">
							{orders.map((order) => (
								<div key={order._id} className="bg-white rounded-xl shadow-sm p-4 space-y-3">
									<div className="flex justify-between items-start">
										<div>
											<span className="text-sm font-medium text-gray-900">
												#{order._id.slice(-8).toUpperCase()}
											</span>
											<p className="text-sm text-gray-500 mt-1">{order.user?.name}</p>
										</div>
										<span className="text-sm font-semibold text-gray-900">
											₹{order.totalPrice?.toLocaleString()}
										</span>
									</div>

									<div className="flex items-center gap-2 text-xs">
										<span className={`px-2 py-0.5 rounded-full ${
											order.isPaid 
												? "bg-green-100 text-green-800" 
												: "bg-yellow-100 text-yellow-800"
										}`}>
											{order.isPaid ? "Paid" : "Pending"}
										</span>
										<span className={`px-2 py-0.5 rounded-full ${
											order.isDelievered 
												? "bg-green-100 text-green-800" 
												: "bg-blue-100 text-blue-800"
										}`}>
											{order.isDelievered ? "Delivered" : "In Progress"}
										</span>
									</div>

									<div className="pt-3 border-t flex items-center justify-end gap-2">
										<button
											onClick={() => navigate(`/order/${order._id}`)}
											className="flex-1 py-2 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
										>
											View Details
										</button>
										{!order.isDelievered && (
											<button
												onClick={() => handleDeliver(order._id)}
												className="flex-1 py-2 text-sm text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
											>
												Mark Delivered
											</button>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminOrders;
