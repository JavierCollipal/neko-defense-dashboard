// 🐾 Defense Stats Component
import React from 'react';
import { useTranslation } from 'react-i18next';

function DefenseStats({ stats }) {
  const { t } = useTranslation();

  if (!stats) {
    return (
      <div className="defense-stats">
        <h2>📊 {t('stats.defense_statistics')}</h2>
        <p>{t('stats.loading_stats')} 🐾</p>
      </div>
    );
  }

  return (
    <div className="defense-stats">
      <h2>📊 {t('stats.header')}</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🗂️</div>
          <div className="stat-value">{stats.total_collections}</div>
          <div className="stat-label">{t('stats.active_collections')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🍯</div>
          <div className="stat-value">5</div>
          <div className="stat-label">{t('stats.honeypot_traps')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{t('stats.active')}</div>
          <div className="stat-label">{t('stats.threat_detection')}</div>
        </div>

        <div className="stat-card kawaii-stat">
          <div className="stat-icon">💖</div>
          <div className="stat-value">{stats.kawaii_level}</div>
          <div className="stat-label">{t('stats.kawaii_power')}</div>
        </div>
      </div>

      {stats.collections && stats.collections.length > 0 && (
        <div className="collections-list">
          <h3>📂 Active Collections</h3>
          <ul>
            {stats.collections.map((col, idx) => (
              <li key={idx}>
                <span className="collection-bullet">🐾</span>
                {col}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="status-message">
        <strong>{stats.status}</strong>
        <div className="timestamp">
          {t('stats.last_update')} {new Date(stats.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default DefenseStats;
