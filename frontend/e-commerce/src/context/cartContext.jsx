import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { addProductToCart, removeProductFromCart, getUserCart } from "../api/cart.api";
const cartContext = createContext();

export const CartProvider = ({ children }) => {
	const [cartItems, setCartItems] = useState(()=>{
        const stored = localStorage.getItem("cart");
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(()=>{
        getUserCart()
        .then((res)=>{
            setCartItems(res.data.data.items);
			console.log("Cart fetched", res.data.data.items);
        })
        .catch((err)=>{
            console.log("Error fetching cart",err);
        })
    },[]);
    
    const addToCart = async(product)=>{
		console.log("Adding to cart", product);
        await addProductToCart(product._id,1)
        const res = await getUserCart()
        setCartItems(res.data.data.items)
    }

	const removeFromCart = (id) => {
        removeProductFromCart(id)
	};

    const increaseQty = (id) => {
			setCartItems((prev) =>
				prev.map((item) =>
					item._id === id ? { ...item, qty: item.qty + 1 } : item
				)
			);
		};

		const decreaseQty = (id) => {
			setCartItems(
				(prev) =>
					prev
						.map((item) =>
							item._id === id ? { ...item, qty: item.qty - 1 } : item
						)
						.filter((item) => item.qty > 0) // auto remove
			);
		};

	return (
		<cartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseQty, decreaseQty }}>
			{children}
		</cartContext.Provider>
	);
};

export const useCart = () => useContext(cartContext);
