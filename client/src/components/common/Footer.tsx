import React from 'react';
import { useNavigate } from 'react-router-dom';
import './footer.css';

interface FooterProps {
  className?: string;
  onCtaClick?: (action: string) => void;
}

const Footer: React.FC<FooterProps> = ({ 
  className = '',
  onCtaClick 
}) => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (linkName: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    // Map link names to routes
    const routeMap: Record<string, string> = {
      'Home': '/',
      'Services': '/services',
      'Household': '/services/household',
      'Auto': '/services/auto',
      'Tech': '/services/tech',
      'Auto Services': '/services/auto',
      'Tech Support': '/services/tech',
      'Cleaning': '/services/household', // Assuming cleaning falls under household
      'Repair': '/services', // Generic repair services page
      'Repair Services': '/services',
      'About': '/about',
      'About Us': '/about',
      'How it Works': '/how-it-works',
      'How It Works': '/how-it-works',
      'Contact': '/contact',
      'Contact Us': '/contact',
      'Careers': '/about', // You might want to create a separate careers page
      'Press': '/about', // You might want to create a separate press page
      'Blog': '/about', // You might want to create a separate blog page
      'Help Center': '/contact',
      'Safety': '/contact', // You might want to create a separate safety page
      'Privacy': '/privacy', // Note: You don't have a privacy route in AppRoutes
      'Privacy Policy': '/privacy',
      'Terms': '/terms', // Note: You don't have a terms route in AppRoutes
      'Terms of Service': '/terms',
      'Cookies': '/privacy', // Assuming cookies falls under privacy
      'Cookie Policy': '/privacy',
      'Join': '/join',
      'Find a Service': '/services',
      'Offer a Service': '/join',
      'Facebook': 'https://facebook.com', // External links
      'Twitter': 'https://twitter.com',
      'Instagram': 'https://instagram.com',
      'LinkedIn': 'https://linkedin.com'
    };

    const route = routeMap[linkName];
    
    if (route) {
      if (route.startsWith('http')) {
        // Open external links in new tab
        window.open(route, '_blank', 'noopener noreferrer');
      } else {
        navigate(route);
      }
    }
  };

  const handleCtaClick = (action: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    // Handle CTA navigation
    if (action === 'Find a Service') {
      navigate('/services');
    } else if (action === 'Offer a Service') {
      navigate('/join');
    }
    
    // Call optional callback if provided
    if (onCtaClick) {
      onCtaClick(action);
    }
  };

  return (
    <footer className={`helpr-footer-wrap ${className}`}>
      <div className="helpr-footer-container">
        
        {/* Top Section */}
        <div className="helpr-footer-top">
          <div className="helpr-footer-brand">
            <div 
              className="helpr-footer-logo" 
              onClick={(e) => handleLinkClick('Home', e)}
              style={{ cursor: 'pointer' }}
            >
              <div className="helpr-footer-logo-text">Logo</div>
              <div className="helpr-footer-logo-underline">
                <div className="helpr-footer-underline-line helpr-footer-underline-primary"></div>
                <div className="helpr-footer-underline-line helpr-footer-underline-secondary"></div>
              </div>
            </div>
            <div className="helpr-footer-site-name">Helpr Marketplace</div>
            <p className="helpr-footer-tagline">
              Connecting skilled professionals with those who need help. 
              Quality service, trusted community.
            </p>
            <div className="helpr-footer-social">
              <a 
                href="https://facebook.com" 
                className="helpr-social-icon" 
                aria-label="Facebook"
                onClick={(e) => handleLinkClick('Facebook', e)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a 
                href="https://twitter.com" 
                className="helpr-social-icon" 
                aria-label="Twitter"
                onClick={(e) => handleLinkClick('Twitter', e)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a 
                href="https://instagram.com" 
                className="helpr-social-icon" 
                aria-label="Instagram"
                onClick={(e) => handleLinkClick('Instagram', e)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href="https://linkedin.com" 
                className="helpr-social-icon" 
                aria-label="LinkedIn"
                onClick={(e) => handleLinkClick('LinkedIn', e)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div className="helpr-footer-links-grid">
            <div className="helpr-footer-links-column">
              <h3 className="helpr-footer-links-title">Services</h3>
              <div className="helpr-footer-links-wrap">
                <a 
                  href="/services/household" 
                  className="helpr-footer-link"
                  onClick={(e) => handleLinkClick('Household', e)}
                >
                  Household
                </a>
                <a 
                  href="/services/auto" 
                  className="helpr-footer-link"
                  onClick={(e) => handleLinkClick('Auto Services', e)}
                >
                  Auto Services
                </a>
                <a 
                  href="/services/tech" 
                  className="helpr-footer-link"
                  onClick={(e) => handleLinkClick('Tech Support', e)}
                >
                  Tech Support
                </a>
                <a 
                  href="/services/household" 
                  className="helpr-footer-link"
                  onClick={(e) => handleLinkClick('Cleaning', e)}
                >
                  Cleaning
                </a>
                <a 
                  href="/services" 
                  className="helpr-footer-link"
                  onClick={(e) => handleLinkClick('Repair Services', e)}
                >
                  Repair Services
                </a>
              </div>
            </div>

            <div className="helpr-footer-links-column">
              <h3 className="helpr-footer-links-title">Company</h3>
              <div className="helpr-footer-links-wrap">
                <a 
                  href="/about" 
                  className="helpr-footer-link"
                  onClick={(e) => handleLinkClick('About Us', e)}
                >
                  About Us
                </a>
                <a 
                  href="/how-it-works" 
                  className="helpr-footer-link"
                  onClick={(e) => handleLinkClick('How It Works', e)}
                >
                  How It Works
                </a>
                <a 
                  href="/about" 
                  className="helpr-footer-link"
                  onClick={(e) => handleLinkClick('Careers', e)}
                >
                  Careers
                </a>
                <a 
                  href="/about" 
                  className="helpr-footer-link"
                  onClick={(e) => handleLinkClick('Press', e)}
                >
                  Press
                </a>
                <a 
                  href="/about" 
                  className="helpr-footer-link"
                  onClick={(e) => handleLinkClick('Blog', e)}
                >
                  Blog
                </a>
              </div>
            </div>

            <div className="helpr-footer-links-column">
              <h3 className="helpr-footer-links-title">Support</h3>
              <div className="helpr-footer-links-wrap">
                <a 
                  href="/contact" 
                  className="helpr-footer-link"
                  onClick={(e) => handleLinkClick('Help Center', e)}
                >
                  Help Center
                </a>
                <a 
                  href="/contact" 
                  className="helpr-footer-link"
                  onClick={(e) => handleLinkClick('Contact Us', e)}
                >
                  Contact Us
                </a>
                <a 
                  href="/contact" 
                  className="helpr-footer-link"
                  onClick={(e) => handleLinkClick('Safety', e)}
                >
                  Safety
                </a>
                <a 
                  href="/privacy" 
                  className="helpr-footer-link"
                  onClick={(e) => handleLinkClick('Privacy Policy', e)}
                >
                  Privacy Policy
                </a>
                <a 
                  href="/terms" 
                  className="helpr-footer-link"
                  onClick={(e) => handleLinkClick('Terms of Service', e)}
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="helpr-footer-cta-wrap">
          <div className="helpr-footer-cta-content">
            <h2 className="helpr-footer-cta-title">Ready to get started?</h2>
            <p className="helpr-footer-cta-subtitle">
              Join thousands of professionals and customers finding help through our platform.
            </p>
            <div className="helpr-footer-cta-buttons">
              <button 
                className="helpr-footer-cta-btn helpr-footer-cta-primary"
                onClick={(e) => handleCtaClick('Find a Service', e)}
              >
                Find a Service
              </button>
              <button 
                className="helpr-footer-cta-btn helpr-footer-cta-secondary"
                onClick={(e) => handleCtaClick('Offer a Service', e)}
              >
                Offer a Service
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="helpr-footer-bottom">
          <div className="helpr-footer-copyright">
            &copy; {currentYear} Helpr Marketplace. All rights reserved.
          </div>
          <div className="helpr-footer-bottom-links">
            <a 
              href="/privacy" 
              className="helpr-footer-bottom-link"
              onClick={(e) => handleLinkClick('Privacy Policy', e)}
            >
              Privacy Policy
            </a>
            <span className="helpr-footer-separator">•</span>
            <a 
              href="/terms" 
              className="helpr-footer-bottom-link"
              onClick={(e) => handleLinkClick('Terms of Service', e)}
            >
              Terms of Service
            </a>
            <span className="helpr-footer-separator">•</span>
            <a 
              href="/privacy" 
              className="helpr-footer-bottom-link"
              onClick={(e) => handleLinkClick('Cookie Policy', e)}
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;