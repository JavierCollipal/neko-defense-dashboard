import React from 'react';
import './LoadingSpinner.css';

export const LoadingSpinner = ({ message = 'Loading, nyaa~' }) => {
  return (
    <div className="loading-container">
      <div className="neko-spinner">
        <div className="spinner-paw">🐾</div>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
