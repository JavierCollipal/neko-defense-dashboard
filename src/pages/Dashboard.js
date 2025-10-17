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
    fetchData();
    fetchThreatCounts();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/ascii-art');
      const data = await response.json();
      setAsciiArt(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchThreatCounts = async () => {
    try {
      const response = await fetch('/api/threat-counts');
      const result = await response.json();
      if (result.success && result.data) {
        setThreatCounts(result.data);
      }
    } catch (error) {
      console.error('Error fetching threat counts:', error);
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
