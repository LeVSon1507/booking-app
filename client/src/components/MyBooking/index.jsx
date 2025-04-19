import { bookingApi } from 'api/bookingApi';
import { hotelApi } from 'api/hotelApi';
import Loader from 'components/utils/Loader';
import MetaData from 'components/utils/MetaData';
import { showErrMsg, showSuccessMsg } from 'components/utils/Notification';
import React, { Fragment, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './MyBooking.css';

const MyBooking = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [alert, setAlert] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [hotelDetails, setHotelDetails] = useState({});
  const navigate = useNavigate();
  const { isLogged } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isLogged) {
      navigate('/login');
    }
  }, [isLogged, navigate]);

  useEffect(() => {
    (async () => {
      try {
        const res = await bookingApi.getBookingsByUserId();
        setBookings(res.data);
        const hotelIds = [...new Set(res.data.map((booking) => booking.hotelId))];
        const hotelDetailsObj = {};

        await Promise.all(
          hotelIds.map(async (hotelId) => {
            try {
              const hotelRes = await hotelApi.getHotelById(hotelId);
              hotelDetailsObj[hotelId] = hotelRes.data.hotel;
            } catch (error) {
              console.log(`Error fetching hotel ${hotelId}:`, error);
            }
          })
        );

        setHotelDetails(hotelDetailsObj);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    })();
  }, []);

  const handleCancel = async (bookingId, roomId) => {
    try {
      setLoading(true);
      const res = await bookingApi.cancelBooking({ bookedId: bookingId, roomId });
      setSuccess(res.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      setAlert(error.response.data.message);
      setTimeout(() => {
        setAlert('');
      }, 2000);
      setLoading(false);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  return (
    <Fragment>
      <MetaData title="My Bookings" />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="container mt-5 mb-5">
            <h2 className="text-center mb-4">My Bookings</h2>
            {bookings.length === 0 ? (
              <div className="no-bookings">
                <h3>You have no bookings yet</h3>
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                  Book Now
                </button>
              </div>
            ) : (
              <div className="row">
                {bookings.map((booking) => (
                  <div className="col-md-6 mb-4" key={booking._id}>
                    <div className="booking-card">
                      <div className="booking-image">
                        <img src={booking.imageUrls[0]} alt={booking.room} />
                        <div className={`booking-status ${booking.status}`}>{booking.status}</div>
                      </div>
                      <div className="booking-content">
                        <h4>{booking.room}</h4>
                        {hotelDetails[booking.hotelId] && (
                          <h6 className="hotel-name">
                            <i className="fas fa-hotel"></i> {hotelDetails[booking.hotelId].name}
                          </h6>
                        )}
                        <div className="booking-dates">
                          <div className="date">
                            <span>Check In</span>
                            <strong>{booking.startDate}</strong>
                          </div>
                          <div className="date-separator">to</div>
                          <div className="date">
                            <span>Check Out</span>
                            <strong>{booking.endDate}</strong>
                          </div>
                        </div>
                        <div className="booking-info">
                          <div className="info-item">
                            <span>Days</span>
                            <strong>{booking.totalDays}</strong>
                          </div>
                          <div className="info-item">
                            <span>Amount</span>
                            <strong>${booking.totalAmount}</strong>
                          </div>
                        </div>
                        <div className="booking-actions">
                          <button
                            className="btn btn-info"
                            onClick={() => handleViewDetails(booking)}
                          >
                            View Details
                          </button>
                          {booking.status !== 'cancelled' && (
                            <button
                              className="btn btn-danger"
                              onClick={() => handleCancel(booking._id, booking.roomId)}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {alert && showErrMsg(alert)}
            {success && showSuccessMsg(success)}
          </div>

          {/* Booking Details Modal */}
          <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>Booking Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedBooking && (
                <div className="booking-details-modal">
                  <div className="row">
                    <div className="col-md-6">
                      <img
                        src={selectedBooking.imageUrls[0]}
                        alt={selectedBooking.room}
                        className="img-fluid rounded mb-3"
                      />
                    </div>
                    <div className="col-md-6">
                      <h4>{selectedBooking.room}</h4>
                      {hotelDetails[selectedBooking.hotelId] && (
                        <div className="hotel-info mb-3">
                          <h6>
                            <i className="fas fa-hotel mr-2"></i>{' '}
                            {hotelDetails[selectedBooking.hotelId].name}
                          </h6>
                          <p>
                            <i className="fas fa-map-marker-alt mr-2"></i>{' '}
                            {hotelDetails[selectedBooking.hotelId].address},{' '}
                            {hotelDetails[selectedBooking.hotelId].city}
                          </p>
                        </div>
                      )}
                      <div className="booking-status-badge mb-3">
                        Status:{' '}
                        <span className={selectedBooking.status}>{selectedBooking.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-12">
                      <h5>Booking Information</h5>
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <td>Booking ID</td>
                            <td>{selectedBooking._id}</td>
                          </tr>
                          <tr>
                            <td>Check In</td>
                            <td>{selectedBooking.startDate}</td>
                          </tr>
                          <tr>
                            <td>Check Out</td>
                            <td>{selectedBooking.endDate}</td>
                          </tr>
                          <tr>
                            <td>Total Days</td>
                            <td>{selectedBooking.totalDays}</td>
                          </tr>
                          <tr>
                            <td>Total Amount</td>
                            <td>${selectedBooking.totalAmount}</td>
                          </tr>
                          <tr>
                            <td>Booking Date</td>
                            <td>
                              {new Date(selectedBooking.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </td>
                          </tr>
                          <tr>
                            <td>Transaction ID</td>
                            <td>{selectedBooking.transactionId}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              {selectedBooking && selectedBooking.status !== 'cancelled' && (
                <Button
                  variant="danger"
                  onClick={() => {
                    handleCancel(selectedBooking._id, selectedBooking.roomId);
                    handleCloseModal();
                  }}
                >
                  Cancel Booking
                </Button>
              )}
            </Modal.Footer>
          </Modal>
        </Fragment>
      )}
    </Fragment>
  );
};

export default MyBooking;
