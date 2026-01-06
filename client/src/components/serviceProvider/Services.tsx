import React from 'react';
import './services.css'

const Services: React.FC = () => {
  const services = [
    {
      id: 1,
      title: 'Plumbing Services',
      category: 'Home Repair',
      status: 'Active',
      price: '$75/hour',
      rating: 4.8,
      bookings: 24
    },
    {
      id: 2,
      title: 'Electrical Work',
      category: 'Electrical',
      status: 'Active',
      price: '$90/hour',
      rating: 4.9,
      bookings: 18
    },
    {
      id: 3,
      title: 'Cleaning Service',
      category: 'Cleaning',
      status: 'Active',
      price: '$60/hour',
      rating: 4.7,
      bookings: 32
    },
    {
      id: 4,
      title: 'Painting Service',
      category: 'Home Improvement',
      status: 'Inactive',
      price: '$85/hour',
      rating: 4.6,
      bookings: 12
    }
  ];

  return (
    <div className="svp-services-container">
      <h1 className="svp-services-title">Services</h1>
      
      <div className="svp-services-header">
        <div className="svp-services-summary">
          <div className="svp-summary-card">
            <h3>Total Services</h3>
            <p>24</p>
          </div>
          <div className="svp-summary-card">
            <h3>Active Services</h3>
            <p>18</p>
          </div>
          <div className="svp-summary-card">
            <h3>Monthly Revenue</h3>
            <p>$4,850</p>
          </div>
        </div>
        
        <button className="svp-add-service-btn">
          <i className="fas fa-plus"></i>
          Add New Service
        </button>
      </div>

      <div className="svp-services-grid">
        {services.map((service) => (
          <div key={service.id} className="svp-service-card">
            <div className="svp-service-header">
              <div className="svp-service-category">
                {service.category}
              </div>
              <span className={`svp-service-status ${service.status.toLowerCase()}`}>
                {service.status}
              </span>
            </div>
            
            <h3 className="svp-service-title">{service.title}</h3>
            
            <div className="svp-service-meta">
              <div className="svp-service-info">
                <span className="svp-meta-label">Price:</span>
                <span className="svp-meta-value">{service.price}</span>
              </div>
              <div className="svp-service-info">
                <span className="svp-meta-label">Rating:</span>
                <span className="svp-meta-value">
                  <i className="fas fa-star"></i> {service.rating}
                </span>
              </div>
              <div className="svp-service-info">
                <span className="svp-meta-label">Bookings:</span>
                <span className="svp-meta-value">{service.bookings}</span>
              </div>
            </div>
            
            <div className="svp-service-actions">
              <button className="svp-action-btn edit">
                <i className="fas fa-edit"></i>
                Edit
              </button>
              <button className="svp-action-btn view">
                <i className="fas fa-eye"></i>
                View
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="svp-services-empty">
        <p>Add more services to grow your business!</p>
      </div>
    </div>
  );
};

export default Services;