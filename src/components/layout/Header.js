import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useIsMobile } from '../../hooks/useMediaQuery';
import './Header.css';

export const Header = () => {
  const { toggleMobileMenu } = useApp();
  const isMobile = useIsMobile();

  return (
    <header className="app-header">
      <div className="header-top">
        {isMobile && (
          <button
            className="hamburger-btn"
            onClick={toggleMobileMenu}
            aria-label="Open menu"
          >
            <span className="hamburger-icon">☰</span>
          </button>
        )}

        <div className="neko-banner">
          <h1>🐾 NEKO DEFENSE SYSTEM ⚡</h1>
        </div>

        {!isMobile && (
          <div className="header-actions">
            <button className="tv-window-button">📺 TV Windows</button>
          </div>
        )}
      </div>

      {!isMobile && (
        <div className="status-bar">
          <div className="status-indicator active">
            <span className="status-dot"></span>
            THREAT MONITORING: ACTIVE
          </div>
          <div className="kawaii-meter">
            💖 KAWAII LEVEL: ∞
          </div>
        </div>
      )}
    </header>
  );
};
