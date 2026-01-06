import './createserviceaccount.css';
import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaPhone, 
  FaArrowRight,
  FaCheckCircle,
  FaBuilding,
  FaShieldAlt,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useToast } from '../../../store/toastStore';

interface CreateAccountData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  company_name?: string;
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  phone_number?: string;
  confirm_password?: string;
  company_name?: string;
}

function Createserviceaccount() {
  const showToast = useToast(state => state.showToast);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [redirectTimer, setRedirectTimer] = useState<number | null>(null);

  const [formData, setFormData] = useState<CreateAccountData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone_number: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showCompanyField, setShowCompanyField] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [redirectTimer]);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Add floating label effect on mobile
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setActiveField(target.getAttribute('name'));
        // Scroll to active field on mobile
        if (isMobile && formRef.current) {
          setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
      }
    };

    const handleBlur = () => {
      setActiveField(null);
    };

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, [isMobile]);

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    // First name validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    } else if (formData.first_name.length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters';
    }

    // Last name validation
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    } else if (formData.last_name.length < 2) {
      newErrors.last_name = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone_number.replace(/\D/g, ''))) {
      newErrors.phone_number = 'Please enter a valid phone number (10-15 digits)';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirm_password = 'Please confirm your password';
    } else if (formData.password !== confirmPassword) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    // Company name validation (only if field is shown and filled)
    if (showCompanyField && formData.company_name && formData.company_name.trim()) {
      if (formData.company_name.length < 2) {
        newErrors.company_name = 'Company name must be at least 2 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const apiUrl = import.meta.env.VITE_API_URL;

  // Create account mutation
  const createAccountMutation = useMutation<
    any,
    Error,
    CreateAccountData
  >({
    mutationFn: async (data: CreateAccountData) => {
      const response = await fetch(
        `${apiUrl}/users/create-service-provider/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Registration failed');
      }

      return result;
    },

    onMutate: () => {
      setIsLoading(true);
      showToast('Creating your account...', 'info', 5);
    },

    onSuccess: (data) => {
      setIsLoading(false);
      setIsSuccess(true);
      
      // Show success toast
      let toastMessage = 'Account created successfully!';
      let toastDuration = 5; // seconds
      
      if (data.message && data.message.includes('verification')) {
        toastMessage = 'Account created! Please check your email for verification.';
        toastDuration = 7; // Give more time for email verification message
      }
      
      showToast(toastMessage, 'success', toastDuration);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          phone_number: '',
        });
        setConfirmPassword('');
        setShowCompanyField(false);
      }, 3000);

      // Set timer to navigate to login after toast disappears
      const timer = setTimeout(() => {
        navigate('/login');
        setIsSuccess(false);
      }, toastDuration * 1000 + 500); // Add 500ms buffer for toast animation

      setRedirectTimer(timer);
    },

    onError: (error) => {
      setIsLoading(false);
      showToast(error.message || 'Failed to create account', 'error', 5);
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'password') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (errors.confirm_password) {
      setErrors(prev => ({ ...prev, confirm_password: undefined }));
    }
  };

  const handleCompanyToggle = () => {
    setShowCompanyField(!showCompanyField);
    
    // If hiding company field, clear the company name
    if (showCompanyField) {
      setFormData(prev => {
        const { company_name, ...rest } = prev;
        return rest;
      });
      // Clear company name error if exists
      if (errors.company_name) {
        setErrors(prev => ({ ...prev, company_name: undefined }));
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Prepare data for submission
      const submitData: CreateAccountData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone_number: formData.phone_number.replace(/\D/g, ''), // Send only digits
      };

      // Add company name only if field is shown and has value
      if (showCompanyField && formData.company_name && formData.company_name.trim()) {
        submitData.company_name = formData.company_name.trim();
      }

      createAccountMutation.mutate(submitData);
    } else {
      showToast('Please fix the errors in the form', 'error', 4);
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

  // Scroll to top function for mobile
  const scrollToTop = () => {
    if (formRef.current) {
      formRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle manual navigation to login
  const handleNavigateToLogin = () => {
    if (redirectTimer) {
      clearTimeout(redirectTimer);
    }
    navigate('/login');
    setIsSuccess(false);
  };

  return (
    <div className="create-account-container" ref={formRef}>
      {/* Mobile Scroll Indicator */}
      {isMobile && (
        <button 
          className="scroll-to-top-btn"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <FaArrowRight style={{ transform: 'rotate(-90deg)' }} />
        </button>
      )}
      
      {/* Success State */}
      {isSuccess ? (
        <div className="success-state">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <h2>Account Created Successfully!</h2>
          <p className="success-subtitle">Welcome to HELPR Service Provider Network</p>
          <div className="success-details">
            <p><FaCheckCircle className="success-bullet" /> Your service provider account has been created</p>
            <p><FaCheckCircle className="success-bullet" /> You can now log in and start offering your services</p>
            <p><FaCheckCircle className="success-bullet" /> Redirecting to login page in a few seconds...</p>
          </div>
          <div className="success-actions">
            <button 
              className="return-btn"
              onClick={() => setIsSuccess(false)}
              disabled={isLoading}
            >
              Create Another Account
            </button>
            <button 
              className="login-btn"
              onClick={handleNavigateToLogin}
            >
              Go to Login Now
            </button>
          </div>
        </div>
      ) : (
        <div className="create-account-form-wrapper">
          {/* Mobile Form Header */}
          {isMobile && (
            <div className="mobile-form-header">
              <button 
                className="mobile-back-btn"
                onClick={() => window.history.back()}
                aria-label="Go back"
              >
                <FaArrowRight style={{ transform: 'rotate(180deg)' }} />
              </button>
              <div className="mobile-header-text">
                <h1 className="mobile-form-title">Service Provider Registration</h1>
                <p className="mobile-form-steps">Step 1 of 1</p>
              </div>
            </div>
          )}

          {/* Form Header */}
          <div className="form-header">
            <div className="header-icon">
              <FaShieldAlt />
            </div>
            <h1 className="form-title">
              Become a <span className="title-highlight">Service Provider</span>
            </h1>
            <p className="form-subtitle">
              Join HELPR's network of trusted professionals
            </p>
            <div className="form-header-underline">
              <div className="underline-bar"></div>
            </div>
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="create-account-form">
            <div className="form-grid">
              {/* First Name */}
              <div className={`input-group ${activeField === 'first_name' ? 'active' : ''}`}>
                <label className="input-label">
                  <FaUser className="label-icon" />
                  First Name *
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`form-input ${errors.first_name ? 'error' : ''}`}
                  placeholder="Enter your first name"
                  disabled={isLoading}
                  autoComplete="given-name"
                />
                {errors.first_name && (
                  <div className="error-message-container">
                    <FaExclamationTriangle className="error-icon" />
                    <span className="error-message">{errors.first_name}</span>
                  </div>
                )}
              </div>

              {/* Last Name */}
              <div className={`input-group ${activeField === 'last_name' ? 'active' : ''}`}>
                <label className="input-label">
                  <FaUser className="label-icon" />
                  Last Name *
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`form-input ${errors.last_name ? 'error' : ''}`}
                  placeholder="Enter your last name"
                  disabled={isLoading}
                  autoComplete="family-name"
                />
                {errors.last_name && (
                  <div className="error-message-container">
                    <FaExclamationTriangle className="error-icon" />
                    <span className="error-message">{errors.last_name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className={`input-group full-width ${activeField === 'email' ? 'active' : ''}`}>
                <label className="input-label">
                  <FaEnvelope className="label-icon" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  autoComplete="email"
                />
                {errors.email && (
                  <div className="error-message-container">
                    <FaExclamationTriangle className="error-icon" />
                    <span className="error-message">{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className={`input-group full-width ${activeField === 'phone_number' ? 'active' : ''}`}>
                <label className="input-label">
                  <FaPhone className="label-icon" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handlePhoneInput}
                  className={`form-input ${errors.phone_number ? 'error' : ''}`}
                  placeholder="(123) 456-7890"
                  disabled={isLoading}
                  autoComplete="tel"
                />
                {errors.phone_number && (
                  <div className="error-message-container">
                    <FaExclamationTriangle className="error-icon" />
                    <span className="error-message">{errors.phone_number}</span>
                  </div>
                )}
              </div>

              {/* Company Name Toggle */}
              <div className="input-group full-width">
                <div className="company-toggle-section">
                  <div className="toggle-container">
                    <input
                      type="checkbox"
                      id="company-toggle"
                      checked={showCompanyField}
                      onChange={handleCompanyToggle}
                      className="toggle-checkbox"
                      disabled={isLoading}
                    />
                    <label htmlFor="company-toggle" className="toggle-label">
                      <span className="toggle-slider"></span>
                      <span className="toggle-text">
                        <FaBuilding className="toggle-icon" />
                        I have a service company (Optional)
                      </span>
                    </label>
                  </div>
                  
                  {/* Company Name Field - Conditionally Shown */}
                  {showCompanyField && (
                    <div className="company-field-wrapper">
                      <div className={`input-group ${activeField === 'company_name' ? 'active' : ''}`}>
                        <label className="input-label">
                          <FaBuilding className="label-icon" />
                          Company Name
                        </label>
                        <input
                          type="text"
                          name="company_name"
                          value={formData.company_name || ''}
                          onChange={handleChange}
                          className={`form-input ${errors.company_name ? 'error' : ''}`}
                          placeholder="Enter your company name"
                          disabled={isLoading}
                          autoComplete="organization"
                        />
                        {errors.company_name && (
                          <div className="error-message-container">
                            <FaExclamationTriangle className="error-icon" />
                            <span className="error-message">{errors.company_name}</span>
                          </div>
                        )}
                        <p className="field-note">Optional - Enter your company name if you represent a business</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className={`input-group full-width ${activeField === 'password' ? 'active' : ''}`}>
                <label className="input-label">
                  <FaLock className="label-icon" />
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Create a strong password"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill"
                        style={{
                          width: `${passwordStrength}%`,
                          backgroundColor: getPasswordStrengthColor()
                        }}
                      ></div>
                    </div>
                    <span className="strength-text">
                      Strength: <span style={{ color: getPasswordStrengthColor() }}>{getPasswordStrengthText()}</span>
                    </span>
                  </div>
                )}
                {errors.password && (
                  <div className="error-message-container">
                    <FaExclamationTriangle className="error-icon" />
                    <span className="error-message">{errors.password}</span>
                  </div>
                )}
                <div className="password-hints">
                  <p>Password must contain:</p>
                  <ul>
                    <li className={formData.password.length >= 8 ? 'valid' : ''}>
                      At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>
                      One uppercase letter
                    </li>
                    <li className={/[0-9]/.test(formData.password) ? 'valid' : ''}>
                      One number
                    </li>
                    <li className={/[^A-Za-z0-9]/.test(formData.password) ? 'valid' : ''}>
                      One special character
                    </li>
                  </ul>
                </div>
              </div>

              {/* Confirm Password */}
              <div className={`input-group full-width ${activeField === 'confirm_password' ? 'active' : ''}`}>
                <label className="input-label">
                  <FaLock className="label-icon" />
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={`form-input ${errors.confirm_password ? 'error' : ''}`}
                  placeholder="Re-enter your password"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                {errors.confirm_password && (
                  <div className="error-message-container">
                    <FaExclamationTriangle className="error-icon" />
                    <span className="error-message">{errors.confirm_password}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="terms-section">
              <label className="terms-label">
                <input 
                  type="checkbox" 
                  required 
                  className="terms-checkbox" 
                  disabled={isLoading} 
                />
                <span className="terms-text">
                  I agree to the <a href="/terms" className="terms-link">Terms of Service</a> and 
                  <a href="/privacy" className="terms-link"> Privacy Policy</a>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="submit-section">
              <button 
                type="submit" 
                className="submit-button"
                disabled={isLoading}
              >
                <span className="button-text">
                  {isLoading ? 'Creating Account...' : 'Become a Service Provider'}
                </span>
                <div className="button-icon">
                  <FaArrowRight />
                </div>
                <div className="button-glow"></div>
              </button>
              
              {isLoading && (
                <div className="loading-indicator">
                  <div className="loading-spinner"></div>
                  <span>Setting up your account...</span>
                </div>
              )}
            </div>

            {/* Mobile Form Progress */}
            {isMobile && (
              <div className="mobile-progress-indicator">
                <div className="progress-dots">
                  <div className="progress-dot active"></div>
                  <div className="progress-dot"></div>
                  <div className="progress-dot"></div>
                </div>
                <p className="progress-text">Almost there! Fill all required fields</p>
              </div>
            )}

            {/* Form Footer */}
            <div className="form-footer">
              <p className="footer-text">
                Already a service provider? <a href="/login" className="footer-link">Sign in here</a>
              </p>
              <div className="security-note">
                <FaShieldAlt className="security-icon" />
                <span>Your information is secure and encrypted</span>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Createserviceaccount;