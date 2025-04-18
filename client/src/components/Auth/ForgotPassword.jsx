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
    if (!isEmail(email)) return setData({ ...data, err: 'Xin mời nhập email.', success: '' });

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
      <MetaData title="Quên mật khẩu" />
      {loading ? (
        <Loader />
      ) : (
        <div className="fg_pass">
          <h2 className="title">Quên mật khẩu?</h2>

          <div className="row">
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}

            <label htmlFor="email">
              Nhập email của bạn
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={handleChangeInput}
              placeholder="vd: example@gmail.com"
            />
            <button onClick={forgotPassword}>Xác nhận địa chỉ email</button>
          </div>
        </div>
       )} 
    </Fragment>
  );
}

export default ForgotPassword;
