import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { addProductToCart, removeProductFromCart, getUserCart, updateCartItemQty } from "../api/cart.api";
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

	const increaseQty = async (productId, currentQty) => {
		await updateCartItemQty(productId, currentQty + 1);
		const res = await getUserCart();
		setCartItems(res.data.data.items);
	};


	const decreaseQty = async (productId, currentQty) => {
		if (currentQty === 1) {
			await removeProductFromCart(productId);
		} else {
			await updateCartItemQty(productId, currentQty - 1);
		}

		const res = await getUserCart();
		setCartItems(res.data.data.items);
	};

	const removeFromCart = async (productId) => {
		await removeProductFromCart(productId);
		const res = await getUserCart();
		setCartItems(res.data.data.items);
	};


	return (
		<cartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseQty, decreaseQty }}>
			{children}
		</cartContext.Provider>
	);
};

export const useCart = () => useContext(cartContext);
