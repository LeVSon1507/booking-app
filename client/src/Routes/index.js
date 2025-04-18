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
import { Route, Switch } from 'react-router';

const Routes = () => {
  const auth = useSelector((state) => state.auth);
  const { isLogged, isAdmin } = auth;
  return (
    <Switch>
      <Fragment>
        {/* Authentication */}
        <Route path="/login" component={Login} exact />
        <Route path="/register" component={Register} exact />
        <Route path="/forgot_password" component={isLogged ? NotFound : ForgotPassword} exact />
        <Route path="/api/auth/reset-password/:token" component={ResetPassword} exact />
        <Route path="/api/auth/activate/:activation_token" component={ActivationEmail} exact />
        <Route path="/profile" component={isLogged ? Profile : NotFound} exact />
        <Route path="/edit_user/:id" component={isAdmin ? EditProfile : NotFound} exact />
        {/* Home */}
        <Route path="/" component={Home} exact />
        <Route path="/book/:id/:startDate/:endDate" component={isLogged ? BookingRoom : Login} exact/>
        <Route path="/mybooking" component={MyBooking} exact />
        {/* <Route  component={NotFound}/> */}

        {/* Admin */}
        <Route path="/admin" component={isAdmin ? Admin : NotFound} exact />
        <Route path="/admin/booking-detail/:id" component={isAdmin ? BookingDetail : NotFound} exact/>
        <Route path="/admin/room-detail/:id" component={isAdmin ? RoomDetail : NotFound} exact/>
      </Fragment>
    </Switch>
  );
};

export default Routes;
