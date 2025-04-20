import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './MyBookings.css';
import ReviewSection from 'components/Pages/MyBookingsAndReview/ReviewSection/ReviewSection';
import MyBookingsList from 'components/Pages/MyBookingsAndReview/MyBookingsList';

const MyBookings = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    // Check if we should activate the reviews tab
    if (location.state && location.state.activeTab === 'reviews') {
      setActiveTab('reviews');
    }
  }, [location]);

  return (
    <div className="my-bookings-container">
      <h2>My Bookings & Reviews</h2>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          My Bookings
        </button>
        <button
          className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          My Reviews
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'bookings' ? <MyBookingsList /> : <ReviewSection />}
      </div>
    </div>
  );
};

export default MyBookings;
