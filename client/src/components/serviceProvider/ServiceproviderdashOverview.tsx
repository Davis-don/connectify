import React from 'react';
import './dashoverview.css'

const Overview: React.FC = () => {
  return (
    <div className="svp-overview-container">
      <h1 className="svp-overview-title">Overview</h1>
      <div className="svp-overview-content">
        <div className="svp-overview-stats">
          <div className="svp-stat-card">
            <div className="svp-stat-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="svp-stat-info">
              <h3>Total Revenue</h3>
              <p>$12,850</p>
              <span className="svp-stat-trend positive">+18%</span>
            </div>
          </div>
          
          <div className="svp-stat-card">
            <div className="svp-stat-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="svp-stat-info">
              <h3>Active Bookings</h3>
              <p>24</p>
              <span className="svp-stat-trend positive">+8</span>
            </div>
          </div>
          
          <div className="svp-stat-card">
            <div className="svp-stat-icon">
              <i className="fas fa-star"></i>
            </div>
            <div className="svp-stat-info">
              <h3>Rating</h3>
              <p>4.9/5</p>
              <span className="svp-stat-trend positive">+0.3</span>
            </div>
          </div>
          
          <div className="svp-stat-card">
            <div className="svp-stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="svp-stat-info">
              <h3>Pending Requests</h3>
              <p>14</p>
              <span className="svp-stat-trend negative">-3</span>
            </div>
          </div>
        </div>
        
        <div className="svp-overview-chart">
          <h2>Performance Analytics</h2>
          <div className="svp-chart-placeholder">
            <p>Performance chart will be displayed here</p>
          </div>
        </div>
        
        <div className="svp-overview-recent">
          <h2>Recent Activities</h2>
          <div className="svp-activities-list">
            <div className="svp-activity-item">
              <div className="svp-activity-icon success">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="svp-activity-content">
                <p>New booking confirmed from John Doe</p>
                <span className="svp-activity-time">10 minutes ago</span>
              </div>
            </div>
            <div className="svp-activity-item">
              <div className="svp-activity-icon payment">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="svp-activity-content">
                <p>Payment received for plumbing service</p>
                <span className="svp-activity-time">2 hours ago</span>
              </div>
            </div>
            <div className="svp-activity-item">
              <div className="svp-activity-icon review">
                <i className="fas fa-star"></i>
              </div>
              <div className="svp-activity-content">
                <p>New 5-star review from Sarah Johnson</p>
                <span className="svp-activity-time">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;