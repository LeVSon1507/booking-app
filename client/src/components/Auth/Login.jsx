import userApi from 'api/userApi';
import Loader from 'components/utils/Loader';
import MetaData from 'components/utils/MetaData';
import React, { Fragment, useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { dispatchLogin } from 'redux/actions/authAction';
import { showErrMsg, showSuccessMsg } from '../utils/Notification';
import { ReactComponent as LoginIcon } from '@images/login.svg';
import { toast } from 'react-toastify';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: '',
    password: '',
    err: '',
    success: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { email, password, err, success } = user;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: '', success: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await userApi.login({ email, password });
      localStorage.setItem('token', res.data?.token || '');
      localStorage.setItem('currentUser', JSON.stringify(res.data?.user));
      localStorage.setItem('isUserLogged', true);
      localStorage.setItem('isAdmin', res.data?.user?.role === 1 ? true : false);
      if (res.data?.refreshToken) {
        localStorage.setItem('refreshToken', res.data.refreshToken);
      }
      setUser({ ...user, err: '', success: res.data?.message });
      dispatch(dispatchLogin());
      if (res.data?.user?.role === 1) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch {
      toast.error('Account not active or wrong credentials.');
      err.response?.data?.message &&
        setUser({ ...user, err: err.response.data.message, success: '' });
    } finally {
      setLoading(false);
    }
  };

  const responseFacebook = async (response) => {
    try {
      const { accessToken, userID } = response;
      const res = await userApi.loginFacebook({ accessToken, userID });

      setUser({ ...user, error: '', success: res.data.message });
      localStorage.setItem('isUserLogged', true);
      dispatch(dispatchLogin());
      navigate('/');
    } catch (err) {
      err.response?.data?.message &&
        setUser({ ...user, err: err.response.data.message, success: '' });
    }
  };

  const isEmptyCre = !email || !password;

  return (
    <Fragment>
      <MetaData title={'Login'} />
      {loading ? (
        <Loader />
      ) : (
        <div className="login_page">
          <div className="d-flex justify-content-center align-items-center">
            <h2 className="text-center" style={{ color: '#e2ba76' }}>
              Login
            </h2>
            <LoginIcon width={100} height={100} />
          </div>

          {err && showErrMsg(err)}
          {success && showSuccessMsg(success)}

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                placeholder="e.g: example@gmail.com"
                id="email"
                value={email}
                name="email"
                onChange={handleChangeInput}
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="*********"
                id="password"
                value={password}
                name="password"
                onChange={handleChangeInput}
              />
            </div>

            <div className="row">
              <button
                type="submit"
                style={
                  isEmptyCre
                    ? {
                        backgroundColor: 'gray',
                        border: 'none',
                      }
                    : {}
                }
                className={isEmptyCre ? 'disabled' : ''}
                disabled={isEmptyCre}
              >
                <b>Login</b>
              </button>
              <Link
                to="/forgot_password"
                className="d-flex justify-content-end"
                style={{ color: '#e2ba76' }}
              >
                Forgot password?
              </Link>
            </div>
          </form>

          <div style={{ color: '#e2ba76' }} className="hr text-center">
            Or login with
          </div>

          <div className="social">
            <FacebookLogin
              appId="685178710652906"
              autoLoad={false}
              fields="name,email,picture"
              callback={responseFacebook}
            />
          </div>

          <p className="text-center">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      )}
    </Fragment>
  );
};

export default Login;
