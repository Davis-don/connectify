import React, { useEffect } from 'react';
import { FaEdit, FaTimes } from 'react-icons/fa';
import './updatecategorycomponent.css'

interface UpdateCategoryProps {
  categoryId: number;
  onClose: () => void;
}

const UpdateCategory: React.FC<UpdateCategoryProps> = ({ categoryId, onClose }) => {
  useEffect(() => {
    alert(`Update Category Component Loaded\nCategory ID: ${categoryId}\n\nThis component will handle updating category with ID: ${categoryId}\n\nYou can implement the update logic here.`);
  }, [categoryId]);

  const handleDummySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Update form submitted for Category ID: ${categoryId}\n\nIn the actual implementation, this would:\n1. Show a form with current category data\n2. Allow editing of category_name, description, is_active\n3. Send PUT request to update API\n4. Show success/error messages\n5. Refresh the categories list`);
    onClose();
  };

  return (
    <div className="upcat-container">
      <div className="upcat-header">
        <div className="upcat-header-icon">
          <FaEdit />
        </div>
        <div className="upcat-header-content">
          <h2 className="upcat-title">Update Category</h2>
          <p className="upcat-subtitle">
            You are updating category with ID: <strong>{categoryId}</strong>
          </p>
        </div>
      </div>

      <div className="upcat-content">
        <div className="upcat-message">
          <div className="upcat-message-icon">ℹ️</div>
          <h3 className="upcat-message-title">Update Component Placeholder</h3>
          <p className="upcat-message-text">
            This component is designed to handle updating service categories.
          </p>
          <p className="upcat-message-details">
            <strong>Category ID:</strong> {categoryId}
          </p>
        </div>

        <div className="upcat-features">
          <h4 className="upcat-features-title">Features to implement:</h4>
          <ul className="upcat-features-list">
            <li>✅ Fetch current category data by ID</li>
            <li>✅ Display form with existing values</li>
            <li>✅ Form validation</li>
            <li>✅ Update API call</li>
            <li>✅ Success/error handling</li>
            <li>✅ Toast notifications</li>
          </ul>
        </div>

        <form onSubmit={handleDummySubmit} className="upcat-form">
          <div className="upcat-form-group">
            <label className="upcat-label">Category Name</label>
            <input
              type="text"
              className="upcat-input"
              placeholder="Category name will appear here"
              disabled
            />
          </div>

          <div className="upcat-form-group">
            <label className="upcat-label">Description</label>
            <textarea
              className="upcat-textarea"
              placeholder="Category description will appear here"
              rows={3}
              disabled
            />
          </div>

          <div className="upcat-form-group">
            <label className="upcat-checkbox-label">
              <input
                type="checkbox"
                className="upcat-checkbox"
                disabled
              />
              <span className="upcat-checkbox-custom"></span>
              <span className="upcat-checkbox-text">
                Active Category
              </span>
            </label>
          </div>

          <div className="upcat-actions">
            <button
              type="button"
              onClick={onClose}
              className="upcat-cancel-btn"
            >
              <FaTimes /> Close
            </button>
            <button
              type="submit"
              className="upcat-submit-btn"
            >
              <FaEdit /> Update Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCategory;