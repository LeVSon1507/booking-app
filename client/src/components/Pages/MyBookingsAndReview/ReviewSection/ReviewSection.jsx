import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ReviewSection.css';
import { ReactComponent as IconReview } from '@images/review-icon.svg';
import { reviewApi } from 'api/reviewApi';
import { useSelector } from 'react-redux';
import { isEmpty } from 'components/utils/Validation';
import moment from 'moment';
import { useEffect, useState } from 'react';

const ReviewSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await reviewApi.getUserReviews({
          headers: { Authorization: token, userid: user._id },
        });
        setReviews(response.data);
      } catch (error) {
        toast.error('Failed to load your reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, [token, user._id]);

  const handleEditReview = (reviewId, hotelId) => {
    navigate(`/hotels/${hotelId}/edit-review/${reviewId}`);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await reviewApi.deleteReview(reviewId);
      toast.success('Review deleted successfully');
      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="user-reviews-loading">
        <div className="spinner"></div>
        <p>Loading your reviews...</p>
      </div>
    );
  }

  return (
    <div className="user-reviews-section">
      <div className="user-reviews-header">
        <IconReview width={'4rem'} height={'4rem'} />
        <h2 className="user-reviews-title">My Reviews</h2>
      </div>

      {isEmpty(reviews) ? (
        <div className="user-no-reviews">
          <i className="fas fa-comment-slash user-empty-icon"></i>
          <h3>You haven't written any reviews yet</h3>
          <p>After completing your stay, you can review hotels from the "My Bookings" page.</p>
        </div>
      ) : (
        <div className="container">
          <div className="row">
            {reviews.map((review = {}) => (
              <div className="col-md-6 col-lg-4 mb-4" key={review._id}>
                <div className="user-review-card">
                  {/* Hotel Info Section */}
                  <div className="user-review-hotel-info">
                    <div className="user-hotel-images">
                      {review.hotel.imageUrls && review.hotel.imageUrls.length > 0 && (
                        <img
                          src={review.hotel.imageUrls[0]}
                          alt={review.hotel.name}
                          className="user-hotel-image"
                        />
                      )}
                    </div>
                    <div className="user-hotel-details">
                      <h4 className="user-hotel-name">{review.hotel.name}</h4>
                      <p className="user-hotel-address">
                        <i className="fas fa-map-marker-alt"></i> {review.hotel.address},{' '}
                        {review.hotel.city}
                      </p>
                    </div>
                  </div>

                  {/* Review Content Section */}
                  <div className="user-review-content">
                    <div className="user-review-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`fas fa-star ${review.rating >= star ? 'filled' : ''}`}
                        ></i>
                      ))}
                      <span className="user-rating-value">({review.rating})</span>
                    </div>

                    <div className="user-review-text">
                      <h5 className="user-review-title">{review.title}</h5>
                      <p className="user-review-comment">{review.comment}</p>
                    </div>

                    <div className="user-review-images">
                      {review.imageUrls && review.imageUrls.length > 0 && (
                        <>
                          {review?.imageUrls.map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`Review ${index + 1}`}
                              className="user-review-image"
                            />
                          ))}
                        </>
                      )}
                    </div>

                    {/* Stay Details */}
                    <div className="user-stay-details">
                      <p className="user-room-info">
                        <i className="fas fa-bed"></i> {review.room.name}
                      </p>
                      <p className="user-stay-dates">
                        <i className="fas fa-calendar"></i> Stayed:{' '}
                        {moment(review.booking.startDate).format('MMM DD')} -{' '}
                        {moment(review.booking.endDate).format('MMM DD, YYYY')}
                      </p>
                    </div>

                    {/* Review Meta */}
                    <div className="user-review-meta">
                      <span className="user-review-date">
                        <i className="far fa-clock"></i> Posted{' '}
                        {moment(review.createdAt).format('MMM DD, YYYY')}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="user-review-actions">
                      <button
                        className="user-btn-edit"
                        onClick={() => handleEditReview(review._id, review.hotel._id)}
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button
                        className="user-btn-delete"
                        onClick={() => handleDeleteReview(review._id)}
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
