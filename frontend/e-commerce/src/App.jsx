import Navbar from "./components/layout/Navbar";
import { useEffect, useState } from "react";
import { getCurrentUser } from "./api/auth.api";
import AppRoutes from "./routes/AppRoutes";
import { logoutUser } from "./api/auth.api.js";
import {Toaster} from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(()=>{
          getCurrentUser().then((res)=>{
              setIsAuthenticated(true);
              setUser(res.data.data);
              setLoading(false);
            }).catch((err)=>{
              console.log("No user logged in",err);
              setUser(null);
              setIsAuthenticated(false);
              setLoading(false);
          })
      },[])

      const handleLogout = async() =>{
        try {
          await logoutUser()
          console.log("Logged out successfully");
        } catch (error) {
          console.log("Error logging out",error);
        }finally{
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      const handleLoginSuccess = async () => {
				const res = await getCurrentUser();
				setUser(res.data.data);
        navigate("/admin/dashboard")
				setIsAuthenticated(true);
			};

      if(loading){
        return <div>Loading...</div>
      }
  return (
    <>
      <Toaster/>
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}/>
      <AppRoutes isAuthenticated={isAuthenticated} onLoginSuccess={handleLoginSuccess}/>
    </>
  )
}

export default App
