import axiosClient from './axiosClient';
export const roomApi = {
  getAllRooms: (params) => {
    const url = '/api/rooms';
    return axiosClient.get(url, { params });
  },

  getRoomById: (id) => {
    const url = `/api/room/${id}`;
    return axiosClient.get(url);
  },

  getRoomsByHotelId: (hotelId, params = '') => {
    const url = `/api/rooms/hotel/${hotelId}${params}`;
    return axiosClient.get(url);
  },

  createRoom: (data) => {
    const url = '/api/rooms';
    return axiosClient.post(url, data);
  },

  updateRoom: (id, data) => {
    const url = `/api/rooms/${id}`;
    return axiosClient.put(url, data);
  },

  deleteRoom: (id) => {
    const url = `/api/rooms/${id}`;
    return axiosClient.delete(url);
  },
};
