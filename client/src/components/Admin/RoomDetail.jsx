import { roomApi } from 'api/roomApi';
import Loader from 'components/utils/Loader';
import MetaData from 'components/utils/MetaData';
import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RoomDetail = () => {
  const { id } = useParams();
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await roomApi.getRoomById(`${id}`);
        setRoom(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    })();
  }, [id]);

  return (
    <Fragment>
      <MetaData title="Room Details" />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <h1 className="text-center mt-3 title">Room Details</h1>
          <div className="container">
            <div className="bs">
              <h5>{room.name}</h5>
              <p>
                <b>RoomId: {room._id} </b>
              </p>
              <p>
                <b>Price: {formatter.format(room.price)} </b>
              </p>
              <p>
                <b>Room Type: {room.type} </b>
              </p>
              <p>
                <b>Current Bookings: {room.currentBookings.length} bookings </b>
              </p>
              <div className="row">
                <b className="mb-3">Room Images</b>
                {room.imageUrls?.map((img) => (
                  <div key={img} className="col-md-4">
                    <img className="w-100" src={img} alt={img} />
                  </div>
                ))}
              </div>
              <p className="mt-3">
                <b>Description: {room.description} </b>
              </p>
            </div>
            <div>
              {room.currentBookings.length === 0 ? (
                ''
              ) : (
                <Fragment>
                  <h3 className="text-center title m-3">Current Bookings</h3>
                  <div className="bs">
                    {room.currentBookings?.map((booking) => (
                      <Fragment key={booking.bookingId}>
                        <p>
                          <b>BookingId: {booking.bookingId} </b>
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
                          <b>Status: {booking.status} </b>
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
