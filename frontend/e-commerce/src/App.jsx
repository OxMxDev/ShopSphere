import React from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/layout/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./context/authContext";
import { getCurrentUser, logoutUser } from "./api/auth.api";

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
      setUser(res.data.data);
      setIsAuthenticated(true);
      navigate("/admin/dashboard");
    } catch (err) {
      console.log("Error fetching user after login", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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
