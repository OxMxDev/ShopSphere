import axiosInstance from "../utils/axios";

export const createReview = (productId, rating, comment) => {
    return axiosInstance.post(`/reviews/${productId}`, {
			rating,
			comment,
		});
}