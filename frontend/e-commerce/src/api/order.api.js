import axiosInstance from "../utils/axios";
export const createOrder = (data) => {
	return axiosInstance.post("/orders/createOrder", data);
};

export const getOrderById = (orderId) => {
	return axiosInstance.get(`/orders/getOrder/${orderId}`);
}