import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FaPlus, FaTimes, FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { useToast } from '../../../store/toastStore';
import { useTokenStore } from '../../../store/tokenStore';
import './addservicecategory.css';

interface AddServiceCategoryProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  category_name: string;
  description: string;
  is_active: boolean;
}

interface ApiErrorResponse {
  detail?: string;
  message?: string;
  category_name?: string[];
  description?: string[];
  non_field_errors?: string[];
}

const AddServiceCategory: React.FC<AddServiceCategoryProps> = ({ onSuccess, onCancel }) => {
  const { showToast } = useToast();
  const { getAccessToken } = useTokenStore();
  
  const [formData, setFormData] = useState<FormData>({
    category_name: '',
    description: '',
    is_active: true
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate category name
    if (!formData.category_name.trim()) {
      errors.category_name = 'Category name is required';
    } else if (formData.category_name.trim().length < 2) {
      errors.category_name = 'Category name must be at least 2 characters';
    } else if (formData.category_name.trim().length > 255) {
      errors.category_name = 'Category name cannot exceed 255 characters';
    }

    // Validate description length
    if (formData.description.length > 1000) {
      errors.description = 'Description cannot exceed 1000 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addCategoryMutation = useMutation({
    mutationFn: async (data: FormData): Promise<any> => {
      const token = getAccessToken();
      
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/services/add-new-category/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      const result: ApiErrorResponse & any = await response.json();

      if (!response.ok) {
        let errorMessage = 'Failed to add category';
        
        if (result.detail) {
          errorMessage = result.detail;
        } else if (result.category_name && result.category_name.length > 0) {
          errorMessage = result.category_name[0];
        } else if (result.description && result.description.length > 0) {
          errorMessage = result.description[0];
        } else if (result.non_field_errors && result.non_field_errors.length > 0) {
          errorMessage = result.non_field_errors[0];
        } else if (result.message) {
          errorMessage = result.message;
        }
        
        throw new Error(errorMessage);
      }

      return result;
    },

    onMutate: () => {
      setIsSubmitting(true);
      showToast('Adding new category...', 'info', 3);
    },

    onSuccess: () => {
      showToast('Service category added successfully!', 'success', 3);
      onSuccess();
    },

    onError: (error: Error) => {
      setIsSubmitting(false);
      showToast(error.message || 'Failed to add category. Please try again.', 'error', 4);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      addCategoryMutation.mutate(formData);
    } else {
      showToast('Please fix the form errors', 'error', 4);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      is_active: checked
    }));
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      onCancel();
    }
  };

  return (
    <div className="asvc-container">
      {/* Form Header */}
      <div className="asvc-header">
        <div className="asvc-header-icon">
          <FaPlus />
        </div>
        <div className="asvc-header-content">
          <h2 className="asvc-title">Add New Service Category</h2>
          <p className="asvc-subtitle">
            Create a new category to organize services on your platform
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="asvc-form">
        {/* Category Name Field */}
        <div className={`asvc-form-group ${formErrors.category_name ? 'asvc-error' : ''}`}>
          <label htmlFor="category_name" className="asvc-label">
            <span className="asvc-label-text">Category Name *</span>
            <span className="asvc-required">Required</span>
          </label>
          <input
            type="text"
            id="category_name"
            name="category_name"
            value={formData.category_name}
            onChange={handleInputChange}
            className="asvc-input"
            placeholder="e.g., Cleaning Services, Plumbing, Electrical"
            disabled={isSubmitting}
            maxLength={255}
          />
          <div className="asvc-character-count">
            {formData.category_name.length}/255 characters
          </div>
          {formErrors.category_name && (
            <div className="asvc-error-message">
              <FaExclamationTriangle className="asvc-error-icon" />
              <span>{formErrors.category_name}</span>
            </div>
          )}
        </div>

        {/* Description Field */}
        <div className={`asvc-form-group ${formErrors.description ? 'asvc-error' : ''}`}>
          <label htmlFor="description" className="asvc-label">
            <span className="asvc-label-text">Description</span>
            <span className="asvc-optional">Optional</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="asvc-textarea"
            placeholder="Describe this category for service providers and clients..."
            rows={4}
            disabled={isSubmitting}
            maxLength={1000}
          />
          <div className="asvc-character-count">
            {formData.description.length}/1000 characters
          </div>
          {formErrors.description && (
            <div className="asvc-error-message">
              <FaExclamationTriangle className="asvc-error-icon" />
              <span>{formErrors.description}</span>
            </div>
          )}
        </div>

        {/* Active Status Field */}
        <div className="asvc-form-group">
          <div className="asvc-checkbox-wrapper">
            <label className="asvc-checkbox-label">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleCheckboxChange}
                className="asvc-checkbox"
                disabled={isSubmitting}
              />
              <span className="asvc-checkbox-custom"></span>
              <span className="asvc-checkbox-text">
                Active Category
                <span className="asvc-checkbox-hint">
                  Active categories will be visible to service providers and clients
                </span>
              </span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="asvc-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="asvc-cancel-button"
            disabled={isSubmitting}
          >
            <FaTimes className="asvc-button-icon" />
            Cancel
          </button>
          <button
            type="submit"
            className="asvc-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="asvc-button-icon asvc-spin" />
                Adding...
              </>
            ) : (
              <>
                <FaCheckCircle className="asvc-button-icon" />
                Add Category
              </>
            )}
          </button>
        </div>

        {/* Form Status */}
        {isSubmitting && (
          <div className="asvc-status">
            <div className="asvc-status-spinner"></div>
            <span className="asvc-status-text">
              Saving category to database...
            </span>
          </div>
        )}
      </form>

      {/* Form Footer */}
      <div className="asvc-footer">
        <div className="asvc-footer-note">
          <FaExclamationTriangle className="asvc-footer-icon" />
          <span>
            Category names must be unique. Changes may take a few moments to reflect across the platform.
          </span>
        </div>
      </div>
    </div>
  );
};

export default AddServiceCategory;