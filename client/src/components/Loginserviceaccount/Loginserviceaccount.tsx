import './loginserviceaccount.css';
import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
import { useTokenStore } from '../../../store/tokenStore';

interface LoginData {
  email: string;
  password: string;
}

interface TokenResponse {
  refresh: string;
  access: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

interface ApiErrorResponse {
  detail?: string;
  message?: string;
  email?: string[];
  password?: string[];
  non_field_errors?: string[];
}

function Loginserviceaccount() {
  const showToast = useToast(state => state.showToast);
  const { setTokens } = useTokenStore();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [redirectTimer, setRedirectTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
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
      const handleFocus = (e: Event) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          const fieldName = target.getAttribute('name');
          if (fieldName) {
            setActiveField(fieldName);
          }
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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const apiUrl = import.meta.env.VITE_API_URL;

  // Helper function to get dashboard path based on role
  const getDashboardPath = (role: string): string => {
    switch (role) {
      case 'service_provider':
        return '/service-provider/dashboard';
      case 'client':
        return '/client/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/unauthorized';
    }
  };

  // Helper function to get personalized welcome message
    const getWelcomeMessage = (role: string, firstName: string): string => {
      const roleTitles: Record<string, string> = {
        service_provider: 'Service Provider',
        client: 'Client',
        admin: 'Administrator'
      };
      
      const title = roleTitles[role] || 'User';
      return `Welcome back, ${firstName} — ${title}`;
    };

  // Login mutation
  const loginMutation = useMutation<
    TokenResponse,
    Error,
    LoginData
  >({
    mutationFn: async (data: LoginData): Promise<TokenResponse> => {
      const response = await fetch(
        `${apiUrl}/users/auth/token/`,
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

      const result: ApiErrorResponse & TokenResponse = await response.json();

      if (!response.ok) {
        let errorMessage = 'Login failed';
        
        if (result.detail) {
          errorMessage = result.detail;
        } else if (result.non_field_errors && result.non_field_errors.length > 0) {
          errorMessage = result.non_field_errors[0];
        } else if (result.message) {
          errorMessage = result.message;
        } else if (result.email && result.email.length > 0) {
          errorMessage = result.email[0];
        } else if (result.password && result.password.length > 0) {
          errorMessage = result.password[0];
        }
        
        throw new Error(errorMessage);
      }

      // Type guard to ensure we have all required fields
      if (!result.access || !result.refresh || !result.email || !result.role || !result.first_name || !result.last_name) {
        throw new Error('Invalid response from server');
      }

      return {
        refresh: result.refresh,
        access: result.access,
        email: result.email,
        role: result.role,
        first_name: result.first_name,
        last_name: result.last_name
      };
    },

    onMutate: () => {
      setIsLoading(true);
      showToast('Logging in...', 'info', 3);
    },

    onSuccess: (data) => {
      setIsLoading(false);
      setIsSuccess(true);
      
      // Store all user data in Zustand store
      setTokens({
        refresh: data.refresh,
        access: data.access,
        role: data.role,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
      });
      
      // Store role and name for UI display
      setUserRole(data.role);
      setUserName(`${data.first_name} ${data.last_name}`);
      
      // Show personalized welcome message
      const welcomeMessage = getWelcomeMessage(data.role, data.first_name);
      showToast(welcomeMessage, 'success', 3);
      
      // Get dashboard path based on role
      const dashboardPath = getDashboardPath(data.role);
      
      // Wait for toast to finish before navigating (3 seconds + 500ms buffer)
      const timer = setTimeout(() => {
        navigate(dashboardPath);
        setIsSuccess(false);
      }, 3500); // 3.5 seconds (3 sec toast + 500ms buffer)

      setRedirectTimer(timer);
    },

    onError: (error: Error) => {
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Prepare data for submission
      const submitData: LoginData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

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

  // Handle manual navigation to dashboard based on role
  const handleNavigateToDashboard = () => {
    if (redirectTimer) {
      clearTimeout(redirectTimer);
    }
    // Navigate based on stored role
    const dashboardPath = getDashboardPath(userRole);
    navigate(dashboardPath);
    setIsSuccess(false);
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
          <p className="login-success-subtitle">Welcome back, {userName}!</p>
          <div className="login-success-details">
            <p><FaCheckCircle className="login-success-bullet" /> Role: {userRole === 'service_provider' ? 'Service Provider' : 
                   userRole === 'client' ? 'Client' : 
                   userRole === 'admin' ? 'Administrator' : userRole}</p>
            <p><FaCheckCircle className="login-success-bullet" /> Redirecting to your dashboard</p>
            <p><FaCheckCircle className="login-success-bullet" /> Setting up your workspace...</p>
          </div>
          <div className="login-loading">
            <div className="login-loading-spinner"></div>
            <span>Please wait, redirecting in a few seconds...</span>
          </div>
          <div className="success-actions">
            <button 
              className="dashboard-btn"
              onClick={handleNavigateToDashboard}
            >
              Go to Dashboard Now
            </button>
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

            {/* Forgot Password */}
            <div className="login-options">
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