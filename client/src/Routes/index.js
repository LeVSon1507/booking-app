import BookingDetail from 'components/Admin/BookingDetail';
import Admin from 'components/Admin/index';
import RoomDetail from 'components/Admin/RoomDetail';
import ActivationEmail from 'components/Auth/ActivationEmail';
import EditProfile from 'components/Auth/EditProfile';
import ForgotPassword from 'components/Auth/ForgotPassword';
import Login from 'components/Auth/Login';
import Profile from 'components/Auth/Profile';
import Register from 'components/Auth/Register';
import ResetPassword from 'components/Auth/ResetPassword';
import Home from 'components/Home';
import BookingRoom from 'components/Home/BookingRoom';
import MyBooking from 'components/MyBooking';
import NotFound from 'components/utils/NotFound';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

const AppRoutes = () => {
  const auth = useSelector((state) => state.auth);
  const { isLogged, isAdmin } = auth;
  return (
    <Routes>
      <Fragment>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot_password" element={isLogged ? <NotFound /> : <ForgotPassword />} />
        <Route path="/api/auth/reset-password/:token" element={<ResetPassword />} />
        <Route path="/api/auth/activate/:activation_token" element={<ActivationEmail />} />
        <Route path="/profile" element={isLogged ? <Profile /> : <NotFound />} />
        <Route path="/edit_user/:id" element={isAdmin ? <EditProfile /> : <NotFound />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/book/:id/:startDate/:endDate"
          element={isLogged ? <BookingRoom /> : <Login />}
        />
        <Route path="/mybooking" element={<MyBooking />} />
        <Route path="/booking-details/:id" element={<BookingDetail />} />

        <Route path="/admin" element={isAdmin ? <Admin /> : <NotFound />} />
        <Route
          path="/admin/booking-detail/:id"
          element={isAdmin ? <BookingDetail /> : <NotFound />}
        />
        <Route path="/admin/room-detail/:id" element={isAdmin ? <RoomDetail /> : <NotFound />} />
      </Fragment>
    </Routes>
  );
};

export default AppRoutes;
