import React from 'react';
import { ReactComponent as WelcomeIcon } from '../../../images/welcome-icon.svg';
import { ReactComponent as WelcomeIcon2 } from '../../../images/welcome-icon-2.svg';

const Banner = () => {
  return (
    <section className="banner">
      <div className="head-bottom flex">
        <WelcomeIcon style={{ width: '250px', height: '250px', marginRight: '10px' }} />
        <h3 style={{ color: 'white' }}>YOUR PASSION IS OUR SATISFACTION</h3>
        <p style={{ color: 'white' }}>
          Discover unparalleled experiences and exceptional services tailored just for you. Your
          journey begins here.
        </p>

        <a href="#home" className="head-btn">
          <WelcomeIcon2 style={{ width: '70px', height: '100px', marginRight: '10px' }} />
          WELCOME
        </a>
      </div>
    </section>
  );
};

export default Banner;
