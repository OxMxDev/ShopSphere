import { useEffect } from "react";
import { createContext, useContext, useState } from "react";

const cartContext = createContext();

export const CartProvider = ({ children }) => {
	const [cartItems, setCartItems] = useState(()=>{
        const stored = localStorage.getItem("cart");
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(()=>{
        localStorage.setItem("cart",JSON.stringify(cartItems));
    },[cartItems]);
	const addToCart = (product) => {
        console.log("Adding to cart:", product);
		setCartItems((prev) => {
            console.log("Previous cart:", prev);
			const existing = prev.find((item) => item.id === product._id);

			if (existing) {
				return prev.map((item) =>
					item.id === product._id ? { ...item, qty: item.qty + 1 } : item
				);
			}
			return [...prev, { ...product, qty: 1 }];
		});
	};

	const removeFromCart = (id) => {
		setCartItems((prev) => prev.filter((item) => item.id !== id));
	};

	return (
		<cartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
			{children}
		</cartContext.Provider>
	);
};

export const useCart = () => useContext(cartContext);
