import React from 'react';
import './profile.css';

const Profile: React.FC = () => {
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
            <button className="svp-nav-item active">
              <i className="fas fa-user-circle"></i>
              Personal Info
            </button>
            <button className="svp-nav-item">
              <i className="fas fa-shield-alt"></i>
              Security
            </button>
            <button className="svp-nav-item">
              <i className="fas fa-bell"></i>
              Notifications
            </button>
            <button className="svp-nav-item">
              <i className="fas fa-cog"></i>
              Preferences
            </button>
          </nav>
        </div>
        
        <div className="svp-profile-main">
          <div className="svp-profile-section">
            <h2>Personal Information</h2>
            <div className="svp-profile-form">
              <div className="svp-form-group">
                <label>First Name</label>
                <input type="text" placeholder="John" />
              </div>
              
              <div className="svp-form-group">
                <label>Last Name</label>
                <input type="text" placeholder="Doe" />
              </div>
              
              <div className="svp-form-group">
                <label>Email Address</label>
                <input type="email" placeholder="john.doe@example.com" />
              </div>
              
              <div className="svp-form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="+1 (555) 123-4567" />
              </div>
              
              <div className="svp-form-group">
                <label>Company Name</label>
                <input type="text" placeholder="Doe Services Inc." />
              </div>
              
              <div className="svp-form-group">
                <label>Bio</label>
                <textarea placeholder="Tell clients about yourself and your services..."></textarea>
              </div>
              
              <div className="svp-form-actions">
                <button className="svp-btn-primary">
                  Save Changes
                </button>
                <button className="svp-btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
          
          <div className="svp-profile-section">
            <h2>Service Preferences</h2>
            <div className="svp-preferences-grid">
              <div className="svp-preference-card">
                <h3>Availability</h3>
                <p>Set your working hours</p>
                <button className="svp-preference-btn">
                  Configure
                </button>
              </div>
              
              <div className="svp-preference-card">
                <h3>Service Radius</h3>
                <p>Set service area distance</p>
                <button className="svp-preference-btn">
                  Set Radius
                </button>
              </div>
              
              <div className="svp-preference-card">
                <h3>Payment Methods</h3>
                <p>Manage accepted payments</p>
                <button className="svp-preference-btn">
                  Manage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;