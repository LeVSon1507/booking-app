import { bookingApi } from 'api/bookingApi';
import { hotelApi } from 'api/hotelApi';
import { roomApi } from 'api/roomApi';
import Loader from 'components/utils/Loader';
import MetaData from 'components/utils/MetaData';
import { showErrMsg, showSuccessMsg } from 'components/utils/Notification';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './BookingRoom.css';

const BookingRoom = () => {
  const { roomId, startDate, endDate } = useParams();
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState({});
  const [hotel, setHotel] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [alert, setAlert] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { isLogged, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isLogged) {
      navigate('/login');
    }
  }, [isLogged, navigate]);

  useEffect(() => {
    (async () => {
      try {
        const roomResponse = await roomApi.getRoomById(roomId);
        setRoom(roomResponse.data.room);

        const hotelId = roomResponse.data.room.hotelId;
        const hotelResponse = await hotelApi.getHotelById(hotelId);
        setHotel(hotelResponse.data.hotel);

        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    })();
  }, [roomId]);

  useEffect(() => {
    const startDateObj = moment(startDate, 'DD-MM-YYYY');
    const endDateObj = moment(endDate, 'DD-MM-YYYY');
    if (startDateObj && endDateObj) {
      setTotalDays(endDateObj.diff(startDateObj, 'days'));
      setTotalAmount(room.price * endDateObj.diff(startDateObj, 'days'));
    }
  }, [room, startDate, endDate]);

  const bookingHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const bookingData = {
        room,
        hotelId: hotel._id,
        userId: user._id,
        startDate,
        endDate,
        totalAmount,
        totalDays,
      };

      const res = await bookingApi.bookRoom(bookingData);
      setSuccess(res.data.message);
      setTimeout(() => {
        navigate('/my-booking');
      }, 2000);
    } catch (error) {
      setAlert(error.response.data.message);
      setTimeout(() => {
        setAlert('');
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <Fragment>
      <MetaData title="Book Room" />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="container mt-5 mb-5">
            <div className="row">
              <div className="col-md-6">
                <div className="card">
                  <img
                    src={room.imageUrls?.[0]}
                    alt={room.name}
                    className="card-img-top booking-image"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{room.name}</h5>
                    <div className="hotel-info mb-3">
                      <h6 className="text-muted">
                        <i className="fas fa-hotel mr-2"></i> {hotel.name}
                      </h6>
                      <p className="text-muted">
                        <i className="fas fa-map-marker-alt mr-2"></i> {hotel.address}, {hotel.city}
                      </p>
                    </div>
                    <p className="card-text">{room.description}</p>
                    <div className="room-details">
                      <p>
                        <strong>Room Type:</strong> {room.type}
                      </p>
                      <p>
                        <strong>Capacity:</strong> {room.capacity || 2} persons
                      </p>
                      <p>
                        <strong>Price:</strong> ${room.price}/day
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card">
                  <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">Booking Details</h4>
                  </div>
                  <div className="card-body">
                    <div className="booking-details">
                      <div className="row mb-3">
                        <div className="col-6">
                          <p className="text-muted mb-1">Check In</p>
                          <h5>{startDate}</h5>
                        </div>
                        <div className="col-6">
                          <p className="text-muted mb-1">Check Out</p>
                          <h5>{endDate}</h5>
                        </div>
                      </div>
                      <hr />
                      <div className="row mb-3">
                        <div className="col-6">
                          <p className="text-muted mb-1">Total Days</p>
                          <h5>{totalDays} days</h5>
                        </div>
                        <div className="col-6">
                          <p className="text-muted mb-1">Total Amount</p>
                          <h5>${totalAmount}</h5>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={bookingHandler}>
                      <div className="form-group mb-3">
                        <label htmlFor="guestName">Guest Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="guestName"
                          value={user.name}
                          readOnly
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="guestEmail">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="guestEmail"
                          value={user.email}
                          readOnly
                        />
                      </div>
                      <div className="form-group mb-4">
                        <label htmlFor="specialRequests">Special Requests (Optional)</label>
                        <textarea
                          className="form-control"
                          id="specialRequests"
                          rows="3"
                          placeholder="Any special requests for your stay?"
                        ></textarea>
                      </div>
                      <div className="payment-info alert alert-info">
                        <h6>Payment Information</h6>
                        <p className="mb-0">
                          Payment will be processed at check-in. We accept credit cards, debit
                          cards, and cash.
                        </p>
                      </div>
                      <button type="submit" className="btn btn-primary btn-block mt-4">
                        Confirm Booking
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            {alert && showErrMsg(alert)}
            {success && showSuccessMsg(success)}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default BookingRoom;
