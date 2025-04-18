import userApi from 'api/userApi';
import React from 'react';
import { Navbar } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Header() {
  const auth = useSelector((state) => state.auth);

  const { user, isLogged } = auth;

  window.onscroll = function () {
    if (document.body.scrollTop >= 400 || document.documentElement.scrollTop >= 400) {
      document.querySelector('header').classList.add('sticky');
    } else {
      document.querySelector('header').classList.remove('sticky');
    }
    if (document.querySelector('#booking-fixed')) {
      if (document.body.scrollTop >= 600 || document.documentElement.scrollTop >= 600) {
        document.querySelector('#booking-fixed').classList.add('fixed');
      } else if (document.body.scrollTop < 600 || document.documentElement.scrollTop < 600) {
        document.querySelector('#booking-fixed').classList.remove('fixed');
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
      <li className="drop-nav ">
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
            <Link to="/profile">Cá nhân</Link>
          </li>
          <li>
            <Link to="/" onClick={handleLogout}>
              Đăng xuất
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
            <h2 className="title-app">Booking App</h2>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll" className="">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
            <ul className="d-flex">
              {isLogged ? (
                userLink()
              ) : (
                <li>
                  <Link to="/login">
                    <i className="fas fa-user"></i> Đăng nhập
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
