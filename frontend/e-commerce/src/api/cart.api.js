import axiosInstance from "../utils/axios";

export const addProductToCart = (productId,qty=1)=>{
    return axiosInstance.post("/cart/addToCart",{productId,qty})
}

export const removeProductFromCart = (productId)=>{
    return axiosInstance.post("/cart/removeFromCart",{productId})
}

export const getUserCart = () => {
    return axiosInstance.get("/cart/getUserCart");
}