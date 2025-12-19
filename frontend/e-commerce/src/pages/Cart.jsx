import { useCart } from "../context/cartContext";

const Cart = () => {
	const { cartItems, removeFromCart, increaseQty, decreaseQty } = useCart();

	if (cartItems.length === 0) {
		return <p>Your cart is empty</p>;
	}

	const total = cartItems.reduce((sum, item) => {
		if (!item.product) return sum;
		return sum + item.product.price * item.qty;
	}, 0);


	return (
		<div className="p-6">
			<h2 className="text-xl font-bold mb-4">Cart</h2>

			{cartItems.map((item) => {
				if (!item.product) return null;

				return (
					<div
						key={item.product._id}
						className="flex justify-between items-center border p-4 mb-2"
					>
						<div>
							<p className="font-semibold">{item.product.name}</p>
							<p>₹{item.product.price}</p>
						</div>

						<div className="flex items-center gap-3">
							<button onClick={() => decreaseQty(item.product._id)}>−</button>
							<span>{item.qty}</span>
							<button onClick={() => increaseQty(item.product._id)}>+</button>
						</div>

						<button onClick={() => removeFromCart(item.product._id)}>
							Remove
						</button>
					</div>
				);
			})}

			<h3 className="font-semibold mt-4">Total: ₹{total}</h3>
		</div>
	);
};

export default Cart;
