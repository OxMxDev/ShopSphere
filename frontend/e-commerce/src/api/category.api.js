import axiosInstance from "../utils/axios";

export const getAllCategories = async()=>{
    return axiosInstance.get("categories/getAllCategories");
}