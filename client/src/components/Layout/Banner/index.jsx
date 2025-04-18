import React from 'react';
import { ReactComponent as WelcomeIcon } from '../../../images/Apartment.svg';
import { ReactComponent as Icon1 } from '../../../images/Travel Plans Illustration.svg';

const Banner = () => {
  return (
    <section className="banner">
      <div className="head-bottom flex">
        <WelcomeIcon style={{ width: '250px', height: '250px', marginRight: '10px' }} />
        <h4 style={{ color: 'white' }}>YOUR PASSION IS OUR SATISFACTION</h4>
        <p style={{ color: 'white' }}>
          Discover unparalleled experiences and exceptional services tailored just for you. Your
          journey begins here.
        </p>

        <a href="#home" className="head-btn">
          <Icon1 style={{ width: '70px', height: '100px', marginRight: '10px' }} />
          WELCOME
        </a>
      </div>
    </section>
  );
};

export default Banner;
