import React, { useState } from 'react';
import type { ChangeEvent,FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '../../../store/toastStore';
import { useTokenStore } from '../../../store/tokenStore';
import './passwordupdate.css'

interface PasswordData {
  previous_password: string;
  new_password: string;
  confirm_password: string;
}

interface PasswordErrors {
  previous_password?: string;
  new_password?: string;
  confirm_password?: string;
}

interface ServerErrors {
  [key: string]: string[];
}

const ServiceProviderUpdatePassword: React.FC = () => {
  const showToast = useToast(state => state.showToast);
  const { getAccessToken } = useTokenStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showPassword, setShowPassword] = useState({
    previous: false,
    new: false,
    confirm: false
  });

  const [formData, setFormData] = useState<PasswordData>({
    previous_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [errors, setErrors] = useState<PasswordErrors>({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [activeField, setActiveField] = useState<string | null>(null);

  // Check mobile view
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async (data: PasswordData) => {
      const token = getAccessToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/update-password/`,
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
        
        // Check for server validation errors
        if (response.status === 400) {
          throw new Error(JSON.stringify(result));
        }
        throw new Error(result.message || result.error || 'Password update failed');
      }

      return result;
    },
    onMutate: () => {
      setIsLoading(true);
      showToast('Updating your password...', 'info', 3);
    },
    onSuccess: () => {
      setIsLoading(false);
      setFormData({
        previous_password: '',
        new_password: '',
        confirm_password: '',
      });
      setErrors({});
      setPasswordStrength(0);
      showToast('Password updated successfully!', 'success', 4);
    },
    onError: (error) => {
      setIsLoading(false);
      
      try {
        // Try to parse server validation errors
        const serverErrors: ServerErrors = JSON.parse(error.message);
        
        // Map server errors to form errors
        const newErrors: PasswordErrors = {};
        
        Object.entries(serverErrors).forEach(([field, messages]) => {
          if (messages && messages.length > 0) {
            newErrors[field as keyof PasswordErrors] = messages[0];
          }
        });
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
          showToast('Failed to update password', 'error', 5);
        } else {
          showToast('Please fix the errors in the form', 'error', 5);
        }
      } catch (e) {
        // If not JSON, show regular error message
        showToast(error.message || 'Failed to update password', 'error', 5);
      }
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'new_password') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof PasswordErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    const newErrors: PasswordErrors = {};
    
    if (!formData.previous_password.trim()) {
      newErrors.previous_password = 'Current password is required';
    }
    
    if (!formData.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.new_password)) {
      newErrors.new_password = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(formData.new_password)) {
      newErrors.new_password = 'Password must contain at least one number';
    } else if (!/[^A-Za-z0-9]/.test(formData.new_password)) {
      newErrors.new_password = 'Password must contain at least one special character';
    }
    
    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your new password';
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // Send to server for final validation
      updatePasswordMutation.mutate(formData);
    } else {
      showToast('Please fix the errors in the form', 'error', 4);
    }
  };

  const handleTogglePassword = (field: 'previous' | 'new' | 'confirm') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleFocus = (fieldName: string) => {
    setActiveField(fieldName);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength >= 75) return '#10b981'; // Green
    if (passwordStrength >= 50) return '#f59e0b'; // Yellow
    if (passwordStrength >= 25) return '#ef4444'; // Red
    return '#6b7280'; // Gray
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength >= 75) return 'Strong';
    if (passwordStrength >= 50) return 'Medium';
    if (passwordStrength >= 25) return 'Weak';
    return 'Very Weak';
  };

  const handleReset = () => {
    setFormData({
      previous_password: '',
      new_password: '',
      confirm_password: '',
    });
    setErrors({});
    setPasswordStrength(0);
  };

  return (
    <div className="svp-update-password-container">
      <div className="svp-update-password-header">
        <div className="svp-update-password-header-icon">
          <i className="fas fa-shield-alt"></i>
        </div>
        <h2 className="svp-update-password-title">Security Settings</h2>
        <p className="svp-update-password-subtitle">
          Update your password to keep your account secure
        </p>
        <div className="svp-update-password-underline">
          <div className="svp-password-underline-bar"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="svp-update-password-form">
        <div className="svp-update-password-grid">
          {/* Current Password */}
          <div className={`svp-update-password-group ${activeField === 'previous_password' ? 'active' : ''}`}>
            <label className="svp-update-password-label">
              <i className="fas fa-lock svp-update-password-icon"></i>
              Current Password *
            </label>
            <div className="svp-password-input-wrapper">
              <input
                type={showPassword.previous ? "text" : "password"}
                name="previous_password"
                value={formData.previous_password}
                onChange={handleChange}
                onFocus={() => handleFocus('previous_password')}
                onBlur={handleBlur}
                className={`svp-update-password-input ${errors.previous_password ? 'error' : ''}`}
                placeholder="Enter your current password"
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="svp-password-toggle-btn"
                onClick={() => handleTogglePassword('previous')}
                tabIndex={-1}
              >
                <i className={`fas ${showPassword.previous ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {errors.previous_password && (
              <div className="svp-update-password-error">
                <i className="fas fa-exclamation-circle svp-password-error-icon"></i>
                <span>{errors.previous_password}</span>
              </div>
            )}
          </div>

          {/* New Password */}
          <div className={`svp-update-password-group ${activeField === 'new_password' ? 'active' : ''}`}>
            <label className="svp-update-password-label">
              <i className="fas fa-key svp-update-password-icon"></i>
              New Password *
            </label>
            <div className="svp-password-input-wrapper">
              <input
                type={showPassword.new ? "text" : "password"}
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                onFocus={() => handleFocus('new_password')}
                onBlur={handleBlur}
                className={`svp-update-password-input ${errors.new_password ? 'error' : ''}`}
                placeholder="Create a strong new password"
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="svp-password-toggle-btn"
                onClick={() => handleTogglePassword('new')}
                tabIndex={-1}
              >
                <i className={`fas ${showPassword.new ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {formData.new_password && (
              <div className="svp-password-strength-meter">
                <div className="svp-strength-bar">
                  <div 
                    className="svp-strength-fill"
                    style={{
                      width: `${passwordStrength}%`,
                      backgroundColor: getPasswordStrengthColor()
                    }}
                  ></div>
                </div>
                <div className="svp-strength-info">
                  <span className="svp-strength-label">Strength:</span>
                  <span className="svp-strength-text" style={{ color: getPasswordStrengthColor() }}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
              </div>
            )}
            {errors.new_password && (
              <div className="svp-update-password-error">
                <i className="fas fa-exclamation-circle svp-password-error-icon"></i>
                <span>{errors.new_password}</span>
              </div>
            )}
            
            {/* Password Requirements */}
            <div className="svp-password-requirements">
              <p className="svp-requirements-title">Password must contain:</p>
              <ul className="svp-requirements-list">
                <li className={formData.new_password.length >= 8 ? 'svp-requirement-met' : ''}>
                  <i className="fas fa-check-circle"></i>
                  At least 8 characters
                </li>
                <li className={/[A-Z]/.test(formData.new_password) ? 'svp-requirement-met' : ''}>
                  <i className="fas fa-check-circle"></i>
                  One uppercase letter
                </li>
                <li className={/[0-9]/.test(formData.new_password) ? 'svp-requirement-met' : ''}>
                  <i className="fas fa-check-circle"></i>
                  One number
                </li>
                <li className={/[^A-Za-z0-9]/.test(formData.new_password) ? 'svp-requirement-met' : ''}>
                  <i className="fas fa-check-circle"></i>
                  One special character
                </li>
              </ul>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className={`svp-update-password-group ${activeField === 'confirm_password' ? 'active' : ''}`}>
            <label className="svp-update-password-label">
              <i className="fas fa-lock svp-update-password-icon"></i>
              Confirm New Password *
            </label>
            <div className="svp-password-input-wrapper">
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                onFocus={() => handleFocus('confirm_password')}
                onBlur={handleBlur}
                className={`svp-update-password-input ${errors.confirm_password ? 'error' : ''}`}
                placeholder="Re-enter your new password"
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="svp-password-toggle-btn"
                onClick={() => handleTogglePassword('confirm')}
                tabIndex={-1}
              >
                <i className={`fas ${showPassword.confirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {errors.confirm_password && (
              <div className="svp-update-password-error">
                <i className="fas fa-exclamation-circle svp-password-error-icon"></i>
                <span>{errors.confirm_password}</span>
              </div>
            )}
            {formData.new_password && formData.confirm_password && 
             formData.new_password === formData.confirm_password && (
              <div className="svp-password-match">
                <i className="fas fa-check-circle svp-match-icon"></i>
                <span>Passwords match</span>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="svp-update-password-actions">
          <button
            type="submit"
            className="svp-update-password-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin svp-update-password-spinner"></i>
                Updating Password...
              </>
            ) : (
              <>
                <i className="fas fa-shield-alt svp-update-password-submit-icon"></i>
                Update Password
              </>
            )}
          </button>
          <button
            type="button"
            className="svp-update-password-reset-btn"
            onClick={handleReset}
            disabled={isLoading}
          >
            <i className="fas fa-redo svp-update-password-reset-icon"></i>
            Clear Form
          </button>
        </div>

        {/* Security Notes */}
        <div className="svp-update-password-security-notes">
          <div className="svp-security-note">
            <i className="fas fa-info-circle svp-security-note-icon"></i>
            <div className="svp-security-note-content">
              <h4>Password Security Tips</h4>
              <ul>
                <li>Use a unique password that you don't use elsewhere</li>
                <li>Avoid using personal information like birthdays or names</li>
                <li>Consider using a password manager</li>
                <li>Change your password regularly</li>
              </ul>
            </div>
          </div>
          
          <div className="svp-security-warning">
            <i className="fas fa-exclamation-triangle svp-security-warning-icon"></i>
            <div className="svp-security-warning-content">
              <h4>Important</h4>
              <p>After updating your password, you'll need to use the new password for all future logins.</p>
            </div>
          </div>
        </div>
      </form>

      {/* Mobile Specific Elements */}
      {isMobile && (
        <div className="svp-update-password-mobile-help">
          <i className="fas fa-mobile-alt"></i>
          <p>For security, ensure no one is watching your screen while entering passwords.</p>
        </div>
      )}
    </div>
  );
};

export default ServiceProviderUpdatePassword;