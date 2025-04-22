import axios from 'axios';
import axiosClient from './axiosClient';

export const uploadApi = {
  uploadAvatar(data, token) {
    const url = '/api/upload_avatar';
    return axiosClient.post(url, data, token);
  },

  uploadEvidence: (formData, config) => {
    return axios.post('/api/upload_evidence', formData, config);
  },

  uploadReviewImages: (formData, config) => {
    return axiosClient.post('/api/upload_review_images', formData, config);
  },
};
