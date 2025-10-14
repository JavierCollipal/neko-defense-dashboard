// 🐾 Threat List Component - HUNT OPERATION READY 🎯⚡
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const API_URL = 'http://localhost:5001/api';

function ThreatList({ activeCategory }) {
  const { t } = useTranslation();
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
        setError(t('threats.failed_to_load'));
      }
      setLoading(false);
    } catch (error) {
      console.error('❌ [ThreatList] Failed to fetch threat actors:', error);
      setError(t('threats.network_error'));
      setLoading(false);
    }
  };

  const getCategoryTitle = () => {
    const titles = {
      all: `🎯 ${t('threats.all_threat_actors')}`,
      predators: `⚠️ ${t('threats.predator_threat_actors')}`,
      pedophiles: `🚨 ${t('threats.pedophile_threat_actors')}`,
      dina_network: `🕸️ ${t('threats.dina_network_actors')}`,
      ransomware: `💀 ${t('threats.ransomware_groups')}`,
      state_sponsored: `🕷️ ${t('threats.state_sponsored_apts')}`,
      crypto_crime: `₿ ${t('threats.crypto_crime_actors')}`
    };
    return titles[activeCategory] || `🎯 ${t('threats.threat_actors')}`;
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
          <p>{t('threats.loading_hunt_targets')} ⚡</p>
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
          <p>{t('threats.no_threats_found')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="threat-list">
      <div className="threat-list-header">
        <h2>{getCategoryTitle()}</h2>
        <div className="hunt-stats">
          <span className="targets-count">{threatActors.length} {threatActors.length !== 1 ? t('threats.targets') : t('threats.target')}</span>
          <span className="hunt-status">🎯 {t('threats.hunt_active')}</span>
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
                {actor.threat_level || t('threats.unknown')}
              </div>
            </div>

            <div className="actor-name">
              <h3>{actor.name || actor.actor_name || t('threats.unknown_actor')}</h3>
              {actor.aliases && actor.aliases.length > 0 && (
                <div className="actor-aliases">
                  {t('threats.aka')} {Array.isArray(actor.aliases) ? actor.aliases.join(', ') : actor.aliases}
                </div>
              )}
            </div>

            <div className="actor-details">
              {actor.type && (
                <div className="detail-item">
                  <span className="detail-label">{t('threats.type')}</span>
                  <span className="detail-value">{actor.type}</span>
                </div>
              )}

              {actor.actor_classification && (
                <div className="detail-item">
                  <span className="detail-label">{t('threats.classification')}</span>
                  <span className="detail-value">{actor.actor_classification}</span>
                </div>
              )}

              {actor.location && (
                <div className="detail-item">
                  <span className="detail-label">{t('threats.location')}</span>
                  <span className="detail-value">{actor.location}</span>
                </div>
              )}

              {actor.nation_state && (
                <div className="detail-item">
                  <span className="detail-label">{t('threats.nation')}</span>
                  <span className="detail-value">{actor.nation_state}</span>
                </div>
              )}

              {actor.hunt_priority && (
                <div className="detail-item priority">
                  <span className="detail-label">{t('threats.hunt_priority')}</span>
                  <span className="detail-value">P{actor.hunt_priority}</span>
                </div>
              )}

              {actor.bounty_usd && (
                <div className="detail-item bounty">
                  <span className="detail-label">{t('threats.bounty')}</span>
                  <span className="detail-value">${actor.bounty_usd.toLocaleString()}</span>
                </div>
              )}
            </div>

            {actor.known_for && (
              <div className="actor-known-for">
                <strong>{t('threats.known_for')}</strong> {actor.known_for}
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
          {t('threats.last_updated')} {new Date().toLocaleString()}
        </div>
        <div className="neko-status">
          {t('threats.purrs_hunt_readiness')} 🐾⚡
        </div>
      </div>
    </div>
  );
}

export default ThreatList;
