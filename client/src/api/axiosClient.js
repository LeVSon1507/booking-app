import axios from 'axios';
import queryString from 'query-string';
import userApi from './userApi';

const axiosClient = axios.create({
  baseURL: 'http://localhost:9000',
  // baseURL: 'https://booking-app-123.up.railway.app',
  // baseURL: process.env.BACKEND_API_URI,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: (prams) => queryString.stringify(prams),
});

axiosClient.interceptors.request.use(async (config) => {
  return config;
});

axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await userApi.getAccessToken();
        const { access_token } = res.data;
        localStorage.setItem('token', access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosClient(originalRequest);
      } catch (err) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
