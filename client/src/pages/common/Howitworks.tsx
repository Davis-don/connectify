import { useEffect, useRef } from 'react';
import './howitworkspage.css';

function HowItWorksPage() {
  return (
    <div className="howitworks-page-container">
      <MarketplaceHero />
      <ProviderJourney />
      <SeekerJourney />
      <PlatformFeatures />
      <RegistrationSteps />
      <SearchAndBook />
      {/* <SuccessStories /> */}
      <GetStartedCTA />
    </div>
  );
}

/* ===== MARKETPLACE HERO ===== */
function MarketplaceHero() {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('marketplace-hero-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="marketplace-hero-section" ref={heroRef}>
      <div className="marketplace-hero-backdrop"></div>
      <div className="marketplace-hero-content">
        <span className="marketplace-hero-badge">Two-Sided Marketplace</span>
        <h1 className="marketplace-hero-title">
          Connect with Perfect Service
          <span className="marketplace-hero-highlight"> Providers & Clients</span>
        </h1>
        <p className="marketplace-hero-subtitle">
          Whether you're offering services or looking for skilled professionals, 
          our platform makes the connection seamless, secure, and rewarding.
        </p>
        {/* <div className="marketplace-hero-stats">
          <div className="marketplace-hero-stat">
            <span className="marketplace-hero-stat-number">10K+</span>
            <span className="marketplace-hero-stat-label">Service Providers</span>
          </div>
          <div className="marketplace-hero-stat">
            <span className="marketplace-hero-stat-number">50K+</span>
            <span className="marketplace-hero-stat-label">Projects Completed</span>
          </div>
          <div className="marketplace-hero-stat">
            <span className="marketplace-hero-stat-number">98%</span>
            <span className="marketplace-hero-stat-label">Satisfaction Rate</span>
          </div>
        </div> */}
      </div>
      <div className="marketplace-hero-visual">
        <div className="marketplace-hero-visual-element">
          <div className="marketplace-provider-card">
            <div className="marketplace-card-icon">👨‍💼</div>
            <span className="marketplace-card-label">Service Provider</span>
          </div>
          <div className="marketplace-connection-line"></div>
          <div className="marketplace-seeker-card">
            <div className="marketplace-card-icon">👥</div>
            <span className="marketplace-card-label">Service Seeker</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== PROVIDER JOURNEY ===== */
function ProviderJourney() {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('provider-step-visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    stepRefs.current.forEach(step => {
      if (step) observer.observe(step);
    });

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      id: 1,
      title: "Create Provider Account",
      description: "Sign up as a service provider and verify your credentials to build trust.",
      icon: "📝",
      color: "#4A90E2",
      details: ["Email verification", "Profile completion", "ID verification"]
    },
    {
      id: 2,
      title: "Register Your Services",
      description: "List your services with detailed descriptions, pricing, and special offers.",
      icon: "🏷️",
      color: "#FF6B35",
      details: ["Service categories", "Pricing packages", "Special offers"]
    },
    {
      id: 3,
      title: "Add Location & Media",
      description: "Set your service area and showcase your work with 2-3 high-quality images.",
      icon: "📍",
      color: "#00C896",
      details: ["Service location", "Portfolio images", "Work samples"]
    },
    {
      id: 4,
      title: "Get Discovered & Booked",
      description: "Appear in search results and start receiving booking requests.",
      icon: "📞",
      color: "#7B68EE",
      details: ["Search optimization", "Booking management", "Payment setup"]
    }
  ];

  return (
    <section className="provider-journey-section">
      <div className="provider-journey-header">
        <div className="provider-journey-header-icon">👨‍💼</div>
        <h2 className="provider-journey-title">For Service Providers</h2>
        <p className="provider-journey-subtitle">
          Turn your skills into income. List your services and connect with clients who need your expertise.
        </p>
      </div>
      
      <div className="provider-journey-steps">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            ref={el => { stepRefs.current[index] = el; }}
            className="provider-step"
            style={{ '--step-color': step.color } as React.CSSProperties}
          >
            <div className="provider-step-number">{step.id}</div>
            <div className="provider-step-content">
              <div className="provider-step-icon">{step.icon}</div>
              <h3 className="provider-step-title">{step.title}</h3>
              <p className="provider-step-description">{step.description}</p>
              <div className="provider-step-details">
                {step.details.map((detail, idx) => (
                  <span key={idx} className="provider-step-detail-item">
                    <span className="provider-step-detail-icon">✓</span>
                    {detail}
                  </span>
                ))}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="provider-step-connector">
                <span className="provider-step-arrow">↓</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===== SEEKER JOURNEY ===== */
function SeekerJourney() {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('seeker-step-visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    stepRefs.current.forEach(step => {
      if (step) observer.observe(step);
    });

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      id: 1,
      title: "Search by Location & Service",
      description: "Enter your location and the type of service you need to find local providers.",
      icon: "🔍",
      color: "#4A90E2",
      filters: ["Location radius", "Service category", "Availability"]
    },
    {
      id: 2,
      title: "Compare & Filter Results",
      description: "Browse through verified providers, compare prices, ratings, and portfolios.",
      icon: "⚖️",
      color: "#FF6B35",
      filters: ["Price range", "Ratings", "Experience level"]
    },
    {
      id: 3,
      title: "View Provider Details",
      description: "Check detailed profiles, work samples, and client reviews before choosing.",
      icon: "📋",
      color: "#00C896",
      filters: ["Portfolio images", "Client reviews", "Response time"]
    },
    {
      id: 4,
      title: "Book & Pay Securely",
      description: "Select your preferred provider and book their service with secure payment.",
      icon: "💳",
      color: "#7B68EE",
      filters: ["Booking calendar", "Secure payment", "Service agreement"]
    }
  ];

  return (
    <section className="seeker-journey-section">
      <div className="seeker-journey-header">
        <div className="seeker-journey-header-icon">👥</div>
        <h2 className="seeker-journey-title">For Service Seekers</h2>
        <p className="seeker-journey-subtitle">
          Find trusted professionals for any service you need, with transparent pricing and verified reviews.
        </p>
      </div>
      
      <div className="seeker-journey-steps">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            ref={el => { stepRefs.current[index] = el; }}
            className="seeker-step"
            style={{ '--step-color': step.color } as React.CSSProperties}
          >
            <div className="seeker-step-number">{step.id}</div>
            <div className="seeker-step-content">
              <div className="seeker-step-icon">{step.icon}</div>
              <h3 className="seeker-step-title">{step.title}</h3>
              <p className="seeker-step-description">{step.description}</p>
              <div className="seeker-step-filters">
                {step.filters.map((filter, idx) => (
                  <span key={idx} className="seeker-step-filter-item">
                    <span className="seeker-step-filter-icon">🔎</span>
                    {filter}
                  </span>
                ))}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="seeker-step-connector">
                <span className="seeker-step-arrow">→</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===== PLATFORM FEATURES ===== */
function PlatformFeatures() {
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('platform-feature-card-visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    featureRefs.current.forEach(feature => {
      if (feature) observer.observe(feature);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      title: "Secure Payments",
      description: "Escrow protection and multiple payment options for safe transactions.",
      icon: "🔒",
      for: "Both",
      color: "#4A90E2"
    },
    {
      title: "Verified Profiles",
      description: "All providers verified with ID and skill validation for your peace of mind.",
      icon: "✅",
      for: "Seekers",
      color: "#FF6B35"
    },
    {
      title: "Review System",
      description: "Transparent rating system with verified customer feedback.",
      icon: "⭐",
      for: "Both",
      color: "#00C896"
    },
    {
      title: "Booking Management",
      description: "Easy calendar integration and booking confirmation system.",
      icon: "📅",
      for: "Both",
      color: "#7B68EE"
    },
    {
      title: "Portfolio Showcase",
      description: "Display your best work with 2-3 high-quality images.",
      icon: "🖼️",
      for: "Providers",
      color: "#4A90E2"
    },
    {
      title: "Location-Based Search",
      description: "Find services near you with accurate location filtering.",
      icon: "📍",
      for: "Seekers",
      color: "#FF6B35"
    }
  ];

  return (
    <section className="platform-features-section">
      <div className="platform-features-header">
        <h2 className="platform-features-title">Platform Features</h2>
        <p className="platform-features-subtitle">
          Everything you need for a seamless service marketplace experience.
        </p>
      </div>
      
      <div className="platform-features-grid">
        {features.map((feature, index) => (
          <div
            key={index}
            ref={el => { featureRefs.current[index] = el; }}
            className="platform-feature-card"
            style={{ '--feature-color': feature.color } as React.CSSProperties}
          >
            <div className="platform-feature-card-badge">{feature.for}</div>
            <div className="platform-feature-card-icon">{feature.icon}</div>
            <h3 className="platform-feature-card-title">{feature.title}</h3>
            <p className="platform-feature-card-description">{feature.description}</p>
            <div className="platform-feature-card-glow"></div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===== REGISTRATION STEPS ===== */
function RegistrationSteps() {
  const detailRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('registration-detail-visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    detailRefs.current.forEach(detail => {
      if (detail) observer.observe(detail);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="registration-steps-section">
      <div className="registration-steps-header">
        <h2 className="registration-steps-title">Registration Details</h2>
        <p className="registration-steps-subtitle">
          Complete guide to setting up your profile and listing services.
        </p>
      </div>
      
      <div className="registration-details">
        <div 
          ref={el => { detailRefs.current[0] = el; }}
          className="registration-detail"
        >
          <div className="registration-detail-number">01</div>
          <div className="registration-detail-content">
            <h3 className="registration-detail-title">Account Creation</h3>
            <p className="registration-detail-description">
              Start by creating your account with basic information and choosing your role.
            </p>
            <div className="registration-detail-forms">
              <div className="registration-form-item">
                <span className="registration-form-label">Basic Info</span>
                <span className="registration-form-desc">Name, email, password</span>
              </div>
              <div className="registration-form-item">
                <span className="registration-form-label">Role Selection</span>
                <span className="registration-form-desc">Provider or Seeker</span>
              </div>
              <div className="registration-form-item">
                <span className="registration-form-label">Verification</span>
                <span className="registration-form-desc">Email & phone verification</span>
              </div>
            </div>
          </div>
        </div>

        <div 
          ref={el => { detailRefs.current[1] = el; }}
          className="registration-detail"
        >
          <div className="registration-detail-number">02</div>
          <div className="registration-detail-content">
            <h3 className="registration-detail-title">Service Registration (Providers)</h3>
            <p className="registration-detail-description">
              Complete your service provider profile and list your offerings.
            </p>
            <div className="registration-detail-forms">
              <div className="registration-form-item">
                <span className="registration-form-label">Service Details</span>
                <span className="registration-form-desc">Name, description, category</span>
              </div>
              <div className="registration-form-item">
                <span className="registration-form-label">Pricing & Packages</span>
                <span className="registration-form-desc">Set rates & special offers</span>
              </div>
              <div className="registration-form-item">
                <span className="registration-form-label">Location & Area</span>
                <span className="registration-form-desc">Service coverage area</span>
              </div>
              <div className="registration-form-item">
                <span className="registration-form-label">Portfolio Images</span>
                <span className="registration-form-desc">Upload 2-3 showcase images</span>
              </div>
            </div>
          </div>
        </div>

        <div 
          ref={el => { detailRefs.current[2] = el; }}
          className="registration-detail"
        >
          <div className="registration-detail-number">03</div>
          <div className="registration-detail-content">
            <h3 className="registration-detail-title">Profile Completion</h3>
            <p className="registration-detail-description">
              Enhance your profile with additional information to attract more clients.
            </p>
            <div className="registration-detail-forms">
              <div className="registration-form-item">
                <span className="registration-form-label">Experience & Skills</span>
                <span className="registration-form-desc">Years of experience, certifications</span>
              </div>
              <div className="registration-form-item">
                <span className="registration-form-label">Availability</span>
                <span className="registration-form-desc">Working hours & schedule</span>
              </div>
              <div className="registration-form-item">
                <span className="registration-form-label">Payment Methods</span>
                <span className="registration-form-desc">Setup payment options</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== SEARCH AND BOOK ===== */
function SearchAndBook() {
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('search-feature-visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    featureRefs.current.forEach(feature => {
      if (feature) observer.observe(feature);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="search-book-section">
      <div className="search-book-header">
        <h2 className="search-book-title">Search & Booking Process</h2>
        <p className="search-book-subtitle">
          How seekers find and book services, and how providers manage bookings.
        </p>
      </div>
      
      <div className="search-book-process">
        <div 
          ref={el => { featureRefs.current[0] = el; }}
          className="search-book-step"
        >
          <div className="search-book-step-icon">🔍</div>
          <h3 className="search-book-step-title">Search & Filter</h3>
          <p className="search-book-step-description">
            Enter location, service type, price range, and other preferences to find the perfect provider.
          </p>
          <div className="search-book-step-filters">
            <span className="search-book-filter">Location Radius</span>
            <span className="search-book-filter">Service Category</span>
            <span className="search-book-filter">Price Range</span>
            <span className="search-book-filter">Ratings</span>
            <span className="search-book-filter">Availability</span>
          </div>
        </div>

        <div className="search-book-arrow">→</div>

        <div 
          ref={el => { featureRefs.current[1] = el; }}
          className="search-book-step"
        >
          <div className="search-book-step-icon">📋</div>
          <h3 className="search-book-step-title">Compare & Select</h3>
          <p className="search-book-step-description">
            View detailed profiles, portfolios, reviews, and pricing to make an informed decision.
          </p>
          <div className="search-book-step-features">
            <span className="search-book-feature">Portfolio Gallery</span>
            <span className="search-book-feature">Client Reviews</span>
            <span className="search-book-feature">Response Time</span>
            <span className="search-book-feature">Service Packages</span>
          </div>
        </div>

        <div className="search-book-arrow">→</div>

        <div 
          ref={el => { featureRefs.current[2] = el; }}
          className="search-book-step"
        >
          <div className="search-book-step-icon">📅</div>
          <h3 className="search-book-step-title">Book & Pay</h3>
          <p className="search-book-step-description">
            Select preferred date/time, confirm service details, and make secure payment.
          </p>
          <div className="search-book-step-actions">
            <span className="search-book-action">Calendar Selection</span>
            <span className="search-book-action">Service Agreement</span>
            <span className="search-book-action">Secure Payment</span>
            <span className="search-book-action">Booking Confirmation</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== SUCCESS STORIES ===== */
// function SuccessStories() {
//   const storyRefs = useRef<(HTMLDivElement | null)[]>([]);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach(entry => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add('success-story-visible');
//           }
//         });
//       },
//       { threshold: 0.15 }
//     );

//     storyRefs.current.forEach(story => {
//       if (story) observer.observe(story);
//     });

//     return () => observer.disconnect();
//   }, []);

//   const stories = [
//     {
//       name: "Sarah Johnson",
//       role: "Freelance Photographer",
//       type: "Provider",
//       result: "Booked 50+ clients in first 3 months",
//       quote: "The platform helped me showcase my work and connect with clients who appreciate my style.",
//       image: "📸",
//       color: "#4A90E2"
//     },
//     {
//       name: "Mike Rodriguez",
//       role: "Homeowner",
//       type: "Seeker",
//       result: "Found perfect contractor in 24 hours",
//       quote: "Found a reliable plumber the same day I needed urgent repairs. The reviews were accurate!",
//       image: "🏠",
//       color: "#FF6B35"
//     },
//     {
//       name: "Tech Solutions LLC",
//       role: "IT Services Company",
//       type: "Provider",
//       result: "Tripled monthly bookings",
//       quote: "Listing our services with detailed packages and location-based targeting worked wonders.",
//       image: "💻",
//       color: "#00C896"
//     }
//   ];

//   return (
//     <section className="success-stories-section">
//       <div className="success-stories-header">
//         <h2 className="success-stories-title">Success Stories</h2>
//         <p className="success-stories-subtitle">
//           Real people achieving real results with our platform.
//         </p>
//       </div>
      
//       <div className="success-stories-grid">
//         {stories.map((story, index) => (
//           <div
//             key={index}
//             ref={el => { storyRefs.current[index] = el; }}
//             className="success-story-card"
//             style={{ '--story-color': story.color } as React.CSSProperties}
//           >
//             <div className="success-story-badge">{story.type}</div>
//             <div className="success-story-image">{story.image}</div>
//             <div className="success-story-content">
//               <h3 className="success-story-name">{story.name}</h3>
//               <span className="success-story-role">{story.role}</span>
//               <div className="success-story-result">
//                 <span className="success-story-result-icon">🎯</span>
//                 {story.result}
//               </div>
//               <blockquote className="success-story-quote">
//                 "{story.quote}"
//               </blockquote>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

/* ===== GET STARTED CTA ===== */
function GetStartedCTA() {
  const ctaRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('get-started-cta-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ctaRef.current) observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="get-started-cta-section" ref={ctaRef}>
      <div className="get-started-cta-background"></div>
      <div className="get-started-cta-content">
        <h2 className="get-started-cta-title">Ready to Start Your Journey?</h2>
        <p className="get-started-cta-subtitle">
          Join thousands of service providers and seekers who are already benefiting from our platform.
          Start for free with no commitment.
        </p>
        
        <div className="get-started-cta-cards">
          <div className="cta-provider-card">
            <div className="cta-card-icon">👨‍💼</div>
            <h3 className="cta-card-title">I'm a Service Provider</h3>
            <p className="cta-card-description">
              List your services, showcase your work, and start earning.
            </p>
            <button className="cta-card-button cta-provider-button">
              Become a Provider
              <span className="cta-button-icon">→</span>
            </button>
          </div>
          
          <div className="cta-divider">or</div>
          
          <div className="cta-seeker-card">
            <div className="cta-card-icon">👥</div>
            <h3 className="cta-card-title">I Need a Service</h3>
            <p className="cta-card-description">
              Find trusted professionals for any service you need.
            </p>
            <button className="cta-card-button cta-seeker-button">
              Find Services
              <span className="cta-button-icon">→</span>
            </button>
          </div>
        </div>
        
        <div className="get-started-cta-features">
          <span className="get-started-cta-feature">
            <span className="get-started-cta-feature-icon">✓</span>
            No registration fees
          </span>
          <span className="get-started-cta-feature">
            <span className="get-started-cta-feature-icon">✓</span>
            First 3 bookings free
          </span>
          <span className="get-started-cta-feature">
            <span className="get-started-cta-feature-icon">✓</span>
            Secure payment protection
          </span>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksPage;