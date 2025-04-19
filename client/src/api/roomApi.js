import axiosClient from './axiosClient';

export const roomApi = {
  getManyRooms: (params) => {
    const url = `/api/rooms${params}`;
    return axiosClient.get(url);
  },
  getRoomById: (id) => {
    const url = `/api/rooms/${id}`;
    return axiosClient.get(url);
  },
  getRoomsByHotelId: (hotelId) => {
    const url = `/api/rooms/hotel/${hotelId}`;
    return axiosClient.get(url);
  },
};
