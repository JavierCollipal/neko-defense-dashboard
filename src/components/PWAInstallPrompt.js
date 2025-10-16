import React, { useState, useEffect } from 'react';
import './PWAInstallPrompt.css';

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event for later
      setDeferredPrompt(e);
      // Show our custom install prompt
      setShowPrompt(true);

      console.log('🐾 [PWA] Install prompt ready, nyaa~!');
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`🐾 [PWA] User response: ${outcome}, desu~!`);

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="pwa-install-prompt">
      <div className="prompt-content">
        <div className="prompt-icon">🐾</div>
        <div className="prompt-text">
          <h3>Install Neko Defense!</h3>
          <p>Add to home screen for offline access, nyaa~!</p>
        </div>
        <div className="prompt-actions">
          <button className="btn-install" onClick={handleInstall}>
            Install
          </button>
          <button className="btn-dismiss" onClick={handleDismiss}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
