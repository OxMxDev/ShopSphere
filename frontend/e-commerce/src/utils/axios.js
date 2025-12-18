import axios from "axios"
import { config } from "dotenv"

const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL,
    withCredentials:true
})

export default axiosInstance

axiosInstance.interceptors.request.use((config)=>{
    const token = localStorage.getItem('accessToken')
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
},
(error)=>{
    return Promise.reject(error)
})

axiosInstance.interceptors.response.use(
	(response) => {
		return response; // ✅ IMPORTANT
	},
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem("token");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	}
);
