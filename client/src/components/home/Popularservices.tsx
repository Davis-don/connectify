import React, { useEffect, useState } from 'react';
import './popularservices.css';

function Popularservices() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [services] = useState([
    {
      id: 1,
      title: "Home Repair & Maintenance",
      icon: "🏠",
      description: "From fixing leaks to electrical work, get your home in perfect shape",
      category: "household",
      color: "#FF6B35",
      delay: 0.1,
      features: ["Fast Response", "Quality Work", "Affordable"]
    },
    {
      id: 2,
      title: "Tech Support & Setup",
      icon: "💻",
      description: "Computer troubleshooting, network setup, and smart home installation",
      category: "tech",
      color: "#4A90E2",
      delay: 0.2,
      features: ["Expert Help", "Remote Support", "Quick Fix"]
    },
    {
      id: 3,
      title: "Auto Care Services",
      icon: "🚗",
      description: "Vehicle maintenance, repairs, and detailing services at your location",
      category: "auto",
      color: "#FFA62B",
      delay: 0.3,
      features: ["Mobile Service", "Quality Parts", "Warranty"]
    },
    {
      id: 4,
      title: "Professional Cleaning",
      icon: "✨",
      description: "Deep cleaning, regular maintenance, and post-construction cleanup",
      category: "cleaning",
      color: "#7B68EE",
      delay: 0.4,
      features: ["Eco-friendly", "Deep Clean", "Flexible"]
    },
    {
      id: 5,
      title: "Personal Fitness Training",
      icon: "💪",
      description: "Custom workout plans, nutrition guidance, and wellness coaching",
      category: "fitness",
      color: "#43E97B",
      delay: 0.5,
      features: ["Custom Plans", "Online Sessions", "Progress Tracking"]
    },
    {
      id: 6,
      title: "Creative Services",
      icon: "🎨",
      description: "Photography, graphic design, and content creation services",
      category: "creative",
      color: "#FF6B9D",
      delay: 0.6,
      features: ["Creative Vision", "Fast Delivery", "Revisions"]
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleCardHover = (id: number | null) => {
    setActiveCard(id);
  };

  const handleCardClick = (category: string) => {
    console.log(`Category clicked: ${category}`);
    // You can add navigation or modal opening here if needed
  };

  return (
    <div 
      className={`helpr-services-container ${isVisible ? 'helpr-services-visible' : ''}`}
      ref={(el) => {
        if (el && isVisible) {
          // Add staggered animation for each child
          const cards = el.querySelectorAll('.helpr-service-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('helpr-card-animated');
            }, index * 100);
          });
        }
      }}
    >
      {/* Animated Background Elements */}
      <div className="helpr-services-bg">
        <div className="helpr-bg-gradient"></div>
        <div className="helpr-bg-blob helpr-blob-1"></div>
        <div className="helpr-bg-blob helpr-blob-2"></div>
        <div className="helpr-bg-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="helpr-particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}></div>
          ))}
        </div>
      </div>

      {/* Content Wrapper */}
      <div className="helpr-services-content">
        {/* Header */}
        <div className="helpr-services-header">
          <div className="helpr-header-badge">
            <span className="helpr-badge-dot"></span>
            <span className="helpr-badge-text">Featured Services</span>
          </div>
          
          <h2 className="helpr-services-title">
            <span className="helpr-title-line helpr-title-line-1">
              Discover Amazing
            </span>
            <span className="helpr-title-line helpr-title-line-2">
              Local Services
            </span>
          </h2>
          
          <p className="helpr-services-subtitle">
            Explore our most popular service categories. Find trusted professionals 
            for all your needs, from home repairs to creative projects.
          </p>
        </div>

        {/* Services Grid */}
        <div className="helpr-services-grid">
          {services.map((service) => (
            <div
              key={service.id}
              className={`helpr-service-card ${activeCard === service.id ? 'helpr-card-active' : ''}`}
              onMouseEnter={() => handleCardHover(service.id)}
              onMouseLeave={() => handleCardHover(null)}
              onClick={() => handleCardClick(service.category)}
              style={{ '--card-color': service.color } as React.CSSProperties}
            >
              {/* Card Glow Effect */}
              <div className="helpr-card-glow"></div>
              
              {/* Card Content */}
              <div className="helpr-card-content">
                {/* Icon with animation */}
                <div className="helpr-card-icon-wrapper">
                  <div className="helpr-card-icon-circle" style={{ background: service.color }}>
                    <span className="helpr-card-icon">{service.icon}</span>
                  </div>
                  <div className="helpr-card-pulse"></div>
                </div>

                {/* Title with animation */}
                <h3 className="helpr-card-title">
                  {service.title.split('').map((char, index) => (
                    <span 
                      key={index} 
                      className="helpr-card-char"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {char}
                    </span>
                  ))}
                </h3>

                {/* Description with fade-in */}
                <p className="helpr-card-description">
                  {service.description}
                </p>

                {/* Features List */}
                <div className="helpr-card-features">
                  {service.features.map((feature, index) => (
                    <div 
                      key={index} 
                      className="helpr-card-feature"
                      style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                    >
                      <span className="helpr-feature-dot"></span>
                      <span className="helpr-feature-text">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Interactive CTA */}
                <button className="helpr-card-cta">
                  <span className="helpr-cta-text">Explore Services</span>
                  <div className="helpr-cta-arrow">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4.16669 10H15.8334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M10.8334 5L15.8334 10L10.8334 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
              </div>

              {/* Card Background Pattern */}
              <div className="helpr-card-pattern"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="helpr-services-bottom">
          <p className="helpr-bottom-text">
            Need something specific? We have hundreds of other services available.
          </p>
          <button className="helpr-bottom-cta">
            <span className="helpr-bottom-cta-text">Browse All Categories</span>
            <div className="helpr-bottom-cta-icon">
              <span className="helpr-cta-chevron">›</span>
              <span className="helpr-cta-chevron">›</span>
              <span className="helpr-cta-chevron">›</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popularservices;