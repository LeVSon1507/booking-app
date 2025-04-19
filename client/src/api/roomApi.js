import axiosClient from './axiosClient';
export const roomApi = {
  getAllRooms: (params) => {
    const url = '/rooms';
    return axiosClient.get(url, { params });
  },

  getRoomById: (id) => {
    const url = `/api/room/${id}`;
    return axiosClient.get(url);
  },

  getRoomsByHotelId: (hotelId) => {
    const url = `/api/rooms/hotel/${hotelId}`;
    return axiosClient.get(url);
  },

  createRoom: (data) => {
    const url = '/api/rooms';
    return axiosClient.post(url, data);
  },

  updateRoom: (id, data) => {
    const url = `/api/room/${id}`;
    return axiosClient.put(url, data);
  },

  deleteRoom: (id) => {
    const url = `/api/room/${id}`;
    return axiosClient.delete(url);
  },
};
