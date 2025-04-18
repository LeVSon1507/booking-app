import { showErrMsg } from 'components/utils/Notification';
import React, { useState } from 'react';
import { Button, Carousel, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import './Room.css';

const Room = ({ room, startDate, endDate }) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [alert, setAlert] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClick = () => {
    if (!startDate || !endDate) {
      setAlert('Please select dates!');
      setTimeout(() => {
        setAlert(null);
      }, 1500);
    } else if (startDate === endDate) {
      setAlert('Cannot select the same date!');
      setTimeout(() => {
        setAlert(null);
      }, 1500);
    } else {
      history.push(`/book/${room._id}/${startDate}/${endDate}`);
    }
  };
  return (
    <>
      <div className="row bs">
        <div className="col-md-4 mb-1">
          <img src={room.imageUrls[0]} alt={room.name} className="room_image" />
        </div>
        <div className="col-md-8 mb-1">
          <h5>{room.name}</h5>
          <p>Room price: {formatter.format(room.price)}/day</p>
          <p>Room type: {room.type}</p>
          <a href="#/" onClick={handleShow}>
            View Detail {'>>'}
          </a>
          <div className="d-flex justify-content-end ">
            <button className="btn-room" onClick={handleClick}>
              Book Now
            </button>
          </div>

          <Modal show={show} onHide={handleClose} size="lg" centered className="room-detail-modal">
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">{room.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
              <div className="room-carousel-wrapper">
                <Carousel interval={null} className="room-carousel">
                  {room.imageUrls?.map((img, index) => (
                    <Carousel.Item key={img}>
                      <img
                        className="d-block w-100 room-image"
                        src={img}
                        alt={`${room.name} - Image ${index + 1}`}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>

              <div className="room-info p-4">
                <div className="room-description mb-3">
                  <h5 className="section-title">Description:</h5>
                  <p>{room.description}</p>
                </div>

                <div className="room-details">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <h5 className="section-title">Room Details:</h5>
                      <ul className="list-unstyled">
                        <li>
                          <span className="detail-label">Room type:</span> {room.type}
                        </li>
                        <li>
                          <span className="detail-label">Price:</span>{' '}
                          {formatter.format(room.price)}/day
                        </li>
                        <li>
                          <span className="detail-label">Max people:</span> {room.maxCount}
                        </li>
                      </ul>
                    </div>

                    <div className="col-md-6 mb-3">
                      <h5 className="section-title">Amenities:</h5>
                      <div className="amenities-list">
                        {room.tv && <span className="amenity-badge">TV</span>}
                        {room.ac && <span className="amenity-badge">Air Conditioner</span>}
                        {room.wifi && <span className="amenity-badge">Wifi</span>}
                        {room.breakfast && <span className="amenity-badge">Breakfast</span>}
                        {room.parking && <span className="amenity-badge">Parking</span>}
                        {room.restaurant && <span className="amenity-badge">Restaurant</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                style={{ backgroundColor: '#e2ba76' }}
                variant="primary"
                onClick={handleClick}
              >
                Book Now
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        {alert && showErrMsg(alert)}
      </div>
    </>
  );
};

export default Room;
