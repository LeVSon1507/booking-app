import React, { useEffect, useState } from 'react';
import { hotelApi } from 'api/hotelApi';
import { useNavigate } from 'react-router-dom';
import { showErrMsg, showSuccessMsg } from 'components/utils/Notification';
import Loader from 'components/utils/Loader';
import { toast } from 'react-toastify';

const GetAllHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await hotelApi.getAllHotels('');
        setHotels(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    })();
  }, []);

  const handleView = (id) => {
    navigate(`/admin/hotel/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this hotel?')) {
        setLoading(true);
        await hotelApi.deleteHotel(id);
        toast.success('Hotel deleted successfully');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      setAlert(error.response.data.message);
      setTimeout(() => {
        setAlert('');
      }, 1500);
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="container">
          <h1 className="text-center">All Hotels</h1>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>City</th>
                  <th>Rating</th>
                  <th>Rooms</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((hotel) => (
                  <tr key={hotel._id}>
                    <td>{hotel._id}</td>
                    <td>{hotel.name}</td>
                    <td>{hotel.city}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">{hotel.rating.toFixed(1)}</span>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fas fa-star ${
                                i < Math.floor(hotel.rating) ? 'text-warning' : 'text-muted'
                              }`}
                            ></i>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td>{hotel.roomCount || 0}</td>
                    <td>
                      <button
                        className="btn btn-info btn-sm mr-2"
                        onClick={() => handleView(hotel._id)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(hotel._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {alert && showErrMsg(alert)}
          {success && showSuccessMsg(success)}
        </div>
      )}
    </>
  );
};

export default GetAllHotels;
