import userApi from 'api/userApi';
import Loader from 'components/utils/Loader';
import MetaData from 'components/utils/MetaData';
import React, { Fragment, useState } from 'react';
import { showErrMsg, showSuccessMsg } from '../utils/Notification';
import { isEmail } from '../utils/Validation';

function ForgotPassword() {
  const [data, setData] = useState({
    email: '',
    err: '',
    success: '',
  });
  const [loading, setLoading] = useState(false);
  const { email, err, success } = data;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: '', success: '' });
  };

  const forgotPassword = async () => {
    if (!isEmail(email)) return setData({ ...data, err: 'Please input email.', success: '' });

    try {
      setLoading(true);
      const res = await userApi.forgotPassword({ email });
      setData({ ...data, err: '', success: res.data.message });
      setLoading(false);
    } catch (err) {
      err.response.data.message &&
        setData({ ...data, err: err.response.data.message, success: '' });
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <MetaData title="Forgot Password" />
      {loading ? (
        <Loader />
      ) : (
        <div className="fg_pass">
          <h2 className="title">Forgot Password?</h2>

          <div className="row">
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}

            <label htmlFor="email">Enter your email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={handleChangeInput}
              placeholder="e.g: example@gmail.com"
            />
            <button onClick={forgotPassword}>Verify Email Address</button>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default ForgotPassword;
