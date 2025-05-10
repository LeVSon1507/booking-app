import React, { useEffect, useState } from 'react';
import { roomApi } from 'api/roomApi';
import { hotelApi } from 'api/hotelApi';
import { useNavigate } from 'react-router-dom';
import { showErrMsg, showSuccessMsg } from 'components/utils/Notification';
import Loader from 'components/utils/Loader';
import { toast } from 'react-toastify';

const GetAllRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState({});
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomsAndHotels = async () => {
      try {
        const roomsResponse = await roomApi.getAllRooms();
        setRooms(roomsResponse.data);

        const hotelIds = [...new Set(roomsResponse.data.map((room) => room.hotelId))];
        const hotelDetailsObj = {};

        await Promise.all(
          hotelIds.map(async (hotelId) => {
            try {
              const hotelRes = await hotelApi.getHotelById(hotelId);
              hotelDetailsObj[hotelId] = hotelRes.data.hotel;
            } catch (error) {
              console.error(`Error fetching hotel ${hotelId}:`, error);
            }
          })
        );

        setHotels(hotelDetailsObj);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchRoomsAndHotels();
  }, []);

  const handleView = (id) => {
    navigate(`/admin/room/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this room?')) {
        setLoading(true);
        await roomApi.deleteRoom(id);
        toast.success('Room deleted successfully');
        // Simple reload after a short delay to show success message
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      // Clear alert after a short delay
      setTimeout(() => {
        setAlert('');
      }, 3000);
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="container">
          <h1 className="text-center">All Rooms</h1>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Hotel</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room._id}>
                    <td>{room._id}</td>
                    <td>{room.name}</td>
                    <td>
                      {hotels[room.hotelId] ? (
                        <>
                          {hotels[room.hotelId].name}
                          <br />
                          <small className="text-muted">{hotels[room.hotelId].city}</small>
                        </>
                      ) : (
                        'Unknown Hotel'
                      )}
                    </td>
                    <td>{room.type}</td>
                    <td>${room.price}</td>
                    <td>
                      <button
                        className="btn btn-info btn-sm mr-2"
                        onClick={() => handleView(room._id)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(room._id)}
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

export default GetAllRoom;
