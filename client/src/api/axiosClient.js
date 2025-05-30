import axios from 'axios';
import queryString from 'query-string';

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
axiosClient.interceptors.request.use(
  async (res) => {
    return res;
  },
  (err) => {
    console.log(err);
  }
);

export default axiosClient;
