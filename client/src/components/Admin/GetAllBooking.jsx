import { bookingApi } from 'api/bookingApi';
import Loader from 'components/utils/Loader';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Admin.css';

const GetAllBooking = () => {
  const token = useSelector((state) => state.token);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await bookingApi.getAllBooking({
          headers: { Authorization: token },
        });
        console.log(response.data);
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    })();
  }, [token]);

  const handleDeleteBooking = async (bookingId, roomId) => {
    try {
      console.log(bookingId, roomId);
      await bookingApi.deleteBooking(`${bookingId}`, {
        headers: { Authorization: token },
      });

      Swal.fire('', 'Xóa đặt phòng thành công', 'success').then(() => {
        window.location.href = '/admin';
      });
    } catch (error) {
      console.log(error);
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
                <th>Phòng</th>
                <th>Ngày</th>
                <th>Trạng thái</th>
                <th>Tổng tiền</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {bookings?.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking._id}</td>
                  <td>{booking.room}</td>
                  <td>
                    {booking.startDate} to {booking.endDate}
                  </td>
                  <td>{booking.status}</td>
                  <td>{booking.totalAmount}</td>
                  <td className="text-center">
                    <Link to={`admin/booking-detail/${booking._id}`}>
                      <i className="fas fa-eye"></i>
                    </Link>
                    {booking.status === 'cancelled' && (
                      <i
                        className="fas fa-trash-alt"
                        title="Remove"
                        onClick={() => {
                          handleDeleteBooking(booking._id, token);
                        }}
                      ></i>
                    )}
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

export default GetAllBooking;
