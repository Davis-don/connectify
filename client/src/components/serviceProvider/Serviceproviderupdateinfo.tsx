import React, { useState, useEffect } from 'react';
import type { ChangeEvent,FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../store/toastStore';
import { useTokenStore } from '../../../store/tokenStore';
import './updateinfo.css'

interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  service_profile: {
    id: number;
    phone_number: string;
    company_name: string;
  };
}

interface UpdateData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  company_name?: string;
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  company_name?: string;
}

const ServiceProviderUpdateInfo: React.FC = () => {
  const showToast = useToast(state => state.showToast);
  const { getAccessToken, getEmail } = useTokenStore();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<UpdateData>({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    company_name: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [activeField, setActiveField] = useState<string | null>(null);

  // Fetch user data
  const { data: userData, isLoading: isFetching } = useQuery<UserData>({
    queryKey: ['serviceProviderData'],
    queryFn: async () => {
      const token = getAccessToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/fetch-service-provider/`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          showToast('Session expired. Please login again.', 'error', 5);
          throw new Error('Authentication failed');
        }
        throw new Error('Failed to fetch user data');
      }

      return response.json();
    },
    retry: false, // Don't retry on authentication errors
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateData) => {
      const token = getAccessToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/update-info/`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(result.message || result.error || 'Update failed');
      }

      return result;
    },
    onMutate: () => {
      setIsLoading(true);
      showToast('Updating your information...', 'info', 3);
    },
    onSuccess: (data) => {
      setIsLoading(false);
      setIsEditing(false);
      showToast('Information updated successfully!', 'success', 4);
      queryClient.invalidateQueries({ queryKey: ['serviceProviderData'] });
      
      // Update token store email if email was changed
      if (data.email && data.email !== getEmail()) {
        // Note: You might want to add a method to update email in token store
        showToast('Email updated. Please note: You may need to login again for some changes to take effect.', 'info', 6);
      }
    },
    onError: (error) => {
      setIsLoading(false);
      showToast(error.message || 'Failed to update information', 'error', 5);
    },
  });

  // Populate form when data is fetched
  useEffect(() => {
    if (userData) {
      setFormData({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        phone_number: userData.service_profile?.phone_number || '',
        company_name: userData.service_profile?.company_name || '',
      });
    }
  }, [userData]);

  // Check mobile view
  // Removed mobile view effect because isMobile was unused
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!formData.first_name?.trim()) {
      newErrors.first_name = 'First name is required';
    } else if (formData.first_name.length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters';
    }

    if (!formData.last_name?.trim()) {
      newErrors.last_name = 'Last name is required';
    } else if (formData.last_name.length < 2) {
      newErrors.last_name = 'Last name must be at least 2 characters';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone_number?.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone_number.replace(/\D/g, ''))) {
      newErrors.phone_number = 'Please enter a valid phone number (10-15 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePhoneInput = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    
    // Format phone number for display
    if (value.length > 6) {
      value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
    } else if (value.length > 3) {
      value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    
    setFormData(prev => ({
      ...prev,
      phone_number: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Prepare data for submission
      const submitData: UpdateData = {
        first_name: formData.first_name?.trim(),
        last_name: formData.last_name?.trim(),
        email: formData.email?.trim().toLowerCase(),
        phone_number: formData.phone_number?.replace(/\D/g, ''),
        company_name: formData.company_name?.trim() || '',
      };

      updateMutation.mutate(submitData);
    } else {
      showToast('Please fix the errors in the form', 'error', 4);
    }
  };

  const handleCancel = () => {
    // Reset form to original data
    if (userData) {
      setFormData({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        phone_number: userData.service_profile?.phone_number || '',
        company_name: userData.service_profile?.company_name || '',
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleFocus = (fieldName: string) => {
    setActiveField(fieldName);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  if (isFetching) {
    return (
      <div className="svp-update-info-loading">
        <div className="svp-loading-spinner"></div>
        <p>Loading your information...</p>
      </div>
    );
  }

  return (
    <div className="svp-update-info-container">
      <div className="svp-update-info-header">
        <h2 className="svp-update-info-title">Personal Information</h2>
        {!isEditing ? (
          <button 
            className="svp-update-info-edit-btn"
            onClick={handleEdit}
            disabled={isLoading}
          >
            <i className="fas fa-edit"></i>
            Edit Information
          </button>
        ) : (
          <div className="svp-update-info-mode">
            <span className="svp-editing-badge">
              <i className="fas fa-pencil-alt"></i>
              Editing Mode
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="svp-update-info-form">
        <div className="svp-update-info-grid">
          {/* First Name */}
          <div className={`svp-update-info-group ${activeField === 'first_name' ? 'active' : ''}`}>
            <label className="svp-update-info-label">
              <i className="fas fa-user svp-update-info-icon"></i>
              First Name *
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name || ''}
              onChange={handleChange}
              onFocus={() => handleFocus('first_name')}
              onBlur={handleBlur}
              className={`svp-update-info-input ${errors.first_name ? 'error' : ''}`}
              placeholder="John"
              disabled={!isEditing || isLoading}
              readOnly={!isEditing}
            />
            {errors.first_name && (
              <div className="svp-update-info-error">
                <i className="fas fa-exclamation-circle svp-error-icon"></i>
                <span>{errors.first_name}</span>
              </div>
            )}
          </div>

          {/* Last Name */}
          <div className={`svp-update-info-group ${activeField === 'last_name' ? 'active' : ''}`}>
            <label className="svp-update-info-label">
              <i className="fas fa-user svp-update-info-icon"></i>
              Last Name *
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name || ''}
              onChange={handleChange}
              onFocus={() => handleFocus('last_name')}
              onBlur={handleBlur}
              className={`svp-update-info-input ${errors.last_name ? 'error' : ''}`}
              placeholder="Doe"
              disabled={!isEditing || isLoading}
              readOnly={!isEditing}
            />
            {errors.last_name && (
              <div className="svp-update-info-error">
                <i className="fas fa-exclamation-circle svp-error-icon"></i>
                <span>{errors.last_name}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div className={`svp-update-info-group ${activeField === 'email' ? 'active' : ''}`}>
            <label className="svp-update-info-label">
              <i className="fas fa-envelope svp-update-info-icon"></i>
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
              className={`svp-update-info-input ${errors.email ? 'error' : ''}`}
              placeholder="john.doe@example.com"
              disabled={!isEditing || isLoading}
              readOnly={!isEditing}
            />
            {errors.email && (
              <div className="svp-update-info-error">
                <i className="fas fa-exclamation-circle svp-error-icon"></i>
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Phone */}
          <div className={`svp-update-info-group ${activeField === 'phone_number' ? 'active' : ''}`}>
            <label className="svp-update-info-label">
              <i className="fas fa-phone svp-update-info-icon"></i>
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number || ''}
              onChange={handlePhoneInput}
              onFocus={() => handleFocus('phone_number')}
              onBlur={handleBlur}
              className={`svp-update-info-input ${errors.phone_number ? 'error' : ''}`}
              placeholder="(123) 456-7890"
              disabled={!isEditing || isLoading}
              readOnly={!isEditing}
            />
            {errors.phone_number && (
              <div className="svp-update-info-error">
                <i className="fas fa-exclamation-circle svp-error-icon"></i>
                <span>{errors.phone_number}</span>
              </div>
            )}
          </div>

          {/* Company Name */}
          <div className={`svp-update-info-group ${activeField === 'company_name' ? 'active' : ''}`}>
            <label className="svp-update-info-label">
              <i className="fas fa-building svp-update-info-icon"></i>
              Company Name
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name || ''}
              onChange={handleChange}
              onFocus={() => handleFocus('company_name')}
              onBlur={handleBlur}
              className={`svp-update-info-input ${errors.company_name ? 'error' : ''}`}
              placeholder="Doe Services Inc."
              disabled={!isEditing || isLoading}
              readOnly={!isEditing}
            />
            {errors.company_name && (
              <div className="svp-update-info-error">
                <i className="fas fa-exclamation-circle svp-error-icon"></i>
                <span>{errors.company_name}</span>
              </div>
            )}
            <p className="svp-update-info-note">
              Optional - Leave blank if you don't have a company
            </p>
          </div>
        </div>

        {/* Form Actions */}
        {isEditing && (
          <div className="svp-update-info-actions">
            <button
              type="submit"
              className="svp-update-info-save-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Save Changes
                </>
              )}
            </button>
            <button
              type="button"
              className="svp-update-info-cancel-btn"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <i className="fas fa-times"></i>
              Cancel
            </button>
          </div>
        )}

        {/* Form Footer */}
        {!isEditing && (
          <div className="svp-update-info-footer">
            <div className="svp-update-info-security-note">
              <i className="fas fa-shield-alt"></i>
              <span>Your information is secure and encrypted</span>
            </div>
            <p className="svp-update-info-help">
              Need to update other information? Contact support for assistance.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ServiceProviderUpdateInfo;