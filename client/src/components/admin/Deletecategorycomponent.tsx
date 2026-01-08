import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { 
  FaTrash, 
  FaExclamationTriangle, 
  FaTimes, 
  FaCheck, 
  FaSpinner,
  FaShieldAlt
} from 'react-icons/fa';
import { useTokenStore } from '../../../store/tokenStore';
import { useToast } from '../../../store/toastStore';
import './deletecategorycomponent.css';

interface DeleteCategoryProps {
  categoryId: number;
  onClose: () => void;
  onSuccess?: () => void;
  onComplete?: () => void;
}

interface DeleteResponse {
  message?: string;
  detail?: string;
}

interface DeleteError {
  message: string;
  detail?: string;
}

const DeleteCategory: React.FC<DeleteCategoryProps> = ({ 
  categoryId, 
  onClose,
  onSuccess,
  onComplete
}) => {
  const { getAccessToken } = useTokenStore();
  const { showToast } = useToast();
  
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteCategoryMutation = useMutation<DeleteResponse, DeleteError>({
    mutationFn: async (): Promise<DeleteResponse> => {
      const token = getAccessToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/services/categories/${categoryId}/delete/`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        // Try to parse error response as JSON
        let errorData: Partial<DeleteError> = {};
        try {
          const text = await response.text();
          errorData = text ? (JSON.parse(text) as Partial<DeleteError>) : {};
        } catch {
          errorData = {};
        }
        
        throw new Error(
          errorData.detail || 
          errorData.message || 
          `Failed to delete category: ${response.status} ${response.statusText}`
        );
      }

      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        // Parse JSON response if it exists
        return await response.json();
      } else {
        // For 204 No Content or empty responses, return empty object
        return {};
      }
    },

    onMutate: () => {
      setIsDeleting(true);
    },

    onSuccess: (data) => {
      const successMessage = data.message || 'Category deleted successfully';
      showToast(successMessage, 'success', 3);
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Notify parent that operation is complete
      if (onComplete) {
        onComplete();
      }
    },

    onError: (error: DeleteError) => {
      setIsDeleting(false);
      showToast(error.message || 'Failed to delete category', 'error', 4);
      
      // Notify parent that operation is complete (even on error)
      if (onComplete) {
        onComplete();
      }
    },
  });

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (confirmationText !== 'DELETE') {
      showToast('Please type "DELETE" to confirm', 'error', 3);
      return;
    }

    deleteCategoryMutation.mutate();
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <div className="catdel-container">
      {/* Header */}
      <div className="catdel-header">
        <div className="catdel-header-content">
          <div className="catdel-header-icon">
            <FaExclamationTriangle />
          </div>
          <div>
            <h2 className="catdel-title">Delete Category</h2>
            <p className="catdel-subtitle">
              This action cannot be undone
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="catdel-content">
        {/* Warning */}
        <div className="catdel-warning">
          <div className="catdel-warning-icon">
            <FaShieldAlt />
          </div>
          <h3 className="catdel-warning-title">Warning</h3>
          <p className="catdel-warning-text">
            Deleting category <strong>ID: {categoryId}</strong> will permanently remove it from the system.
          </p>
        </div>

        {/* Confirmation */}
        <form onSubmit={handleDelete} className="catdel-form">
          <div className="catdel-form-group">
            <label className="catdel-label">
              Type <span className="catdel-delete-text">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="catdel-input"
              placeholder="Type DELETE here"
              autoComplete="off"
              disabled={isDeleting}
              autoFocus
            />
            <div className="catdel-input-status">
              {confirmationText === 'DELETE' ? (
                <span className="catdel-input-valid">
                  <FaCheck /> Ready to delete
                </span>
              ) : (
                <span className="catdel-input-invalid">
                  Type "DELETE" exactly as shown
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="catdel-actions">
            <button
              type="button"
              onClick={handleClose}
              className="catdel-cancel-btn"
              disabled={isDeleting}
            >
              <FaTimes /> Cancel
            </button>
            <button
              type="submit"
              className="catdel-delete-btn"
              disabled={confirmationText !== 'DELETE' || isDeleting}
            >
              {isDeleting ? (
                <>
                  <FaSpinner className="catdel-delete-spinner" />
                  Deleting...
                </>
              ) : (
                <>
                  <FaTrash /> Delete Category
                </>
              )}
            </button>
          </div>
        </form>

        {/* Status */}
        {isDeleting && (
          <div className="catdel-status">
            <FaSpinner className="catdel-status-spinner" />
            <span>Deleting category from database...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteCategory;