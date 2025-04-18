import userApi from 'api/userApi';
import MetaData from 'components/utils/MetaData';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';


function EditProfile(props) {
  const { id } = useParams();
  const history = useHistory();
  const [editUser, setEditUser] = useState([]);

  const users = useSelector((state) => state.users);
  const token = useSelector((state) => state.token);

  const [checkAdmin, setCheckAdmin] = useState(false);
  const [num, setNum] = useState(0);

  useEffect(() => {
    if (users.length !== 0) {
      users.forEach((user) => {
        if (user._id === id) {
          setEditUser(user);
          setCheckAdmin(user.role === 1 ? true : false);
        }
      });
    } else {
      history.push('/profile');
    }
  }, [users, id, history]);

  const handleUpdate = async () => {
    try {
      if (num % 2 !== 0) {
        const response = await userApi.updateUsersRole(
          `${editUser._id}`,
          {
            role: checkAdmin ? 1 : 0,
          },
          {
            headers: { Authorization: token },
          }
        );

        Swal.fire('', `${response.data.message}`, 'success').then(() => {
          window.location.href = '/profile';
        });
        setNum(0);
      }
    } catch (err) {
      err.response.data.message && Swal.fire('Oops', `${err.response.data.message}`, 'error');
    }
  };

  const handleCheck = () => {
    setCheckAdmin(!checkAdmin);
    setNum(num + 1);
  };

  return (
    <Fragment>
      <MetaData title="Cập nhật thông tin người dùng"/>
      <div className="profile_page edit_user">
      <div className="m-auto">
        <h2>Cập nhật thông tin người dùng</h2>

        <div className="form-group">
          <label htmlFor="name">Tên</label>
          <input type="text" name="name" defaultValue={editUser.name} disabled />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" defaultValue={editUser.email} disabled />
        </div>

        <div className="form-group d-flex">
          <label htmlFor="isAdmin">isAdmin</label>
          <input type="checkbox" id="isAdmin" checked={checkAdmin} onChange={handleCheck} />
        </div>
        <div className="d-flex justify-content-center m-3">
          <button onClick={handleUpdate}>Cập nhật</button>
        </div>
      </div>
    </div>
 
    </Fragment>
    );
}

export default EditProfile;
