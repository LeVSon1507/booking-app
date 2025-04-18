import axiosClient from './axiosClient';

const userApi = {
  register(data) {
    const url = '/api/auth/register';
    return axiosClient.post(url, data);
  },
  activeEmail(data) {
    const url = '/api/auth/activation';
    return axiosClient.post(url, data);
  },
  getAccessToken() {
    const url = '/api/auth/refresh_token';
    return axiosClient.post(url);
  },
  login(data) {
    const url = '/api/auth/login';
    return axiosClient.post(url, data);
  },
  logout() {
    const url = '/api/auth/logout';
    return axiosClient.get(url);
  },
  forgotPassword(data) {
    const url = '/api/auth/forgot-password';
    return axiosClient.post(url, data);
  },
  resetPassword(data, token) {
    const url = '/api/auth/reset-password';
    return axiosClient.post(url, data, token);
  },
  getUsersAllInfor(data) {
    const url = '/api/auth/all_infor';
    return axiosClient.get(url, data);
  },
  getUsersInfor(data) {
    const url = '/api/auth/infor';
    return axiosClient.get(url, data);
  },
  updateUser(data, token) {
    const url = '/api/auth/update';
    return axiosClient.put(url, data, token);
  },
  updateUsersRole(id, data, token) {
    const url = `/api/auth/update_role/${id}`;
    return axiosClient.put(url, data, token);
  },
  deleteUser(id, token) {
    const url = `/api/auth/delete/${id}`;
    return axiosClient.delete(url, token);
  },
  // Socail
  loginGoogle(tokenId) {
    const url = '/api/auth/google_login';
    return axiosClient.post(url, tokenId);
  },
  loginFacebook(accessToken, userID) {
    const url = '/api/auth/facebook_login';
    return axiosClient.post(url, accessToken, userID);
  },
};

export default userApi;
