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
  const formater = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
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
      Swal.fire('Chúc mừng', 'Đặt phòng thành công', 'success').then(() => {
        window.location.href = '/';
      });
    } catch (error) {
      console.log(error);
      Swal.fire('Oops', 'Đã xảy ra sự cố', 'error');
    }
  };

  return (
    <Fragment>
      <MetaData title="Đặt phòng" />
      {loading ? (
        <Loader />
      ) : error ? (
        showErrMsg(error)
      ) : (
        <div className="container ">
          <div className="row bs mt-5" data-aos="flip-left">
            <div className="col-md-5 mb-2">
              <h4>{room.name}</h4>
              <img src={room.imageUrls[0]} alt={room.name} className="booking-room-img" />
            </div>
            <div className="col-md-7 boking-detail mb-2">
              <h1 className="">Chi tiết đặt phòng</h1>
              <hr />
              <b>
                <p>Tên: {user.name} </p>
                <p>Ngày nhận phòng: {match.params.startDate} </p>
                <p>Ngày trả phòng: {match.params.endDate} </p>
                <p>Giá phòng: {room.price}/ngày</p>
              </b>

              <h1>Tổng</h1>
              <hr />
              <b>
                <p>Tổng ngày: {totalDays} ngày</p>
                <p>Giá thuê phòng: {room.price} </p>
                <p>Tổng tiền: {formater.format(totalAmount)}</p>
              </b>

              <div className="booking-center">
                <button className="btn-booking" disabled={disable} onClick={handleBooking}>
                  Thanh toán
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
