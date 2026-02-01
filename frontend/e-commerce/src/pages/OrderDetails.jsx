import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../api/order.api";
import Loader from "../components/ui/Loader";
import { FiPackage, FiMapPin, FiCreditCard, FiTruck, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../context/authContext";

const OrderDetails = () => {
	const { id } = useParams();
	const { user } = useAuth();

	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const isAdmin = user?.role === "admin";

	useEffect(() => {
		getOrderById(id)
			.then((res) => {
				setOrder(res.data.data);
				setLoading(false);
			})
			.catch((err) => {
				setError("Failed to load order");
				setLoading(false);
			});
	}, [id]);

	if (loading) return <Loader />;
	
	if (error)
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<p className="text-gray-500">{error}</p>
			</div>
		);

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-4xl mx-auto px-4 py-8">
				{/* Back Link - Context aware for admin vs user */}
				<Link
					to={isAdmin ? "/admin/orders" : "/my-orders"}
					className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-6"
				>
					<FiArrowLeft />
					{isAdmin ? "Back to Admin Orders" : "Back to My Orders"}
				</Link>

				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
						<p className="text-sm text-gray-500 mt-1">
							Order #{order._id.slice(-8).toUpperCase()}
						</p>
					</div>
					<p className="text-sm text-gray-500">
						Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
							day: "numeric",
							month: "long",
							year: "numeric",
						})}
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-6">
					{/* Left Column - Order Info */}
					<div className="md:col-span-2 space-y-6">
						{/* Order Items */}
						<div className="bg-white rounded-lg p-6 shadow-sm">
							<div className="flex items-center gap-2 mb-4">
								<FiPackage className="text-gray-500" />
								<h2 className="font-semibold text-gray-900">Order Items</h2>
							</div>

							<div className="divide-y">
								{order.orderItems.map((item) => (
									<div key={item._id} className="py-4 flex gap-4">
										<div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
											<FiPackage className="text-gray-400" />
										</div>
										<div className="flex-1">
											<h3 className="font-medium text-gray-900">
												{item.name}
												{!item.product && (
													<span className="text-xs text-red-500 ml-2">(Deleted)</span>
												)}
											</h3>
											<p className="text-sm text-gray-500">Qty: {item.qty}</p>
										</div>
										<p className="font-semibold text-gray-900">
											₹{(item.price * item.qty).toLocaleString()}
										</p>
									</div>
								))}
							</div>
						</div>

						{/* Shipping Address */}
						<div className="bg-white rounded-lg p-6 shadow-sm">
							<div className="flex items-center gap-2 mb-4">
								<FiMapPin className="text-gray-500" />
								<h2 className="font-semibold text-gray-900">Shipping Address</h2>
							</div>

							<div className="text-gray-600">
								<p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
								<p>{order.shippingAddress.street}</p>
								<p>{order.shippingAddress.city} - {order.shippingAddress.pincode}</p>
								<p className="mt-2">Phone: {order.shippingAddress.phone}</p>
							</div>
						</div>
					</div>

					{/* Right Column - Status & Summary */}
					<div className="space-y-6">
						{/* Status Cards */}
						<div className="bg-white rounded-lg p-6 shadow-sm">
							<div className="flex items-center gap-2 mb-4">
								<FiCreditCard className="text-gray-500" />
								<h2 className="font-semibold text-gray-900">Payment</h2>
							</div>
							{order.isPaid ? (
								<div className="flex items-center gap-2">
									<span className="w-2 h-2 bg-green-500 rounded-full"></span>
									<span className="text-green-700 text-sm">
										Paid on {new Date(order.paidAt).toLocaleDateString()}
									</span>
								</div>
							) : (
								<div className="flex items-center gap-2">
									<span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
									<span className="text-yellow-700 text-sm">Pending Payment</span>
								</div>
							)}
						</div>

						<div className="bg-white rounded-lg p-6 shadow-sm">
							<div className="flex items-center gap-2 mb-4">
								<FiTruck className="text-gray-500" />
								<h2 className="font-semibold text-gray-900">Delivery</h2>
							</div>
							{order.isDelievered ? (
								<div className="flex items-center gap-2">
									<span className="w-2 h-2 bg-green-500 rounded-full"></span>
									<span className="text-green-700 text-sm">
										Delivered on {new Date(order.delieveredAt).toLocaleDateString()}
									</span>
								</div>
							) : (
								<div className="flex items-center gap-2">
									<span className="w-2 h-2 bg-blue-500 rounded-full"></span>
									<span className="text-blue-700 text-sm">In Progress</span>
								</div>
							)}
						</div>

						{/* Price Summary */}
						<div className="bg-white rounded-lg p-6 shadow-sm">
							<h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
							<div className="space-y-3 text-sm">
								<div className="flex justify-between">
									<span className="text-gray-600">Subtotal</span>
									<span>₹{(order.totalPrice - order.taxPrice - order.shippingPrice).toLocaleString()}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Tax</span>
									<span>₹{order.taxPrice.toLocaleString()}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Shipping</span>
									<span>{order.shippingPrice === 0 ? (
										<span className="text-green-600">Free</span>
									) : (
										`₹${order.shippingPrice.toLocaleString()}`
									)}</span>
								</div>
								<hr />
								<div className="flex justify-between font-semibold text-base">
									<span>Total</span>
									<span>₹{order.totalPrice.toLocaleString()}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderDetails;
