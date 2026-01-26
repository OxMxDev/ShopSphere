import axios from "axios"

const axiosInstance = axios.create({
    baseURL:`${import.meta.env.VITE_BACKEND_URL}/api/v1`,
    withCredentials:true
})

export default axiosInstance

axiosInstance.interceptors.request.use((config)=>{
    return config
},
(error)=>{
    return Promise.reject(error)
})

axiosInstance.interceptors.response.use(
	(response) => {
		return response; 
	},
	(error) => {
		if (error.response?.status === 401) {
		}
		return Promise.reject(error);
	}
);
