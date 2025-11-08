// 🐾🛡️ CATEGORY SWITCHER - SPECIAL THREAT TRACKING
import React from 'react';

const CATEGORIES = [
  {
    id: 'all',
    name: 'All Threats',
    icon: '🎯',
    color: '#00ffff'
  },
  {
    id: 'predators',
    name: 'Predators',
    icon: '⚠️',
    color: '#ff0033',
    priority: 'CRITICAL'
  },
  {
    id: 'pedophiles',
    name: 'Pedophiles',
    icon: '🚨',
    color: '#ff0033',
    priority: 'MAXIMUM ALERT'
  },
  {
    id: 'dina_network',
    name: 'DINA Network',
    icon: '🕸️',
    color: '#ff1493',
    priority: 'HIGH'
  },
  {
    id: 'ransomware',
    name: 'Ransomware',
    icon: '💀',
    color: '#ffd700'
  },
  {
    id: 'state_sponsored',
    name: 'State Sponsored',
    icon: '🕷️',
    color: '#ff6600'
  },
  {
    id: 'crypto_crime',
    name: 'Crypto Crime',
    icon: '₿',
    color: '#00ff41'
  }
];

function CategorySwitcher({ activeCategory, onCategoryChange, threatCounts }) {
  return (
    <div className="category-switcher">
      <div className="switcher-header">
        <h2>🛡️ THREAT CATEGORIES</h2>
        <div className="fortress-badge">FORTRESS MODE</div>
      </div>

      <div className="categories-list">
        {CATEGORIES.map(category => (
          <div
            key={category.id}
            className={`category-item ${activeCategory === category.id ? 'active' : ''} ${category.priority ? 'priority' : ''}`}
            onClick={() => onCategoryChange(category.id)}
            style={{ borderLeftColor: category.color }}
          >
            <div className="category-icon">{category.icon}</div>
            <div className="category-info">
              <div className="category-name">{category.name}</div>
              {category.priority && (
                <div className="category-priority">{category.priority}</div>
              )}
              <div className="category-count">
                {threatCounts[category.id] || 0} detected
              </div>
            </div>
            {category.priority && (
              <div className="alert-pulse"></div>
            )}
          </div>
        ))}
      </div>

      <div className="switcher-footer">
        <div className="monitoring-status">
          <span className="status-dot"></span>
          ACTIVE MONITORING
        </div>
        <div className="neko-guardian">
          🐾 Neko Guardian: ON
        </div>
      </div>
    </div>
  );
}

export default CategorySwitcher;
