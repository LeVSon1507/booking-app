import { roomApi } from 'api/roomApi';
import Loader from 'components/utils/Loader';
import MetaData from 'components/utils/MetaData';
import React, { Fragment, useEffect, useState } from 'react';

const RoomDetail = ({ match }) => {
  const formater = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState([]);

  const roomId = match.params.id;

  useEffect(() => {
    (async () => {
      try {
        const response = await roomApi.getRoomById(`${roomId}`);
        setRoom(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    })();
  }, [roomId]);

  return (
    <Fragment>
      <MetaData title="Chi tiết phòng" />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <h1 className="text-center mt-3 title">Chi tiết phòng</h1>
          <div className="container">
            <div className="bs">
              <h5>{room.name}</h5>
              <p>
                <b>RoomId: {room._id} </b>
              </p>
              <p>
                <b>Giá: {formater.format(room.price)} </b>
              </p>
              <p>
                <b>Loại phòng: {room.type} </b>
              </p>
              <p>
                <b>Số lượng đặt phòng hiện tại: {room.currentBookings.length} đặt </b>
              </p>
              <div className="row">
                <b className="mb-3">Ảnh phòng</b>
                {room.imageUrls?.map((img) => (
                  <div key={img} className="col-md-4">
                    <img className="w-100" src={img} alt={img} />
                  </div>
                ))}
              </div>
              <p className="mt-3">
                <b>Mô tả: {room.description} </b>
              </p>
            </div>
            <div>
              {room.currentBookings.length === 0 ? ('') : (
                <Fragment>
                  <h3 className="text-center title m-3">Đặt phòng hiện tại</h3>
                  <div className="bs">
                    {room.currentBookings?.map((booking) => (
                      <Fragment>
                        <p>
                          <b>RoomId: {booking.bookingId} </b>
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
                          <b>Trạng thái: {booking.status} </b>
                        </p>
                        <hr />
                      </Fragment>
                    ))}
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default RoomDetail;
