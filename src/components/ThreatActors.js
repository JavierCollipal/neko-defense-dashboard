// 🐾⚡ THREAT ACTORS REGISTRY - LEGENDARY TRACKING ⚡🐾
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/ThreatActors.css';

// 🎯 API URL - Express backend runs on port 5001 (same as main app), nyaa~!
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function ThreatActors() {
  const { i18n } = useTranslation();
  const [threatActors, setThreatActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedActor, setSelectedActor] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    console.log('🐾 [ThreatActors] Component mounted, fetching data, nyaa~');
    fetchThreatActors();
  }, [i18n.language]); // Refetch when language changes, desu~!

  const fetchThreatActors = async () => {
    const userLang = i18n.language || 'en';
    console.log('🔍 [ThreatActors] Fetching threat actors from API, desu~ | Language:', userLang);
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/threat-actors?lang=${userLang}`);
      console.log('📡 [ThreatActors] Response status:', response.status, '| Language:', userLang);

      const data = await response.json();
      console.log('✅ [ThreatActors] Received data:', { count: data.count, success: data.success });

      if (data.success) {
        setThreatActors(data.data);
        console.log('💖 [ThreatActors] Loaded', data.count, 'threat actors, nyaa~!');
      } else {
        setError('Failed to load threat actors');
        console.error('❌ [ThreatActors] API returned success: false');
      }
      setLoading(false);
    } catch (err) {
      console.error('💥 [ThreatActors] Fetch error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const getThreatLevelColor = (level) => {
    const colors = {
      'CRITICAL': '#ff0055',
      'HIGH': '#ff6b35',
      'MEDIUM': '#ffaa00',
      'LOW': '#88ff88'
    };
    return colors[level] || '#888888';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'individual': '👤',
      'ransomware': '💰',
      'apt': '🎯',
      'group': '👥',
      'state': '🏛️'
    };
    return icons[type] || '⚠️';
  };

  const filteredActors = threatActors.filter(actor => {
    const matchesType = filterType === 'all' || actor.type === filterType;
    const matchesSearch = !searchTerm ||
      (actor.name && actor.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (actor.actor_id && actor.actor_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (actor.aliases && actor.aliases.some(alias =>
        alias && alias.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    return matchesType && matchesSearch;
  });

  console.log('🔎 [ThreatActors] Filtered actors:', {
    total: threatActors.length,
    filtered: filteredActors.length,
    filterType,
    searchTerm
  });

  if (loading) {
    return (
      <div className="threat-actors-container">
        <div className="loading-neko">
          <div className="loading-spinner">🐾</div>
          <p>Loading threat actors, nyaa~!</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="threat-actors-container">
        <div className="error-neko">
          <p>❌ Error loading threat actors: {error}</p>
          <button onClick={fetchThreatActors} className="retry-button">
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="threat-actors-container">
      <div className="threat-actors-header">
        <h2>🎯⚡ THREAT ACTORS REGISTRY ⚡🎯</h2>
        <div className="threat-stats">
          <div className="stat-badge critical">
            <span className="stat-value">{threatActors.length}</span>
            <span className="stat-label">Total Tracked</span>
          </div>
          <div className="stat-badge high">
            <span className="stat-value">
              {threatActors.filter(a => a.status === 'WANTED').length}
            </span>
            <span className="stat-label">FBI Wanted</span>
          </div>
          <div className="stat-badge medium">
            <span className="stat-value">
              ${threatActors.reduce((sum, a) => sum + (a.attribution?.reward_usd || 0), 0).toLocaleString()}
            </span>
            <span className="stat-label">Total Rewards</span>
          </div>
        </div>
      </div>

      <div className="threat-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="🔍 Search by name, ID, or alias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <button
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All Types
          </button>
          <button
            className={`filter-btn ${filterType === 'individual' ? 'active' : ''}`}
            onClick={() => setFilterType('individual')}
          >
            👤 Individual
          </button>
          <button
            className={`filter-btn ${filterType === 'ransomware' ? 'active' : ''}`}
            onClick={() => setFilterType('ransomware')}
          >
            💰 Ransomware
          </button>
          <button
            className={`filter-btn ${filterType === 'apt' ? 'active' : ''}`}
            onClick={() => setFilterType('apt')}
          >
            🎯 APT
          </button>
        </div>
      </div>

      <div className="threat-actors-grid">
        {filteredActors.map((actor, index) => (
          <div
            key={actor.actor_id || actor._id || index}
            className="threat-actor-card"
            onClick={() => setSelectedActor(actor)}
            style={{ borderLeft: `4px solid ${getThreatLevelColor(actor.threat_level)}` }}
          >
            <div className="actor-header">
              <div className="actor-icon">{getTypeIcon(actor.type)}</div>
              <div className="actor-title">
                <h3>{actor.name || 'Unknown Actor'}</h3>
                <span className="actor-id">{actor.actor_id || 'unknown_id'}</span>
              </div>
              <div
                className="threat-badge"
                style={{ backgroundColor: getThreatLevelColor(actor.threat_level) }}
              >
                {actor.threat_level || 'UNKNOWN'}
              </div>
            </div>

            <div className="actor-aliases">
              {actor.aliases && actor.aliases.slice(0, 3).map((alias, i) => (
                <span key={i} className="alias-tag">{alias}</span>
              ))}
            </div>

            <div className="actor-info">
              <div className="info-row">
                <span className="info-label">Origin:</span>
                <span className="info-value">{actor.origin?.country || 'Unknown'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Status:</span>
                <span className={`status-badge ${(actor.status || 'unknown').toLowerCase()}`}>
                  {actor.status || 'Unknown'}
                </span>
              </div>
              {actor.attribution?.reward_usd > 0 && (
                <div className="info-row reward">
                  <span className="info-label">💰 Reward:</span>
                  <span className="info-value">
                    ${actor.attribution.reward_usd.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="actor-categories">
              {actor.categories && actor.categories.slice(0, 2).map((cat, i) => (
                <span key={i} className="category-tag">{cat}</span>
              ))}
            </div>

            <div className="actor-stats">
              <div className="stat-item">
                <span className="stat-icon">🎯</span>
                <span className="stat-text">{actor.evidence?.victim_count || 0} victims</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">💸</span>
                <span className="stat-text">
                  ${((actor.evidence?.financial_damage_usd || 0) / 1000000).toFixed(0)}M damage
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredActors.length === 0 && (
        <div className="no-results">
          <p>😿 No threat actors found matching your filters, nyaa~</p>
        </div>
      )}

      {selectedActor && (
        <div className="modal-overlay" onClick={() => setSelectedActor(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedActor(null)}>
              ✕
            </button>

            <div className="modal-header">
              <div className="modal-icon">{getTypeIcon(selectedActor.type)}</div>
              <div>
                <h2>{selectedActor.name || 'Unknown Actor'}</h2>
                <p className="modal-subtitle">{selectedActor.actor_id || 'unknown_id'}</p>
              </div>
              <div
                className="threat-badge large"
                style={{ backgroundColor: getThreatLevelColor(selectedActor.threat_level) }}
              >
                {selectedActor.threat_level || 'UNKNOWN'}
              </div>
            </div>

            <div className="modal-body">
              <section className="modal-section">
                <h3>🎭 Aliases</h3>
                <div className="alias-list">
                  {selectedActor.aliases && selectedActor.aliases.map((alias, i) => (
                    <span key={i} className="alias-tag large">{alias}</span>
                  ))}
                </div>
              </section>

              <section className="modal-section">
                <h3>📍 Origin & Attribution</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>Country:</strong> {selectedActor.origin?.country || 'Unknown'}
                  </div>
                  <div className="info-item">
                    <strong>State Affiliated:</strong> {selectedActor.origin?.affiliated_state ? '✅ Yes' : '❌ No'}
                  </div>
                  {selectedActor.attribution?.fbi_wanted && (
                    <div className="info-item highlight">
                      <strong>🚨 FBI WANTED</strong>
                    </div>
                  )}
                  {selectedActor.attribution?.reward_usd > 0 && (
                    <div className="info-item highlight">
                      <strong>💰 Reward:</strong> ${selectedActor.attribution.reward_usd.toLocaleString()}
                    </div>
                  )}
                </div>
              </section>

              <section className="modal-section">
                <h3>🎯 Threat Categories</h3>
                <div className="category-list">
                  {selectedActor.categories && selectedActor.categories.map((cat, i) => (
                    <span key={i} className="category-tag large">{cat}</span>
                  ))}
                </div>
              </section>

              <section className="modal-section">
                <h3>🔧 Technical Profile</h3>
                <div className="technical-info">
                  {selectedActor.technical_profile?.malware_families && (
                    <div className="tech-item">
                      <strong>Malware:</strong>
                      <div className="tech-tags">
                        {selectedActor.technical_profile.malware_families.map((m, i) => (
                          <span key={i} className="tech-tag">{m}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedActor.technical_profile?.attack_vectors && (
                    <div className="tech-item">
                      <strong>Attack Vectors:</strong>
                      <ul>
                        {selectedActor.technical_profile.attack_vectors.slice(0, 5).map((v, i) => (
                          <li key={i}>{v}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>

              <section className="modal-section">
                <h3>📊 Evidence & Impact</h3>
                <div className="evidence-stats">
                  <div className="evidence-stat">
                    <div className="stat-number">{selectedActor.evidence?.victim_count || 0}</div>
                    <div className="stat-label">Victims</div>
                  </div>
                  <div className="evidence-stat">
                    <div className="stat-number">
                      ${((selectedActor.evidence?.financial_damage_usd || 0) / 1000000).toFixed(0)}M
                    </div>
                    <div className="stat-label">Financial Damage</div>
                  </div>
                  <div className="evidence-stat">
                    <div className="stat-number">{selectedActor.evidence?.known_incidents?.length || 0}</div>
                    <div className="stat-label">Known Incidents</div>
                  </div>
                </div>
                {selectedActor.evidence?.known_incidents && (
                  <div className="incidents-list">
                    <strong>Notable Incidents:</strong>
                    <ul>
                      {selectedActor.evidence.known_incidents.slice(0, 5).map((incident, i) => (
                        <li key={i}>{incident}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>

              <section className="modal-section">
                <h3>🔍 Intelligence</h3>
                <div className="intelligence-info">
                  <div className="info-item">
                    <strong>Sources:</strong> {selectedActor.intelligence?.sources?.join(', ')}
                  </div>
                  <div className="info-item">
                    <strong>Confidence:</strong>
                    <span className={`confidence-badge ${selectedActor.intelligence?.confidence_level?.toLowerCase()}`}>
                      {selectedActor.intelligence?.confidence_level}
                    </span>
                  </div>
                  <div className="info-item">
                    <strong>Last Updated:</strong> {new Date(selectedActor.intelligence?.last_updated).toLocaleDateString()}
                  </div>
                </div>
              </section>

              {selectedActor.hunting_status?.notes && (
                <section className="modal-section">
                  <h3>🐾 Hunting Notes</h3>
                  <p className="hunting-notes">{selectedActor.hunting_status.notes}</p>
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThreatActors;
