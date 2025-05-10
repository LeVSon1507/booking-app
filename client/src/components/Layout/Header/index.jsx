import userApi from 'api/userApi';
import React, { useEffect } from 'react';
import { Navbar } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ReactComponent as ApartmentIcon } from '@images/welcome-icon.svg';
import { ReactComponent as LoginIcon } from '@images/login-navbar.svg';

function Header() {
  const auth = useSelector((state) => state.auth);
  const { user: userStore, isLogged: isLoggedStore } = auth;
  const isLogged = isLoggedStore ?? localStorage.getItem('isUserLogged') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const user = userStore ?? JSON.parse(localStorage.getItem('currentUser')) ?? {};
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) ?? {};

  useEffect(() => {
    if (localStorage.getItem('isUserLogged') !== 'true' || !localStorage.getItem('token')) {
      localStorage.removeItem('isUserLogged');
      localStorage.removeItem('token');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (header) {
        if (document.body.scrollTop >= 400 || document.documentElement.scrollTop >= 400) {
          header.classList.add('sticky');
        } else {
          header.classList.remove('sticky');
        }
      }

      const bookingFixed = document.querySelector('#booking-fixed');
      if (bookingFixed) {
        if (document.body.scrollTop >= 600 || document.documentElement.scrollTop >= 600) {
          bookingFixed.classList.add('fixed');
        } else {
          bookingFixed.classList.remove('fixed');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await userApi.logout();
      localStorage.removeItem('isUserLogged');
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (err) {
      window.location.href = '/';
    }
  };

  const userLink = () => {
    return (
      <li className="drop-nav">
        <Link to="#" className="avatar">
          <img src={user.avatar ?? currentUser.avatar} alt="" />
          <span className="">
            {user.name ?? currentUser.name}&nbsp;
            <i className="fas fa-angle-down"></i>
          </span>
        </Link>
        <ul className="dropdown">
          {isAdmin && (
            <li>
              <Link to="/admin">Admin Dashboard</Link>
            </li>
          )}
          <li>
            <Link to="/my-booking">My Booking</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </li>
    );
  };

  return (
    <header>
      <Navbar expand="lg">
        <div className="container">
          <Navbar.Brand href="/">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ApartmentIcon className="header-icon" />
              <h5 className="title">Booking Web</h5>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
            <ul className="d-flex">
              {isLogged ? (
                userLink()
              ) : (
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <LoginIcon className="login-icon" />
                  <Link to="/login" className="login-link">
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </header>
  );
}

export default Header;
