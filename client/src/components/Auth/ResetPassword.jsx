import userApi from 'api/userApi';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { showErrMsg, showSuccessMsg } from '../utils/Notification';
import { isLength, isMatch } from '../utils/Validation';

function ResetPassword() {
  const { token } = useParams();
  const [data, setData] = useState({
    password: '',
    cf_password: '',
    err: '',
    success: '',
  });

  const { password, cf_password, err, success } = data;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: '', success: '' });
  };

  const handleResetPass = async () => {
    if (isLength(password))
      return setData({ ...data, err: 'Mật khẩu phải 6 ký tự trở lên.', success: '' });

    if (!isMatch(password, cf_password))
      return setData({ ...data, err: 'Mật khẩu không khớp.', success: '' });

    try {
      const res = await userApi.resetPassword(
        { password },
        {
          headers: { Authorization: token },
        }
      );

      return setData({ ...data, err: '', success: res.data.message });
    } catch (err) {
      err.response.data.message &&
        setData({ ...data, err: err.response.data.message, success: '' });
    }
  };

  return (
    <div className="fg_pass">
      <h2>ĐẶT LẠI MẬT KHẨU CỦA BẠN</h2>

      <div className="row">
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}

        <label htmlFor="password">Mật khẩu</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={handleChangeInput}
        />

        <label htmlFor="cf_password">Xác nhận mật khẩu</label>
        <input
          type="password"
          name="cf_password"
          id="cf_password"
          value={cf_password}
          onChange={handleChangeInput}
        />

        <button onClick={handleResetPass}><b>ĐẶT LẠI MẬT KHẨU</b></button>
      </div>
    </div>
  );
}

export default ResetPassword;
