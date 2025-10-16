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
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchData();
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

  return (
    <div className="dashboard-page">
      {!isMobile && (
        <aside className="dashboard-sidebar">
          <CategorySwitcher
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </aside>
      )}

      <div className="dashboard-content">
        {isMobile && (
          <div className="mobile-category-select">
            <CategorySwitcher
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
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
