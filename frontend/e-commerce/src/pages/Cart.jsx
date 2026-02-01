import { useCart } from "../context/cartContext";
import { useNavigate, Link } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from "react-icons/fi";

const Cart = () => {
	const { cartItems, removeFromCart, increaseQty, decreaseQty } = useCart();
	const navigate = useNavigate();

	const total = cartItems.reduce((sum, item) => {
		if (!item.product) return sum;
		return sum + item.product.price * item.qty;
	}, 0);

	if (cartItems.length === 0) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="text-center">
					<FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-800 mb-2">
						Your cart is empty
					</h2>
					<p className="text-gray-500 mb-6">
						Browse products and add items to your cart.
					</p>
					<Link
						to="/products"
						className="inline-block bg-slate-800 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors"
					>
						Continue Shopping
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-6xl mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

				<div className="flex flex-col lg:flex-row gap-8">
					{/* Cart Items */}
					<div className="flex-1">
						<div className="divide-y">
							{cartItems.map((item) => {
								if (!item.product) return null;

								return (
									<div
										key={item.product._id}
										className="py-6 flex gap-4"
									>
										{/* Product Image */}
										<div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
											<img
												src={item.product.images?.[0]}
												alt={item.product.name}
												className="w-full h-full object-contain"
											/>
										</div>

										{/* Product Info */}
										<div className="flex-1">
											<h3 className="font-medium text-gray-900">
												{item.product.name}
											</h3>
											<p className="text-gray-900 font-semibold mt-1">
												₹{item.product.price?.toLocaleString()}
											</p>

											{/* Quantity Controls */}
											<div className="flex items-center gap-4 mt-3">
												<div className="flex items-center border rounded-md">
													<button
														onClick={() => decreaseQty(item.product._id, item.qty)}
														className="p-2 hover:bg-gray-50 transition-colors"
													>
														<FiMinus className="w-4 h-4" />
													</button>
													<span className="px-4 py-2 text-sm font-medium">
														{item.qty}
													</span>
													<button
														onClick={() => increaseQty(item.product._id, item.qty)}
														className="p-2 hover:bg-gray-50 transition-colors"
													>
														<FiPlus className="w-4 h-4" />
													</button>
												</div>
												<button
													onClick={() => removeFromCart(item.product._id)}
													className="text-gray-400 hover:text-red-500 transition-colors"
												>
													<FiTrash2 className="w-5 h-5" />
												</button>
											</div>
										</div>

										{/* Item Total */}
										<div className="text-right">
											<p className="font-semibold text-gray-900">
												₹{(item.product.price * item.qty).toLocaleString()}
											</p>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* Order Summary */}
					<div className="lg:w-80">
						<div className="bg-gray-50 rounded-lg p-6">
							<h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
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
								onClick={() => navigate("/checkout")}
								className="w-full bg-slate-800 text-white py-3 rounded-md text-sm font-medium mt-6 hover:bg-slate-700 transition-colors"
							>
								Proceed to Checkout
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Cart;
