import { useCart } from "../context/cartContext";

const Cart = () => {
	const { cartItems, removeFromCart } = useCart();

	if (cartItems.length === 0) {
		return <p>Your cart is empty</p>;
	}

	const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

	return (
		<div className="p-6">
			<h2 className="text-xl font-bold mb-4">Cart</h2>

			{cartItems.map((item) => (
				<div key={item._id} className="border p-4 mb-2">
					<p>{item.name}</p>
					<p>Qty: {item.qty}</p>
					<p>₹{item.price}</p>
					<button
						onClick={() => removeFromCart(item._id)}
						className="text-red-500"
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
