import './loginserviceaccount.css';
import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { 
  FaEnvelope, 
  FaLock, 
  FaArrowRight,
  FaCheckCircle,
  FaUserCircle,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
  FaShieldAlt
} from 'react-icons/fa';
import { useToast } from '../../../store/toastStore';

interface LoginData {
  email: string;
  password: string;
  remember_me?: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

function Loginserviceaccount() {
  const showToast = useToast(state => state.showToast);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [activeField, setActiveField] = useState<string | null>(null);

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
    
    // Check for saved credentials
    const savedEmail = localStorage.getItem('service_account_email');
    const savedPassword = localStorage.getItem('service_account_password');
    const savedRemember = localStorage.getItem('service_account_remember');
    
    if (savedRemember === 'true' && savedEmail && savedPassword) {
      setFormData({
        email: savedEmail,
        password: savedPassword
      });
      setRememberMe(true);
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, [isMobile]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Login mutation
  const loginMutation = useMutation<
    any,
    Error,
    LoginData
  >({
    mutationFn: async (data: LoginData) => {
      const response = await fetch(
        `http://localhost:8000/users/login-service-provider/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            email: data.email.toLowerCase(),
            password: data.password
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Login failed');
      }

      return result;
    },

    onMutate: () => {
      setIsLoading(true);
      showToast('Logging in...', 'info', 3);
    },

    onSuccess: (data) => {
      setIsLoading(false);
      setIsSuccess(true);
      
      // Save credentials if remember me is checked
      if (rememberMe) {
        localStorage.setItem('service_account_email', formData.email);
        localStorage.setItem('service_account_password', formData.password);
        localStorage.setItem('service_account_remember', 'true');
      } else {
        localStorage.removeItem('service_account_email');
        localStorage.removeItem('service_account_password');
        localStorage.setItem('service_account_remember', 'false');
      }
      
      showToast('Login successful!', 'success', 3);
      
      // Store auth token if returned
      if (data.token) {
        localStorage.setItem('service_auth_token', data.token);
      }

      // Reset form after success
      setTimeout(() => {
        // Redirect to dashboard or perform next action
        window.location.href = '/service-provider/dashboard';
      }, 2000);
    },

    onError: (error) => {
      setIsLoading(false);
      showToast(error.message || 'Invalid email or password', 'error', 4);
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Prepare data for submission
      const submitData: LoginData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      // Add remember_me if checked
      if (rememberMe) {
        submitData.remember_me = true;
      }

      loginMutation.mutate(submitData);
    } else {
      showToast('Please fix the errors in the form', 'error', 4);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    showToast('Password reset link will be sent to your email', 'info', 4);
    // Implement forgot password logic here
  };

  // Scroll to top function for mobile
  const scrollToTop = () => {
    if (formRef.current) {
      formRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="login-account-container" ref={formRef}>
      {/* Mobile Scroll Indicator */}
      {isMobile && (
        <button 
          className="login-scroll-to-top-btn"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <FaArrowRight style={{ transform: 'rotate(-90deg)' }} />
        </button>
      )}
      
      {/* Success State */}
      {isSuccess ? (
        <div className="login-success-state">
          <div className="login-success-icon">
            <FaCheckCircle />
          </div>
          <h2>Login Successful!</h2>
          <p className="login-success-subtitle">Welcome back to HELPR Service Provider</p>
          <div className="login-success-details">
            <p><FaCheckCircle className="login-success-bullet" /> Redirecting to your dashboard</p>
            <p><FaCheckCircle className="login-success-bullet" /> Setting up your workspace</p>
          </div>
          <div className="login-loading">
            <div className="login-loading-spinner"></div>
            <span>Please wait...</span>
          </div>
        </div>
      ) : (
        <div className="login-account-form-wrapper">
          {/* Mobile Form Header */}
          {isMobile && (
            <div className="login-mobile-form-header">
              <button 
                className="login-mobile-back-btn"
                onClick={() => window.history.back()}
                aria-label="Go back"
              >
                <FaArrowRight style={{ transform: 'rotate(180deg)' }} />
              </button>
              <div className="login-mobile-header-text">
                <h1 className="login-mobile-form-title">Service Provider Login</h1>
                <p className="login-mobile-form-subtitle">Access your service account</p>
              </div>
            </div>
          )}

          {/* Form Header */}
          <div className="login-form-header">
            <div className="login-header-icon">
              <FaUserCircle />
            </div>
            <h1 className="login-form-title">
              Service Provider <span className="login-title-highlight">Login</span>
            </h1>
            <p className="login-form-subtitle">
              Sign in to manage your service account
            </p>
            <div className="login-form-header-underline">
              <div className="login-underline-bar"></div>
            </div>
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="login-account-form">
            {/* Email */}
            <div className={`login-input-group ${activeField === 'email' ? 'active' : ''}`}>
              <label className="login-input-label">
                <FaEnvelope className="login-label-icon" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`login-form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
                disabled={isLoading}
                autoComplete="email"
              />
              {errors.email && (
                <div className="login-error-message-container">
                  <FaExclamationTriangle className="login-error-icon" />
                  <span className="login-error-message">{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password */}
            <div className={`login-input-group ${activeField === 'password' ? 'active' : ''}`}>
              <label className="login-input-label">
                <FaLock className="login-label-icon" />
                Password
              </label>
              <div className="login-password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`login-form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button 
                  type="button"
                  className="login-password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <div className="login-error-message-container">
                  <FaExclamationTriangle className="login-error-icon" />
                  <span className="login-error-message">{errors.password}</span>
                </div>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="login-options">
              <label className="login-remember-me">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="login-remember-checkbox" 
                  disabled={isLoading} 
                />
                <span className="login-remember-text">Remember me</span>
              </label>
              
              <button 
                type="button"
                className="login-forgot-password"
                onClick={handleForgotPassword}
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <div className="login-submit-section">
              <button 
                type="submit" 
                className="login-submit-button"
                disabled={isLoading}
              >
                <span className="login-button-text">
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </span>
                <div className="login-button-icon">
                  <FaArrowRight />
                </div>
                <div className="login-button-glow"></div>
              </button>
              
              {isLoading && (
                <div className="login-loading-indicator">
                  <div className="login-loading-spinner-small"></div>
                  <span>Authenticating...</span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="login-divider">
              <span className="login-divider-text">or</span>
            </div>

            {/* Sign Up Link */}
            <div className="login-signup-section">
              <p className="login-signup-text">
                Don't have a service account? 
                <a href="/service-provider/create-account" className="login-signup-link">
                  Become a Service Provider
                </a>
              </p>
            </div>

            {/* Security Note */}
            <div className="login-security-note">
              <FaShieldAlt className="login-security-icon" />
              <span>Secure login with encrypted credentials</span>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Loginserviceaccount;