import { bookingApi } from 'api/bookingApi';
import Loader from 'components/utils/Loader';
import MetaData from 'components/utils/MetaData';
import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchGetBookingUser, fetchBookingUser } from 'redux/actions/bookingAction';
import Swal from 'sweetalert2';

const MyBooking = () => {
  const token = useSelector((state) => state.token);
  const { bookings, loading } = useSelector((state) => state.booking);

  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      fetchBookingUser(token).then((res) => {
        dispatch(dispatchGetBookingUser(res));
      });
    }
  }, [token, dispatch]);

  const handleCancelBooking = async (bookedId, roomId) => {
    try {
      console.log(bookedId, roomId);
      const response = await (
        await bookingApi.cancelBooking({ bookedId, roomId }, { headers: { Authorization: token } })
      ).data;
      Swal.fire('', `${response.message}`, 'success').then(() => {
        window.location.href = '/mybooking';
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      <MetaData title="My booking"/>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {bookings.length === 0 ? (
            <h2 className="text-center mt-2">Booking room is empty</h2>
          ) : (
            <div>
              <div className="container">
                <div className="row">
                  {bookings?.map((booking) => (
                    <div className="col-md-6 bs" data-aos="zoom-in" key={booking._id}>
                      <h5>{booking.room}</h5>
                      <p>
                        <b>BookingId: {booking._id} </b>
                      </p>
                      <p>
                        <b>CheckIn: {booking.startDate} </b>
                      </p>
                      <p>
                        <b>CheckOut: {booking.endDate} </b>
                      </p>
                      <p>
                        <b>Amount: {booking.totalAmount} </b>
                      </p>
                      <p>
                        <b>Status: {booking.status === 'booked' ? 'CONFIRMED' : 'CANCEL'} </b>
                      </p>
                      {booking.status !== 'cancelled' && (
                        <div className="d-flex justify-content-end">
                          <button
                            className="btn btn-dark"
                            onClick={() => {
                              handleCancelBooking(booking._id, booking.roomId);
                            }}
                          >
                            Cancel booking
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default MyBooking;
