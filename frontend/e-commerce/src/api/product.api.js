import axiosInstance from "../utils/axios";

export const getAllProducts = () =>{
    return axiosInstance.get("/products/getAllProducts");
}