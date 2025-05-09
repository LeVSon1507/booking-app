import { DatePicker } from 'antd';
import { hotelApi } from 'api/hotelApi';
import { roomApi } from 'api/roomApi';
import Loader from 'components/utils/Loader';
import MetaData from 'components/utils/MetaData';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import LazyLoad from 'react-lazyload';
import { useParams, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Room from '../Room';
import './HotelDetail.css';

const { RangePicker } = DatePicker;

const HotelDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = queryString.parse(location.search);

  const [loading, setLoading] = useState(true);
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [startDate, setStartDate] = useState(queryParams.startDate || '');
  const [endDate, setEndDate] = useState(queryParams.endDate || '');
  const [dateInfo, setDateInfo] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const hotelResponse = await hotelApi.getHotelById(id);
        setHotel(hotelResponse.data.hotel);

        let url = '';
        if (startDate && endDate) {
          url = `?startDate=${startDate}&endDate=${endDate}`;
        }

        const roomsResponse = await roomApi.getRoomsByHotelId(id, url);

        if (roomsResponse.data.rooms) {
          setRooms(roomsResponse.data.rooms);
          setDateInfo(roomsResponse.data.dateInfo);
        } else {
          setRooms(roomsResponse.data);
          setDateInfo(null);
        }

        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    })();
  }, [id, startDate, endDate]);

  const filterByDate = (dates) => {
    if (!dates) {
      setStartDate('');
      setEndDate('');
      return;
    }

    setStartDate(dates[0].format('DD-MM-YYYY'));
    setEndDate(dates[1].format('DD-MM-YYYY'));
  };

  function disabledDate(current) {
    return current && current.valueOf() < moment().endOf('day');
  }

  return (
    <Fragment>
      <MetaData title={hotel ? `${hotel.name} - Rooms` : 'Hotel Details'} />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {hotel && (
            <div className="container hotel-detail-container">
              <div className="hotel-header">
                <div className="row">
                  <div className="col-md-8">
                    <h1 className="hotel-name">{hotel.name}</h1>
                    <p className="hotel-address">
                      <i className="fas fa-map-marker-alt"></i> {hotel.address}, {hotel.city}
                    </p>
                    <div className="hotel-rating">
                      <span className="rating-value">{hotel.rating.toFixed(1)}</span>
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fas fa-star ${
                              i < Math.floor(hotel.rating) ? 'active' : ''
                            }`}
                          ></i>
                        ))}
                      </div>
                      <span className="reviews-count">({hotel.reviews?.length || 0} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hotel-images">
                <Carousel>
                  {hotel.imageUrls?.map((img, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100 hotel-carousel-image"
                        src={img}
                        alt={`${hotel.name} - ${index + 1}`}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>

              <div className="hotel-description mt-4">
                <h3>About this hotel</h3>
                <p className="text-black">{hotel.description}</p>
              </div>

              <div className="hotel-amenities mt-4">
                <h3>Hotel Amenities</h3>
                <div className="amenities-list">
                  {hotel.amenities?.map((amenity, index) => (
                    <span key={index} className="amenity-badge">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rooms-section mt-5">
                <h2>Available Rooms</h2>

                <div className="date-filter-section mb-4">
                  <h5>Select Check-in and Check-out Dates</h5>
                  <RangePicker
                    placeholder={['Check-in', 'Check-out']}
                    format="DD-MM-YYYY"
                    disabledDate={disabledDate}
                    onChange={filterByDate}
                    className="date-picker"
                    defaultValue={
                      startDate && endDate
                        ? [moment(startDate, 'DD-MM-YYYY'), moment(endDate, 'DD-MM-YYYY')]
                        : null
                    }
                  />
                </div>

                {dateInfo && (
                  <div className="alert alert-info mb-4">
                    <i className="fas fa-info-circle me-2"></i>
                    Showing {dateInfo.totalAvailable} available rooms from {dateInfo.startDate} to{' '}
                    {dateInfo.endDate}
                  </div>
                )}

                {rooms.length === 0 ? (
                  <div className="no-rooms-message">
                    <h3>No rooms available for the selected dates</h3>
                    <p>Please try different dates or contact the hotel directly.</p>
                  </div>
                ) : (
                  <div className="rooms-list">
                    {rooms.map((room) => (
                      <div key={room._id} className="room-item">
                        <LazyLoad height={200} offset={100} debounce={300} once>
                          <Room room={room} startDate={startDate} endDate={endDate} />
                        </LazyLoad>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default HotelDetail;
