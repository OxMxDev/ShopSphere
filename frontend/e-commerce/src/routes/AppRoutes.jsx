import { Routes, Route } from "react-router-dom";
import Wishlist from "../pages/Wishlist";
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
import EditProduct from "../pages/admin/EditProduct";
import AdminProducts from "../pages/admin/AdminProducts";
import CreateProduct from "../pages/admin/CreateProduct";
import Dashboard from "../pages/Dashboard";
import SignUp from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Profile from "../pages/Profile";

const AppRoutes = ({ onLoginSuccess, isAuthenticated }) => {
	return (
		<Routes>
			<Route
				path="/admin/dashboard"
				element={
					<ProtectedRoute isAuthenticated={isAuthenticated} adminOnly>
						<Dashboard />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/login"
				element={<Login onLoginSuccess={onLoginSuccess} />}
			/>
			<Route
				path="/forgot-password"
				element={<ForgotPassword />}
			/>
			<Route
				path="/reset-password/:token"
				element={<ResetPassword />}
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
			<Route
				path="/admin/products/:id/edit"
				element={
					<ProtectedRoute isAuthenticated={isAuthenticated} adminOnly>
						<EditProduct />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/admin/products"
				element={
					<ProtectedRoute isAuthenticated={isAuthenticated} adminOnly>
						<AdminProducts />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/admin/products/create"
				element={
					<ProtectedRoute isAuthenticated={isAuthenticated} adminOnly>
						<CreateProduct />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/register"
				element={<SignUp />}
			/>
			<Route
				path="/wishlist"
				element={
					<ProtectedRoute>
						<Wishlist />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/profile"
				element={
					<ProtectedRoute isAuthenticated={isAuthenticated}>
						<Profile />
					</ProtectedRoute>
				}
			/>
		</Routes>
	);
};

export default AppRoutes;
