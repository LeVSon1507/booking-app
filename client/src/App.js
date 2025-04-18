import userApi from 'api/userApi';
import Footer from 'components/Layout/Footer';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from 'Routes';
import './App.css';
import Header from './components/Layout/Header';
import { dispatchGetUser, dispatchLogin, fetchUser } from './redux/actions/authAction';

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const { isLogged  } = useSelector((state) => state.auth);
  useEffect(() => {
    const firstLogin = localStorage.getItem("userCurrent")
    if (firstLogin) {
      const getToken = async () => {
        const res = await userApi.getAccessToken();
        dispatch({ type: 'GET_TOKEN', payload: res.data.access_token });
      };
      getToken();
    }
  }, [isLogged, dispatch]);

  useEffect(() => {
    if (token) {
      const getUser = () => {
        dispatch(dispatchLogin());
        return fetchUser(token).then((res) => {        
            dispatch(dispatchGetUser(res));
        });
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
      </div>
    </Router>
  );
}

export default App;
