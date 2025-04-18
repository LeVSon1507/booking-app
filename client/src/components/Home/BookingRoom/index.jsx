import { bookingApi } from 'api/bookingApi';
import { roomApi } from 'api/roomApi';
import Loader from 'components/utils/Loader';
import MetaData from 'components/utils/MetaData';
import { showErrMsg } from 'components/utils/Notification';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import './BookingRoom.css';

const BookingRoom = ({ match }) => {
  const formater = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const { user } = useSelector((state) => state.auth);
  const token = useSelector((state) => state.token);
  const [room, setRoom] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [disable, setDisable] = useState(false);
  const roomId = match.params.id;
  const startDate = moment(match.params.startDate, 'DD-MM-YYYY');
  const endDate = moment(match.params.endDate, 'DD-MM-YYYY');

  const totalDays = moment.duration(endDate.diff(startDate)).asDays();
  let totalAmount = totalDays * room.price;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await roomApi.getRoomById(`${roomId}`);
        setRoom(response.data);
        setLoading(false);
        window.scrollTo(0, 0);
      } catch (error) {
        setError(error.response.data.message);
        setLoading(false);
      }
    })();
  }, [roomId]);

  const handleBooking = async () => {
    const bookingDetail = {
      room,
      userId: user._id,
      startDate,
      endDate,
      totalAmount,
      totalDays: Number(totalDays),
    };
    try {
      await bookingApi.createBookingRoom(bookingDetail, {
        headers: { Authorization: token },
      });
      setDisable(true);
      Swal.fire('Congratulations', 'Booking successful', 'success').then(() => {
        window.location.href = '/';
      });
    } catch (error) {
      console.log(error);
      Swal.fire('Oops', 'Something went wrong', 'error');
    }
  };

  return (
    <Fragment>
      <MetaData title="Booking" />
      {loading ? (
        <Loader />
      ) : error ? (
        showErrMsg(error)
      ) : (
        <div className="container">
          <div className="row bs mt-5" data-aos="flip-left">
            <div className="col-md-5 mb-2">
              <h4>{room.name}</h4>
              <img src={room.imageUrls[0]} alt={room.name} className="booking-room-img" />
            </div>
            <div className="col-md-7 booking-detail mb-2">
              <h1>Booking Details</h1>
              <hr />
              <b>
                <p>Name: {user.name} </p>
                <p>Check-in Date: {match.params.startDate} </p>
                <p>Check-out Date: {match.params.endDate} </p>
                <p>Room Price: {room.price}/day</p>
              </b>

              <h1>Total</h1>
              <hr />
              <b>
                <p>Total Days: {totalDays} days</p>
                <p>Room Rent: {room.price} </p>
                <p>Total Amount: {formater.format(totalAmount)}</p>
              </b>

              <div className="booking-center">
                <button className="btn-booking" disabled={disable} onClick={handleBooking}>
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default BookingRoom;
