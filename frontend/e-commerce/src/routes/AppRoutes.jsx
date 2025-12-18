import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
const AppRoutes = ({isAuthenticated}) => {
	return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Home />
                </ProtectedRoute>
            }/>        
        </Routes>
    );
};

export default AppRoutes;
