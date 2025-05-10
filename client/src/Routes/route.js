import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from 'components/Pages/Home';
import Login from 'components/Auth/Login';
import Register from 'components/Auth/Register';
import ActivationEmail from 'components/Auth/ActivationEmail';
import NotFound from 'components/utils/NotFound';
import ForgotPassword from 'components/Auth/ForgotPassword';
import ResetPassword from 'components/Auth/ResetPassword';
import Profile from 'components/Pages/Profile/Profile';
import EditProfile from 'components/Auth/EditProfile';
import BookingRoom from 'components/Pages/Home/BookingRoom';
import Admin from 'components/Admin';
import GetAllUser from 'components/Admin/GetAllUser';
import GetAllRoom from 'components/Admin/GetAllRoom';
import GetAllBooking from 'components/Admin/GetAllBooking';
import RoomDetail from 'components/Admin/RoomDetail';
import HotelDetail from 'components/Pages/Home/HotelDetail';
import GetAllHotels from 'components/Admin/GetAllHotels';
import AdminHotelDetail from 'components/Admin/HotelDetail';
import AddHotel from 'components/Admin/AddHotel';
import AddRoomForm from 'components/Admin/AddRoomForm';
import HotelReviewPage from 'components/Pages/Home/HotelReviewPage/HotelReviewPage';
import EditReviewPage from 'components/Pages/Home/EditReviewPage/EditReviewPage';
import MyBookings from 'components/Pages/MyBookingsAndReview';
import BookingDetailAdmin from 'components/Admin/BookingDetailAdmin';
import BookingDetail from 'components/Pages/Home/BookingDetail/BookingDetail';
import { toast } from 'react-toastify';
import { isEmpty } from 'components/utils/Validation';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) ?? {};
  const isUserLogged = localStorage.getItem('isUserLogged') ?? false;
  const isAdmin = !!JSON.parse(localStorage.getItem('isAdmin'));

  if (!isUserLogged) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly) {
    if (isEmpty(currentUser) || !isAdmin) {
      toast.error('Access denied. Admins only.');
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/user/reset/:token" element={<ResetPassword />} />
      <Route path="/api/auth/activate/:activation_token" element={<ActivationEmail />} />

      <Route path="/profile" element={<Profile />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/hotels/:id" element={<HotelDetail />} />
      <Route path="/book/:roomId/:startDate/:endDate" element={<BookingRoom />} />
      <Route path="/my-booking" element={<MyBookings />} />
      <Route path="/hotels/:hotelId/review" element={<HotelReviewPage />} />
      <Route path="/hotels/:hotelId/edit-review/:reviewId" element={<EditReviewPage />} />
      <Route path="/booking-details/:id" element={<BookingDetail />} />

      {/* <Route path="/admin" element={<Admin />} />
      <Route path="/admin/users" element={<GetAllUser />} />
      <Route path="/admin/rooms" element={<GetAllRoom />} />
      <Route path="/admin/add-room/:hotelId" element={<AddRoomForm />} />
      <Route path="/admin/bookings" element={<GetAllBooking />} />
      <Route path="/admin/booking/:id" element={<BookingDetailAdmin />} />
      <Route path="/admin/room/:id" element={<RoomDetail />} />
      <Route path="/admin/hotels" element={<GetAllHotels />} />
      <Route path="/admin/hotel/:id" element={<AdminHotelDetail />} />
      <Route path="/admin/add-hotel" element={<AddHotel />} /> */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute adminOnly={true}>
            <GetAllUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/rooms"
        element={
          <ProtectedRoute adminOnly={true}>
            <GetAllRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-room/:hotelId"
        element={
          <ProtectedRoute adminOnly={true}>
            <AddRoomForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute adminOnly={true}>
            <GetAllBooking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/booking/:id"
        element={
          <ProtectedRoute adminOnly={true}>
            <BookingDetailAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/room/:id"
        element={
          <ProtectedRoute adminOnly={true}>
            <RoomDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/hotels"
        element={
          <ProtectedRoute adminOnly={true}>
            <GetAllHotels />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/hotel/:id"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminHotelDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-hotel"
        element={
          <ProtectedRoute adminOnly={true}>
            <AddHotel />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
