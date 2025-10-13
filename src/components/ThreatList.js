// 🐾 Threat List Component - HUNT OPERATION READY 🎯⚡
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5001/api';

function ThreatList({ activeCategory }) {
  const [threatActors, setThreatActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchThreatActors();
  }, [activeCategory]);

  const fetchThreatActors = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🎯 [ThreatList] Fetching threat actors for category:', activeCategory);
      const response = await fetch(`${API_URL}/threat-actors?category=${activeCategory}`);
      const data = await response.json();

      if (data.success) {
        console.log(`✅ [ThreatList] Loaded ${data.count} threat actors, nyaa~!`);
        setThreatActors(data.data);
      } else {
        setError('Failed to load threat actors');
      }
      setLoading(false);
    } catch (error) {
      console.error('❌ [ThreatList] Failed to fetch threat actors:', error);
      setError('Network error - unable to connect to defense system');
      setLoading(false);
    }
  };

  const getCategoryTitle = () => {
    const titles = {
      all: '🎯 ALL THREAT ACTORS',
      predators: '⚠️ PREDATOR THREAT ACTORS',
      pedophiles: '🚨 PEDOPHILE THREAT ACTORS - MASS HUNT TARGET',
      dina_network: '🕸️ DINA NETWORK ACTORS',
      ransomware: '💀 RANSOMWARE GROUPS',
      state_sponsored: '🕷️ STATE-SPONSORED APTs',
      crypto_crime: '₿ CRYPTO CRIME ACTORS'
    };
    return titles[activeCategory] || '🎯 THREAT ACTORS';
  };

  const getThreatLevelColor = (level) => {
    const colors = {
      'CRITICAL': '#ff0033',
      'HIGH': '#ff6600',
      'MEDIUM': '#ffd700',
      'LOW': '#00ff41'
    };
    return colors[level] || '#00ffff';
  };

  if (loading) {
    return (
      <div className="threat-list">
        <h2>{getCategoryTitle()}</h2>
        <div className="loading-hunt">
          <div className="loading-spinner">🐾</div>
          <p>Loading hunt targets, desu~! ⚡</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="threat-list">
        <h2>{getCategoryTitle()}</h2>
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (threatActors.length === 0) {
    return (
      <div className="threat-list">
        <h2>{getCategoryTitle()}</h2>
        <div className="no-threats">
          <span className="success-icon">✅</span>
          <p>No threat actors found in this category, nyaa~!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="threat-list">
      <div className="threat-list-header">
        <h2>{getCategoryTitle()}</h2>
        <div className="hunt-stats">
          <span className="targets-count">{threatActors.length} TARGET{threatActors.length !== 1 ? 'S' : ''}</span>
          <span className="hunt-status">🎯 HUNT ACTIVE</span>
        </div>
      </div>

      <div className="threat-actors-grid">
        {threatActors.map((actor, idx) => (
          <div key={actor._id || idx} className="threat-actor-card">
            <div className="actor-header">
              <div className="actor-rank">#{idx + 1}</div>
              <div
                className="threat-level-badge"
                style={{ backgroundColor: getThreatLevelColor(actor.threat_level) }}
              >
                {actor.threat_level || 'UNKNOWN'}
              </div>
            </div>

            <div className="actor-name">
              <h3>{actor.name || actor.actor_name || 'Unknown Actor'}</h3>
              {actor.aliases && actor.aliases.length > 0 && (
                <div className="actor-aliases">
                  aka: {Array.isArray(actor.aliases) ? actor.aliases.join(', ') : actor.aliases}
                </div>
              )}
            </div>

            <div className="actor-details">
              {actor.type && (
                <div className="detail-item">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{actor.type}</span>
                </div>
              )}

              {actor.actor_classification && (
                <div className="detail-item">
                  <span className="detail-label">Classification:</span>
                  <span className="detail-value">{actor.actor_classification}</span>
                </div>
              )}

              {actor.location && (
                <div className="detail-item">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{actor.location}</span>
                </div>
              )}

              {actor.nation_state && (
                <div className="detail-item">
                  <span className="detail-label">Nation:</span>
                  <span className="detail-value">{actor.nation_state}</span>
                </div>
              )}

              {actor.hunt_priority && (
                <div className="detail-item priority">
                  <span className="detail-label">Hunt Priority:</span>
                  <span className="detail-value">P{actor.hunt_priority}</span>
                </div>
              )}

              {actor.bounty_usd && (
                <div className="detail-item bounty">
                  <span className="detail-label">Bounty:</span>
                  <span className="detail-value">${actor.bounty_usd.toLocaleString()}</span>
                </div>
              )}
            </div>

            {actor.known_for && (
              <div className="actor-known-for">
                <strong>Known For:</strong> {actor.known_for}
              </div>
            )}

            {actor.law_enforcement_status && (
              <div className="law-enforcement-status">
                🚨 {actor.law_enforcement_status}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="threat-list-footer">
        <div className="update-time">
          Last Updated: {new Date().toLocaleString()}
        </div>
        <div className="neko-status">
          *purrs in hunt readiness* 🐾⚡
        </div>
      </div>
    </div>
  );
}

export default ThreatList;
