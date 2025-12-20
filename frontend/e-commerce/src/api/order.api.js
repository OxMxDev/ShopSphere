import axiosInstance from "../utils/axios";
export const createOrder = (data) => {
	return axiosInstance.post("/orders/createOrder", data);
};

export const getOrderById = (orderId) => {
	return axiosInstance.get(`/orders/getOrder/${orderId}`);
}

export const getUserOrders = () =>{
	return axiosInstance.get("/orders/myorders");
}

export const getAllOrders = () =>{
	return axiosInstance.get("/admins/getAllOrders");
}

export const updateOrderToDelivered = (orderId) =>{
	return axiosInstance.patch(`/orders/updateDeliveredStatus/${orderId}`);
}