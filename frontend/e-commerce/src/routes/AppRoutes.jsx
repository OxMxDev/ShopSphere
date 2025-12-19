import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
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
		</Routes>
	);
};

export default AppRoutes;
