import React, { useEffect, useState } from 'react';
import { hotelApi } from 'api/hotelApi';
import { roomApi } from 'api/roomApi';
import { useNavigate, useParams } from 'react-router-dom';
import { showErrMsg, showSuccessMsg } from 'components/utils/Notification';
import Loader from 'components/utils/Loader';
import { Carousel } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './HotelDetail.css';

const HotelDetail = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    description: '',
    amenities: [],
    contactInfo: {
      phone: '',
      email: '',
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const hotelResponse = await hotelApi.getHotelById(id);
        setHotel(hotelResponse.data.hotel);
        setFormData({
          name: hotelResponse.data.hotel.name,
          address: hotelResponse.data.hotel.address,
          city: hotelResponse.data.hotel.city,
          description: hotelResponse.data.hotel.description,
          amenities: hotelResponse.data.hotel.amenities || [],
          contactInfo: hotelResponse.data.hotel.contactInfo || {
            phone: '',
            email: '',
          },
        });

        const roomsResponse = await roomApi.getRoomsByHotelId(id);
        setRooms(roomsResponse.data);
      } catch (error) {
        console.error('Error loading hotel:', error);
        if (error.response && error.response.status === 404) {
          setAlert(`Hotel with ID ${id} not found. It may have been deleted.`);
          setTimeout(() => navigate('/admin/hotels'), 3000);
        } else {
          setAlert(
            `Failed to load hotel details: ${error.response?.data?.message || error.message}`
          );
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAmenitiesChange = (e) => {
    const value = e.target.value;
    const amenitiesArray = value.split(',').map((item) => item.trim());
    setFormData({
      ...formData,
      amenities: amenitiesArray,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await hotelApi.updateHotel(id, formData);
      setSuccess('Hotel updated successfully');
      setIsEditing(false);

      const hotelResponse = await hotelApi.getHotelById(id);
      setHotel(hotelResponse.data.hotel);
    } catch (error) {
      setAlert(error.response?.data?.message || 'Failed to update hotel');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = () => {
    navigate(`/admin/add-room/${id}`);
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      if (window.confirm('Are you sure you want to delete this room?')) {
        setLoading(true);
        await roomApi.deleteRoom(roomId);
        setSuccess('Room deleted successfully');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        navigate(`/admin/hotel/${id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete room');
      setAlert(error.response?.data?.message || 'Failed to delete room');
    } finally {
      setLoading(false);
    }
  };

  const handleViewRoom = (roomId) => {
    navigate(`/admin/room/${roomId}`);
  };

  if (loading) return <Loader />;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h2>Hotel Details</h2>
            <div>
              <button
                className="btn btn-primary"
                style={{ marginRight: '10px' }}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel Edit' : 'Edit Hotel'}
              </button>
              <button
                className="btn btn-success"
                style={{ marginRight: '10px' }}
                onClick={handleAddRoom}
              >
                Add Room
              </button>
            </div>
          </div>
        </div>
      </div>

      {alert && showErrMsg(alert)}
      {success && showSuccessMsg(success)}

      {hotel && (
        <div className="row">
          <div className="col-md-6">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Hotel Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="5"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Amenities (comma separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.amenities.join(', ')}
                    onChange={handleAmenitiesChange}
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="contactInfo.phone"
                    className="form-control"
                    value={formData.contactInfo.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="contactInfo.email"
                    className="form-control"
                    value={formData.contactInfo.email}
                    onChange={handleInputChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Update Hotel
                </button>
              </form>
            ) : (
              <div className="hotel-info">
                <h3>{hotel.name}</h3>

                <div className="hotel-details-grid">
                  <div className="detail-item">
                    <strong>Address</strong>
                    <span>
                      {hotel.address}, {hotel.city}
                    </span>
                  </div>

                  <div className="detail-item">
                    <strong>Rating</strong>
                    <div className="rating-display">
                      <span className="rating-value">{hotel.rating.toFixed(1)}/5</span>
                      <span className="reviews-count">({hotel.reviews?.length || 0} reviews)</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <strong>Description</strong>
                    <p className="description-text">{hotel.description}</p>
                  </div>

                  <div className="detail-item">
                    <strong>Amenities</strong>
                    <div className="amenities-container">
                      {hotel.amenities?.map((amenity, index) => (
                        <span key={index} className="amenity-badge">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="detail-item">
                    <strong>Contact</strong>
                    <div className="contact-info">
                      <div className="contact-item">
                        <i className="fas fa-phone contact-icon"></i>
                        {hotel.contactInfo?.phone || 'N/A'}
                      </div>
                      <div className="contact-item">
                        <i className="fas fa-envelope contact-icon"></i>
                        {hotel.contactInfo?.email || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="col-md-6">
            <div className="hotel-images mb-4">
              <h4>Hotel Images</h4>
              {hotel.imageUrls && hotel.imageUrls.length > 0 ? (
                <Carousel>
                  {hotel.imageUrls.map((img, index) => {
                    if (Array.isArray(img?.imageUrls) && img.imageUrls) {
                      return (
                        <Carousel.Item key={index}>
                          {img?.imageUrls?.map((image, imgIndex) => (
                            <img
                              key={imgIndex}
                              className="d-block w-100"
                              src={image}
                              alt={`${hotel.name} - ${index + 1}`}
                              style={{ height: '300px', objectFit: 'cover' }}
                            />
                          ))}
                        </Carousel.Item>
                      );
                    }
                    return (
                      <Carousel.Item key={index}>
                        <img
                          className="d-block w-100"
                          src={img}
                          alt={`${hotel.name} - ${index + 1}`}
                          style={{ height: '300px', objectFit: 'cover' }}
                        />
                      </Carousel.Item>
                    );
                  })}
                </Carousel>
              ) : (
                <p>No images available</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="row mt-5">
        <div className="col-12">
          <h3>Hotel Rooms ({rooms.length})</h3>
          {rooms.length === 0 ? (
            <div className="alert alert-info">
              This hotel has no rooms yet. Click "Add Room" to add rooms.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room._id}>
                      <td>{room.name}</td>
                      <td>{room.type}</td>
                      <td>${room.price}</td>
                      <td>{room.capacity || 2}</td>
                      <td>
                        <span
                          className={`badge ${room.isAvailable ? 'badge-success' : 'badge-danger'}`}
                        >
                          {room.isAvailable ? 'Available' : 'Not Available'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-info btn-sm mx-2"
                          onClick={() => handleViewRoom(room._id)}
                        >
                          View/Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteRoom(room._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h3>Reviews ({hotel?.reviews?.length || 0})</h3>
        {hotel?.reviews?.length === 0 ? (
          <div className="alert alert-info">No reviews yet.</div>
        ) : (
          <div className="reviews-container">
            {hotel?.reviews?.map((review, index) => (
              <div key={index} className="review-card">
                <div className="review-header">
                  <span className="reviewer-name">{review.user?.name || 'Anonymous'}</span>
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`star ${i < review.rating ? 'active' : ''}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="review-content">{review.comment}</p>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelDetail;
