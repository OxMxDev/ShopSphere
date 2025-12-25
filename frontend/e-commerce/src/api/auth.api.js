import axiosInstance from "../utils/axios";

export const loginUser = (data)=>{
    return axiosInstance.post('/users/login',data)
}

export const registerUser = (formData) => {
	return axiosInstance.post("/users/register", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};
export const getCurrentUser = ()=>{
    return axiosInstance.get("/users/current-user");
}
export const logoutUser = ()=>{
    return axiosInstance.post('/users/logout')
}
