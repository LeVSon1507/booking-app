import { bookingApi } from 'api/bookingApi';
import Loader from 'components/utils/Loader';
import MetaData from 'components/utils/MetaData';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const BookingDetail = () => {
  const { id } = useParams();
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState([]);
  const token = useSelector((state) => state.token);

  const getBooking = useCallback(async () => {
    return await bookingApi.getBookingById(`${id}`, {
      headers: { Authorization: token },
    });
  }, [token, id]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getBooking();
        setBooking(response.data.booking);
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
      <MetaData title="Booking Details" />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <h1 className="text-center mt-3 title">Booking Details</h1>
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
                <b>Total Days: {booking.totalDays}/day </b>
              </p>
              <p>
                <b>Total Amount: {formatter.format(booking.totalAmount)} </b>
              </p>
              <p>
                <b>TransactionId: {booking.transactionId} </b>
              </p>
              <p>
                <b>
                  Status:
                  {booking.status === 'booked' ? (
                    <span className="badge bg-success">Completed</span>
                  ) : (
                    <span className="badge bg-danger">Cancelled</span>
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
