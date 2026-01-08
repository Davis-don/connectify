import React from 'react';
import './adminoverview.css';
import AdminWelcomeOverview from './Adminwelcomeoverview';

const AdminOverview: React.FC = () => {
  return (
    <div className="admo-overview-container">
      <AdminWelcomeOverview />
    </div>
  );
};

export default AdminOverview;