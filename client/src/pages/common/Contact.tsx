import React, { useState, useEffect } from 'react';
import './contactpage.css'

function Contact() {
  const [animate, setAnimate] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeContact, setActiveContact] = useState('email');

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const contactCategories = [
    { id: 'general', label: 'General Inquiry', icon: '💬', color: '#FF6B35' },
    { id: 'support', label: 'Technical Support', icon: '🔧', color: '#4A90E2' },
    { id: 'partnership', label: 'Partnership', icon: '🤝', color: '#7B68EE' },
    { id: 'provider', label: 'Become a Provider', icon: '👨‍🔧', color: '#FFA62B' },
    { id: 'feedback', label: 'Feedback', icon: '✨', color: '#2E8B57' },
    { id: 'business', label: 'Business Inquiry', icon: '🏢', color: '#FF4757' }
  ];

  const contactMethods = [
    {
      id: 'email',
      title: 'Email Us',
      details: 'davismugoikou@gmail.com',
      icon: '📧',
      action: 'mailto:davismugoikou@gmail.com',
      color: '#FF6B35',
      description: 'We typically respond within 24 hours'
    },
    {
      id: 'phone',
      title: 'Call Us',
      details: '+254 758 420 860',
      icon: '📞',
      action: 'tel:+254758420860',
      color: '#4A90E2',
      description: 'Monday to Friday, 8AM - 6PM EAT'
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      details: '+254 758 420 860',
      icon: '💬',
      action: 'https://wa.me/254758420860',
      color: '#25D366',
      description: 'Instant messaging for quick queries'
    }
  ];

  const faqItems = [
    {
      question: 'How quickly will I get a response?',
      answer: 'We aim to respond to all inquiries within 24 hours. For urgent matters, please call us directly.'
    },
    {
      question: 'What information should I include in my message?',
      answer: 'Please include your name, contact details, and a clear description of your inquiry or issue.'
    },
    {
      question: 'Do you offer 24/7 support?',
      answer: 'Our phone lines are available during business hours. For after-hours emergencies, please email us.'
    },
    {
      question: 'Can I schedule a call or meeting?',
      answer: 'Yes! Include your preferred time in your message, and we\'ll arrange a suitable time to connect.'
    }
  ];

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general'
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  const handleContactAction = (method:any) => {
    setActiveContact(method.id);
    if (method.action) {
      if (method.id === 'whatsapp') {
        window.open(method.action, '_blank');
      } else {
        window.location.href = method.action;
      }
    }
  };

  return (
    <div className="helpr-contact-page-container">
      {/* Hero Section */}
      <section className={`helpr-contact-hero ${animate ? 'helpr-contact-hero-animate' : ''}`}>
        <div className="helpr-contact-hero-content">
          <h1 className={`helpr-contact-hero-title ${animate ? 'helpr-contact-text-reveal' : ''}`}>
            Get in <span className="helpr-gradient-text">Touch</span> with Helpr
          </h1>
          <p className={`helpr-contact-hero-subtitle ${animate ? 'helpr-contact-text-reveal' : ''}`} style={{ animationDelay: '0.1s' }}>
            We're here to help you connect better with service professionals. Whether you have questions, feedback, or need assistance, our team is ready to assist.
          </p>
        </div>
        <div className={`helpr-contact-hero-graphic ${animate ? 'helpr-contact-hero-graphic-animate' : ''}`}>
          <div className="helpr-contact-communication-line"></div>
          <div className="helpr-contact-msg-icon">💬</div>
          <div className="helpr-contact-phone-icon">📞</div>
          <div className="helpr-contact-email-icon">📧</div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="helpr-contact-section">
        <div className="helpr-contact-container">
          <h2 className="helpr-contact-section-title helpr-contact-centered">
            Choose Your Preferred Contact Method
          </h2>
          <p className="helpr-contact-section-subtitle helpr-contact-centered">
            We make it easy to reach us through multiple channels
          </p>
          
          <div className="helpr-contact-methods-grid">
            {contactMethods.map((method, index) => (
              <div 
                key={method.id}
                className={`helpr-contact-method-card ${activeContact === method.id ? 'helpr-contact-method-active' : ''} ${animate ? 'helpr-contact-method-pop' : ''}`}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  borderTopColor: method.color 
                }}
                onClick={() => handleContactAction(method)}
              >
                <div className="helpr-contact-method-icon" style={{ backgroundColor: `${method.color}15` }}>
                  {method.icon}
                </div>
                <h3>{method.title}</h3>
                <div className="helpr-contact-method-details">
                  {method.details}
                </div>
                <p className="helpr-contact-method-description">
                  {method.description}
                </p>
                <div className="helpr-contact-method-action">
                  {method.id === 'email' ? 'Send Email' : method.id === 'phone' ? 'Make a Call' : 'Start Chat'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="helpr-contact-section helpr-contact-form-section">
        <div className="helpr-contact-container">
          <div className="helpr-contact-form-wrapper">
            {/* Left Column - Form */}
            <div className={`helpr-contact-form-column ${animate ? 'helpr-contact-form-slide' : ''}`}>
              <div className="helpr-contact-form-header">
                <h2 className="helpr-contact-form-title">
                  Send Us a Message
                </h2>
                <p className="helpr-contact-form-subtitle">
                  Fill out the form below and we'll get back to you promptly
                </p>
              </div>

              {submitSuccess && (
                <div className="helpr-contact-success-message">
                  <div className="helpr-contact-success-icon">✓</div>
                  <h3>Message Sent Successfully!</h3>
                  <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="helpr-contact-form">
                <div className="helpr-form-row">
                  <div className="helpr-form-group">
                    <label htmlFor="name" className="helpr-form-label">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="helpr-form-input"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="helpr-form-group">
                    <label htmlFor="email" className="helpr-form-label">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="helpr-form-input"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="helpr-form-row">
                  <div className="helpr-form-group">
                    <label htmlFor="phone" className="helpr-form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="helpr-form-input"
                      placeholder="+254 XXX XXX XXX"
                    />
                  </div>
                  <div className="helpr-form-group">
                    <label htmlFor="subject" className="helpr-form-label">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="helpr-form-input"
                      placeholder="What is this regarding?"
                      required
                    />
                  </div>
                </div>

                <div className="helpr-form-group">
                  <label className="helpr-form-label">
                    Inquiry Category *
                  </label>
                  <div className="helpr-contact-categories">
                    {contactCategories.map(category => (
                      <label 
                        key={category.id}
                        className={`helpr-contact-category-label ${formData.category === category.id ? 'helpr-contact-category-active' : ''}`}
                        style={{ ['--category-color']: category.color } as React.CSSProperties}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.id}
                          checked={formData.category === category.id}
                          onChange={handleChange}
                          className="helpr-contact-category-input"
                        />
                        <span className="helpr-contact-category-icon">{category.icon}</span>
                        <span className="helpr-contact-category-text">{category.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="helpr-form-group">
                  <label htmlFor="message" className="helpr-form-label">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="helpr-form-textarea"
                    placeholder="Please describe your inquiry in detail..."
                    rows={6}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className={`helpr-contact-submit-btn ${isSubmitting ? 'helpr-contact-submit-loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="helpr-contact-spinner"></span>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>

            {/* Right Column - Info */}
            <div className={`helpr-contact-info-column ${animate ? 'helpr-contact-info-slide' : ''}`} style={{ animationDelay: '0.2s' }}>
              <div className="helpr-contact-info-card">
                <div className="helpr-contact-info-header">
                  <h3>Contact Information</h3>
                  <div className="helpr-contact-info-icon">📋</div>
                </div>

                <div className="helpr-contact-info-details">
                  <div className="helpr-contact-info-item">
                    <div className="helpr-contact-info-label">Email</div>
                    <div className="helpr-contact-info-value">
                      <a href="mailto:davismugoikou@gmail.com">davismugoikou@gmail.com</a>
                    </div>
                  </div>
                  
                  <div className="helpr-contact-info-item">
                    <div className="helpr-contact-info-label">Phone</div>
                    <div className="helpr-contact-info-value">
                      <a href="tel:+254758420860">+254 758 420 860</a>
                    </div>
                  </div>

                  <div className="helpr-contact-info-item">
                    <div className="helpr-contact-info-label">WhatsApp</div>
                    <div className="helpr-contact-info-value">
                      <a href="https://wa.me/254758420860" target="_blank" rel="noopener noreferrer">
                        +254 758 420 860
                      </a>
                    </div>
                  </div>

                  <div className="helpr-contact-info-item">
                    <div className="helpr-contact-info-label">Response Time</div>
                    <div className="helpr-contact-info-value">
                      Within 24 hours
                    </div>
                  </div>
                </div>

                <div className="helpr-contact-office-hours">
                  <h4>Business Hours</h4>
                  <div className="helpr-contact-hours-grid">
                    <div className="helpr-contact-hour-day">Monday - Friday</div>
                    <div className="helpr-contact-hour-time">8:00 AM - 6:00 PM EAT</div>
                    <div className="helpr-contact-hour-day">Saturday</div>
                    <div className="helpr-contact-hour-time">9:00 AM - 2:00 PM EAT</div>
                    <div className="helpr-contact-hour-day">Sunday</div>
                    <div className="helpr-contact-hour-time">Emergency Support Only</div>
                  </div>
                </div>

                <div className="helpr-contact-note">
                  <div className="helpr-contact-note-icon">💡</div>
                  <p>
                    <strong>Tip:</strong> For faster response, include as much detail as possible about your inquiry or issue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="helpr-contact-section helpr-contact-faq-section">
        <div className="helpr-contact-container">
          <h2 className="helpr-contact-section-title helpr-contact-centered">
            Frequently Asked Questions
          </h2>
          <p className="helpr-contact-section-subtitle helpr-contact-centered">
            Find quick answers to common questions
          </p>

          <div className="helpr-contact-faq-grid">
            {faqItems.map((faq, index) => (
              <div 
                key={index}
                className={`helpr-contact-faq-card ${animate ? 'helpr-contact-faq-fade' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="helpr-contact-faq-question">
                  <span className="helpr-contact-faq-icon">❓</span>
                  {faq.question}
                </div>
                <div className="helpr-contact-faq-answer">
                  <span className="helpr-contact-faq-answer-icon">💬</span>
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`helpr-contact-cta ${animate ? 'helpr-contact-cta-animate' : ''}`}>
        <div className="helpr-contact-container">
          <div className="helpr-contact-cta-content">
            <div className="helpr-contact-cta-icon">🚀</div>
            <h2>Need Immediate Assistance?</h2>
            <p>Call us now for urgent support or use WhatsApp for instant messaging</p>
            <div className="helpr-contact-cta-buttons">
              <a 
                href="tel:+254758420860" 
                className="helpr-nav-btn-primary helpr-contact-cta-btn"
              >
                📞 Call Now
              </a>
              <a 
                href="https://wa.me/254758420860" 
                target="_blank" 
                rel="noopener noreferrer"
                className="helpr-nav-btn-secondary helpr-contact-cta-btn"
              >
                💬 WhatsApp Chat
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;