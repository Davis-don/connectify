import React from 'react';
import './dashoverview.css';
import WelcomeDashoverview from './Welcomedashoverview';

const Overview: React.FC = () => {
  return (
    <div className="svp-overview-container">
      <WelcomeDashoverview />
    </div>
  );
};

export default Overview;