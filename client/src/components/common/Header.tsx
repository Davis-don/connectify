import React, { useState } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './header.css';

interface HeaderProps {
  onMenuToggle?: (isOpen: boolean) => void;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  onMenuToggle,
  className = '' 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Extract active link from current path
  const getActiveLink = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path === '/how-it-works') return 'How It Works';
    if (path === '/about') return 'About';
    if (path === '/contact') return 'Contact';
    if (path.startsWith('/services')) {
      // Check if we're on a specific service page
      const pathParts = path.split('/');
      if (pathParts.length === 2) return 'Services';
      return 'Services'; // Default to Services for service-related pages
    }
    return '';
  };

  const activeLink = getActiveLink();

  const handleLinkClick = (linkName: string, e?: MouseEvent) => {
    e?.preventDefault();
    
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
      setIsDropdownOpen(false);
    }
    
    // Map link names to routes
    const routeMap: Record<string, string> = {
      'Home': '/',
      'Services': '/services',
      'How It Works': '/how-it-works',
      'About': '/about',
      'Contact': '/contact',
      'Household': '/services/household',
      'Auto': '/services/auto',
      'Tech': '/services/tech',
      'Find a Service': '/services',
      'Offer a Service': '/join'
    };

    const route = routeMap[linkName];
    if (route) {
      navigate(route);
    }
  };
  
  const handleServicesHover = (isHovering: boolean) => {
    if (window.innerWidth >= 768) {
      setIsDropdownOpen(isHovering);
    }
  };

  const handleServicesClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (window.innerWidth < 768) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      // On desktop, clicking Services navigates to services page
      handleLinkClick('Services', e);
    }
  };

  const toggleMobileMenu = (e: MouseEvent) => {
    e.preventDefault();
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    if (!newState) {
      setIsDropdownOpen(false);
    }
    
    if (onMenuToggle) {
      onMenuToggle(newState);
    }
  };

  const handleActionClick = (action: string, e: MouseEvent) => {
    e.preventDefault();
    handleLinkClick(action, e);
  };


  return (
    <header className={`helpr-header-wrap ${className}`}>
      <div className="helpr-header-container">
        {/* Logo and Site Name */}
        <div className="helpr-header-logo-section">
          <div className="helpr-nav-logo" onClick={(e) => handleLinkClick('Home', e)} style={{ cursor: 'pointer' }}>
            <div className="helpr-logo-text">Logo</div>
            <div className="helpr-logo-underline">
              <div className="helpr-underline-line helpr-underline-primary"></div>
              <div className="helpr-underline-line helpr-underline-secondary"></div>
            </div>
          </div>
          <div className="helpr-nav-sitename">Helpr Marketplace</div>
        </div>

        {/* Desktop Navigation */}
        <nav className={`helpr-nav-links-wrap ${isMobileMenuOpen ? 'helpr-mobile-menu-open' : ''}`}>
          <div 
            className={`helpr-nav-link ${activeLink === 'Home' ? 'helpr-nav-link-active' : ''}`}
            onClick={(e) => handleLinkClick('Home', e)}
          >
            Home
          </div>
          
          {/* Services Dropdown */}
          <div 
            className={`helpr-nav-link helpr-nav-link-dropdown ${isDropdownOpen ? 'helpr-dropdown-open' : ''} ${activeLink === 'Services' ? 'helpr-nav-link-active' : ''}`}
            onMouseEnter={() => handleServicesHover(true)}
            onMouseLeave={() => handleServicesHover(false)}
            onClick={handleServicesClick}
          >
            Services <span className="helpr-dropdown-arrow">▾</span>
            <div className={`helpr-nav-dropdown-wrap ${isDropdownOpen ? 'helpr-dropdown-visible' : ''}`}>
              <div 
                className="helpr-nav-dropdown-item" 
                onClick={(e) => handleLinkClick('Household', e)}
              >
                Household
              </div>
              <div 
                className="helpr-nav-dropdown-item" 
                onClick={(e) => handleLinkClick('Auto', e)}
              >
                Auto
              </div>
              <div 
                className="helpr-nav-dropdown-item" 
                onClick={(e) => handleLinkClick('Tech', e)}
              >
                Tech
              </div>
            </div>
          </div>
          
          <div 
            className={`helpr-nav-link ${activeLink === 'How It Works' ? 'helpr-nav-link-active' : ''}`}
            onClick={(e) => handleLinkClick('How It Works', e)}
          >
            How it Works
          </div>
          
          <div 
            className={`helpr-nav-link ${activeLink === 'About' ? 'helpr-nav-link-active' : ''}`}
            onClick={(e) => handleLinkClick('About', e)}
          >
            About
          </div>
          
          <div 
            className={`helpr-nav-link ${activeLink === 'Contact' ? 'helpr-nav-link-active' : ''}`}
            onClick={(e) => handleLinkClick('Contact', e)}
          >
            Contact
          </div>

          {/* Mobile Action Buttons */}
          <div className="helpr-mobile-actions">
            <button 
              className="helpr-nav-btn-secondary helpr-mobile-btn" 
              onClick={(e) => handleActionClick('Find a Service', e)}
            >
              Find a Service
            </button>
            <button 
              className="helpr-nav-btn-primary helpr-mobile-btn" 
              onClick={(e) => handleActionClick('Offer a Service', e)}
            >
              Offer a Service
            </button>
          </div>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="helpr-header-actions">
          <button 
            className="helpr-nav-btn-secondary" 
            onClick={(e) => handleActionClick('Find a Service', e)}
          >
            Find a Service
          </button>
          <button 
            className="helpr-nav-btn-primary" 
            onClick={(e) => handleActionClick('Offer a Service', e)}
          >
            Offer a Service
          </button>
        </div>

        {/* Mobile Hamburger Menu */}
        <button 
          className={`helpr-nav-menu-btn ${isMobileMenuOpen ? 'helpr-menu-open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <div className="helpr-hamburger-line"></div>
          <div className="helpr-hamburger-line"></div>
          <div className="helpr-hamburger-line"></div>
        </button>
      </div>
    </header>
  );
};

export default Header;