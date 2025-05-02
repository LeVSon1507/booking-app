import userApi from 'api/userApi';
import { GET_USER_SUCCESS, LOGIN } from 'redux/contants';

export const dispatchLogin = () => ({ type: LOGIN });

export const fetchUser = async (token) => {
  return await userApi.getUsersInfor({
    headers: { Authorization: token },
  });
};

export const dispatchGetUser = (res) => ({
  type: GET_USER_SUCCESS,
  payload: {
    user: res.data,
    isAdmin: res.data.user.role === 1,
  },
});
