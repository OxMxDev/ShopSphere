import React, { useState, useEffect, createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
	getFirestore,
	doc,
	setDoc,
	getDoc,
	onSnapshot,
} from "firebase/firestore";
import { ShoppingCart, X, Trash2, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Firebase Config
const firebaseConfig = {
	apiKey: "AIzaSyCoOG0kCDfbK26BSW5Qe9NpRYZqIPtd3LY",
	authDomain: "ecommerce-app-ae924.firebaseapp.com",
	projectId: "ecommerce-app-ae924",
	storageBucket: "ecommerce-app-ae924.appspot.com",
	messagingSenderId: "113595908375",
	appId: "1:113595908375:web:8c50bac76aee8e97e57752",
	measurementId: "G-GM4LKPG7CH",
};

const appId = "my-local-ecommerce-app";

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- CART CONTEXT ---
const CartContext = createContext();

const CartProvider = ({ children, userId }) => {
	const [cart, setCart] = useState({});

	useEffect(() => {
		if (!userId) return;

		const cartRef = doc(
			db,
			"artifacts",
			appId,
			"users",
			userId,
			"cart",
			"items"
		);
		const unsubscribe = onSnapshot(cartRef, (snapshot) => {
			if (snapshot.exists()) {
				setCart(snapshot.data() || {});
			} else {
				setCart({});
			}
		});

		return () => unsubscribe();
	}, [userId]);

	const addToCart = async (product) => {
		if (!userId) return;
		const cartRef = doc(
			db,
			"artifacts",
			appId,
			"users",
			userId,
			"cart",
			"items"
		);
		try {
			const cartSnapshot = await getDoc(cartRef);
			const currentCart = cartSnapshot.exists() ? cartSnapshot.data() : {};

			const updatedQuantity = (currentCart[product.id]?.quantity || 0) + 1;
			const updatedCart = {
				...currentCart,
				[product.id]: {
					...product,
					quantity: updatedQuantity,
				},
			};

			await setDoc(cartRef, updatedCart);
		} catch (e) {
			console.error("Error adding to cart:", e);
		}
	};

	const removeFromCart = async (productId) => {
		if (!userId) return;
		const cartRef = doc(
			db,
			"artifacts",
			appId,
			"users",
			userId,
			"cart",
			"items"
		);
		try {
			const updatedCart = { ...cart };
			delete updatedCart[productId];
			await setDoc(cartRef, updatedCart);
		} catch (e) {
			console.error("Error removing from cart:", e);
		}
	};

	const updateQuantity = async (productId, quantity) => {
		if (!userId) return;
		const cartRef = doc(
			db,
			"artifacts",
			appId,
			"users",
			userId,
			"cart",
			"items"
		);
		try {
			const updatedCart = { ...cart };
			if (quantity > 0) {
				updatedCart[productId].quantity = quantity;
			} else {
				delete updatedCart[productId];
			}
			await setDoc(cartRef, updatedCart);
		} catch (e) {
			console.error("Error updating quantity:", e);
		}
	};

	return (
		<CartContext.Provider
			value={{ cart, addToCart, removeFromCart, updateQuantity }}
		>
			{children}
		</CartContext.Provider>
	);
};

const useCart = () => useContext(CartContext);

// --- HEADER ---
const Header = () => {
	const { cart } = useCart();
	const [isCartOpen, setIsCartOpen] = useState(false);
	const totalItems = Object.values(cart).reduce(
		(sum, item) => sum + item.quantity,
		0
	);

	return (
		<header className="sticky top-0 z-50 bg-white shadow-md">
			<div className="container mx-auto p-4 flex justify-between items-center">
				<h1 className="text-3xl font-bold text-gray-800 font-sans">
					<span className="text-blue-500">Shop</span>Sphere
				</h1>
				<div className="relative">
					<button
						onClick={() => setIsCartOpen(!isCartOpen)}
						className="relative p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200"
					>
						<ShoppingCart size={24} />
						{totalItems > 0 && (
							<span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
								{totalItems}
							</span>
						)}
					</button>
					<AnimatePresence>
						{isCartOpen && <CartSidebar setIsCartOpen={setIsCartOpen} />}
					</AnimatePresence>
				</div>
			</div>
		</header>
	);
};

// --- CART SIDEBAR ---
const CartSidebar = ({ setIsCartOpen }) => {
	const { cart, removeFromCart, updateQuantity } = useCart();
	const total = Object.values(cart).reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);

	return (
		<motion.div
			initial={{ x: "100%" }}
			animate={{ x: 0 }}
			exit={{ x: "100%" }}
			transition={{ type: "spring", damping: 20, stiffness: 100 }}
			className="fixed right-0 top-0 w-full md:w-96 h-full bg-white shadow-xl z-50 flex flex-col"
		>
			<div className="p-6 flex items-center justify-between border-b border-gray-200">
				<h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
				<button
					onClick={() => setIsCartOpen(false)}
					className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
				>
					<X size={24} />
				</button>
			</div>

			<div className="flex-grow overflow-y-auto p-6">
				{Object.values(cart).length === 0 ? (
					<p className="text-center text-gray-500 mt-10">Your cart is empty.</p>
				) : (
					<ul className="space-y-4">
						{Object.values(cart).map((item) => (
							<li
								key={item.id}
								className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg shadow-sm"
							>
								<img
									src={item.image}
									alt={item.name}
									className="w-20 h-20 object-cover rounded-md"
								/>
								<div className="flex-grow">
									<h3 className="font-semibold text-lg">{item.name}</h3>
									<p className="text-gray-600">${item.price.toFixed(2)}</p>
									<div className="flex items-center mt-2">
										<button
											onClick={() => updateQuantity(item.id, item.quantity - 1)}
											className="p-1 px-3 bg-gray-200 rounded-l-md hover:bg-gray-300"
										>
											-
										</button>
										<input
											type="number"
											value={item.quantity}
											onChange={(e) =>
												updateQuantity(item.id, parseInt(e.target.value))
											}
											className="w-12 text-center border-t border-b border-gray-200"
										/>
										<button
											onClick={() => updateQuantity(item.id, item.quantity + 1)}
											className="p-1 px-3 bg-gray-200 rounded-r-md hover:bg-gray-300"
										>
											+
										</button>
									</div>
								</div>
								<button
									onClick={() => removeFromCart(item.id)}
									className="text-gray-400 hover:text-red-500"
								>
									<Trash2 size={20} />
								</button>
							</li>
						))}
					</ul>
				)}
			</div>

			<div className="p-6 border-t border-gray-200">
				<div className="flex justify-between items-center text-xl font-bold mb-4">
					<span>Subtotal:</span>
					<span>${total.toFixed(2)}</span>
				</div>
				<button className="w-full py-3 bg-blue-500 text-white rounded-lg font-bold text-lg hover:bg-blue-600 flex items-center justify-center">
					Checkout <ArrowRight size={20} className="ml-2" />
				</button>
			</div>
		</motion.div>
	);
};

