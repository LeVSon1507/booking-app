import userApi from 'api/userApi';
import React from 'react';
import { Navbar } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ReactComponent as ApartmentIcon } from '../../../images/welcome-icon.svg';
import { ReactComponent as LoginIcon } from '../../../images/login-navbar.svg';

function Header() {
  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;

  window.onscroll = function () {
    const header = document.querySelector('header');
    if (document.body.scrollTop >= 400 || document.documentElement.scrollTop >= 400) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
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

  const handleLogout = async () => {
    try {
      await userApi.logout();
      localStorage.removeItem('userCurrent');
      window.location.href = '/';
    } catch (err) {
      window.location.href = '/';
    }
  };

  const userLink = () => {
    return (
      <li className="drop-nav">
        <Link to="#" className="avatar">
          <img src={user.avatar} alt="" />
          <span>
            {user.name}&nbsp;
            <i className="fas fa-angle-down"></i>
          </span>
        </Link>
        <ul className="dropdown">
          {user && user.role !== 1 ? (
            <li>
              <Link to="/mybooking">Booking</Link>
            </li>
          ) : (
            <li>
              <Link to="/admin">Admin</Link>
            </li>
          )}
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
              <h5 className="title">Booking App</h5>
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
