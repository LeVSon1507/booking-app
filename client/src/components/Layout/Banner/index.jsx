import React from 'react';
import { ReactComponent as WelcomeIcon } from '@images/welcome-icon.svg';
import { ReactComponent as WelcomeIcon2 } from '@images/welcome-icon-2.svg';

const Banner = () => {
  return (
    <section className="banner">
      <div className="head-bottom">
        <WelcomeIcon style={{ width: '250px', height: '250px', marginRight: '10px' }} />
        <h3 className="text-white">YOUR PASSION IS OUR SATISFACTION</h3>
        <p className="text-white">
          Discover unparalleled experiences and exceptional services tailored just for you. Your
          journey begins here.
        </p>

        <a href="#home" className="head-btn px-7">
          {/* <WelcomeIcon2 style={{ width: '70px', height: '100px', marginRight: '10px' }} /> */}
          WELCOME
        </a>
      </div>
    </section>
  );
};

export default Banner;
