import userApi from 'api/userApi';
import Loader from 'components/utils/Loader';
import MetaData from 'components/utils/MetaData';
import React, { Fragment, useState } from 'react';
import FacebookLogin from 'react-facebook-login';
// import { GoogleLogin } from 'react-google-login';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { dispatchLogin } from 'redux/actions/authAction';
import { showErrMsg, showSuccessMsg } from '../utils/Notification';
import { ReactComponent as LoginIcon } from '../../images/login.svg';

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
      setUser({ ...user, err: '', success: res.message });
      console.log(res);
      setLoading(false);

      localStorage.setItem('userCurrent', true);

      dispatch(dispatchLogin());
      navigate('/');
    } catch (err) {
      err.response.data.message &&
        setUser({ ...user, err: err.response.data.message, success: '' });
      setTimeout(() => setUser({ ...user, err: null, success: '' }), 2000);
      setLoading(false);
    }
  };

  const responseGoogle = async (response) => {
    try {
      const res = await userApi.loginGoogle({
        tokenId: response.tokenId,
      });

      setUser({ ...user, error: '', success: res.data.message });
      localStorage.setItem('userCurrent', true);

      dispatch(dispatchLogin());
      navigate('/');
    } catch (err) {
      err.response.data.message &&
        setUser({ ...user, err: err.response.data.message, success: '' });
    }
  };

  const responseFacebook = async (response) => {
    try {
      const { accessToken, userID } = response;
      const res = await userApi.loginFacebook({
        accessToken,
        userID,
      });

      setUser({ ...user, error: '', success: res.data.message });
      localStorage.setItem('userCurrent', true);

      dispatch(dispatchLogin());
      navigate('/');
    } catch (err) {
      err.response.data.message &&
        setUser({ ...user, err: err.response.data.message, success: '' });
    }
  };

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
              <button type="submit">
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
            {/* <GoogleLogin
              clientId="97287736977-qnt2i1j8hf2tqok4dj0fb86hrpfnglim.apps.googleusercontent.com"
              buttonText="Login with Google"
              onSuccess={responseGoogle}
              cookiePolicy={'single_host_origin'}
            /> */}

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
