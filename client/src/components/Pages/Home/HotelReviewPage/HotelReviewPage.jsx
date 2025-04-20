import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './HotelReviewPage.css';

const HotelReviewPage = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await axios.get(`/api/hotels/${hotelId}`);
        setHotel(response.data.hotel);
      } catch (error) {
        toast.error('Failed to load hotel information');
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [hotelId]);

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
      await axios.post(`/api/hotels/${hotelId}/reviews`, {
        rating,
        comment,
      });

      toast.success('Your review has been submitted successfully');
      navigate('/my-bookings');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error('You can only review hotels you have stayed at');
      } else {
        toast.error('An error occurred while submitting your review');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="review-page-loading">
        <div className="spinner"></div>
        <p>Loading hotel information...</p>
      </div>
    );
  }

  return (
    <div className="review-page-container">
      <div className="review-page-header">
        <h2>Review {hotel.name}</h2>
      </div>

      <div className="hotel-info-card">
        <div className="hotel-image">
          <img src={hotel.imageUrls[0]} alt={hotel.name} />
        </div>
        <div className="hotel-details">
          <h3>{hotel.name}</h3>
          <p>
            <i className="fas fa-map-marker-alt"></i> {hotel.address}, {hotel.city}
          </p>
          <div className="current-rating">
            <span>Current rating: </span>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <i key={star} className={`fas fa-star ${hotel.rating >= star ? 'filled' : ''}`}></i>
              ))}
            </div>
            <span>({hotel.reviews ? hotel.reviews.length : 0} reviews)</span>
          </div>
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
          <button type="button" className="btn-cancel" onClick={() => navigate('/my-bookings')}>
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelReviewPage;
