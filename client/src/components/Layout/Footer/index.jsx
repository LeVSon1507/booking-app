/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h3 className="footer-title">Booking Web</h3>
          <p>
            Leading online booking platform providing hotel, resort, and other accommodation booking
            services quickly and conveniently.
          </p>
          <div className="contact">
            <span>
              <i className="fas fa-phone"></i> &nbsp; 0123-456-789
            </span>
            <span>
              <i className="fas fa-envelope"></i> &nbsp; contact@bookingapp.com
            </span>
          </div>
          <div className="socials">
            <a href="#">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>

        <div className="footer-section links">
          <h3 className="footer-title">Quick Links</h3>
          <ul>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Services</a>
            </li>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Terms & Conditions</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>

        <div className="footer-section newsletter">
          <h3 className="footer-title">Newsletter</h3>
          <p>Subscribe to get updates and special offers</p>
          <form>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit" className="btn-subscribe">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="text-center">Booking Web &copy; 2025 by Thanh Mai. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
