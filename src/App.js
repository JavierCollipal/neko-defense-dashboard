// 🐾⚡ NEKO DEFENSE DASHBOARD - Mobile-First Edition ⚡🐾
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { Layout } from './components/layout/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import './styles/App.css';

// Eager load: Dashboard (home page)
import { Dashboard } from './pages/Dashboard';

// Lazy load: All other pages for code splitting
const ThreatActors = lazy(() => import('./components/ThreatActors'));
const ValechV2Dashboard = lazy(() => import('./components/ValechV2Dashboard'));
const DinaDocumentationInternational = lazy(() => import('./components/DinaDocumentationInternational'));
const NekoArcAbilities = lazy(() => import('./components/NekoArcAbilities'));
const VideoMaker = lazy(() => import('./components/VideoMaker'));
const IngestionEnrichmentDashboard = lazy(() => import('./components/IngestionEnrichmentDashboard'));

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<LoadingSpinner message="Loading, nyaa~! 🐾" />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/threats" element={<ThreatActors />} />
              <Route path="/valech" element={<ValechV2Dashboard />} />
              <Route path="/dina" element={<DinaDocumentationInternational />} />
              <Route path="/abilities" element={<NekoArcAbilities />} />
              <Route path="/video" element={<VideoMaker />} />
              <Route path="/rag" element={<IngestionEnrichmentDashboard />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
