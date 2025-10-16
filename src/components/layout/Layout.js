import React from 'react';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { BottomTabs } from '../navigation/BottomTabs';
import { Drawer } from '../navigation/Drawer';
import { Header } from './Header';
import PWAInstallPrompt from '../PWAInstallPrompt';
import './Layout.css';

export const Layout = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="layout">
      <Header />
      <Drawer />

      <main className="layout-main">
        {children}
      </main>

      {isMobile && <BottomTabs />}

      <PWAInstallPrompt />

      <footer className="layout-footer">
        <p>🐾 Neko Defense System - Mobile-First PWA Edition</p>
        <p>Protecting the digital realm with MAXIMUM KAWAII POWER! 💖</p>
      </footer>
    </div>
  );
};
