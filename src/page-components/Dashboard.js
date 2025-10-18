import React, { useState, useEffect } from 'react';
import AsciiTvDisplay from '../components/AsciiTvDisplay';
import DefenseStats from '../components/DefenseStats';
import ThreatList from '../components/ThreatList';
import CategorySwitcher from '../components/CategorySwitcher';
import { useIsMobile } from '../hooks/useMediaQuery';
import './Dashboard.css';

export const Dashboard = () => {
  const [asciiArt, setAsciiArt] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [threatCounts, setThreatCounts] = useState({
    all: 0,
    predators: 0,
    pedophiles: 0,
    dina_network: 0,
    ransomware: 0,
    state_sponsored: 0,
    crypto_crime: 0
  });
  const isMobile = useIsMobile();

  useEffect(() => {
    console.log('🐾 [Dashboard] useEffect triggered - fetching data, nyaa~!');
    fetchData();
    fetchThreatCounts();
  }, []);

  const fetchData = async () => {
    try {
      console.log('🎨 [Dashboard] Fetching ASCII art from /api/ascii-art...');
      const response = await fetch('/api/ascii-art');
      console.log('🎨 [Dashboard] ASCII art response received:', response.status);
      const data = await response.json();
      console.log('🎨 [Dashboard] ASCII art data:', data);
      setAsciiArt(data);
    } catch (error) {
      console.error('❌ [Dashboard] Error fetching ASCII art:', error);
    }
  };

  const fetchThreatCounts = async () => {
    try {
      console.log('📊 [Dashboard] Fetching threat counts from /api/threat-counts...');
      const response = await fetch('/api/threat-counts');
      console.log('📊 [Dashboard] Threat counts response received:', response.status);
      const result = await response.json();
      console.log('📊 [Dashboard] Threat counts data:', result);
      if (result.success && result.data) {
        setThreatCounts(result.data);
      }
    } catch (error) {
      console.error('❌ [Dashboard] Error fetching threat counts:', error);
      // Keep default counts on error
    }
  };

  return (
    <div className="dashboard-page">
      {!isMobile && (
        <aside className="dashboard-sidebar">
          <CategorySwitcher
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            threatCounts={threatCounts}
          />
        </aside>
      )}

      <div className="dashboard-content">
        {isMobile && (
          <div className="mobile-category-select">
            <CategorySwitcher
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              threatCounts={threatCounts}
            />
          </div>
        )}

        <div className="dashboard-grid">
          <section className="ascii-tv-section">
            <AsciiTvDisplay asciiArt={asciiArt} />
          </section>

          <section className="stats-section">
            <DefenseStats />
          </section>

          <section className="threats-section">
            <ThreatList activeCategory={activeCategory} />
          </section>
        </div>
      </div>
    </div>
  );
};
