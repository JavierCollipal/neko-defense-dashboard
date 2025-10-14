// 🐾⚡ NEKO DEFENSE DASHBOARD - Entry Point ⚡🐾
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apollo/client';
import './styles/App.css';
import App from './App';
// 🌍 Initialize i18n for global language support, nyaa~!
import './i18n/config';

console.log('🐾 Starting NEKO DEFENSE DASHBOARD with GraphQL, nyaa~!');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

console.log('✅ NEKO DEFENSE DASHBOARD initialized, desu~!');
