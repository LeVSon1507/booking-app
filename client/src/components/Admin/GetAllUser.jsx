import userApi from 'api/userApi';
import Loader from 'components/utils/Loader';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { dispatchGetAllUsers, fetchAllUsers } from 'redux/actions/userAction';
import Swal from 'sweetalert2';
import './Admin.css';

const GetAllUser = () => {
  const { user, isAdmin } = useSelector((state) => state.auth);
  const token = useSelector((state) => state.token);
  const users = useSelector((state) => state.users);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  console.log(users);

  useEffect(() => {
    if (isAdmin) {
      fetchAllUsers(token).then((res) => {
        dispatch(dispatchGetAllUsers(res));
      });
      setLoading(false);
    }
  }, [token, isAdmin, dispatch]);

  const handleDelete = async (id) => {
    try {
      // không đc phép xóa admin
      console.log(user._id)
      if (user._id !== id) {
        // const response = await userApi.deleteUser(`${id}`, {
        //   headers: { Authorization: token },
        // });
        Swal.fire('', 'Xóa người dùng thành công', 'success').then(() => {
          window.location.href = '/admin';
        });
      }
    } catch (err) {
      console.log(err);
      // err.response.data.message && Swal.fire('Oops', `${err.response.data.message}`, 'error');
    }
  };
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="container">
          <table className="customers">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nickname</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.role === 1 ? (
                      <i className="fas fa-check" title="Admin"></i>
                    ) : (
                      <i className="fas fa-times" title="User"></i>
                    )}
                  </td>
                  <td>
                    <Link to={`/edit_user/${user._id}`}>
                      <i className="fas fa-edit" title="Edit"></i>
                    </Link>
                    <i
                      className="fas fa-trash-alt"
                      title="Remove"
                      onClick={() => handleDelete(user._id)}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Fragment>
  );
};

export default GetAllUser;
