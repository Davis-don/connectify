import React, { useState } from 'react';
import './adminservicecategories.css'

// Import sub-components (we'll create these next)
import AddServiceCategory from './Addservicecategory';
import ViewCategories from './Viewcategories';

// Define component types for TypeScript
type ActiveComponent = 'add' | 'view';

const Adminservicecategories: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<ActiveComponent>('view');

  const handleAddNew = () => {
    setActiveComponent('add');
  };

  const handleCancel = () => {
    setActiveComponent('view');
  };

  return (
    <div className="admsc-container">
      {/* Header Section */}
      <div className="admsc-header">
        <h1 className="admsc-title">Service Categories Management</h1>
        <p className="admsc-subtitle">
          Manage service categories for your platform
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="admsc-navigation">
        <div className="admsc-tabs">
          <button
            className={`admsc-tab ${activeComponent === 'view' ? 'admsc-tab-active' : ''}`}
            onClick={() => setActiveComponent('view')}
            aria-selected={activeComponent === 'view'}
          >
            <span className="admsc-tab-icon">📋</span>
            <span className="admsc-tab-text">View Categories</span>
          </button>
          <button
            className={`admsc-tab ${activeComponent === 'add' ? 'admsc-tab-active' : ''}`}
            onClick={() => setActiveComponent('add')}
            aria-selected={activeComponent === 'add'}
          >
            <span className="admsc-tab-icon">➕</span>
            <span className="admsc-tab-text">Add New Category</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="admsc-content">
        {activeComponent === 'view' ? (
          <ViewCategories onAddNew={handleAddNew} />
        ) : (
          <AddServiceCategory onSuccess={() => setActiveComponent('view')} onCancel={handleCancel} />
        )}
      </div>
    </div>
  );
};

export default Adminservicecategories;