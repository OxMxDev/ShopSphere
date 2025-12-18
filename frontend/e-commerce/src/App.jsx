import Navbar from "./components/layout/Navbar";
import { useEffect, useState } from "react";
import { getCurrentUser } from "./api/auth.api";
import AppRoutes from "./routes/AppRoutes";
import { logoutUser } from "./api/auth.api.js";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  useEffect(()=>{
          getCurrentUser().then((res)=>{
              console.log("User already logged in",res.data);
              setIsAuthenticated(true);
              setUser(res.data.data);
              console.log("User data",res.data.data);
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
  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}/>
      <AppRoutes isAuthenticated={isAuthenticated}/>
    </>
  )
}

export default App
