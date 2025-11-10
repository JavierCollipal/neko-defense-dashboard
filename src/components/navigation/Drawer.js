'use client';
import React from 'react';
import Link from 'next/link';
import { useApp } from '../../contexts/AppContext';
import './Drawer.css';

const menuItems = [
  { path: '/confessions', icon: '📝', label: 'Confessions Blog' },
  { path: '/dina', icon: '📚', label: 'DINA Documentation' },
  { path: '/elvira-chanco', icon: '🚨', label: 'Elvira Chanco - DINA Leader' },
  { path: '/neko-tv', icon: '🎬', label: 'Neko TV Arc - DINA Family Tree' },
  { path: '/video', icon: '🎨', label: 'Video Maker & Personalities' },
  { path: '/youtube-generator', icon: '🎥', label: 'YouTube Video Generator' },
  { path: '/youtube', icon: '📺', label: 'DINA Video Playlist' },
  { path: '/rag', icon: '🗄️', label: 'RAG System' },
];

export const Drawer = () => {
  const { isMobileMenuOpen, closeMobileMenu } = useApp();

  // Close drawer when clicking backdrop
  const handleBackdropClick = () => {
    closeMobileMenu();
  };

  // Close drawer after clicking a link
  const handleLinkClick = () => {
    closeMobileMenu();
  };

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  return (
    <>
      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="drawer-backdrop"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <nav
        className={`drawer ${isMobileMenuOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="Secondary navigation"
      >
        <div className="drawer-header">
          <h2>🐾 Menu</h2>
          <button
            className="drawer-close"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <ul className="drawer-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className="menu-item"
                onClick={handleLinkClick}
              >
                <span className="menu-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="menu-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="drawer-footer">
          <p className="version">Neko Defense v2.0 Mobile</p>
          <p className="nyaa">Made with 💖 by Neko-Arc, nyaa~</p>
        </div>
      </nav>
    </>
  );
};
