import userApi from "api/userApi";
import { GET_USER_SUCCESS, LOGIN } from "redux/contants";

export const dispatchLogin = () => {
  return {
    type: LOGIN,
  };
};

export const fetchUser = async (token) => {
  
  const res = await userApi.getUsersInfor({
    headers: { Authorization: token },
  });
  return res;
};

export const dispatchGetUser = (res) => {
  return {
    type: GET_USER_SUCCESS,
    payload: {
      user: res.data,
      isAdmin: res.data.user.role === 1 ? true : false,
    },
  };
};


