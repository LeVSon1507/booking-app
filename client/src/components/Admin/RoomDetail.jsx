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
  const [data, setData] = useState({
    hotel: {},
    rooms: [],
    reviews: [],
  });

  const [room, setRoom] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await roomApi.getRoomById(`${id}`);
        setData(response.data);

        const foundRoom = response.data.room;
        setRoom(foundRoom);

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
      ) : room ? (
        <Fragment>
          <h1 className="text-center mt-3 title">Room Details</h1>
          <div className="container">
            <div className="bs">
              <h5>{room?.name}</h5>
              <p>
                <b>
                  Hotel:{' '}
                  {!!data?.hotel?.name ? (
                    data?.hotel?.name
                  ) : (
                    <p className="text-danger">No Hotel (Please delete room)</p>
                  )}{' '}
                </b>
              </p>
              <p>
                <b>RoomId: {room._id} </b>
              </p>
              <p>
                <b>Price: {formatter.format(room.price)} </b>
              </p>
              <p>
                <b>Room Type: {room?.type} </b>
              </p>
              <p>
                <b>Capacity: {room.capacity} persons</b>
              </p>
              <p>
                <b>Current Bookings: {room?.currentBookings?.length || 0} bookings </b>
              </p>

              {room.amenities && room.amenities.length > 0 && (
                <div className="mb-3">
                  <b>Amenities:</b>
                  <ul>
                    {room.amenities.map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="row">
                <b className="mb-3">Room Images</b>
                {room.imageUrls?.map((img, index) => (
                  <div key={index} className="col-md-4 mb-3">
                    <img className="w-100" src={img} alt={`Room ${index + 1}`} />
                  </div>
                ))}
              </div>

              <p className="mt-3">
                <b>Description: </b> {room.description}
              </p>
            </div>

            {room?.currentBookings?.length > 0 && (
              <Fragment>
                <h3 className="text-center title m-3">Current Bookings</h3>
                <div className="bs">
                  {room.currentBookings.map((booking) => (
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

            {data.reviews && data.reviews.length > 0 && (
              <Fragment>
                <h3 className="text-center title m-3">Reviews</h3>
                <div className="bs">
                  {data.reviews.map((review) => (
                    <Fragment key={review._id}>
                      <div className="d-flex align-items-center mb-2">
                        {review.user?.avatar && (
                          <img
                            src={review.user.avatar}
                            alt={review.user.name}
                            style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }}
                          />
                        )}
                        <div>
                          <p className="mb-0">
                            <b>{review.user?.name || 'Anonymous'}</b>
                          </p>
                          <p className="mb-0">Rating: {review.rating}/5</p>
                        </div>
                      </div>
                      {review.title && (
                        <p>
                          <b>Title:</b> {review.title}
                        </p>
                      )}
                      <p>{review.comment}</p>

                      {review.imageUrls && review.imageUrls.length > 0 && (
                        <div className="row mb-3">
                          {review.imageUrls.map((img, index) => (
                            <div key={index} className="col-md-3 mb-2">
                              <img className="w-100" src={img} alt={`Review ${index + 1}`} />
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-muted">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                      <hr />
                    </Fragment>
                  ))}
                </div>
              </Fragment>
            )}
          </div>
        </Fragment>
      ) : (
        <div className="container mt-5 text-center">
          <h3>Room not found</h3>
        </div>
      )}
    </Fragment>
  );
};

export default RoomDetail;
