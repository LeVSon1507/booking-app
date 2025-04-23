import axiosClient from './axiosClient';

export const reviewApi = {
  addReview: (hotelId, reviewData, config) => {
    return axiosClient.post(`/api/hotels/${hotelId}/reviews`, reviewData, config);
  },

  getUserReviews: (config) => {
    return axiosClient.get('/api/reviews/user', config);
  },

  updateReview: (reviewId, reviewData, config) => {
    return axiosClient.put(`/api/reviews/${reviewId}`, reviewData, config);
  },

  deleteReview: (reviewId, config) => {
    return axiosClient.delete(`/api/reviews/${reviewId}`, config);
  },
};
