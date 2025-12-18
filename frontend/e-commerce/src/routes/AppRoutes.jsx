import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
const AppRoutes = ({isAuthenticated}) => {
    const setIsAuthenticated = () => {}; // Placeholder function
	return (
		<Routes>
			<Route
				path="/login"
				element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />}
			/>
			<Route
				path="/"
				element={
					<ProtectedRoute isAuthenticated={isAuthenticated}>
						<Home />
					</ProtectedRoute>
				}
			/>
		</Routes>
	);
};

export default AppRoutes;
