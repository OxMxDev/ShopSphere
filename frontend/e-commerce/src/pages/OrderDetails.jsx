import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../api/order.api";
import Loader from "../components/ui/Loader";
import PageContainer from "../components/layout/PageContainer";
const OrderDetails = () => {
	const { id } = useParams();

	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

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
	if (error) return <p>{error}</p>;

	return (
		<PageContainer>
		<div className="p-6 max-w-3xl mx-auto">
			<h1 className="text-2xl font-bold mb-4">Order Details</h1>

			{/* Order ID */}
			<p className="mb-2">
				<strong>Order ID:</strong> {order._id}
			</p>

			{/* Shipping Address */}
			<div className="border p-4 mb-4">
				<h2 className="font-semibold mb-2">Shipping Address</h2>
				<p>{order.shippingAddress.name}</p>
				<p>{order.shippingAddress.street}</p>
				<p>
					{order.shippingAddress.city} - {order.shippingAddress.pincode}
				</p>
				<p>Phone: {order.shippingAddress.phone}</p>
			</div>

			{/* Order Items */}
			<div className="border p-4 mb-4">
				<h2 className="font-semibold mb-2">Order Items</h2>

				{order.orderItems.map((item) => (
					<div key={item.product._id} className="flex justify-between mb-2">
						<span>
							{item.name} × {item.qty}
						</span>
						<span>₹{item.price * item.qty}</span>
					</div>
				))}
			</div>

			{/* Payment Status */}
			<div className="border p-4 mb-4">
				<h2 className="font-semibold mb-2">Payment</h2>
				{order.isPaid ? (
					<p className="text-green-600">
						Paid on {new Date(order.paidAt).toLocaleDateString()}
					</p>
				) : (
					<p className="text-red-600">Not Paid</p>
				)}
			</div>

			{/* Delivery Status */}
			<div className="border p-4 mb-4">
				<h2 className="font-semibold mb-2">Delivery</h2>
				{order.isDelievered ? (
					<p className="text-green-600">
						Delivered on {new Date(order.delieveredAt).toLocaleDateString()}
					</p>
				) : (
					<p className="text-yellow-600">Not Delivered</p>
				)}
			</div>

			{/* Price Summary */}
			<div className="border p-4">
				<h2 className="font-semibold mb-2">Price Summary</h2>
				<div className="flex justify-between">
					<span>Items</span>
					<span>
						₹{order.totalPrice - order.taxPrice - order.shippingPrice}
					</span>
				</div>
				<div className="flex justify-between">
					<span>Tax</span>
					<span>₹{order.taxPrice}</span>
				</div>
				<div className="flex justify-between">
					<span>Shipping</span>
					<span>₹{order.shippingPrice}</span>
				</div>
				<hr className="my-2" />
				<div className="flex justify-between font-bold">
					<span>Total</span>
					<span>₹{order.totalPrice}</span>
				</div>
			</div>
		</div>
		</PageContainer>
	);
};

export default OrderDetails;
