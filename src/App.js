// 🐾⚡ NEKO DEFENSE DASHBOARD - Mobile-First Edition ⚡🐾
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import ThreatActors from './components/ThreatActors';
import ValechV2Dashboard from './components/ValechV2Dashboard';
import DinaDocumentationInternational from './components/DinaDocumentationInternational';
import NekoArcAbilities from './components/NekoArcAbilities';
import VideoMaker from './components/VideoMaker';
import IngestionEnrichmentDashboard from './components/IngestionEnrichmentDashboard';
import './styles/App.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/threats" element={<ThreatActors />} />
            <Route path="/valech" element={<ValechV2Dashboard />} />
            <Route path="/dina" element={<DinaDocumentationInternational />} />
            <Route path="/abilities" element={<NekoArcAbilities />} />
            <Route path="/video" element={<VideoMaker />} />
            <Route path="/rag" element={<IngestionEnrichmentDashboard />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
