import './join.css';
import { ArrowRight, LogIn, UserPlus, Zap, Shield, Users, Sparkles } from 'lucide-react';

function Join() {
  const handleCreateAccount = () => {
    // Navigate to signup
    window.location.href = '/signup';
  };

  const handleLogin = () => {
    // Navigate to login
    window.location.href = '/login';
  };

  const handleGuestMode = () => {
    // Handle guest mode
    window.location.href = '/services';
  };

  return (
    <div className="helpr-join-cosmos">
      {/* Animated background elements */}
      <div className="helpr-join-orbit-1"></div>
      <div className="helpr-join-orbit-2"></div>
      <div className="helpr-join-orbit-3"></div>
      
      <div className="helpr-join-nebula">
        {/* Left side - Welcome section */}
        <div className="helpr-join-stellar">
          <div className="helpr-join-greeting">
            Welcome to HELPR
          </div>
          
          <h1 className="helpr-join-headline">
            Join Our <span className="helpr-join-headline-emphasis">Future</span> of Services
          </h1>
          
          <p className="helpr-join-subtitle">
            Connect with trusted professionals or find perfect solutions for your needs. 
            Experience seamless service delivery in a community built on trust and excellence.
          </p>
          
          <div className="helpr-join-features-grid">
            <div className="helpr-join-feature">
              <div className="helpr-join-feature-icon">
                <Zap size={14} />
              </div>
              <span className="helpr-join-feature-text">Instant Matching</span>
            </div>
            
            <div className="helpr-join-feature">
              <div className="helpr-join-feature-icon">
                <Shield size={14} />
              </div>
              <span className="helpr-join-feature-text">Verified Professionals</span>
            </div>
            
            <div className="helpr-join-feature">
              <div className="helpr-join-feature-icon">
                <Users size={14} />
              </div>
              <span className="helpr-join-feature-text">Community Driven</span>
            </div>
            
            <div className="helpr-join-feature">
              <div className="helpr-join-feature-icon">
                <Sparkles size={14} />
              </div>
              <span className="helpr-join-feature-text">Smart Solutions</span>
            </div>
          </div>
          
          {/* Testimonial */}
          <div className="helpr-join-testimonial">
            <p className="helpr-join-quote">
              "HELPR transformed how I find services. The quality and professionalism are unmatched. 
              It's like having a trusted friend for every need."
            </p>
            <div className="helpr-join-quote-author">
              <div className="helpr-join-author-avatar">
                AS
              </div>
              <div className="helpr-join-author-info">
                <div className="helpr-join-author-name">Alex Sterling</div>
                <div className="helpr-join-author-role">Member since 2023</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Interactive panel */}
        <div className="helpr-join-portal">
          <h2 className="helpr-join-portal-title">Begin Your Journey</h2>
          <p className="helpr-join-portal-subtitle">
            Choose how you'd like to experience HELPR
          </p>
          
          <div className="helpr-join-cta-buttons">
            <button 
              onClick={handleCreateAccount}
              className="helpr-join-btn-primary"
            >
              <UserPlus className="helpr-join-btn-icon" />
              Create New Account
              <ArrowRight className="helpr-join-btn-icon" />
            </button>
            
            <button 
              onClick={handleLogin}
              className="helpr-join-btn-secondary"
            >
              <LogIn className="helpr-join-btn-icon" />
              Sign In to Your Account
              <ArrowRight className="helpr-join-btn-icon" />
            </button>
          </div>
          
          <div className="helpr-join-divider">
            <span className="helpr-join-divider-text">or continue as</span>
          </div>
          
          <div className="helpr-join-guest-option">
            <button 
              onClick={handleGuestMode}
              className="helpr-join-guest-btn"
            >
              Explore as Guest
              <ArrowRight size={16} />
            </button>
            <p style={{ fontSize: '13px', color: '#718096', marginTop: '8px' }}>
              Browse services without creating an account
            </p>
          </div>
          
          {/* Additional info */}
          <div style={{ 
            marginTop: '40px', 
            paddingTop: '24px', 
            borderTop: '1px solid #e2e8f0',
            fontSize: '13px',
            color: '#718096',
            textAlign: 'center'
          }}>
            <p>
              By joining, you agree to our Terms of Service and Privacy Policy. 
              Your journey to better services starts here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Join;