// --- PRODUCT CARD ---
const ProductCard = ({ product }) => {
	const { addToCart } = useCart();
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden"
		>
			<img
				src={product.image}
				alt={product.name}
				className="w-full h-48 object-cover"
			/>
			<div className="p-5 flex flex-col">
				<h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
				<p className="text-gray-600 mt-2">{product.description}</p>
				<div className="flex justify-between items-center mt-4">
					<span className="text-2xl font-bold text-blue-500">
						${product.price.toFixed(2)}
					</span>
					<button
						onClick={() => addToCart(product)}
						className="p-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600"
					>
						Add to Cart
					</button>
				</div>
			</div>
		</motion.div>
	);
};

// --- PRODUCT LIST ---
const ProductList = () => {
	const products = [
		{
			id: "prod-001",
			name: "Wireless Bluetooth Headphones",
			description: "Noise-cancelling, 20 hours battery.",
			price: 79.99,
			image: "https://placehold.co/600x400/1e40af/ffffff?text=Headphones",
		},
		{
			id: "prod-002",
			name: "Smartwatch with Health Tracker",
			description: "Tracks heart rate, steps, and sleep.",
			price: 129.5,
			image: "https://placehold.co/600x400/065f46/ffffff?text=Smartwatch",
		},
		{
			id: "prod-003",
			name: "Classic Leather Backpack",
			description: "Genuine leather, stylish design.",
			price: 59.0,
			image: "https://placehold.co/600x400/9b2c2c/ffffff?text=Backpack",
		},
		{
			id: "prod-004",
			name: "Espresso Machine",
			description: "Cafe-quality coffee at home.",
			price: 249.99,
			image: "https://placehold.co/600x400/312e81/ffffff?text=Espresso+Machine",
		},
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
			{products.map((p) => (
				<ProductCard key={p.id} product={p} />
			))}
		</div>
	);
};

// --- FOOTER ---
const Footer = () => (
	<footer className="bg-gray-800 text-gray-300 py-8 mt-12">
		<div className="container mx-auto text-center">
			<p>&copy; 2025 ShopSphere. All rights reserved.</p>
		</div>
	</footer>
);

// --- APP ---
export default function App() {
	const [isAuthReady, setIsAuthReady] = useState(false);
	const [userId, setUserId] = useState(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				setUserId(user.uid);
			} else {
				try {
					await signInAnonymously(auth);
				} catch (e) {
					console.error("Anonymous sign-in failed:", e);
				}
			}
			setIsAuthReady(true);
		});

		return () => unsubscribe();
	}, []);

	if (!isAuthReady) {
		return (
			<div className="flex items-center justify-center min-h-screen text-gray-500">
				Initializing app...
			</div>
		);
	}

	return (
		<CartProvider userId={userId}>
			<div className="bg-gray-50 min-h-screen font-sans antialiased">
				<Header />
				<main className="container mx-auto p-6">
					<h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
						Featured Products
					</h2>
					<p className="text-center text-sm text-gray-500 mb-4">
						User ID: {userId}
					</p>
					<ProductList />
				</main>
				<Footer />
			</div>
		</CartProvider>
	);
}
