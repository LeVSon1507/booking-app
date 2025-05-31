import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Loader from '../Loader';
import bookingApi from '../../services/bookingApi';

const Booking = () => {
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await bookingApi.getBookingById(id);
        setBooking(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load booking details');
        setTimeout(() => navigate('/'), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, navigate]);

  const handleCancel = async () => {
    try {
      setLoading(true);
      await bookingApi.cancelBooking(id);
      setBooking({ ...booking, status: 'cancelled' });
      toast.success('Booking cancelled successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!booking) return <div className="alert alert-info">Booking not found</div>;

  // ... rest of the component code ...
};

export default Booking; 