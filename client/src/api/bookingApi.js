import axiosClient from './axiosClient';

export const bookingApi = {
  createBookingRoom(data, token) {
    const url = '/api/booking';
    return axiosClient.post(url, data, token);
  },
  getAllBooking(token) {
    const url = '/api/bookings';
    return axiosClient.get(url, token);
  },
  getBookingById(id, token) {
    const url = `/api/booking/${id}`;
    return axiosClient.get(url, token);
  },
  getBookingByUserId(token) {
    const url = '/api/bookingbyid';
    return axiosClient.get(url, token);
  },
  cancelBooking(data, token) {
    const url = '/api/cancelbooking';
    return axiosClient.post(url, data, token);
  },
  deleteBooking(id,data ,token) {
    const url = `/api/booking/${id}`;
    return axiosClient.delete(url,data ,token);
  },

};
