import userApi from 'api/userApi';
import { GET_ALL_USERS_SUCCESS } from 'redux/contants';

export const fetchAllUsers = async (token) => {
  const res = await userApi.getUsersAllInfor({
    headers: { Authorization: token },
  });
  return res;
};

export const dispatchGetAllUsers = (res) => {
  return {
    type: GET_ALL_USERS_SUCCESS,
    payload: res.data,
  };
};
