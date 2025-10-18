// 🐾⚡ NEKO DEFENSE DASHBOARD - Mobile-First Edition ⚡🐾
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { Layout } from './components/layout/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import './styles/App.css';

// Eager load: Dashboard (home page)
import { Dashboard } from './page-components/Dashboard';

// Lazy load: All other pages for code splitting
const ThreatActors = lazy(() => import('./components/ThreatActors'));
const ValechV2Dashboard = lazy(() => import('./components/ValechV2Dashboard'));
const DinaDocumentationInternational = lazy(() => import('./components/DinaDocumentationInternational'));
const NekoArcAbilities = lazy(() => import('./components/NekoArcAbilities'));
const VideoMaker = lazy(() => import('./components/VideoMaker'));
const YouTubeVideoGenerator = lazy(() => import('./components/YouTubeVideoGenerator'));
const YouTubePlaylist = lazy(() => import('./components/YouTubePlaylist'));
const IngestionEnrichmentDashboard = lazy(() => import('./components/IngestionEnrichmentDashboard'));
const ConfessionsBlog = lazy(() => import('./components/ConfessionsBlog'));

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
              <Route path="/youtube-generator" element={<YouTubeVideoGenerator />} />
              <Route path="/youtube" element={<YouTubePlaylist />} />
              <Route path="/rag" element={<IngestionEnrichmentDashboard />} />
              <Route path="/confessions" element={<ConfessionsBlog />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
