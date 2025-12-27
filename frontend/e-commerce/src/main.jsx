import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/cartContext.jsx";
import { AuthProvider } from "./context/authContext.jsx";
import { WishlistProvider } from "./context/wishlistContext.jsx";
createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<AuthProvider>
			<WishlistProvider>
				<CartProvider>
					<App />
				</CartProvider>
			</WishlistProvider>
		</AuthProvider>
	</BrowserRouter>
);
