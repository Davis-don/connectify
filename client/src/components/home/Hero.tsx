import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './hero.css';

function Hero() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [_typedText, setTypedText] = useState('');
  const [activeService, setActiveService] = useState(0);
  const fullText = "Helpr Marketplace";

  const services = [
    {
      icon: "🔧",
      title: "Home Repair",
      tag: "Fast & Reliable",
      color: "#FF6B35"
    },
    {
      icon: "💻",
      title: "Tech Support",
      tag: "Expert Help",
      color: "#4A90E2"
    },
    {
      icon: "🚗",
      title: "Auto Care",
      tag: "Mobile Service",
      color: "#FFA62B"
    },
    {
      icon: "✨",
      title: "Cleaning",
      tag: "Eco-friendly",
      color: "#7B68EE"
    },
    {
      icon: "💪",
      title: "Fitness",
      tag: "Personal Training",
      color: "#43E97B"
    },
    {
      icon: "📸",
      title: "Photography",
      tag: "Creative Vision",
      color: "#FF6B9D"
    }
  ];

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
    
    // Typewriter effect
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.substring(0, index));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 80);

    // Rotate active service
    const rotateInterval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length);
    }, 2500);

    return () => {
      clearInterval(typeInterval);
      clearInterval(rotateInterval);
    };
  }, []);

  const handleFindService = () => {
    navigate('/services');
  };

  const handleOfferService = () => {
    navigate('/join');
  };

  return (
    <div className={`helpr-hero-container ${isVisible ? 'helpr-hero-visible' : ''}`}>
      
      {/* Animated Background */}
      <div className="helpr-hero-background">
        <div className="helpr-hero-gradient"></div>
        <div className="helpr-hero-particles">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="helpr-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
        <div className="helpr-hero-orb helpr-orb-1"></div>
        <div className="helpr-hero-orb helpr-orb-2"></div>
        <div className="helpr-hero-orb helpr-orb-3"></div>
      </div>

      <div className="helpr-hero-content">
        
        {/* Left Column - Text Content */}
        <div className="helpr-hero-left">
          
          {/* Animated Badge */}
          <div className="helpr-hero-badge">
            <span className="helpr-badge-dot"></span>
            <span className="helpr-badge-text">Connecting Communities Since 2024</span>
          </div>

          {/* Main Title with Typewriter */}
          <h1 className="helpr-hero-title">
            <span className="helpr-title-line helpr-title-line-1">
              Where Local Skills
            </span>
            <span className="helpr-title-line helpr-title-line-2">
              Meet <span className="helpr-title-highlight">Local Needs</span>
            </span>
          </h1>

          {/* Dynamic Tagline */}
          <p className="helpr-hero-tagline">
            Discover trusted professionals for every task. 
            From home repairs to creative projects, we connect you with skilled locals ready to help.
          </p>

          {/* Interactive Service Rotator */}
          <div className="helpr-service-rotator">
            <div className="helpr-rotator-label">Popular Services:</div>
            <div className="helpr-rotator-display">
              {services.map((service, index) => (
                <div 
                  key={index}
                  className={`helpr-rotator-item ${index === activeService ? 'helpr-rotator-active' : ''}`}
                  style={{ '--service-color': service.color } as React.CSSProperties}
                >
                  <span className="helpr-rotator-icon">{service.icon}</span>
                  <span className="helpr-rotator-title">{service.title}</span>
                  <span className="helpr-rotator-tag">{service.tag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats with Animation */}
          <div className="helpr-hero-stats">
            <div className="helpr-stat">
              <div className="helpr-stat-number" data-count="5000">0</div>
              <div className="helpr-stat-label">Active Services</div>
            </div>
            <div className="helpr-stat">
              <div className="helpr-stat-number" data-count="98">0</div>
              <div className="helpr-stat-label">Satisfaction Rate</div>
            </div>
            <div className="helpr-stat">
              <div className="helpr-stat-number" data-count="24">0</div>
              <div className="helpr-stat-label">Hour Response</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="helpr-hero-actions">
            <button 
              className="helpr-action-btn helpr-action-primary"
              onClick={handleFindService}
            >
              <span className="helpr-btn-content">
                <span className="helpr-btn-icon">🔍</span>
                <span className="helpr-btn-text">Find Services</span>
              </span>
              <div className="helpr-btn-ripple"></div>
            </button>
            
            <button 
              className="helpr-action-btn helpr-action-secondary"
              onClick={handleOfferService}
            >
              <span className="helpr-btn-content">
                <span className="helpr-btn-icon">⚡</span>
                <span className="helpr-btn-text">Offer Skills</span>
              </span>
              <div className="helpr-btn-ripple"></div>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="helpr-trust-indicators">
            <div className="helpr-trust-text">Trusted by thousands of users</div>
            <div className="helpr-trust-avatars">
              <div className="helpr-avatar">👨‍🔧</div>
              <div className="helpr-avatar">👩‍💻</div>
              <div className="helpr-avatar">👨‍🎨</div>
              <div className="helpr-avatar">👩‍🍳</div>
              <div className="helpr-avatar helpr-avatar-more">+128</div>
            </div>
          </div>
        </div>

        {/* Right Column - Visual Elements */}
        <div className="helpr-hero-right">
          
          {/* Floating Service Cards */}
          <div className="helpr-floating-cards">
            {services.map((service, index) => (
              <div 
                key={index}
                className={`helpr-floating-card helpr-card-${index + 1}`}
                style={{ '--card-color': service.color } as React.CSSProperties}
                onMouseEnter={() => setActiveService(index)}
              >
                <div className="helpr-card-glow"></div>
                <div className="helpr-card-content">
                  <div className="helpr-card-icon">{service.icon}</div>
                  <h3 className="helpr-card-title">{service.title}</h3>
                  <p className="helpr-card-tag">{service.tag}</p>
                  <div className="helpr-card-dots">
                    <span className="helpr-dot"></span>
                    <span className="helpr-dot"></span>
                    <span className="helpr-dot"></span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Animated Connector Lines */}
          <div className="helpr-connector-lines">
            <svg width="100%" height="100%" viewBox="0 0 400 400">
              <path 
                className="helpr-line helpr-line-1" 
                d="M50,100 C150,50 250,150 350,100"
                stroke="url(#gradient1)"
              />
              <path 
                className="helpr-line helpr-line-2" 
                d="M100,200 C200,150 300,250 350,200"
                stroke="url(#gradient2)"
              />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#FFA62B" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4A90E2" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#7B68EE" stopOpacity="0.5" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Floating Elements */}
          <div className="helpr-floating-elements">
            <div className="helpr-floating-element helpr-floating-1">
              <span className="helpr-floating-icon">⭐</span>
              <span className="helpr-floating-text">Top Rated</span>
            </div>
            <div className="helpr-floating-element helpr-floating-2">
              <span className="helpr-floating-icon">⚡</span>
              <span className="helpr-floating-text">Fast Response</span>
            </div>
            <div className="helpr-floating-element helpr-floating-3">
              <span className="helpr-floating-icon">🛡️</span>
              <span className="helpr-floating-text">Verified Pros</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;