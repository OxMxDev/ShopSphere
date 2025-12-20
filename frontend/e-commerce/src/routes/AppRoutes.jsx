import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import OrderDetails from "../pages/OrderDetails";
import MyOrders from "../pages/MyOrders";
import AdminOrders from "../pages/admin/AdminOrders";
const AppRoutes = ({ onLoginSuccess, isAuthenticated }) => {
	return (
		<Routes>
			<Route
				path="/login"
				element={<Login onLoginSuccess={onLoginSuccess} />}
			/>
			<Route
				path="/"
				element={
					<ProtectedRoute isAuthenticated={isAuthenticated}>
						<Home />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/products"
				element={
					<ProtectedRoute isAuthenticated={isAuthenticated}>
						<Products />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/products/:id"
				element={
					<ProtectedRoute isAuthenticated={isAuthenticated}>
						<ProductDetails />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/cart"
				element={
					<ProtectedRoute isAuthenticated={isAuthenticated}>
						<Cart />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/checkout"
				element={
					<ProtectedRoute isAuthenticated={isAuthenticated}>
						<Checkout />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/order/:id"
				element={
					<ProtectedRoute isAuthenticated={isAuthenticated}>
						<OrderDetails />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/my-orders"
				element={
					<ProtectedRoute isAuthenticated={isAuthenticated}>
						<MyOrders />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/admin/orders"
				element={
					<ProtectedRoute isAuthenticated={isAuthenticated} adminOnly>
						<AdminOrders />
					</ProtectedRoute>
				}
			/>
		</Routes>
	);
};

export default AppRoutes;
