import { useCart } from "../context/cartContext";
import { useState } from "react";
import { createOrder } from "../api/order.api";
const Checkout = () => {
    const {cartItems} = useCart();
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
						console.log("Order created:", res.data);

						clearCart(); // frontend cart
						navigate(`/order/${res.data.data._id}`);
					} catch (error) {
						console.error("Order failed", error);
						alert(error.response?.data?.message || "Order failed");
					}
				};

    if(cartItems.length === 0){
        return <p>Your cart is empty. Please add items to proceed to checkout.</p>
    }

    const total = cartItems.reduce((sum,item)=>sum + item.price * item.qty,0)
	return (
		<>
			<div className="border p-4 rounded">
				<h2 className="text-lg font-bold mb-2">Order Summary</h2>

				{cartItems.map((item) => (
					<div key={item._id} className="flex justify-between mb-2">
						<span>
							{item.name} × {item.qty}
						</span>
						<span>₹{item.price * item.qty}</span>
					</div>
				))}

				<hr className="my-2" />

				<div className="flex justify-between font-semibold">
					<span>Total</span>
					<span>₹{total}</span>
				</div>
			</div>
			<div className="border p-4 rounded">
				<h2 className="text-lg font-bold mb-2">Shipping Address</h2>

				<input
					placeholder="Full Name"
					value={address.name}
					onChange={(e) => setAddress({ ...address, name: e.target.value })}
				/>

				<input
					placeholder="Street Address"
					value={address.street}
					onChange={(e) => setAddress({ ...address, street: e.target.value })}
				/>

				<input
					placeholder="City"
					value={address.city}
					onChange={(e) => setAddress({ ...address, city: e.target.value })}
				/>

				<input
					placeholder="Pincode"
					value={address.pincode}
					onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
				/>

				<input
					placeholder="Phone"
					value={address.phone}
					onChange={(e) => setAddress({ ...address, phone: e.target.value })}
				/>
			</div>
			<button
				className="bg-green-600 text-white px-4 py-2 rounded mt-4"
				onClick={handlePlaceOrder}
			>
				Place Order
			</button>
		</>
	);
};

export default Checkout;
