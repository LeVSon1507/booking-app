import { bookingApi } from 'api/bookingApi';
import Loader from 'components/utils/Loader';
import MetaData from 'components/utils/MetaData';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const BookingDetail = ({ match }) => {
  const formater = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState([]);
  const token = useSelector((state) => state.token);

  const bookingId = match.params.id;

  const getBooking = useCallback(async () => {
    return await bookingApi.getBookingById(`${bookingId}`, {
      headers: { Authorization: token },
    });
  }, [token, bookingId]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getBooking();
        setBooking(response.data);
        setLoading(false);
        window.scrollTo(0, 0);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    })();
  }, [getBooking]);

  return (
    <Fragment>
      <MetaData title="Chi tiết đặt phòng" />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <h1 className="text-center mt-3 title">Chi tiết đặt phòng</h1>
          <div className="container">
            <div className="bs">
              <h5>{booking.room}</h5>
              <p>
                <b>RoomId: {booking.roomId} </b>
              </p>
              <p>
                <b>UserId: {booking.userId} </b>
              </p>
              <p>
                <b>
                  CheckIn: {booking.startDate} - CheckOut: {booking.endDate}
                </b>
              </p>
              <p>
                <b>Tổng ngày: {booking.totalDays}/ngày </b>
              </p>
              <p>
                <b>Tổng tiền: {formater.format(booking.totalAmount)} </b>
              </p>
              <p>
                <b>TransactionId: {booking.transactionId} </b>
              </p>
              <p>
                <b>
                  Status:
                  {booking.status === 'booked' ? (
                    <span className="badge bg-success">Hoàn thành</span>
                  ) : (
                    <span className="badge bg-danger">Hủy phòng</span>
                  )}
                </b>
              </p>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default BookingDetail;
