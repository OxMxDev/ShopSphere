import React from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/layout/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./context/authContext";
import { getCurrentUser, logoutUser } from "./api/auth.api";
import Loader from "./components/ui/Loader";

function App() {
  const { isAuthenticated, loading, user, setUser, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.log(error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const handleLoginSuccess = async () => {
    try {
      const res = await getCurrentUser();
      const userData = res.data.data;
      setUser(userData);
      setIsAuthenticated(true);
      
      // Redirect based on user role
      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log("Error fetching user after login", err);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Toaster />
      <Navbar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />
      <AppRoutes
        isAuthenticated={isAuthenticated}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}

export default App;
