import React, { useState } from 'react';
import { hotelApi } from 'api/hotelApi';
import { uploadApi } from 'api/uploadApi';
import { showErrMsg, showSuccessMsg } from 'components/utils/Notification';
import Loader from 'components/utils/Loader';
import { useNavigate } from 'react-router-dom';

const AddHotel = () => {
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
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrls((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedImageUrls = [];
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((image) => {
          formData.append('file', image);
        });

        const uploadResponse = await uploadApi.uploadImages(formData);
        uploadedImageUrls = uploadResponse.data;
      }

      const hotelData = {
        ...formData,
        imageUrls: uploadedImageUrls,
      };

      const response = await hotelApi.createHotel(hotelData);
      setSuccess('Hotel created successfully');

      setTimeout(() => {
        navigate(`/admin/hotel/${response.data.hotel._id}`);
      }, 2000);
    } catch (error) {
      setAlert(error.response?.data?.message || 'Failed to create hotel');
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12 mb-4">
          <h2>Add New Hotel</h2>
        </div>
      </div>

      {alert && showErrMsg(alert)}
      {success && showSuccessMsg(success)}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
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
                placeholder="WiFi, Pool, Gym, Restaurant"
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
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label>Hotel Images</label>
              <input
                type="file"
                className="form-control-file"
                onChange={handleImageChange}
                multiple
                accept="image/*"
              />
              <small className="form-text text-muted">
                You can select multiple images. Recommended size: 1200x800 pixels.
              </small>
            </div>

            <div className="image-previews mt-3">
              <div className="row">
                {imageUrls.map((url, index) => (
                  <div key={index} className="col-md-4 mb-3">
                    <div className="image-preview-container">
                      <img src={url} alt={`Preview ${index + 1}`} className="img-thumbnail" />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger remove-image"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Create Hotel
            </button>
            <button
              type="button"
              className="btn btn-secondary ml-2"
              onClick={() => navigate('/admin/hotels')}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddHotel;
