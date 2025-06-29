import { showErrMsg } from 'components/utils/Notification';
import React, { useState } from 'react';
import { Button, Carousel, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Room.css';
import { toast } from 'react-toastify';

const Room = ({ room, startDate, endDate }) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [alert, setAlert] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClick = () => {
    if (!localStorage.getItem('token')) {
      toast.error('Please login to book!');
      return;
    }
    if (!startDate || !endDate) {
      toast.error('Please select dates!');
    } else if (startDate === endDate) {
      toast.error('Cannot select the same date!');
    } else {
      navigate(`/book/${room._id}/${startDate}/${endDate}`);
    }
  };

  return (
    <>
      <div className="row bs">
        <div className="col-md-4 mb-1">
          <img src={room.imageUrls[0]} alt={room?.name} className="room_image" />
        </div>
        <div className="col-md-8 mb-1">
          <h4 className="font-bold mb-3">
            <strong>{room?.name}</strong>
          </h4>
          <p className="text-black">
            <strong>Room price:</strong> {formatter?.format(room?.price)}/day
          </p>
          <p className="text-black">
            <strong>Room type:</strong> {room?.type}
          </p>
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
                        alt={`${room.name}  ${index + 1}`}
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
                          <span className="detail-label">Max people:</span> {room.capacity || 2}
                        </li>
                      </ul>
                    </div>

                    <div className="col-md-6 mb-3">
                      <h5 className="section-title">Amenities:</h5>
                      <div className="amenities-list">
                        {room.amenities?.map((amenity, index) => (
                          <span key={index} className="amenity-badge" style={{ color: 'black' }}>
                            {amenity}
                          </span>
                        ))}
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
