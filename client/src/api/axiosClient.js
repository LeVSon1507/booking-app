import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
  // baseURL: process.env.BACKEND_API_URI,
  baseURL: process.env.BACKEND_API_URI ?? 'https://booking-app-11111.up.railway.app',
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
