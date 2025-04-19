import axiosClient from './axiosClient';

export const hotelApi = {
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
};
