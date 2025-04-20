import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import userApi from 'api/userApi';
import { ReactComponent as OkIcon } from '@images/ok.svg';
import { ReactComponent as NotOkIcon } from '@images/not-ok.svg';
import './ActivationEmail.css';

function ActivationEmail() {
  const { activation_token } = useParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (activation_token) {
      const activateEmail = async () => {
        try {
          const res = await userApi.activeEmail({ activation_token });
          setStatus('success');
          setMessage(res.data.message || 'Your account has been activated successfully!');

          startRedirectCountdown();
        } catch (err) {
          setStatus('error');
          setMessage(err.response?.data?.message || 'Something went wrong! Please try again.');
        }
      };

      activateEmail();
    } else {
      setStatus('error');
      setMessage('Activation token is missing.');
    }
  }, [activation_token]);

  const startRedirectCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          window.location.href = '/login';
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  const handleRedirect = () => {
    window.location.href = '/login';
  };

  return (
    <div className="activation-container">
      <div className="activation-card">
        {status === 'loading' && (
          <div className="loading-state">
            <div className="spinner"></div>
            <h2>Verifying your account...</h2>
          </div>
        )}

        {status === 'success' && (
          <div className="success-state">
            <OkIcon className="status-icon success" />
            <h2>Verification Successful!</h2>
            <p className="message">{message}</p>
            <div className="redirect-info">
              <p>
                Redirecting to login in <span className="countdown">{countdown}</span> seconds
              </p>
              <button className="redirect-button" onClick={handleRedirect}>
                Login Now
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="error-state">
            <NotOkIcon className="status-icon error" />
            <h2>Verification Failed</h2>
            <p className="message">{message}</p>
            <div className="action-buttons">
              <button className="retry-button" onClick={() => window.location.reload()}>
                Try Again
              </button>
              <button className="home-button" onClick={() => (window.location.href = '/')}>
                Go to Homepage
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivationEmail;
