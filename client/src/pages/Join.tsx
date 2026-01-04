import { useState, useEffect, useRef } from 'react';
import Createserviceaccount from "../components/Createserviceaccount/Createserviceaccount";
import Loginserviceaccount from "../components/Loginserviceaccount/Loginserviceaccount";
import './join.css';
import { FaSignInAlt, FaUserPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Use const objects + type aliases to avoid 'enum' syntax with erasableSyntaxOnly
const FormType = {
  LOGIN: 'login',
  CREATE: 'create'
} as const;
type FormType = typeof FormType[keyof typeof FormType];

const AnimationState = {
  ENTER: 'enter',
  ACTIVE: 'active',
  EXIT: 'exit'
} as const;
type AnimationState = typeof AnimationState[keyof typeof AnimationState];

interface WelcomeText {
  title: string;
  subtitle: string;
}

function Join() {
  const [activeForm, setActiveForm] = useState<FormType>(FormType.LOGIN);
  const [textAnimation, setTextAnimation] = useState<AnimationState>(AnimationState.ENTER);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const textRef = useRef<HTMLHeadingElement>(null);
  const formsContainerRef = useRef<HTMLDivElement>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const welcomeTexts: Record<FormType, WelcomeText> = {
    [FormType.LOGIN]: {
      title: "Welcome Back",
      subtitle: "Sign in to continue your journey with HELPR"
    },
    [FormType.CREATE]: {
      title: "Join HELPR",
      subtitle: "Create your account and unlock amazing possibilities"
    }
  };

  useEffect(() => {
    // Initial animation
    const timer = setTimeout(() => {
      setTextAnimation(AnimationState.ACTIVE);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const switchForm = (formType: FormType) => {
    if (formType === activeForm) return;
    
    // Scroll to top of forms container when switching
    if (formsContainerRef.current) {
      formsContainerRef.current.scrollTop = 0;
    }
    
    // Close mobile menu if open
    if (showMobileMenu) {
      setShowMobileMenu(false);
    }
    
    setTextAnimation(AnimationState.EXIT);
    
    setTimeout(() => {
      setActiveForm(formType);
      setTimeout(() => {
        setTextAnimation(AnimationState.ENTER);
        setTimeout(() => setTextAnimation(AnimationState.ACTIVE), 50);
      }, 50);
    }, 300);
  };

  const currentText = welcomeTexts[activeForm];

  return (
    <div className="join-page">
      {/* Mobile Navigation */}
      {isMobile && (
        <div className="mobile-navigation">
          <button 
            className="mobile-menu-toggle"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label={showMobileMenu ? "Close menu" : "Open menu"}
          >
            <div className={`menu-icon ${showMobileMenu ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="menu-text">Menu</span>
          </button>
          
          <div className="mobile-brand">
            <span className="brand-text">HELPR</span>
            <div className="brand-dot"></div>
          </div>
          
          {showMobileMenu && (
            <div className="mobile-menu-overlay" onClick={() => setShowMobileMenu(false)}>
              <div className="mobile-menu-content" onClick={e => e.stopPropagation()}>
                <div className="mobile-menu-header">
                  <div className="mobile-brand-large">
                    <span className="brand-text-large">HELPR</span>
                    <div className="brand-underline-mobile"></div>
                  </div>
                  <button 
                    className="mobile-menu-close"
                    onClick={() => setShowMobileMenu(false)}
                    aria-label="Close menu"
                  >
                    <FaChevronLeft />
                  </button>
                </div>
                
                <div className="mobile-form-tabs">
                  <button 
                    className={`mobile-tab-btn ${activeForm === FormType.LOGIN ? 'active' : ''}`}
                    onClick={() => switchForm(FormType.LOGIN)}
                    type="button"
                  >
                    <FaSignInAlt className="mobile-tab-icon" />
                    <span>Sign In</span>
                  </button>
                  
                  <button 
                    className={`mobile-tab-btn ${activeForm === FormType.CREATE ? 'active' : ''}`}
                    onClick={() => switchForm(FormType.CREATE)}
                    type="button"
                  >
                    <FaUserPlus className="mobile-tab-icon" />
                    <span>Create Account</span>
                  </button>
                </div>
                
                <div className="mobile-features">
                  <h3>Why Choose HELPR?</h3>
                  <div className="mobile-features-list">
                    <div className="mobile-feature-item">
                      <div className="mobile-feature-icon">✨</div>
                      <span>Smart task management</span>
                    </div>
                    <div className="mobile-feature-item">
                      <div className="mobile-feature-icon">⚡</div>
                      <span>Lightning fast responses</span>
                    </div>
                    <div className="mobile-feature-item">
                      <div className="mobile-feature-icon">🔒</div>
                      <span>Enterprise-grade security</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Mobile Hero Section */}
      {isMobile && (
        <div className="mobile-hero">
          <div className="mobile-hero-content">
            <h1 className="mobile-hero-title">
              {currentText.title}
            </h1>
            <p className="mobile-hero-subtitle">
              {currentText.subtitle}
            </p>
            <div className="mobile-form-indicator">
              <div className="form-indicator-dots">
                <div className={`indicator-dot ${activeForm === FormType.LOGIN ? 'active' : ''}`}></div>
                <div className={`indicator-dot ${activeForm === FormType.CREATE ? 'active' : ''}`}></div>
              </div>
              <span className="form-indicator-text">
                {activeForm === FormType.LOGIN ? 'Sign In Form' : 'Create Account Form'}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop Layout */}
      {!isMobile && (
        <div className="join-container">
          {/* Animated Background Elements */}
          <div className="bg-elements">
            <div className="bg-circle bg-circle-1"></div>
            <div className="bg-circle bg-circle-2"></div>
            <div className="bg-circle bg-circle-3"></div>
            <div className="bg-gradient"></div>
          </div>
          
          {/* Left Panel - Branding & Welcome */}
          <div className="join-left-panel">
            <div className="brand-section">
              <div className="brand-logo">
                <span className="brand-text">HELPR</span>
                <div className="brand-underline">
                  <div className="underline-bar"></div>
                  <div className="underline-glow"></div>
                </div>
              </div>
              <div className="tagline">
                Your intelligent assistant for every task
              </div>
            </div>
            
            <div className="welcome-section">
              <div className="welcome-text-container">
                <h1 ref={textRef} className={`welcome-title ${textAnimation}`}>
                  {currentText.title}
                </h1>
                <p className={`welcome-subtitle ${textAnimation}`}>
                  {currentText.subtitle}
                </p>
              </div>
              
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon">✨</div>
                  <div className="feature-content">
                    <span className="feature-title">Smart Task Management</span>
                    <span className="feature-desc">Organize and prioritize efficiently</span>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">⚡</div>
                  <div className="feature-content">
                    <span className="feature-title">Lightning Fast</span>
                    <span className="feature-desc">Instant responses and actions</span>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔒</div>
                  <div className="feature-content">
                    <span className="feature-title">Secure & Private</span>
                    <span className="feature-desc">Enterprise-grade protection</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Desktop Form Toggle */}
            <div className="desktop-form-toggle">
              <div className="toggle-buttons">
                <button 
                  className={`toggle-btn ${activeForm === FormType.LOGIN ? 'active' : ''}`}
                  onClick={() => switchForm(FormType.LOGIN)}
                  type="button"
                >
                  <FaSignInAlt className="toggle-icon" />
                  <span>Sign In</span>
                </button>
                <button 
                  className={`toggle-btn ${activeForm === FormType.CREATE ? 'active' : ''}`}
                  onClick={() => switchForm(FormType.CREATE)}
                  type="button"
                >
                  <FaUserPlus className="toggle-icon" />
                  <span>Create Account</span>
                </button>
              </div>
              <div className="toggle-indicator-container">
                <div className={`toggle-indicator ${activeForm === FormType.CREATE ? 'right' : 'left'}`}></div>
              </div>
            </div>
          </div>
          
          {/* Right Panel - Forms */}
          <div className="join-right-panel">
            <div className="form-card">
              {/* Desktop Form Tabs */}
              <div className="form-tabs">
                <button 
                  className={`tab-btn ${activeForm === FormType.LOGIN ? 'active' : ''}`}
                  onClick={() => switchForm(FormType.LOGIN)}
                  type="button"
                >
                  <span className="tab-icon">🔐</span>
                  <span>Sign In</span>
                  {activeForm === FormType.LOGIN && <div className="tab-indicator"></div>}
                </button>
                
                <div className="tab-divider">
                  <span>or</span>
                </div>
                
                <button 
                  className={`tab-btn ${activeForm === FormType.CREATE ? 'active' : ''}`}
                  onClick={() => switchForm(FormType.CREATE)}
                  type="button"
                >
                  <span className="tab-icon">🚀</span>
                  <span>Create Account</span>
                  {activeForm === FormType.CREATE && <div className="tab-indicator"></div>}
                </button>
              </div>
              
              {/* Forms Container with Scroll */}
              <div className="forms-scroll-container" ref={formsContainerRef}>
                <div className="forms-container">
                  <div className={`form-wrapper ${activeForm === FormType.LOGIN ? 'login-active' : ''}`}>
                    <div className="form-content">
                      <Loginserviceaccount />
                    </div>
                    <div className="form-footer">
                      <span>Don't have an account? </span>
                      <button 
                        className="switch-btn"
                        onClick={() => switchForm(FormType.CREATE)}
                        type="button"
                      >
                        Create one
                      </button>
                    </div>
                  </div>
                  
                  <div className={`form-wrapper ${activeForm === FormType.CREATE ? 'create-active' : ''}`}>
                    <div className="form-content">
                      <Createserviceaccount />
                    </div>
                    <div className="form-footer">
                      <span>Already have an account? </span>
                      <button 
                        className="switch-btn"
                        onClick={() => switchForm(FormType.LOGIN)}
                        type="button"
                      >
                        Sign in
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Scroll Indicator */}
              <div className="scroll-indicator">
                <div className="indicator-dot"></div>
                <span>Scroll to see more</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Form Container */}
      {isMobile && (
        <div className="mobile-form-container" ref={formsContainerRef}>
          <div className="mobile-forms-wrapper">
            <div className={`mobile-form-wrapper ${activeForm === FormType.LOGIN ? 'active' : ''}`}>
              <div className="mobile-form-content">
                <Loginserviceaccount />
              </div>
              <div className="mobile-form-switch">
                <span>Don't have an account? </span>
                <button 
                  className="mobile-switch-btn"
                  onClick={() => switchForm(FormType.CREATE)}
                  type="button"
                >
                  Create one
                </button>
              </div>
            </div>
            
            <div className={`mobile-form-wrapper ${activeForm === FormType.CREATE ? 'active' : ''}`}>
              <div className="mobile-form-content">
                <Createserviceaccount />
              </div>
              <div className="mobile-form-switch">
                <span>Already have an account? </span>
                <button 
                  className="mobile-switch-btn"
                  onClick={() => switchForm(FormType.LOGIN)}
                  type="button"
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Quick Switch */}
          <div className="mobile-quick-switch">
            <button 
              className="quick-switch-btn"
              onClick={() => switchForm(activeForm === FormType.LOGIN ? FormType.CREATE : FormType.LOGIN)}
              type="button"
            >
              <span className="quick-switch-text">
                {activeForm === FormType.LOGIN ? 'Need an account?' : 'Already have an account?'}
              </span>
              <FaChevronRight className="quick-switch-icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Join;