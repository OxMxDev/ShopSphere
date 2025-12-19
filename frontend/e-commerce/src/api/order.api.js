import axiosInstance from "../utils/axios";
export const createOrder = (data) => {
	return axiosInstance.post("/orders/createOrder", data);
};
