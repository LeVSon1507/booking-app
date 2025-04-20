import { uploadApi } from 'api/uploadApi';
import userApi from 'api/userApi';
import Loader from 'components/utils/Loader';
import MetaData from 'components/utils/MetaData';
import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { showErrMsg, showSuccessMsg } from '../../utils/Notification';
import { isLength, isMatch } from '../../utils/Validation';
import { ReactComponent as ProfileIcon } from '@images/my-profile.svg';

const Profile = () => {
  const { user, isAdmin, isLoading } = useSelector((state) => state.auth);
  const token = useSelector((state) => state.token);

  const [data, setData] = useState({
    name: '',
    password: '',
    cf_password: '',
    err: '',
    success: '',
  });
  const { name, password, cf_password, err, success } = data;

  const [avatar, setAvatar] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: '', success: '' });
  };

  const changeAvatar = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];

      if (!file) {
        setTimeout(() => setData({ ...data, err: null, success: null }), 1500);
        return setData({
          ...data,
          err: 'No files were uploaded.',
          success: '',
        });
      }

      if (file.size > 1024 * 1024) {
        setTimeout(() => setData({ ...data, err: null, success: null }), 1500);
        return setData({ ...data, err: 'File size is too large.', success: '' });
      }

      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        setTimeout(() => setData({ ...data, err: null, success: null }), 1500);
        return setData({
          ...data,
          err: 'Invalid file format.',
          success: '',
        });
      }

      let formData = new FormData();
      formData.append('file', file);
      setLoading(true);
      const res = await uploadApi.uploadAvatar(formData, {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: token,
        },
      });

      setLoading(false);
      setAvatar(res.data.url);
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: '' });
      setTimeout(() => setData({ err: null, success: null }), 2000);
    }
  };

  const updateInfor = () => {
    try {
      userApi.updateUser(
        {
          name: name ? name : user.name,
          avatar: avatar ? avatar : user.avatar,
        },
        {
          headers: { Authorization: token },
        }
      );

      setData({ ...data, err: '', success: 'Profile updated successfully!' });
      Swal.fire('', 'Profile updated successfully!', 'success').then(() => {
        window.location.href = '/profile';
      });
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: '' });
      setTimeout(() => setData({ ...data, err: '', success: '' }), 2000);
    }
  };

  const updatePassword = () => {
    if (isLength(password)) {
      setTimeout(() => setData({ ...data, err: null, success: null }), 1500);
      return setData({
        ...data,
        err: 'Password must be at least 6 characters.',
        success: '',
      });
    }

    if (!isMatch(password, cf_password)) {
      setTimeout(() => setData({ ...data, err: null, success: null }), 1500);
      return setData({ ...data, err: 'Passwords do not match.', success: '' });
    }

    try {
      userApi.resetPassword(
        { password },
        {
          headers: { Authorization: token },
        }
      );

      setData({ ...data, err: '', success: 'Profile updated successfully!' });
      Swal.fire('', 'Profile updated successfully!', 'success').then(() => {
        window.location.href = '/profile';
      });
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: '' });
      setTimeout(() => setData({ ...data, err: null, success: '' }), 2000);
    }
  };

  const handleUpdate = () => {
    if (name || avatar) updateInfor();
    if (password) updatePassword();
  };

  return (
    <Fragment>
      <div>
        <MetaData title="Profile" />
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <Fragment>
          <div>
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
            {loading && <b>Loading.....</b>}
          </div>
          <div className="profile_page container-fluid">
            <div className="m-auto">
              <h2>{isAdmin ? 'Admin Profile' : 'Profile'}</h2>

              <div className="avatar">
                <img src={avatar ? avatar : user.avatar} alt="" />
                <span>
                  <i className="fas fa-camera"></i>
                  <p>Change</p>
                  <input type="file" name="file" id="file_up" onChange={changeAvatar} />
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  defaultValue={user.name}
                  placeholder="Your name"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" defaultValue={user.email} disabled />
              </div>

              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="*********"
                  value={password}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cf_password">Confirm New Password</label>
                <input
                  type="password"
                  name="cf_password"
                  id="cf_password"
                  placeholder="*********"
                  value={cf_password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <em style={{ color: 'crimson' }}>
                  * If you update your password here, you will not be able to login quickly using
                  Google and Facebook.
                </em>
              </div>
              <div className="d-flex justify-content-center mt-2">
                <button className="" disabled={loading} onClick={handleUpdate}>
                  Update
                  <ProfileIcon className="ml-2" width={'2rem'} height={'2rem'} />
                </button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Profile;
