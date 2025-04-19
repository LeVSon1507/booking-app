import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Swal from 'sweetalert2';

import { roomApi } from 'api/roomApi';

import Loader from 'components/utils/Loader';
import MetaData from 'components/utils/MetaData';
import { showErrMsg } from 'components/utils/Notification';
import PaymentProcess from '../PaymentProcess/PaymentProcess';
import { ReactComponent as IconMoney } from '../../../images/money3.svg';

import './BookingRoom.css';

const BookingRoom = ({ match }) => {
  const [room, setRoom] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    specialRequests: '',
  });

  const { user } = useSelector((state) => state.auth);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const roomId = match.params.id;
  const startDate = moment(match.params.startDate, 'DD-MM-YYYY');
  const endDate = moment(match.params.endDate, 'DD-MM-YYYY');

  const totalDays = moment.duration(endDate.diff(startDate)).asDays();
  const totalAmount = totalDays * (room?.price || 0);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        const response = await roomApi.getRoomById(roomId);
        setRoom(response.data);
        setLoading(false);
        window.scrollTo(0, 0);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch room details');
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  useEffect(() => {
    if (user) {
      setBookingInfo((prevState) => ({
        ...prevState,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingInfo({
      ...bookingInfo,
      [name]: value,
    });
  };

  const handleProceedToPayment = () => {
    if (!bookingInfo.name || !bookingInfo.email || !bookingInfo.phone) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }

    setShowPayment(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === (room.imageUrls?.length - 1 || 0) ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? room.imageUrls?.length - 1 || 0 : prevIndex - 1
    );
  };

  return (
    <>
      <MetaData title="Book Your Room" />

      {loading ? (
        <Loader />
      ) : error ? (
        showErrMsg(error)
      ) : showPayment ? (
        <PaymentProcess
          room={room}
          bookingInfo={bookingInfo}
          startDate={startDate}
          endDate={endDate}
          totalDays={totalDays}
          totalAmount={totalAmount}
          onBack={() => setShowPayment(false)}
        />
      ) : (
        <div className="container py-4">
          <div className="row booking-container">
            <div className="col-lg-7 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h2 className="card-title">{room.name}</h2>

                  <div className="image-slider-container mb-4">
                    {room.imageUrls && room.imageUrls.length > 0 ? (
                      <>
                        <div className="image-slider">
                          <img
                            src={room.imageUrls[currentImageIndex]}
                            alt={`${room.name} - ${currentImageIndex + 1}`}
                            className="booking-room-img img-fluid rounded"
                          />

                          {room.imageUrls.length > 1 && (
                            <>
                              <button className="slider-btn prev-btn" onClick={prevImage}>
                                &lt;
                              </button>
                              <button className="slider-btn next-btn" onClick={nextImage}>
                                &gt;
                              </button>

                              <div className="image-counter">
                                {currentImageIndex + 1}/{room.imageUrls.length}
                              </div>
                            </>
                          )}
                        </div>

                        {room.imageUrls.length > 1 && (
                          <div className="image-thumbnails mt-2">
                            {room.imageUrls.map((url, index) => (
                              <div
                                key={index}
                                className={`thumbnail ${
                                  index === currentImageIndex ? 'active' : ''
                                }`}
                                onClick={() => setCurrentImageIndex(index)}
                              >
                                <img src={url} alt={`Thumbnail ${index + 1}`} />
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="no-image">No images available</div>
                    )}
                  </div>

                  <div className="room-details">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="badge bg-info text-white p-2">{room.type}</span>
                      <span className="price-tag">{formatter.format(room.price)}/night</span>
                    </div>

                    <h5>Room Features:</h5>
                    <ul className="room-features">
                      <li>Max Guests: {room.maxCount}</li>
                      {room.features &&
                        room.features.map((feature, index) => <li key={index}>{feature}</li>)}
                    </ul>

                    <h5>Description:</h5>
                    <p>{room.description}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="card shadow-sm mb-4">
                <div style={{ backgroundColor: '#e2ba76' }} className="card-header text-white">
                  <h3 className="mb-0">Booking Details</h3>
                </div>
                <div className="card-body">
                  <div className="booking-dates mb-4">
                    <div className="row">
                      <div className="col-6">
                        <p className="text-muted mb-1">Check-in</p>
                        <p className="fw-bold">{startDate.format('DD MMM YYYY')}</p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted mb-1">Check-out</p>
                        <p className="fw-bold">{endDate.format('DD MMM YYYY')}</p>
                      </div>
                    </div>
                    <p className="fw-bold d-flex align-items-center text-center mt-2">
                      <span
                        style={{ backgroundColor: '#e2ba76', padding: '10px', borderRadius: '5px' }}
                        className="badge fw-bold text-black"
                      >
                        {totalDays} {totalDays === 1 ? 'night' : 'nights'}
                      </span>
                      <div>
                        <IconMoney width={100} height={100} style={{ marginLeft: '10px' }} />
                      </div>
                    </p>
                  </div>

                  <div className="price-breakdown mb-4">
                    <h5>Price Details</h5>
                    <div className="d-flex justify-content-between mb-2">
                      <span>
                        {formatter.format(room.price)} x {totalDays}{' '}
                        {totalDays === 1 ? 'night' : 'nights'}
                      </span>
                      <span>{formatter.format(totalAmount)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Taxes & Fees</span>
                      <span>Included</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total</span>
                      <span>{formatter.format(totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card shadow-sm">
                <div style={{ backgroundColor: '#e2ba76' }} className="card-header text-white">
                  <h3 className="mb-0">Guest Information</h3>
                </div>
                <div className="card-body">
                  <form>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={bookingInfo.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email *
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={bookingInfo.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={bookingInfo.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="address" className="form-label">
                        Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        name="address"
                        value={bookingInfo.address}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="specialRequests" className="form-label">
                        Special Requests
                      </label>
                      <textarea
                        className="form-control"
                        id="specialRequests"
                        name="specialRequests"
                        rows="3"
                        value={bookingInfo.specialRequests}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    <button
                      style={{ backgroundColor: '#e2ba76' }}
                      type="button"
                      className="btn btn-lg w-100"
                      onClick={handleProceedToPayment}
                    >
                      Continue to Payment
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingRoom;
