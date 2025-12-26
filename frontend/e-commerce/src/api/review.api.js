import axiosInstance from "../utils/axios";

export const createReview = (productId, rating, comment) => {
    return axiosInstance.post(`/reviews/${productId}`, {
			rating,
			comment,
		});
}

export const getProductReviews = (productId)=>{
	return axiosInstance.get(`/reviews/getProductReviews/${productId}`);
}

export const updateReview = (reviewId, rating, comment) => {
	return axiosInstance.patch(`/reviews/updateReview/${reviewId}`, {
			rating,
			comment,
		});
}

export const deleteReview = (reviewId) => {
	return axiosInstance.delete(`/reviews/deleteReview/${reviewId}`);
}