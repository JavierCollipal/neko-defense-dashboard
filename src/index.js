// 🐾⚡ NEKO DEFENSE DASHBOARD - Entry Point ⚡🐾
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apollo/client';
import './styles/App.css';
import App from './App';
// 🌍 Initialize i18n for global language support, nyaa~!
import './i18n/config';
// 📱 PWA Service Worker Registration
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

console.log('🐾 Starting NEKO DEFENSE DASHBOARD with GraphQL, nyaa~!');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

// Register service worker for PWA support
serviceWorkerRegistration.register({
  onSuccess: () =>
    console.log('🐾 [PWA] Service worker registered successfully, nyaa~!'),
  onUpdate: (registration) => {
    console.log('🐾 [PWA] New version available, desu~!');
    // Auto-update after confirmation
    if (window.confirm('New version available! Reload to update?')) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  },
});

console.log('✅ NEKO DEFENSE DASHBOARD initialized, desu~!');
