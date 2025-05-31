import React, { useState } from 'react';
import { Button, Carousel, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Hotel.css';

const Hotel = ({ hotel }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleToggleReviews = () => setShowAllReviews(!showAllReviews);

  const handleViewRooms = () => {
    navigate(`/hotels/${hotel._id}`);
  };

  const calculateCategoryRatings = () => {
    if (!hotel.reviews || hotel.reviews.length === 0) return {};

    const initialRatings = {
      cleanliness: 0,
      comfort: 0,
      location: 0,
      service: 0,
      value: 0,
    };

    const totals = hotel.reviews.reduce(
      (acc, review) => {
        if (review.categoryRatings) {
          Object.keys(initialRatings).forEach((category) => {
            if (review.categoryRatings[category]) {
              acc[category] += review.categoryRatings[category];
            }
          });
        }
        return acc;
      },
      { ...initialRatings }
    );

    const averages = {};
    Object.keys(totals).forEach((category) => {
      averages[category] = totals[category] / hotel.reviews.length;
    });

    return averages;
  };

  const categoryRatings = calculateCategoryRatings();

  const recentReviews = hotel.reviews
    ? [...hotel.reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3)
    : [];

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
            <span className="reviews-count">
              ({hotel.reviews?.length || 0} reviews)
              {hotel.reviews?.length > 0 && (
                <a
                  href="#/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleShow();
                    setShowAllReviews(true);
                  }}
                >
                  View all
                </a>
              )}
            </span>
          </div>

          {recentReviews.length > 0 && (
            <div className="recent-review-preview">
              <p className="review-title">"{recentReviews[0].title}"</p>
              <p className="review-excerpt">{recentReviews[0].comment.substring(0, 100)}...</p>
              <small>- {recentReviews[0].user?.name || 'Anonymous'}</small>
            </div>
          )}

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
                      <h5 className="section-title text-black">Hotel Details:</h5>
                      <ul className="list-unstyled">
                        <li>
                          <span className="detail-label text-black">Address:</span>
                          <span className="text-black">{hotel.address}</span>
                        </li>
                        <li>
                          <span className="detail-label text-black">City:</span>
                          <span className="text-black">{hotel.city}</span>
                        </li>
                        <li>
                          <span className="detail-label text-black">Rating:</span>
                          <span className="text-black">{hotel.rating.toFixed(1)}/5</span>
                          <i className="fas fa-star ms-1 text-warning"></i>
                        </li>
                      </ul>
                    </div>

                    <div className="col-md-6 mb-3">
                      <h5 className="section-title text-black">Amenities:</h5>
                      <div className="amenities-list">
                        {hotel.amenities?.map((amenity, index) => (
                          <span key={index} className="amenity-badge" style={{ color: 'black' }}>
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                {hotel.reviews && hotel.reviews.length > 0 && (
                  <div className="hotel-reviews mt-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="section-title">Guest Reviews ({hotel.reviews.length})</h5>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={handleToggleReviews}
                      >
                        {showAllReviews ? 'Show Less' : 'Show All'}
                      </button>
                    </div>

                    <div className="category-ratings mb-3">
                      <div className="row">
                        {Object.keys(categoryRatings).map((category) => (
                          <div key={category} className="col-md-4 col-6 mb-2">
                            <div className="d-flex justify-content-between">
                              <span className="category-name text-capitalize">{category}:</span>
                              <span className="category-score">
                                {categoryRatings[category].toFixed(1)}
                                <i className="fas fa-star ms-1 text-warning"></i>
                              </span>
                            </div>
                            <div className="progress" style={{ height: '6px' }}>
                              <div
                                className="progress-bar bg-warning"
                                style={{ width: `${(categoryRatings[category] / 5) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Review List */}
                    <div className="review-list">
                      {(showAllReviews ? hotel.reviews : recentReviews).map((review, index) => (
                        <div key={index} className="review-item p-3 mb-3 border rounded">
                          <div className="d-flex justify-content-between">
                            <h6 className="review-title fw-bold">{review.title}</h6>
                            <div className="review-rating">
                              {review.rating.toFixed(1)}
                              <i className="fas fa-star ms-1 text-warning"></i>
                            </div>
                          </div>
                          <p className="review-text">{review.comment}</p>
                          <div className="review-footer d-flex justify-content-between">
                            <span className="reviewer-name">
                              <i className="fas fa-user me-1"></i>
                              {review.user?.name || 'Anonymous'}
                            </span>
                            <span className="review-date text-muted">
                              <i className="far fa-calendar-alt me-1"></i>
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {review.imageUrls && review.imageUrls.length > 0 && (
                            <div className="review-images mt-2">
                              <div className="row">
                                {review.imageUrls.map((img, imgIndex) => (
                                  <div key={imgIndex} className="col-3">
                                    <img
                                      src={img}
                                      alt={`Review ${index + 1} ${imgIndex + 1}`}
                                      className="img-thumbnail"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {!showAllReviews && hotel.reviews.length > 3 && (
                        <div className="text-center">
                          <button className="btn btn-link" onClick={handleToggleReviews}>
                            View all {hotel.reviews.length} reviews
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
