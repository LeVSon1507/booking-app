import axiosClient from './axiosClient';

export const hotelApi = {
  createHotel: (body) => {
    const url = '/api/hotels';
    return axiosClient.post(url, body);
  },
  getAllHotels: (params) => {
    const url = `/api/hotels${params}`;
    return axiosClient.get(url);
  },
  getHotelById: (id) => {
    const url = `/api/hotels/${id}`;
    return axiosClient.get(url);
  },
  getHotelsByCity: (city) => {
    const url = `/api/hotels/city/${city}`;
    return axiosClient.get(url);
  },
  deleteHotel: (id) => {
    const url = `/api/hotels/${id}`;
    return axiosClient.delete(url);
  },
};
