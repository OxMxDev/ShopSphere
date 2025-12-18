import axiosInstance from "../utils/axios";

export const loginUser = (data)=>{
    return axiosInstance.post('/users/login',data)
}

export const registerUser = (data)=>{
    return axiosInstance.post('/users/register',data)
}
export const getCurrentUser = ()=>{
    return axiosInstance.get("/users/current-user");
}
export const logoutUser = ()=>{
}
