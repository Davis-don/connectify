import React, { useState } from 'react';
import { FaTrash, FaExclamationTriangle, FaTimes, FaCheck } from 'react-icons/fa';
import  './deletecategorycomponent.css'

interface DeleteCategoryProps {
  categoryId: number;
  onClose: () => void;
}

const DeleteCategory: React.FC<DeleteCategoryProps> = ({ categoryId, onClose }) => {
  const [confirmationText, setConfirmationText] = useState('');

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (confirmationText !== 'DELETE') {
      alert(`Please type "DELETE" in the confirmation field to delete category with ID: ${categoryId}`);
      return;
    }

    alert(`Delete confirmation successful!\n\nCategory ID: ${categoryId} will be deleted.\n\nIn the actual implementation, this would:\n1. Send DELETE request to API\n2. Handle success/error responses\n3. Show appropriate toast messages\n4. Refresh the categories list`);
    onClose();
  };

  const handleClose = () => {
    alert(`Delete operation cancelled for Category ID: ${categoryId}`);
    onClose();
  };

  return (
    <div className="delcat-container">
      <div className="delcat-header">
        <div className="delcat-header-icon">
          <FaExclamationTriangle />
        </div>
        <div className="delcat-header-content">
          <h2 className="delcat-title">Delete Category</h2>
          <p className="delcat-subtitle">
            Warning: This action cannot be undone
          </p>
        </div>
      </div>

      <div className="delcat-content">
        <div className="delcat-warning">
          <div className="delcat-warning-icon">
            ⚠️
          </div>
          <h3 className="delcat-warning-title">Are you sure?</h3>
          <p className="delcat-warning-text">
            You are about to delete category with ID: <strong>{categoryId}</strong>
          </p>
          <p className="delcat-warning-details">
            This will permanently remove the category from the system.
            Any services associated with this category may be affected.
          </p>
        </div>

        <form onSubmit={handleDelete} className="delcat-form">
          <div className="delcat-form-group">
            <label htmlFor="confirmation" className="delcat-label">
              Type <strong>DELETE</strong> to confirm
            </label>
            <input
              type="text"
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="delcat-input"
              placeholder="Type DELETE here"
              autoComplete="off"
            />
            <div className="delcat-char-count">
              {confirmationText === 'DELETE' ? (
                <span className="delcat-valid">
                  <FaCheck /> Confirmation text matches
                </span>
              ) : (
                <span className="delcat-invalid">
                  Type exactly: DELETE
                </span>
              )}
            </div>
          </div>

          <div className="delcat-consequences">
            <h4 className="delcat-consequences-title">What will be deleted:</h4>
            <ul className="delcat-consequences-list">
              <li>📋 Category record with ID: {categoryId}</li>
              <li>🗂️ All services under this category</li>
              <li>📊 Related statistics and analytics</li>
              <li>🚫 Cannot be recovered</li>
            </ul>
          </div>

          <div className="delcat-actions">
            <button
              type="button"
              onClick={handleClose}
              className="delcat-cancel-btn"
            >
              <FaTimes /> Cancel
            </button>
            <button
              type="submit"
              className="delcat-delete-btn"
              disabled={confirmationText !== 'DELETE'}
            >
              <FaTrash /> Delete Category
            </button>
          </div>
        </form>

        <div className="delcat-note">
          <FaExclamationTriangle className="delcat-note-icon" />
          <span>
            Note: This is a demo component. In production, this would make an API call to delete the category.
          </span>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategory;