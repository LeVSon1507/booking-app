import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BookingCard.css';

const BookingCard = ({ booking }) => {
  const navigate = useNavigate();

  const handleReviewClick = () => {
    navigate(`/hotels/${booking.hotelId}/review`);
  };

  const handleViewReviewClick = () => {
    navigate('/my-bookings', { state: { activeTab: 'reviews' } });
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  return (
    <div className="booking-card">
      <div className="booking-header">
        <h3>{booking.hotelName}</h3>
        <span className={`booking-status ${getStatusClass(booking.status)}`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      <div className="booking-details">
        <div className="booking-info">
          <p>
            <strong>Room:</strong> {booking.roomName}
          </p>
          <p>
            <strong>Check-in:</strong> {formatDate(booking.fromDate)}
          </p>
          <p>
            <strong>Check-out:</strong> {formatDate(booking.toDate)}
          </p>
          <p>
            <strong>Total:</strong> ${booking.totalAmount}
          </p>
        </div>

        {booking.status === 'completed' && (
          <div className="booking-actions">
            {!booking.hasReviewed ? (
              <button className="btn-review" onClick={handleReviewClick}>
                <i className="fas fa-star"></i> Leave a Review
              </button>
            ) : (
              <button className="btn-view-review" onClick={handleViewReviewClick}>
                <i className="fas fa-eye"></i> View Your Review
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
