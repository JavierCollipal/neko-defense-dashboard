// 🐾🛡️ CATEGORY SWITCHER - SPECIAL THREAT TRACKING
import React from 'react';
import { useTranslation } from 'react-i18next';

const getCategoriesWithTranslation = (t) => [
  {
    id: 'all',
    name: t('categories.all_threats'),
    icon: '🎯',
    color: '#00ffff'
  },
  {
    id: 'predators',
    name: t('categories.predators'),
    icon: '⚠️',
    color: '#ff0033',
    priority: t('categories.priority_critical')
  },
  {
    id: 'pedophiles',
    name: t('categories.pedophiles'),
    icon: '🚨',
    color: '#ff0033',
    priority: t('categories.priority_maximum')
  },
  {
    id: 'dina_network',
    name: t('categories.dina_network'),
    icon: '🕸️',
    color: '#ff1493',
    priority: t('categories.priority_high')
  },
  {
    id: 'ransomware',
    name: t('categories.ransomware'),
    icon: '💀',
    color: '#ffd700'
  },
  {
    id: 'state_sponsored',
    name: t('categories.state_sponsored'),
    icon: '🕷️',
    color: '#ff6600'
  },
  {
    id: 'crypto_crime',
    name: t('categories.crypto_crime'),
    icon: '₿',
    color: '#00ff41'
  }
];

function CategorySwitcher({ activeCategory, onCategoryChange, threatCounts }) {
  const { t } = useTranslation();
  const CATEGORIES = getCategoriesWithTranslation(t);

  // 🐾 NEKO PROTECTION: Handle undefined, null, or missing threatCounts
  const safeThreatCounts = threatCounts || {};

  return (
    <div className="category-switcher">
      <div className="switcher-header">
        <h2>🛡️ {t('categories.header')}</h2>
        <div className="fortress-badge">{t('categories.fortress_badge')}</div>
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
                {safeThreatCounts[category.id] || 0} {t('categories.detected')}
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
          {t('categories.active_monitoring')}
        </div>
        <div className="neko-guardian">
          🐾 {t('categories.neko_guardian')}
        </div>
      </div>
    </div>
  );
}

export default CategorySwitcher;
