// 🐾⚡ NEKO DEFENSE DASHBOARD - Main App ⚡🐾
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './styles/App.css';
import CategorySwitcher from './components/CategorySwitcher';
import AsciiTvDisplay from './components/AsciiTvDisplay';
import DefenseStats from './components/DefenseStats';
import ThreatList from './components/ThreatList';
import ThreatActors from './components/ThreatActors';
import DinaDocumentationInternational from './components/DinaDocumentationInternational';
import ValechV2Dashboard from './components/ValechV2Dashboard';
import NekoArcAbilities from './components/NekoArcAbilities';
import LanguageSwitcher from './components/LanguageSwitcher';

// 🎯 API URL - Express backend runs on port 5001, nyaa~!
// (Has all the threat-actors and DINA endpoints we need!)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function App() {
  const { t } = useTranslation();
  const [asciiArt, setAsciiArt] = useState([]);
  const [currentArtIndex, setCurrentArtIndex] = useState(0);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showDinaDoc, setShowDinaDoc] = useState(false);
  const [showValechV2, setShowValechV2] = useState(false);
  const [showThreatActors, setShowThreatActors] = useState(false);
  const [showAbilities, setShowAbilities] = useState(false);
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
      alert(t('alerts.allow_popups'));
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
      alert(t('alerts.allow_popups_multi'));
    }
  };

  const toggleDinaDoc = () => {
    setShowDinaDoc(!showDinaDoc);
    setShowValechV2(false);
    setShowThreatActors(false);
    setShowAbilities(false);
  };

  const toggleValechV2 = () => {
    setShowValechV2(!showValechV2);
    setShowDinaDoc(false);
    setShowThreatActors(false);
    setShowAbilities(false);
  };

  const toggleThreatActors = () => {
    setShowThreatActors(!showThreatActors);
    setShowDinaDoc(false);
    setShowValechV2(false);
    setShowAbilities(false);
  };

  const toggleAbilities = () => {
    setShowAbilities(!showAbilities);
    setShowDinaDoc(false);
    setShowValechV2(false);
    setShowThreatActors(false);
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
      alert(t('alerts.allow_popups_dina'));
    }
  };

  // If Valech V2.0 view is active, show only that
  if (showValechV2) {
    return (
      <div className="App">
        <header className="App-header">
          <div className="neko-banner">
            <h1>🐾🚀💖 VALECH V2.0 UPGRADE SYSTEM 💖🚀🐾</h1>
            <div className="status-bar">
              <span className="status-indicator active">🔴 LIVE - V2.0 DEPLOYED</span>
              <span>MAXIMUM CAPACITY MODE: ACTIVE</span>
              <button className="tv-window-button" onClick={toggleValechV2}>
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </header>
        <ValechV2Dashboard />
      </div>
    );
  }

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

  // If Neko Abilities view is active, show only that
  if (showAbilities) {
    return (
      <div className="App">
        <header className="App-header">
          <div className="neko-banner">
            <h1>🐾⚡✨ NEKO-ARC ABILITIES SHOWCASE ✨⚡🐾</h1>
            <div className="status-bar">
              <span className="status-indicator active">🔴 LIVE - FULL POWER</span>
              <span>ABILITY SHOWCASE MODE: MAXIMUM KAWAII</span>
              <button className="tv-window-button" onClick={toggleAbilities}>
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </header>
        <NekoArcAbilities />
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
          <h1>🐾⚡ {t('app.title')} ⚡🐾</h1>
          <div className="status-bar">
            <span className="status-indicator active">🔴 {t('app.status_live')}</span>
            <span>{t('app.fortress_mode')}</span>
            <span className="kawaii-meter">{t('app.kawaii_level')} 💖</span>
            <LanguageSwitcher />
            <button className="tv-window-button" onClick={openTvWindow}>
              📺 {t('buttons.neko_tv')}
            </button>
            <button className="tv-window-button multi-channel" onClick={openMultiChannelTv}>
              📡 {t('buttons.multi_channel_tv')}
            </button>
            <button className="tv-window-button dina-doc" onClick={toggleDinaDoc}>
              ⚖️ {t('buttons.dina_docs')}
            </button>
            <button className="tv-window-button dina-tv" onClick={openDinaTvWindow}>
              📺 {t('buttons.dina_justice_tv')}
            </button>
            <button className="tv-window-button valech-v2" onClick={toggleValechV2}>
              🚀 {t('buttons.valech_v2')}
            </button>
            <button className="tv-window-button threat-actors" onClick={toggleThreatActors}>
              🎯 {t('buttons.threat_actors')}
            </button>
            <button className="tv-window-button abilities" onClick={toggleAbilities}>
              ⚡ NEKO ABILITIES
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
              <div className="loading">{t('app.loading')} 🐾</div>
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
        <p>{t('app.footer')} 😻</p>
      </footer>
    </div>
  );
}

export default App;
