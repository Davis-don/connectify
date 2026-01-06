import  { useEffect, useState } from 'react';
import './about.css'

function About() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // const teamMembers = [
  //   { id: 1, name: "Alex Chen", role: "CEO & Founder", expertise: "Marketplace Strategy", delay: 0.1 },
  //   { id: 2, name: "Maya Rodriguez", role: "CTO", expertise: "Platform Architecture", delay: 0.2 },
  //   { id: 3, name: "James Wilson", role: "Head of Operations", expertise: "Service Provider Relations", delay: 0.3 },
  //   { id: 4, name: "Sophie Williams", role: "Head of Product", expertise: "User Experience", delay: 0.4 },
  // ];

  const stats = [
    { number: "10K+", label: "Service Providers", icon: "👨‍🔧" },
    { number: "50K+", label: "Happy Customers", icon: "😊" },
    { number: "200+", label: "Cities Covered", icon: "🌍" },
    { number: "98%", label: "Satisfaction Rate", icon: "⭐" },
  ];

  const values = [
    { title: "Trust & Safety", description: "Verified providers and secure transactions", icon: "🛡️", color: "#4A90E2" },
    { title: "Quality First", description: "Rigorous vetting and customer reviews", icon: "✨", color: "#FF6B35" },
    { title: "Local Focus", description: "Connecting communities through services", icon: "🏘️", color: "#7B68EE" },
    { title: "Fair Pricing", description: "Transparent costs and no hidden fees", icon: "💰", color: "#2E8B57" },
  ];

  return (
    <div className="helpr-about-page-container">
      {/* Hero Section */}
      <section className={`helpr-about-hero ${animate ? 'helpr-about-hero-animate' : ''}`}>
        <div className="helpr-about-hero-content">
          <h1 className={`helpr-about-hero-title ${animate ? 'helpr-about-text-reveal' : ''}`}>
            Connecting <span className="helpr-gradient-text">Service Providers</span> with Those Who Need Them
          </h1>
          <p className={`helpr-about-hero-subtitle ${animate ? 'helpr-about-text-reveal' : ''}`} style={{ animationDelay: '0.1s' }}>
            Helpr is a revolutionary platform that bridges the gap between skilled service professionals and customers based on location, cost, availability, and quality ratings.
          </p>
        </div>
        <div className={`helpr-about-hero-graphic ${animate ? 'helpr-about-hero-graphic-animate' : ''}`}>
          <div className="helpr-about-connecting-line"></div>
          <div className="helpr-about-provider-icon">👨‍🔧</div>
          <div className="helpr-about-connection-icon">🤝</div>
          <div className="helpr-about-customer-icon">👨‍👩‍👧</div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="helpr-about-section">
        <div className="helpr-about-container">
          <div className={`helpr-about-mission-card ${animate ? 'helpr-about-card-float' : ''}`}>
            <div className="helpr-about-mission-icon">🎯</div>
            <h2 className="helpr-about-section-title">Our Mission</h2>
            <p className="helpr-about-section-text">
              To create a seamless marketplace where finding reliable service professionals is as easy as a few clicks. We're transforming how people connect with local experts for home services, repairs, tutoring, wellness, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="helpr-about-section helpr-about-stats-section">
        <div className="helpr-about-container">
          <h2 className="helpr-about-section-title helpr-about-centered">Making a Difference</h2>
          <p className="helpr-about-section-subtitle helpr-about-centered">
            Our impact in numbers
          </p>
          <div className="helpr-about-stats-grid">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className={`helpr-about-stat-card ${animate ? 'helpr-about-stat-pop' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="helpr-about-stat-icon">{stat.icon}</div>
                <div className="helpr-about-stat-number">{stat.number}</div>
                <div className="helpr-about-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="helpr-about-section">
        <div className="helpr-about-container">
          <h2 className="helpr-about-section-title helpr-about-centered">How Helpr Works</h2>
          <div className="helpr-about-steps">
            <div className={`helpr-about-step ${animate ? 'helpr-about-step-slide' : ''}`} style={{ animationDelay: '0s' }}>
              <div className="helpr-about-step-number">1</div>
              <div className="helpr-about-step-content">
                <h3>Post Your Need</h3>
                <p>Describe the service you need, your location, and budget</p>
              </div>
            </div>
            <div className={`helpr-about-step ${animate ? 'helpr-about-step-slide' : ''}`} style={{ animationDelay: '0.2s' }}>
              <div className="helpr-about-step-number">2</div>
              <div className="helpr-about-step-content">
                <h3>Match & Compare</h3>
                <p>Get matched with verified providers based on location, ratings, and cost</p>
              </div>
            </div>
            <div className={`helpr-about-step ${animate ? 'helpr-about-step-slide' : ''}`} style={{ animationDelay: '0.4s' }}>
              <div className="helpr-about-step-number">3</div>
              <div className="helpr-about-step-content">
                <h3>Book & Pay Securely</h3>
                <p>Schedule the service and pay through our protected system</p>
              </div>
            </div>
            <div className={`helpr-about-step ${animate ? 'helpr-about-step-slide' : ''}`} style={{ animationDelay: '0.6s' }}>
              <div className="helpr-about-step-number">4</div>
              <div className="helpr-about-step-content">
                <h3>Rate & Review</h3>
                <p>Share your experience to help others make better choices</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="helpr-about-section helpr-about-values-section">
        <div className="helpr-about-container">
          <h2 className="helpr-about-section-title helpr-about-centered">Our Core Values</h2>
          <div className="helpr-about-values-grid">
            {values.map((value, index) => (
              <div 
                key={value.title}
                className={`helpr-about-value-card ${animate ? 'helpr-about-card-float' : ''}`}
                style={{ 
                  animationDelay: `${index * 0.15}s`,
                  borderTopColor: value.color 
                }}
              >
                <div className="helpr-about-value-icon" style={{ backgroundColor: `${value.color}15` }}>
                  {value.icon}
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="helpr-about-section">
        <div className="helpr-about-container">
          <h2 className="helpr-about-section-title helpr-about-centered">Meet Our Leadership</h2>
          <div className="helpr-about-team-grid">
            {teamMembers.map((member) => (
              <div 
                key={member.id}
                className={`helpr-about-team-card ${animate ? 'helpr-about-team-card-animate' : ''}`}
                style={{ animationDelay: `${member.delay}s` }}
              >
                <div className="helpr-about-team-avatar">
                  {member.name.charAt(0)}
                </div>
                <h3>{member.name}</h3>
                <div className="helpr-about-team-role">{member.role}</div>
                <div className="helpr-about-team-expertise">{member.expertise}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className={`helpr-about-cta ${animate ? 'helpr-about-cta-animate' : ''}`}>
        <div className="helpr-about-container">
          <div className="helpr-about-cta-content">
            <h2>Ready to Experience Better Service Connections?</h2>
            <p>Join thousands who trust Helpr for their service needs</p>
            <div className="helpr-about-cta-buttons">
              <button className="helpr-nav-btn-primary helpr-about-cta-btn">
                Find a Provider
              </button>
              <button className="helpr-nav-btn-secondary helpr-about-cta-btn">
                Become a Provider
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;