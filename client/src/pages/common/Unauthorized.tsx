// Unauthorized.tsx
import './unauthorised.css';
import { FaLock, FaArrowLeft, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="overall-unauthorised-page">
      {/* Floating background circles */}
      <div className="floating-circles">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
      
      <div className="unauthorized-container">
        <div className="unauthorized-icon">
          <FaLock className="icon-lock" />
        </div>
        
        <h1 className="unauthorized-title">Access Denied</h1>
        
        <p className="unauthorized-subtitle">
          You don't have permission to view this page
        </p>
        
        <div>
          <button 
            className="action-button"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
            Go Back
          </button>
          
          <button 
            className="action-button"
            onClick={() => navigate('/')}
          >
            <FaHome />
            Home Page
          </button>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;