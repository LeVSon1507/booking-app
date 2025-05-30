import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditReviewPage = () => {
  const { hotelId, reviewId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState({});
  const [review, setReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hotelResponse = await axios.get(`/api/hotels/${hotelId}`);
        setHotel(hotelResponse.data.hotel);

        const reviewsResponse = await axios.get('/api/user/reviews');
        const userReview = reviewsResponse.data.find((r) => r.reviewId === reviewId);

        if (userReview) {
          setReview(userReview);
          setRating(userReview.rating);
          setComment(userReview.comment);
        } else {
          toast.error('Review not found');
          navigate('/my-booking');
        }
      } catch (error) {
        toast.error('An error occurred while loading data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hotelId, reviewId, navigate]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (comment.trim() === '') {
      toast.error('Please enter a review comment');
      return;
    }

    setSubmitting(true);

    try {
      await axios.put(`/api/reviews/${reviewId}`, {
        rating,
        comment,
      });

      toast.success('Review updated successfully');
      navigate('/my-booking');
    } catch (error) {
      toast.error('An error occurred while updating your review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-review-loading">
        <div className="spinner"></div>
        <p>Loading information...</p>
      </div>
    );
  }

  return (
    <div className="edit-review-container">
      <div className="edit-review-header">
        <h2>Edit Review</h2>
      </div>

      <div className="hotel-info-card">
        <div className="hotel-image">
          <img src={hotel?.imageUrls?.[0]} alt={hotel.name} />
        </div>
        <div className="hotel-details">
          <h3>{hotel.name}</h3>
          <p>
            <i className="fas fa-map-marker-alt"></i> {hotel.address}, {hotel.city}
          </p>
        </div>
      </div>

      <form className="review-form" onSubmit={handleSubmit}>
        <div className="rating-section">
          <label>Your rating:</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`fas fa-star ${rating >= star ? 'active' : ''}`}
                onClick={() => handleRatingChange(star)}
              ></i>
            ))}
          </div>
        </div>

        <div className="comment-section">
          <label htmlFor="review-comment">Your review:</label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience at this hotel..."
            rows={5}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/my-booking')}>
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditReviewPage;
