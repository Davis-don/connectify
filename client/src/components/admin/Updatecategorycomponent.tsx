import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { 
  FaEdit, 
  FaTimes, 
  FaSave, 
  FaSpinner, 
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaToggleOn,
  FaToggleOff
} from 'react-icons/fa';
import { useTokenStore } from '../../../store/tokenStore';
import { useToast } from '../../../store/toastStore';
import './updatecategorycomponent.css';

interface ServiceCategory {
  id: number;
  category_name: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

interface UpdateCategoryProps {
  categoryId: number;
  onClose: () => void;
  onSuccess?: () => void;
  onComplete?: () => void;
}

interface UpdateFormData {
  category_name: string;
  description: string;
  is_active: boolean;
}

const UpdateCategory: React.FC<UpdateCategoryProps> = ({ 
  categoryId, 
  onClose,
  onSuccess,
  onComplete
}) => {
  const { getAccessToken } = useTokenStore();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState<UpdateFormData>({
    category_name: '',
    description: '',
    is_active: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch category data
  const fetchCategoryData = async (): Promise<ServiceCategory> => {
    const token = getAccessToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/services/get-category/${categoryId}/`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || 
        errorData.detail || 
        `Failed to fetch category: ${response.status}`
      );
    }

    return await response.json();
  };

  const { data: categoryData, error: fetchError, refetch } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: fetchCategoryData,
    enabled: !!categoryId,
    retry: 1,
  });

  // Update form data when category data is fetched
  useEffect(() => {
    if (categoryData) {
      setFormData({
        category_name: categoryData.category_name,
        description: categoryData.description || '',
        is_active: categoryData.is_active,
      });
      setIsLoadingData(false);
    }
  }, [categoryData]);

  useEffect(() => {
    if (fetchError) {
      showToast(fetchError.message || 'Failed to load category data', 'error', 4);
      setIsLoadingData(false);
    }
  }, [fetchError, showToast]);

  // Update mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async (data: UpdateFormData) => {
      const token = getAccessToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/services/categories/${categoryId}/update/`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        let errorMessage = `Failed to update category: ${response.status}`;
        
        try {
          const errorData = await response.json();
          
          // Handle validation errors
          if (errorData.category_name) {
            errorMessage = `Category name: ${Array.isArray(errorData.category_name) ? errorData.category_name[0] : errorData.category_name}`;
          } else if (errorData.description) {
            errorMessage = `Description: ${Array.isArray(errorData.description) ? errorData.description[0] : errorData.description}`;
          } else {
            errorMessage = errorData.error || errorData.detail || errorData.message || errorMessage;
          }
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    },

    onMutate: () => {
      // Clear previous errors
      setFormErrors({});
    },

    onSuccess: (data) => {
      const successMessage = data.category_name 
        ? `"${data.category_name}" updated successfully`
        : 'Category updated successfully';
      
      showToast(successMessage, 'success', 3);
      
      if (onSuccess) {
        onSuccess();
      }
      
      if (onComplete) {
        onComplete();
      }
    },

    onError: (error: Error) => {
      showToast(error.message || 'Failed to update category', 'error', 4);
      
      if (onComplete) {
        onComplete();
      }
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleToggleActive = () => {
    setFormData(prev => ({
      ...prev,
      is_active: !prev.is_active,
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.category_name.trim()) {
      errors.category_name = 'Category name is required';
    } else if (formData.category_name.length > 255) {
      errors.category_name = 'Category name cannot exceed 255 characters';
    }

    if (formData.description.length > 1000) {
      errors.description = 'Description cannot exceed 1000 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the form errors', 'error', 3);
      return;
    }

    updateCategoryMutation.mutate(formData);
  };

  const handleClose = () => {
    if (!updateCategoryMutation.isPending) {
      onClose();
    }
  };

  const handleRetryFetch = () => {
    setIsLoadingData(true);
    refetch();
  };

  // Loading state
  if (isLoadingData) {
    return (
      <div className="upcat-container">
        <div className="upcat-header">
          <div className="upcat-header-icon">
            <FaEdit />
          </div>
          <div className="upcat-header-content">
            <h2 className="upcat-title">Update Category</h2>
            <p className="upcat-subtitle">
              Loading category data...
            </p>
          </div>
        </div>

        <div className="upcat-loading">
          <div className="upcat-loading-spinner">
            <FaSpinner className="upcat-spinner" />
          </div>
          <h3 className="upcat-loading-title">Loading Category Information</h3>
          <p className="upcat-loading-text">
            Fetching details for category ID: {categoryId}
          </p>
        </div>
      </div>
    );
  }

  // Error state for fetching
  if (fetchError) {
    return (
      <div className="upcat-container">
        <div className="upcat-header">
          <div className="upcat-header-icon">
            <FaExclamationTriangle />
          </div>
          <div className="upcat-header-content">
            <h2 className="upcat-title">Update Category</h2>
            <p className="upcat-subtitle">
              Unable to load category data
            </p>
          </div>
        </div>

        <div className="upcat-error">
          <div className="upcat-error-icon">
            <FaExclamationTriangle />
          </div>
          <h3 className="upcat-error-title">Failed to Load Category</h3>
          <p className="upcat-error-message">
            {fetchError.message || 'There was an error loading the category data.'}
          </p>
          <div className="upcat-error-actions">
            <button
              onClick={handleRetryFetch}
              className="upcat-retry-btn"
            >
              <FaSpinner className="upcat-retry-icon" />
              Try Again
            </button>
            <button
              onClick={handleClose}
              className="upcat-cancel-btn"
            >
              <FaTimes /> Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="upcat-container">
      {/* Header */}
      <div className="upcat-header">
        <div className="upcat-header-icon">
          <FaEdit />
        </div>
        <div className="upcat-header-content">
          <h2 className="upcat-title">Update Category</h2>
          <p className="upcat-subtitle">
            Editing: <strong>{categoryData?.category_name}</strong> (ID: {categoryId})
          </p>
        </div>
      </div>

      <div className="upcat-content">
        {/* Info message */}
        <div className="upcat-message">
          <div className="upcat-message-icon">
            <FaInfoCircle />
          </div>
          <div className="upcat-message-content">
            <h3 className="upcat-message-title">Update Category Details</h3>
            <p className="upcat-message-text">
              Make changes to the category information below. All fields are required unless marked optional.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="upcat-form">
          {/* Category Name */}
          <div className="upcat-form-group">
            <label className="upcat-label">
              Category Name <span className="upcat-required">*</span>
            </label>
            <input
              type="text"
              name="category_name"
              value={formData.category_name}
              onChange={handleInputChange}
              className={`upcat-input ${formErrors.category_name ? 'upcat-input-error' : ''}`}
              placeholder="Enter category name"
              disabled={updateCategoryMutation.isPending}
              autoFocus
            />
            {formErrors.category_name && (
              <div className="upcat-error-message">
                <FaExclamationTriangle className="upcat-error-icon-small" />
                {formErrors.category_name}
              </div>
            )}
            <div className="upcat-input-hint">
              Required. Maximum 255 characters.
            </div>
          </div>

          {/* Description */}
          <div className="upcat-form-group">
            <label className="upcat-label">
              Description <span className="upcat-optional">(Optional)</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`upcat-textarea ${formErrors.description ? 'upcat-input-error' : ''}`}
              placeholder="Enter category description"
              rows={4}
              disabled={updateCategoryMutation.isPending}
            />
            {formErrors.description && (
              <div className="upcat-error-message">
                <FaExclamationTriangle className="upcat-error-icon-small" />
                {formErrors.description}
              </div>
            )}
            <div className="upcat-input-hint">
              Optional. Maximum 1000 characters. Current: {formData.description.length}/1000
            </div>
          </div>

          {/* Status Toggle */}
          <div className="upcat-form-group">
            <label className="upcat-label">Category Status</label>
            <div className="upcat-toggle-container">
              <button
                type="button"
                onClick={handleToggleActive}
                className={`upcat-toggle ${formData.is_active ? 'upcat-toggle-active' : 'upcat-toggle-inactive'}`}
                disabled={updateCategoryMutation.isPending}
              >
                <div className="upcat-toggle-inner">
                  <div className="upcat-toggle-icon">
                    {formData.is_active ? <FaToggleOn /> : <FaToggleOff />}
                  </div>
                  <div className="upcat-toggle-label">
                    {formData.is_active ? 'Active' : 'Inactive'}
                  </div>
                  <div className="upcat-toggle-status">
                    {formData.is_active ? 'Category is visible' : 'Category is hidden'}
                  </div>
                </div>
              </button>
            </div>
            <div className="upcat-input-hint">
              Active categories are visible to users, inactive ones are hidden.
            </div>
          </div>

          {/* Actions */}
          <div className="upcat-actions">
            <button
              type="button"
              onClick={handleClose}
              className="upcat-cancel-btn"
              disabled={updateCategoryMutation.isPending}
            >
              <FaTimes /> Cancel
            </button>
            <button
              type="submit"
              className="upcat-submit-btn"
              disabled={updateCategoryMutation.isPending}
            >
              {updateCategoryMutation.isPending ? (
                <>
                  <FaSpinner className="upcat-submit-spinner" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        {/* Status indicator */}
        {updateCategoryMutation.isPending && (
          <div className="upcat-status">
            <FaSpinner className="upcat-status-spinner" />
            <span>Updating category in database...</span>
          </div>
        )}

        {/* Success indicator (briefly shows before closing) */}
        {updateCategoryMutation.isSuccess && (
          <div className="upcat-success">
            <FaCheckCircle className="upcat-success-icon" />
            <span>Category updated successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateCategory;