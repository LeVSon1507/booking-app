import userApi from 'api/userApi';
import Loader from 'components/utils/Loader';
import MetaData from 'components/utils/MetaData';
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { showErrMsg, showSuccessMsg } from '../utils/Notification';
import { isEmail, isEmpty, isLength, isMatch } from '../utils/Validation';
import { toast } from 'react-toastify';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEmpty(name) || isEmpty(password)) {
      setTimeout(() => setUser({ ...user, err: null, success: '' }), 2000);
      return setUser({ ...user, err: 'Please fill in all fields.', success: '' });
    }

    if (!isEmail(email)) {
      setTimeout(() => setUser({ ...user, err: null, success: '' }), 2000);
      return setUser({ ...user, err: 'Invalid email.', success: '' });
    }

    if (isLength(password)) {
      setTimeout(() => setUser({ ...user, err: null, success: '' }), 2000);
      return setUser({ ...user, err: 'Password must be at least 6 characters.', success: '' });
    }

    if (!isMatch(password, cf_password)) {
      setTimeout(() => setUser({ ...user, err: null, success: '' }), 2000);
      return setUser({ ...user, err: 'Passwords do not match.', success: '' });
    }
    try {
      setLoading(true);
      const res = await userApi.register({
        name,
        email,
        password,
      });

      setUser({ ...user, err: '', success: res.data.message });
      toast.success('Registration successful! Please check your email to activate your account.');
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
      <MetaData title={'Register'} />
      {loading ? (
        <Loader />
      ) : (
        <div className="login_page">
          <h2 className="text-center">Register</h2>
          {err && showErrMsg(err)}
          {success && showSuccessMsg(success)}

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Nickname</label>
              <input
                type="text"
                placeholder="Enter your nickname"
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
                placeholder="e.g: abc@gmail.com"
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

            <div>
              <label htmlFor="cf_password">Confirm Password</label>
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
                <b>Register</b>
              </button>
            </div>
          </form>

          <p className="text-center">
            Already have an account? <Link to="/login">Login now</Link>
          </p>
        </div>
      )}
    </Fragment>
  );
};

export default Register;
