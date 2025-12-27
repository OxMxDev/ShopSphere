import axiosInstance from "../utils/axios";

export const addToWishlist = async (productId) => {
    const response = await axiosInstance.post("/wishlist/addToWishlist", {
			productId,
		});
    return response;
}

export const removeFromWishlist = async (productId) => {
    const response = await axiosInstance.post("/wishlist/removeFromWishlist", {
			productId,
		});
    return response;
}

export const getUserWishlist = async () => {
    const response = await axiosInstance.get("/wishlist/getUserWishlist");  
    return response;
}