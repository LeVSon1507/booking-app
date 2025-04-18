import { bookingApi } from 'api/bookingApi';
import { GET_BOOKING_USER_SUCCESS } from 'redux/contants';

export const fetchBookingUser = async (token) => {
  const res = await bookingApi.getBookingByUserId({
    headers: { Authorization: token },
  });
  return res;
};

export const dispatchGetBookingUser = (res) => {
  return {
    type: GET_BOOKING_USER_SUCCESS,
    payload: res.data,
  };
};

