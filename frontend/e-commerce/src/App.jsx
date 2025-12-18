import Login from "./pages/Login"
import { useEffect, useState } from "react";
import { getCurrentUser } from "./api/auth.api";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
          getCurrentUser().then((res)=>{
              console.log("User already logged in",res.data);
              setIsAuthenticated(true);
              setLoading(false);
          }).catch((err)=>{
              console.log("No user logged in",err);
              setIsAuthenticated(false);
              setLoading(false);
          })
      },[])
  return (
    <>
      {loading ? (
        <p>Loading....</p>
      ) : isAuthenticated ? (
        <p>Welcome to the E-commerce App!</p>
      ) : (
        <Login onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </>
  )
}

export default App
