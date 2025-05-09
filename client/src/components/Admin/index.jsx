import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';
import { toast } from 'react-toastify';

const Admin = () => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    toast.error('Access denied. Admins only.');
    navigate('/');
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">Admin Dashboard</h1>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card admin-card">
            <div className="card-body">
              <h5 className="card-title">Hotels Management</h5>
              <p className="card-text">
                Manage hotels, add new hotels, update and delete existing ones.
              </p>
              <div className="d-flex flex-column">
                <Link to="/admin/hotels" className="btn btn-primary mb-2">
                  View All Hotels
                </Link>
                <Link to="/admin/add-hotel" className="btn btn-success">
                  Add New Hotel
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card admin-card">
            <div className="card-body">
              <h5 className="card-title">Rooms Management</h5>
              <p className="card-text">
                Manage rooms, add new rooms, update and delete existing ones.
              </p>
              <div className="d-flex flex-column">
                <Link to="/admin/rooms" className="btn btn-primary mb-2">
                  View All Rooms
                </Link>
                <Link to="/admin/hotels" className="btn btn-success">
                  Add Room (Select Hotel First)
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card admin-card">
            <div className="card-body">
              <h5 className="card-title">Bookings Management</h5>
              <p className="card-text">View all bookings, manage booking status and details.</p>
              <Link to="/admin/bookings" className="btn btn-primary">
                View All Bookings
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card admin-card">
            <div className="card-body">
              <h5 className="card-title">User Management</h5>
              <p className="card-text">Manage users, view user details and activity.</p>
              <Link to="/admin/users" className="btn btn-primary">
                View All Users
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
