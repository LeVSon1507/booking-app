import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';
import { ReactComponent as NotFoundIcon } from '@images/404.svg';

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <NotFoundIcon className="not-found-icon" />
        <h1 style={{ color: '#e2ba76' }}>404 | Page Not Found</h1>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <div className="not-found-actions">
          <Link to="/" className="home-button">
            Return to Homepage
          </Link>
          <button className="back-button" onClick={() => window.history.back()}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
