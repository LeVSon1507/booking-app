import userApi from 'api/userApi';
import Footer from 'components/Layout/Footer';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from 'Routes/route';
import './App.css';
import Header from './components/Layout/Header';
import { dispatchGetUser, dispatchLogin, fetchUser } from './redux/actions/authAction';
import { ToastContainer } from 'react-toastify';
import Chatbot from './components/Chatbot/Chatbot';

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const isUserLogged = localStorage.getItem('isUserLogged');

    if (storedToken && isUserLogged) {
      dispatch({ type: 'GET_TOKEN', payload: storedToken });
    }

    setIsInitialized(true);
  }, [dispatch]);

  useEffect(() => {
    if (isInitialized && !token) {
      const isUserLogged = localStorage.getItem('isUserLogged');

      if (isUserLogged) {
        const refreshToken = async () => {
          try {
            const res = await userApi.getAccessToken();
            dispatch({ type: 'GET_TOKEN', payload: res.data.access_token });
            localStorage.setItem('token', res.data.access_token);
          } catch (error) {
            console.log('Refresh token failed');
            localStorage.removeItem('isUserLogged');
            localStorage.removeItem('token');
          }
        };

        refreshToken();
      }
    }
  }, [isInitialized, token, dispatch]);

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          dispatch(dispatchLogin());
          const res = await fetchUser(token);
          dispatch(dispatchGetUser(res));
        } catch (error) {
          console.log('Failed to fetch user data');
        }
      };

      getUser();
    }
  }, [token, dispatch]);

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="booking-app-main-container">
          <Routes />
        </div>
        <Footer />
        <Chatbot />
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
