import React from 'react';
import './spinner.css'

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'medium', 
  color = '#4361ee',
  className = ''
}) => {
  const sizeMap = {
    small: 20,
    medium: 40,
    large: 60
  };

  const spinnerSize = sizeMap[size];

  return (
    <div className={`spinner-container ${className}`}>
      <div 
        className="spinner"
        style={{
          width: `${spinnerSize}px`,
          height: `${spinnerSize}px`,
          borderColor: color
        }}
      >
        <div className="spinner-inner"></div>
      </div>
    </div>
  );
};

export default Spinner;