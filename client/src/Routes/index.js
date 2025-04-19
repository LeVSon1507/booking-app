// src/Routes/index.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from 'components/Home';
import Login from 'components/Auth/Login';
import Register from 'components/Auth/Register';
import ActivationEmail from 'components/Auth/ActivationEmail';
import NotFound from 'components/utils/NotFound';
import ForgotPassword from 'components/Auth/ForgotPassword';
import ResetPassword from 'components/Auth/ResetPassword';
import Profile from 'components/Auth/Profile';
import EditProfile from 'components/Auth/EditProfile';
import BookingRoom from 'components/Home/BookingRoom';
import MyBooking from 'components/MyBooking';
import Admin from 'components/Admin';
import GetAllUser from 'components/Admin/GetAllUser';
import GetAllRoom from 'components/Admin/GetAllRoom';
import GetAllBooking from 'components/Admin/GetAllBooking';
import BookingDetail from 'components/Admin/BookingDetail';
import RoomDetail from 'components/Admin/RoomDetail';
import HotelDetail from 'components/Home/HotelDetail';
import GetAllHotels from 'components/Admin/GetAllHotels';
import AdminHotelDetail from 'components/Admin/HotelDetail';
import AddHotel from 'components/Admin/AddHotel';
import AddRoom from 'components/Admin/AddRoom';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/user/reset/:token" element={<ResetPassword />} />
      <Route path="/user/activate/:activation_token" element={<ActivationEmail />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/hotel/:id" element={<HotelDetail />} />
      <Route path="/book/:roomId/:startDate/:endDate" element={<BookingRoom />} />
      <Route path="/my-booking" element={<MyBooking />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/users" element={<GetAllUser />} />
      <Route path="/admin/rooms" element={<GetAllRoom />} />
      <Route path="/admin/add-room/:hotelId" element={<AddRoom />} />
      <Route path="/admin/bookings" element={<GetAllBooking />} />
      <Route path="/admin/booking/:id" element={<BookingDetail />} />
      <Route path="/admin/room/:id" element={<RoomDetail />} />
      <Route path="/admin/hotels" element={<GetAllHotels />} />
      <Route path="/admin/hotel/:id" element={<AdminHotelDetail />} />
      <Route path="/admin/add-hotel" element={<AddHotel />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
