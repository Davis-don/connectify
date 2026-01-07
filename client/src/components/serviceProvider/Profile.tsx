import React, { useState } from 'react';
import './profile.css';
import ServiceProviderUpdateInfo from './Serviceproviderupdateinfo';
import ServiceProviderUpdatePassword from './Passwordupdatae';

const Profile: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'info' | 'security'>('info');

  return (
    <div className="svp-profile-container">
      <h1 className="svp-profile-title">Profile</h1>
      
      <div className="svp-profile-content">
        <div className="svp-profile-sidebar">
          <div className="svp-profile-avatar">
            <div className="svp-avatar-placeholder">
              <i className="fas fa-user"></i>
            </div>
            <h3>Service Provider</h3>
            <p>Premium Account</p>
          </div>
          
          <nav className="svp-profile-nav">
            <button 
              className={`svp-nav-item ${activeSection === 'info' ? 'active' : ''}`}
              onClick={() => setActiveSection('info')}
            >
              <i className="fas fa-user-circle"></i>
              Personal Info
            </button>
            <button 
              className={`svp-nav-item ${activeSection === 'security' ? 'active' : ''}`}
              onClick={() => setActiveSection('security')}
            >
              <i className="fas fa-shield-alt"></i>
              Security
            </button>
          </nav>
        </div>
        
        <div className="svp-profile-main">
          {activeSection === 'info' ? (
            <ServiceProviderUpdateInfo />
          ) : (
            <ServiceProviderUpdatePassword />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;