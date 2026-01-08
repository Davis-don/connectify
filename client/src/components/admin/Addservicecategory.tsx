import React, { useState } from 'react';
import './addservicecategory.css'

interface AddServiceCategoryProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddServiceCategory: React.FC<AddServiceCategoryProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate form
    if (!formData.name.trim()) {
      setError('Category name is required');
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      onSuccess();
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      isActive: checked
    }));
  };

  return (
    <div className="asc-container">
      <div className="asc-header">
        <h2 className="asc-title">Add New Service Category</h2>
        <p className="asc-description">
          Create a new service category to organize your services
        </p>
      </div>

      <form onSubmit={handleSubmit} className="asc-form">
        {error && (
          <div className="asc-error-message">
            ⚠️ {error}
          </div>
        )}

        <div className="asc-form-group">
          <label htmlFor="name" className="asc-label">
            Category Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="asc-input"
            placeholder="e.g., Cleaning Services"
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="asc-form-group">
          <label htmlFor="description" className="asc-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="asc-textarea"
            placeholder="Brief description of this category..."
            rows={4}
            disabled={isSubmitting}
          />
        </div>

        <div className="asc-form-group">
          <label className="asc-checkbox-label">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleCheckboxChange}
              className="asc-checkbox"
              disabled={isSubmitting}
            />
            <span className="asc-checkbox-text">Active Category</span>
          </label>
          <p className="asc-hint">
            Active categories will be available for service providers to use
          </p>
        </div>

        <div className="asc-actions">
          <button
            type="button"
            onClick={onCancel}
            className="asc-cancel-button"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="asc-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Category'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddServiceCategory;