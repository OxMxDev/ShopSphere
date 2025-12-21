import axiosInstance from "../utils/axios";

export const getAllProducts = () =>{
    return axiosInstance.get("/products/getAllProducts");
}

export const getProductById = (id) =>{
    return axiosInstance.get(`/products/${id}`)
}

export const updateProduct = (id,productData) =>{
    return axiosInstance.patch(`/products/${id}`,productData)
}

export const deleteProduct = (id) =>{
    return axiosInstance.delete(`/products/${id}`)
}