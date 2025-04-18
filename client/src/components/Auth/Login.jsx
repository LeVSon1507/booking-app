import userApi from 'api/userApi';
import Loader from 'components/utils/Loader';
import MetaData from 'components/utils/MetaData';
import React, { Fragment, useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { dispatchLogin } from 'redux/actions/authAction';
import { showErrMsg, showSuccessMsg } from '../utils/Notification';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: '',
    password: '',
    err: '',
    success: '',
  });
  const dispatch = useDispatch();
  const history = useHistory();

  const { email, password, err, success } = user;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: '', success: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // gọi api đăng nhập
      const res = await userApi.login({ email, password });
      setUser({ ...user, err: '', success: res.message });
      console.log(res);
      setLoading(false);

      // lưu đăng nhập ở local
      localStorage.setItem('userCurrent', true);

      dispatch(dispatchLogin());
      history.push('/');
    } catch (err) {
      err.response.data.message &&
        setUser({ ...user, err: err.response.data.message, success: '' });
      setTimeout(() => setUser({ ...user, err: null, success: '' }), 2000);
      setLoading(false);
    }
  };

  const responseGoogle = async (response) => {
    try {
      // gọi api đăng nhập google
      const res = await userApi.loginGoogle({
        tokenId: response.tokenId,
      });

      setUser({ ...user, error: "", success: res.data.message });
      localStorage.setItem('userCurrent', true);

      dispatch(dispatchLogin());
      history.push('/');
    } catch (err) {
      err.response.data.message &&
        setUser({ ...user, err: err.response.data.message, success: '' });
    }
  };

  const responseFacebook = async (response) => {
    try {
      const { accessToken, userID } = response;
      // gọi api đăng nhập facebook
      const res = await userApi.loginFacebook({
        accessToken,
        userID,
      });

      setUser({ ...user, error: '', success: res.data.message });
      localStorage.setItem('userCurrent', true);


      dispatch(dispatchLogin());
      history.push('/');
    } catch (err) {
      err.response.data.message &&
        setUser({ ...user, err: err.response.data.message, success: '' });
    }
  };

  return (
    <Fragment>
      <MetaData title={'Đăng nhập'} />
      {loading ? (
        <Loader />
      ) : (
        <div className="login_page">
          <h2 className="text-center">Đăng nhập</h2>
          {err && showErrMsg(err)}
          {success && showSuccessMsg(success)}

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                placeholder="vd: example@gmail.com"
                id="email"
                value={email}
                name="email"
                onChange={handleChangeInput}
              />
            </div>

            <div>
              <label htmlFor="password">Mật khẩu</label>
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
                <b>Đăng nhập</b>
              </button>
              <Link to="/forgot_password" className="d-flex justify-content-end">
                Quên mật khẩu?
              </Link>
            </div>
          </form>

          <div className="hr text-center">Hoặc đăng nhập với</div>

          <div className="social">
            <GoogleLogin
              clientId="55687161092-slgs7a90j0guvn4f5vi1p6s6sf8vv9m5.apps.googleusercontent.com"
              buttonText="Đăng nhập Google"
              onSuccess={responseGoogle}
              cookiePolicy={'single_host_origin'}
            />

            <FacebookLogin
              appId="160074812626146"
              autoLoad={false}
              fields="name,email,picture"
              callback={responseFacebook}
            />
          </div>

          <p className="text-center">
            Chưa có tài khoản. <Link to="/register">Đăng ký tại đây</Link>
          </p>
        </div>
      )}
    </Fragment>
  );
};

export default Login;
