import { bookingApi } from 'api/bookingApi';
import Loader from 'components/utils/Loader';
import MetaData from 'components/utils/MetaData';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchGetBookingUser, fetchBookingUser } from 'redux/actions/bookingAction';
import Swal from 'sweetalert2';
import './MyBooking.css';
import { ReactComponent as Icon } from '../../images/my-booking-icon.svg';

const MyBooking = () => {
  const token = useSelector((state) => state.token);
  const { bookings, loading } = useSelector((state) => state.booking);
  const [cancellingId, setCancellingId] = useState(null);

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
      setCancellingId(bookedId);

      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, cancel it!',
      });

      if (result.isConfirmed) {
        const response = await bookingApi.cancelBooking(
          { bookedId, roomId },
          { headers: { Authorization: token } }
        );

        Swal.fire('Cancelled!', response.data.message, 'success').then(() => {
          fetchBookingUser(token).then((res) => {
            dispatch(dispatchGetBookingUser(res));
            setCancellingId(null);
          });
        });
      } else {
        setCancellingId(null);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      Swal.fire('Error', 'Something went wrong while cancelling your booking', 'error');
      setCancellingId(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      let date = new Date(dateString);

      if (isNaN(date.getTime())) {
        const parts = dateString.split('-');
        if (parts.length === 3) {
          date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      }

      if (isNaN(date.getTime())) {
        return dateString;
      }

      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'booked':
        return 'badge-success';
      case 'cancelled':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <Fragment>
      <MetaData title="My Bookings" />
      {loading ? (
        <Loader />
      ) : (
        <div className="my-bookings-container">
          <div className="d-flex flex-column align-items-center">
            <Icon width={'8rem'} height={'8rem'} />
            <h2 className="my-bookings-title">My Bookings</h2>
          </div>

          {bookings.length === 0 ? (
            <div className="empty-bookings">
              <i className="fas fa-calendar-times empty-icon"></i>
              <h3>You don't have any bookings yet</h3>
              <p>When you book a room, it will appear here</p>
              <a href="/" className="btn btn-primary">
                Browse Rooms
              </a>
            </div>
          ) : (
            <div className="container">
              <div className="row">
                {bookings?.map((booking) => (
                  <div className="col-md-6 col-lg-4 mb-4" key={booking._id}>
                    <div className="booking-card">
                      <div className="booking-image-container">
                        {booking.imageUrls && booking.imageUrls.length > 0 ? (
                          <img
                            src={booking.imageUrls[0]}
                            alt={booking.room}
                            className="booking-image"
                          />
                        ) : (
                          <div className="no-image">No image available</div>
                        )}
                        <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                          {booking.status === 'booked' ? 'CONFIRMED' : 'CANCELLED'}
                        </span>
                      </div>

                      <div className="booking-details">
                        <h4 className="room-name">{booking.room}</h4>

                        <div className="booking-info">
                          <div className="info-item">
                            <i className="fas fa-calendar-check"></i>
                            <div>
                              <span className="label">Check-in:</span>
                              <span className="value">{formatDate(booking.startDate)}</span>
                            </div>
                          </div>

                          <div className="info-item">
                            <i className="fas fa-calendar-minus"></i>
                            <div>
                              <span className="label">Check-out:</span>
                              <span className="value">{formatDate(booking.endDate)}</span>
                            </div>
                          </div>

                          <div className="info-item">
                            <i className="fas fa-money-bill-wave"></i>
                            <div>
                              <span className="label">Total:</span>
                              <span className="value">{formatCurrency(booking.totalAmount)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="booking-id">
                          <small>Booking ID: {booking._id}</small>
                        </div>

                        {booking.status !== 'cancelled' && (
                          <div className="booking-actions">
                            <button
                              className="btn-cancel"
                              onClick={() => handleCancelBooking(booking._id, booking.roomId)}
                              disabled={cancellingId === booking._id}
                            >
                              {cancellingId === booking._id ? (
                                <span>
                                  <i className="fas fa-spinner fa-spin"></i> Processing...
                                </span>
                              ) : (
                                <span>
                                  <i className="fas fa-times"></i> Cancel Booking
                                </span>
                              )}
                            </button>

                            <a href={`/booking-details/${booking._id}`} className="btn-details">
                              <i className="fas fa-info-circle"></i> Details
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default MyBooking;
