import { useCart } from "../context/cartContext";

const Cart = () => {
	const { cartItems, removeFromCart, increaseQty, decreaseQty } = useCart();

	if (cartItems.length === 0) {
		return <p>Your cart is empty</p>;
	}

	const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

	return (
		<div className="p-6">
			<h2 className="text-xl font-bold mb-4">Cart</h2>

			{cartItems.map((item) => (
				<div
					key={item._id}
					className="flex justify-between items-center border p-4 mb-2"
				>
					<div>
						<p className="font-semibold">{item.name}</p>
						<p>₹{item.price}</p>
					</div>

					<div className="flex items-center gap-3">
						<button
							onClick={() => decreaseQty(item._id)}
							className="px-2 bg-gray-300 rounded"
						>
							−
						</button>

						<span>{item.qty}</span>

						<button
							onClick={() => increaseQty(item._id)}
							className="px-2 bg-gray-300 rounded"
						>
							+
						</button>
					</div>
						<button
							onClick={() => removeFromCart(item._id)}
							className="text-red-500 cursor-pointer"
						>
							Remove
						</button>
					</div>
			))}

			<h3 className="font-semibold mt-4">Total: ₹{total}</h3>
		</div>
	);
};

export default Cart;
