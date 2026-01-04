import React from 'react';
import './footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="helpr-footer-wrap">
      <div className="helpr-footer-container">
        <div className="helpr-footer-content">
          <p className="helpr-footer-copyright">
            &copy; {currentYear} Helpr Marketplace. 
            <span className="helpr-footer-developer">
              Developed by Kinstry Systems • 
              <a 
                href="https://kinstryx.co.ke/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="helpr-footer-link"
              >
                kinstryx.co.ke
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;