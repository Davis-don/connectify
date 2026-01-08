import React, { useState, useEffect } from 'react';
import './viewcategories.css'

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  servicesCount: number;
  isActive: boolean;
}

interface ViewCategoriesProps {
  onAddNew: () => void;
}

const ViewCategories: React.FC<ViewCategoriesProps> = ({ onAddNew }) => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in real app, this would come from API
  const mockCategories: ServiceCategory[] = [
    { id: '1', name: 'Cleaning', description: 'House and office cleaning services', servicesCount: 8, isActive: true },
    { id: '2', name: 'Repair', description: 'Appliance and home repairs', servicesCount: 12, isActive: true },
    { id: '3', name: 'Beauty', description: 'Personal care and beauty services', servicesCount: 6, isActive: true },
    { id: '4', name: 'Tutoring', description: 'Educational services', servicesCount: 4, isActive: false },
    { id: '5', name: 'Delivery', description: 'Package and food delivery', servicesCount: 7, isActive: true },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCategories(mockCategories);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCategoryStatus = (id: string) => {
    setCategories(prev =>
      prev.map(category =>
        category.id === id
          ? { ...category, isActive: !category.isActive }
          : category
      )
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(category => category.id !== id));
    }
  };

  return (
    <div className="vc-container">
      <div className="vc-header">
        <div className="vc-search-container">
          <div className="vc-search-box">
            <span className="vc-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="vc-search-input"
            />
          </div>
        </div>
        
        <button
          onClick={onAddNew}
          className="vc-add-button"
        >
          <span className="vc-add-icon">➕</span>
          Add New Category
        </button>
      </div>

      {isLoading ? (
        <div className="vc-loading">
          <div className="vc-spinner"></div>
          <p>Loading categories...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="vc-empty">
          <div className="vc-empty-icon">📂</div>
          <h3>No categories found</h3>
          <p>
            {searchTerm
              ? 'No categories match your search. Try different keywords.'
              : 'No categories have been created yet.'}
          </p>
          {!searchTerm && (
            <button onClick={onAddNew} className="vc-empty-action">
              Create your first category
            </button>
          )}
        </div>
      ) : (
        <div className="vc-categories-list">
          {filteredCategories.map((category) => (
            <div key={category.id} className="vc-category-card">
              <div className="vc-category-header">
                <div className="vc-category-title">
                  <h3 className="vc-category-name">{category.name}</h3>
                  <span className={`vc-status-badge ${category.isActive ? 'vc-active' : 'vc-inactive'}`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="vc-category-actions">
                  <button
                    onClick={() => toggleCategoryStatus(category.id)}
                    className={`vc-action-button ${category.isActive ? 'vc-deactivate' : 'vc-activate'}`}
                    title={category.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {category.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="vc-action-button vc-delete"
                    title="Delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <p className="vc-category-description">
                {category.description}
              </p>
              
              <div className="vc-category-footer">
                <span className="vc-services-count">
                  {category.servicesCount} services
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewCategories;