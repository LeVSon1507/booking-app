import { roomApi } from 'api/roomApi';
import Loader from 'components/utils/Loader';
import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

const GetAllRoom = () => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await roomApi.getAllRooms();
        console.log(response.data);
        setRooms(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="container">
          <table className="customers">
            <thead>
              <tr>
                <th>ID</th>
                <th>Room Name</th>
                <th>Price</th>
                <th>Bookings</th>
                <th>Room Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rooms?.map((room) => (
                <tr key={room._id}>
                  <td>{room._id}</td>
                  <td>{room.name}</td>
                  <td>{formatter.format(room.price)}</td>
                  <td>{room.currentBookings.length}</td>
                  <td>{room.type}</td>
                  <td className="text-center">
                    <Link to={`admin/room-detail/${room._id}`}>
                      <i className="fas fa-eye"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Fragment>
  );
};

export default GetAllRoom;
