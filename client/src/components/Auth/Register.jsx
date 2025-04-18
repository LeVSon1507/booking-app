import userApi from 'api/userApi';
import Loader from 'components/utils/Loader';
import MetaData from 'components/utils/MetaData';
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { showErrMsg, showSuccessMsg } from '../utils/Notification';
import { isEmail, isEmpty, isLength, isMatch } from '../utils/Validation';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    cf_password: '',
    err: '',
    success: '',
  });

  const { name, email, password, cf_password, err, success } = user;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: '', success: '' });
  };

  // hàm submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEmpty(name) || isEmpty(password)) {
      setTimeout(() => setUser({ ...user, err: null, success: '' }), 2000);
      return setUser({ ...user, err: 'Xin mời điền tất cả các trường.', success: '' });
    }

    if (!isEmail(email)) {
      setTimeout(() => setUser({ ...user, err: null, success: '' }), 2000);
      return setUser({ ...user, err: 'Thiếu trường email.', success: '' });
    }

    if (isLength(password)) {
      setTimeout(() => setUser({ ...user, err: null, success: '' }), 2000);
      return setUser({ ...user, err: 'Mật khẩu 6 ký tự trở lên.', success: '' });
    }

    if (!isMatch(password, cf_password)){
      setTimeout(() => setUser({ ...user, err: null, success: '' }), 2000);
      return setUser({ ...user, err: 'Mật khẩu không khớp.', success: '' });
    }
    try {
      setLoading(true);
      // gọi api đăng ký
      const res = await userApi.register({
        name,
        email,
        password,
      });

      setUser({ ...user, err: '', success: res.data.message });
      setLoading(false);
    } catch (err) {
      err.response.data.message &&
        setUser({ ...user, err: err.response.data.message, success: '' });
      setTimeout(() => setUser({ ...user, err: null, success: '' }), 2000);
      setLoading(false);
    }
  };
  return (
    <Fragment>
      <MetaData title={'Đăng ký'} />
      {loading ? (
        <Loader />
      ) : (
        <div className="login_page">
          <h2 className="text-center">Đăng ký</h2>
          {err && showErrMsg(err)}
          {success && showSuccessMsg(success)}

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Nickname</label>
              <input
                type="text"
                placeholder="Nhập nickname"
                id="name"
                value={name}
                name="name"
                onChange={handleChangeInput}
              />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                placeholder="vd: abc@gmail.com"
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

            <div>
              <label htmlFor="cf_password">Xác nhận mật khẩu</label>
              <input
                type="password"
                placeholder="*********"
                id="cf_password"
                value={cf_password}
                name="cf_password"
                onChange={handleChangeInput}
              />
            </div>

            <div className="row">
              <button type="submit">
                <b>Đăng ký</b>
              </button>
            </div>
          </form>

          <p className="text-center">
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </p>
        </div>
      )}
    </Fragment>
  );
};

export default Register;
