import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ReviewSection.css';
import { ReactComponent as IconReview } from '@images/review-icon.svg';
import { reviewApi } from 'api/reviewApi';
import { useSelector } from 'react-redux';
import { isEmpty } from 'components/utils/Validation';

const ReviewSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await reviewApi.getUserReviews({
          headers: { Authorization: token, userId: user._id },
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
      await axios.delete(`/api/reviews/${reviewId}`);
      toast.success('Review deleted successfully');
      setReviews(reviews.filter((review) => review.reviewId !== reviewId));
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="reviews-loading">
        <div className="spinner"></div>
        <p>Loading your reviews...</p>
      </div>
    );
  }

  return (
    <div className="reviews-section">
      <div className="d-flex flex-column align-items-center">
        <IconReview width={'4rem'} height={'4rem'} />
        <h2>My Reviews</h2>
      </div>
      {reviews.length === 0 ? (
        <div className="no-reviews">
          <p>You haven't written any reviews yet.</p>
          <p>After completing your stay, you can review hotels from the "My Bookings" page.</p>
        </div>
      ) : (
        <div className="reviews-list">
          {!isEmpty(reviews) &&
            reviews?.map((review) => (
              <div key={review.reviewId} className="review-card">
                <div className="review-header">
                  <h4>{review.hotelName}</h4>
                  <div className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="review-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`fas fa-star ${review.rating >= star ? 'filled' : ''}`}
                    ></i>
                  ))}
                </div>

                <div className="review-comment">{review.comment}</div>

                <div className="review-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEditReview(review.reviewId, review.hotelId)}
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteReview(review.reviewId)}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
