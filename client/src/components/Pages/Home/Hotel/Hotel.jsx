import React, { useState } from 'react';
import { Button, Carousel, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Hotel.css';

const Hotel = ({ hotel }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleViewRooms = () => {
    navigate(`/hotels/${hotel._id}`);
  };

  return (
    <>
      <div className="row bs hotel-card">
        <div className="col-md-4 mb-1">
          <img
            src={
              hotel.imageUrls && hotel.imageUrls.length > 0
                ? hotel.imageUrls[0]
                : 'https://via.placeholder.com/300x200?text=No+Image'
            }
            alt={hotel.name}
            className="hotel_image"
          />
        </div>
        <div className="col-md-8 mb-1">
          <h5>{hotel.name}</h5>
          <p>
            <i className="fas fa-map-marker-alt"></i> {hotel.address}, {hotel.city}
          </p>
          <div className="hotel-rating">
            <span className="rating-value">{hotel.rating.toFixed(1)}</span>
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`fas fa-star ${i < Math.floor(hotel.rating) ? 'active' : ''}`}
                ></i>
              ))}
            </div>
            <span className="reviews-count">({hotel.reviews?.length || 0} reviews)</span>
          </div>
          <a href="#/" onClick={handleShow}>
            View Details {'>>'}
          </a>
          <div className="d-flex justify-content-end">
            <button className="btn-hotel" onClick={handleViewRooms}>
              View Rooms
            </button>
          </div>

          <Modal show={show} onHide={handleClose} size="lg" centered className="hotel-detail-modal">
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">{hotel.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
              <div className="hotel-carousel-wrapper">
                <Carousel interval={null} className="hotel-carousel">
                  {hotel.imageUrls?.map((img, index) => (
                    <Carousel.Item key={img}>
                      <img
                        className="d-block w-100 hotel-image"
                        src={img}
                        alt={`${hotel.name} - ${index + 1}`}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>

              <div className="hotel-info p-4">
                <div className="hotel-description mb-3">
                  <h5 className="section-title">Description:</h5>
                  <p>{hotel.description}</p>
                </div>

                <div className="hotel-details">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <h5 className="section-title">Hotel Details:</h5>
                      <ul className="list-unstyled">
                        <li>
                          <span className="detail-label">Address:</span> {hotel.address}
                        </li>
                        <li>
                          <span className="detail-label">City:</span> {hotel.city}
                        </li>
                        <li>
                          <span className="detail-label">Rating:</span> {hotel.rating.toFixed(1)}/5
                        </li>
                      </ul>
                    </div>

                    <div className="col-md-6 mb-3">
                      <h5 className="section-title">Amenities:</h5>
                      <div className="amenities-list">
                        {hotel.amenities?.map((amenity, index) => (
                          <span key={index} className="amenity-badge">
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
                onClick={handleViewRooms}
              >
                View Rooms
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Hotel;
