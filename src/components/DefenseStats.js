// 🐾 Defense Stats Component
import React from 'react';

function DefenseStats({ stats }) {
  if (!stats) {
    return (
      <div className="defense-stats">
        <h2>📊 Defense Statistics</h2>
        <p>Loading stats, nyaa~! 🐾</p>
      </div>
    );
  }

  return (
    <div className="defense-stats">
      <h2>📊 DEFENSE SYSTEM STATUS</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🗂️</div>
          <div className="stat-value">{stats.total_collections}</div>
          <div className="stat-label">Active Collections</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🍯</div>
          <div className="stat-value">5</div>
          <div className="stat-label">Honeypot Traps</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">ACTIVE</div>
          <div className="stat-label">Threat Detection</div>
        </div>

        <div className="stat-card kawaii-stat">
          <div className="stat-icon">💖</div>
          <div className="stat-value">{stats.kawaii_level}</div>
          <div className="stat-label">Kawaii Power</div>
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
          Last Update: {new Date(stats.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default DefenseStats;
