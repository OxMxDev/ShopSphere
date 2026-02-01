import { useCart } from "../context/cartContext";
import { useState } from "react";
import { createOrder } from "../api/order.api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Checkout = () => {
	const { cartItems, clearCart } = useCart();
	const navigate = useNavigate();
	const [paymentMethod, setPaymentMethod] = useState("COD");
	const [address, setAddress] = useState({
		name: "",
		street: "",
		city: "",
		pincode: "",
		phone: "",
	});

	const orderPayload = {
		shippingAddress: address,
		paymentMethod,
	};

	const handlePlaceOrder = async () => {
		try {
			const res = await createOrder(orderPayload);
			clearCart();
			toast.success("Order placed successfully!");
			navigate(`/order/${res.data.data._id}`);
		} catch (error) {
			toast.error(error.response?.data?.message || "Something went wrong");
		}
	};

	const total = cartItems.reduce((sum, item) => {
		if (!item.product) return sum;
		return sum + item.product.price * item.qty;
	}, 0);

	if (cartItems.length === 0) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-xl font-semibold text-gray-800 mb-2">
						Your cart is empty
					</h2>
					<p className="text-gray-500 mb-6">
						Please add items to proceed to checkout.
					</p>
					<Link
						to="/products"
						className="inline-block bg-slate-800 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors"
					>
						Browse Products
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-6xl mx-auto px-4 py-8">
				{/* Breadcrumb */}
				<div className="text-sm text-gray-500 mb-8">
					<Link to="/" className="hover:text-gray-800">Home</Link>
					{" / "}
					<Link to="/cart" className="hover:text-gray-800">Cart</Link>
					{" / "}
					<span className="text-gray-900">Checkout</span>
				</div>

				<div className="flex flex-col lg:flex-row gap-12">
					{/* Shipping Form */}
					<div className="flex-1">
						<h2 className="text-xl font-semibold text-gray-900 mb-6">
							Shipping Information
						</h2>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Full Name
								</label>
								<input
									type="text"
									placeholder="John Doe"
									value={address.name}
									onChange={(e) => setAddress({ ...address, name: e.target.value })}
									className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Street Address
								</label>
								<input
									type="text"
									placeholder="123 Main Street"
									value={address.street}
									onChange={(e) => setAddress({ ...address, street: e.target.value })}
									className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										City
									</label>
									<input
										type="text"
										placeholder="Mumbai"
										value={address.city}
										onChange={(e) => setAddress({ ...address, city: e.target.value })}
										className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Pincode
									</label>
									<input
										type="text"
										placeholder="400001"
										value={address.pincode}
										onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
										className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Phone Number
								</label>
								<input
									type="text"
									placeholder="+91 9876543210"
									value={address.phone}
									onChange={(e) => setAddress({ ...address, phone: e.target.value })}
									className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
								/>
							</div>

							{/* Payment Method */}
							<div className="mt-6">
								<h3 className="text-sm font-medium text-gray-700 mb-3">
									Payment Method
								</h3>
								<div className="space-y-2">
									<label className="flex items-center gap-2 cursor-pointer">
										<input
											type="radio"
											name="payment"
											value="COD"
											checked={paymentMethod === "COD"}
											onChange={(e) => setPaymentMethod(e.target.value)}
											className="w-4 h-4"
										/>
										<span className="text-sm text-gray-600">Cash on Delivery</span>
									</label>
								</div>
							</div>
						</div>
					</div>

					{/* Order Summary */}
					<div className="lg:w-96">
						<div className="bg-gray-50 rounded-lg p-6">
							<h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>

							<div className="space-y-3 mb-4">
								{cartItems.map((item) => {
									if (!item.product) return null;
									return (
										<div key={item.product._id} className="flex justify-between text-sm">
											<span className="text-gray-600">
												{item.product.name} × {item.qty}
											</span>
											<span>₹{(item.product.price * item.qty).toLocaleString()}</span>
										</div>
									);
								})}
							</div>

							<hr className="my-4" />

							<div className="space-y-3 text-sm">
								<div className="flex justify-between">
									<span className="text-gray-600">Subtotal</span>
									<span>₹{total.toLocaleString()}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Shipping</span>
									<span className="text-green-600">Free</span>
								</div>
								<hr />
								<div className="flex justify-between font-semibold text-base">
									<span>Total</span>
									<span>₹{total.toLocaleString()}</span>
								</div>
							</div>

							<button
								onClick={handlePlaceOrder}
								className="w-full bg-slate-800 text-white py-3 rounded-md text-sm font-medium mt-6 hover:bg-slate-700 transition-colors"
							>
								Place Order
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Checkout;
