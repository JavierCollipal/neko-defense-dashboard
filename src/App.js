// 🐾⚡ NEKO DEFENSE DASHBOARD - Main App ⚡🐾
import React, { useState, useEffect } from 'react';
import './styles/App.css';
import CategorySwitcher from './components/CategorySwitcher';
import AsciiTvDisplay from './components/AsciiTvDisplay';
import DefenseStats from './components/DefenseStats';
import ThreatList from './components/ThreatList';
import ThreatActors from './components/ThreatActors';
import DinaDocumentationInternational from './components/DinaDocumentationInternational';

// 🎯 API URL - Express backend runs on port 5001, nyaa~!
// (Has all the threat-actors and DINA endpoints we need!)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function App() {
  const [asciiArt, setAsciiArt] = useState([]);
  const [currentArtIndex, setCurrentArtIndex] = useState(0);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showDinaDoc, setShowDinaDoc] = useState(false);
  const [showThreatActors, setShowThreatActors] = useState(false);
  const [threatCounts, setThreatCounts] = useState({
    all: 0,
    predators: 0,
    pedophiles: 0,
    dina_network: 0,
    ransomware: 0,
    state_sponsored: 0,
    crypto_crime: 0
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      if (asciiArt.length > 0) {
        setCurrentArtIndex(prev => (prev + 1) % asciiArt.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [asciiArt.length]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch ASCII art
      const artResponse = await fetch(API_URL + '/ascii-art');
      const artData = await artResponse.json();
      if (artData.success) setAsciiArt(artData.data);

      // Fetch stats
      const statsResponse = await fetch(API_URL + '/stats');
      const statsData = await statsResponse.json();
      if (statsData.success) setStats(statsData.data);

      // Fetch threat counts from database, nyaa~! 🐾📊
      console.log('📊 [App] Fetching threat counts from database, desu~');
      const countsResponse = await fetch(API_URL + '/threat-counts');
      const countsData = await countsResponse.json();
      if (countsData.success) {
        console.log('✅ [App] Threat counts loaded:', countsData.data);
        setThreatCounts(countsData.data);
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  const openTvWindow = () => {
    const tvWindow = window.open(
      '/tv-window.html',
      'NekoTvStreaming',
      'width=1200,height=800,menubar=no,toolbar=no,location=no,status=no'
    );
    if (tvWindow) {
      tvWindow.focus();
    } else {
      alert('Please allow pop-ups to open NEKO TV Window, nyaa~! 🐾📺');
    }
  };

  const openMultiChannelTv = () => {
    const tvWindow = window.open(
      '/tv-window-tabs.html',
      'NekoMultiChannelTv',
      'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no'
    );
    if (tvWindow) {
      tvWindow.focus();
    } else {
      alert('Please allow pop-ups to open NEKO MULTI-CHANNEL TV, nyaa~! 🐾📺');
    }
  };

  const toggleDinaDoc = () => {
    setShowDinaDoc(!showDinaDoc);
    setShowThreatActors(false);
  };

  const toggleThreatActors = () => {
    setShowThreatActors(!showThreatActors);
    setShowDinaDoc(false);
  };

  const openDinaTvWindow = () => {
    const dinaTvWindow = window.open(
      '/dina-tv-window.html',
      'DinaTvWindow',
      'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no'
    );
    if (dinaTvWindow) {
      dinaTvWindow.focus();
    } else {
      alert('Please allow pop-ups to open DINA JUSTICE TV, nyaa~! 🐾📺⚖️');
    }
  };

  // If Threat Actors view is active, show only that
  if (showThreatActors) {
    return (
      <div className="App">
        <header className="App-header">
          <div className="neko-banner">
            <h1>🐾🎯⚡ THREAT ACTORS REGISTRY ⚡🎯🐾</h1>
            <div className="status-bar">
              <span className="status-indicator active">🔴 LIVE - GLOBAL TRACKING</span>
              <span>THREAT INTELLIGENCE MODE: ACTIVE</span>
              <button className="tv-window-button" onClick={toggleThreatActors}>
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </header>
        <ThreatActors />
      </div>
    );
  }

  // If DINA documentation is active, show only that
  if (showDinaDoc) {
    return (
      <div className="App">
        <header className="App-header">
          <div className="neko-banner">
            <h1>🐾⚖️🌍 DINA INTERNATIONAL HUNT OPERATION 🌍⚖️🐾</h1>
            <div className="status-bar">
              <span className="status-indicator active">🔴 LIVE - GLOBAL DEPLOYMENT</span>
              <span>INTERNATIONAL JUSTICE MODE: ACTIVE</span>
              <button className="tv-window-button" onClick={toggleDinaDoc}>
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </header>
        <DinaDocumentationInternational />
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="neko-banner">
          <h1>🐾⚡ NEKO-ARC DEFENSE SYSTEM ⚡🐾</h1>
          <div className="status-bar">
            <span className="status-indicator active">🔴 LIVE</span>
            <span>FORTRESS MODE: ACTIVE</span>
            <span className="kawaii-meter">KAWAII LEVEL: MAXIMUM 💖</span>
            <button className="tv-window-button" onClick={openTvWindow}>
              📺 NEKO TV
            </button>
            <button className="tv-window-button multi-channel" onClick={openMultiChannelTv}>
              📡 MULTI-CHANNEL TV
            </button>
            <button className="tv-window-button dina-doc" onClick={toggleDinaDoc}>
              ⚖️ DINA DOCS
            </button>
            <button className="tv-window-button dina-tv" onClick={openDinaTvWindow}>
              📺 DINA JUSTICE TV
            </button>
            <button className="tv-window-button threat-actors" onClick={toggleThreatActors}>
              🎯 THREAT ACTORS
            </button>
          </div>
        </div>
      </header>

      <div className="main-container">
        <aside className="sidebar-left">
          <CategorySwitcher
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            threatCounts={threatCounts}
          />
        </aside>

        <main className="dashboard-grid">
          <section className="ascii-tv-section">
            {loading ? (
              <div className="loading">Loading, nyaa~! 🐾</div>
            ) : (
              <AsciiTvDisplay
                artPiece={asciiArt[currentArtIndex]}
                total={asciiArt.length}
                current={currentArtIndex + 1}
              />
            )}
          </section>

          <section className="stats-section">
            <DefenseStats stats={stats} activeCategory={activeCategory} />
          </section>

          <section className="threats-section">
            <ThreatList activeCategory={activeCategory} />
          </section>
        </main>
      </div>

      <footer className="App-footer">
        <p>*purrs in defensive excellence* 😻 | NYA NYA NYA~!</p>
      </footer>
    </div>
  );
}

export default App;
