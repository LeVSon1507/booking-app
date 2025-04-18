import { showErrMsg } from 'components/utils/Notification';
import React, { useState } from 'react';
import { Carousel, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import './Room.css';

const Room = ({ room, startDate, endDate }) => {
  const formater = new Intl.NumberFormat('en-US', {
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
      setAlert('Please select a date!');
      setTimeout(() => {
        setAlert(null);
      }, 1500);
    } else if (startDate === endDate) {
      setAlert('Start and end dates cannot be the same!');
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
          <p>Price: {formater.format(room.price)}/day</p>
          <p>Room Type: {room.type}</p>
          <a href="#/" onClick={handleShow}>
            View Details {'>>'}
          </a>
          <div className="d-flex justify-content-end">
            <button className="btn-room" onClick={handleClick}>
              Book Now
            </button>
          </div>

          <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
              <b>{room.name}</b>
            </Modal.Header>
            <Modal.Body>
              <Carousel>
                {room.imageUrls?.map((img) => (
                  <Carousel.Item key={img}>
                    <img className="d-block w-100" src={img} alt={img} />
                  </Carousel.Item>
                ))}
              </Carousel>
              <span className="mt-2">
                <b>Description: </b> {room.description}
              </span>
            </Modal.Body>
          </Modal>
        </div>
        {alert && showErrMsg(alert)}
      </div>
    </>
  );
};

export default Room;
