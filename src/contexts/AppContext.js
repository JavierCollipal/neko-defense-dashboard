'use client';
import React, { createContext, useState, useContext } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('cyberpunk');

  const value = {
    // Mobile menu state
    isMobileMenuOpen,
    setMobileMenuOpen,

    // Theme state
    activeTheme,
    setActiveTheme,

    // Helper functions
    toggleMobileMenu: () => setMobileMenuOpen(prev => !prev),
    closeMobileMenu: () => setMobileMenuOpen(false),
    openMobileMenu: () => setMobileMenuOpen(true)
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for easy access
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
