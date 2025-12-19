import axiosInstance from "../utils/axios";

export const getAllProducts = () =>{
    return axiosInstance.get("/products/getAllProducts");
}

export const getProductById = (id) =>{
    return axiosInstance.get(`/products/${id}`)
}