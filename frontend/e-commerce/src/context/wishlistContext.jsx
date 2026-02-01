import { createContext,useContext,useEffect,useState } from "react";
import { addToWishlist,removeFromWishlist,getUserWishlist } from "../api/wishlist.api";
import { useAuth } from "./authContext";

const WishlistContext = createContext();

export const WishlistProvider = ({children})=>{
    const [wishlist,setWishlist] = useState([])
    const [loading,setLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    useEffect(()=>{
        if (isAuthenticated) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    },[isAuthenticated])
    const fetchWishlist = async()=>{
        try {
            const res = await getUserWishlist();
            setWishlist(res.data.data.products || []);

        } catch (error) {
            console.log("Error fetching wishlist",error);
        } finally {
            setLoading(false);
        }
    }
    
    const toggleWishlist = async(productId)=>{
        const exists = wishlist.some(item=>item._id === productId);
        if(exists){
            await removeFromWishlist(productId);
        }else{
            await addToWishlist(productId);
        }
        fetchWishlist();
    }

    return (
        <WishlistContext.Provider value={{wishlist,loading,toggleWishlist}}>
            {children}
        </WishlistContext.Provider>
    )
}   

export const useWishlist = ()=>{
    return useContext(WishlistContext);
}