// 🐾⚡ VALECH DATA VIEWER - Read Actual Victim Data ⚡🐾
import React, { useState, useEffect } from 'react';
import '../styles/ValechDataViewer.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function ValechDataViewer() {
  const [victims, setVictims] = useState([]);
  const [stats, setStats] = useState(null);
  const [detentionCenters, setDetentionCenters] = useState([]);
  const [perpetrators, setPerpetrators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('list'); // 'list', 'stats', 'detail'
  const [selectedVictim, setSelectedVictim] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    outcome: '',
    detentionCenter: '',
    perpetrator: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [victimsRes, statsRes, centersRes, perpetratorsRes] = await Promise.all([
        fetch(`${API_URL}/valech?limit=100`),
        fetch(`${API_URL}/valech/stats/all`),
        fetch(`${API_URL}/valech/lists/detention-centers`),
        fetch(`${API_URL}/valech/lists/perpetrators`),
      ]);

      const victimsData = await victimsRes.json();
      const statsData = await statsRes.json();
      const centersData = await centersRes.json();
      const perpetratorsData = await perpetratorsRes.json();

      if (victimsData.success) setVictims(victimsData.data);
      if (statsData.success) setStats(statsData.data);
      if (centersData.success) setDetentionCenters(centersData.data);
      if (perpetratorsData.success) setPerpetrators(perpetratorsData.data);

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch Valech data:', error);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);

      let url = `${API_URL}/valech/search/advanced?`;
      const params = [];

      if (filters.search) params.push(`name=${encodeURIComponent(filters.search)}`);
      if (filters.outcome) params.push(`outcome=${encodeURIComponent(filters.outcome)}`);
      if (filters.detentionCenter) params.push(`detentionCenter=${encodeURIComponent(filters.detentionCenter)}`);
      if (filters.perpetrator) params.push(`perpetrator=${encodeURIComponent(filters.perpetrator)}`);

      url += params.join('&');

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setVictims(data.data);
      }

      setLoading(false);
    } catch (error) {
      console.error('Search failed:', error);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      search: '',
      outcome: '',
      detentionCenter: '',
      perpetrator: '',
    });
    fetchData();
  };

  const viewVictimDetail = (victim) => {
    setSelectedVictim(victim);
    setActiveView('detail');
  };

  const getOutcomeColor = (outcome) => {
    if (!outcome) return 'outcome-unknown';
    if (outcome.includes('SURVIVED')) return 'outcome-survived';
    if (outcome.includes('EXECUTED')) return 'outcome-executed';
    if (outcome.includes('DISAPPEARED')) return 'outcome-disappeared';
    if (outcome.includes('ASSASSINATED')) return 'outcome-assassinated';
    return 'outcome-unknown';
  };

  if (loading) {
    return (
      <div className="valech-viewer-container">
        <div className="valech-loading">
          🐾 Loading Valech data, nyaa~... ⚡
        </div>
      </div>
    );
  }

  return (
    <div className="valech-viewer-container">
      {/* Header */}
      <div className="valech-viewer-header">
        <h1>🕊️⚖️ VALECH HISTORICAL RECORDS ⚖️🕊️</h1>
        <p className="valech-viewer-tagline">
          Chilean Truth Commission Victim Database - Complete Documentation
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="valech-viewer-navigation">
        <button
          className={`viewer-nav-tab ${activeView === 'list' ? 'active' : ''}`}
          onClick={() => setActiveView('list')}
        >
          📋 VICTIM LIST
        </button>
        <button
          className={`viewer-nav-tab ${activeView === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveView('stats')}
        >
          📊 STATISTICS
        </button>
        {selectedVictim && (
          <button
            className={`viewer-nav-tab ${activeView === 'detail' ? 'active' : ''}`}
            onClick={() => setActiveView('detail')}
          >
            🔍 DETAIL VIEW
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="valech-viewer-content">

        {/* LIST VIEW */}
        {activeView === 'list' && (
          <div className="list-view">
            {/* Filters */}
            <div className="filters-section">
              <h3>🔍 Search & Filter</h3>
              <div className="filters-grid">
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="filter-input"
                />

                <select
                  value={filters.outcome}
                  onChange={(e) => setFilters({ ...filters, outcome: e.target.value })}
                  className="filter-select"
                >
                  <option value="">All Outcomes</option>
                  <option value="SURVIVED">Survived</option>
                  <option value="EXECUTED">Executed</option>
                  <option value="DISAPPEARED">Disappeared</option>
                  <option value="ASSASSINATED">Assassinated</option>
                </select>

                <select
                  value={filters.detentionCenter}
                  onChange={(e) => setFilters({ ...filters, detentionCenter: e.target.value })}
                  className="filter-select"
                >
                  <option value="">All Detention Centers</option>
                  {detentionCenters.slice(0, 20).map((center, idx) => (
                    <option key={idx} value={center}>{center}</option>
                  ))}
                </select>

                <select
                  value={filters.perpetrator}
                  onChange={(e) => setFilters({ ...filters, perpetrator: e.target.value })}
                  className="filter-select"
                >
                  <option value="">All Perpetrators</option>
                  {perpetrators.slice(0, 20).map((perp, idx) => (
                    <option key={idx} value={perp}>{perp}</option>
                  ))}
                </select>
              </div>

              <div className="filter-buttons">
                <button className="search-button" onClick={handleSearch}>
                  🔍 Search
                </button>
                <button className="reset-button" onClick={handleReset}>
                  🔄 Reset
                </button>
              </div>
            </div>

            {/* Victims Table */}
            <div className="victims-table-section">
              <h3>📋 Victims ({victims.length})</h3>
              <div className="victims-table-container">
                <table className="victims-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Outcome</th>
                      <th>Detention Centers</th>
                      <th>Linked Perpetrators</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {victims.map((victim) => (
                      <tr key={victim._id}>
                        <td className="victim-name">{victim.fullName}</td>
                        <td>{victim.age || 'N/A'}</td>
                        <td>{victim.gender || 'N/A'}</td>
                        <td>
                          <span className={`outcome-badge ${getOutcomeColor(victim.outcome)}`}>
                            {victim.outcome || 'UNKNOWN'}
                          </span>
                        </td>
                        <td className="detention-centers-cell">
                          {victim.detentionCenters && victim.detentionCenters.length > 0
                            ? victim.detentionCenters.map(c => c.name).join(', ')
                            : 'N/A'}
                        </td>
                        <td className="perpetrators-cell">
                          {victim.linkedPerpetrators && victim.linkedPerpetrators.length > 0
                            ? victim.linkedPerpetrators.join(', ')
                            : 'None'}
                        </td>
                        <td>
                          <button
                            className="view-detail-button"
                            onClick={() => viewVictimDetail(victim)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* STATS VIEW */}
        {activeView === 'stats' && stats && (
          <div className="stats-view">
            <h2>📊 Database Statistics</h2>

            <div className="stats-grid">
              <div className="stat-card total">
                <div className="stat-icon">📊</div>
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Total Victims</div>
              </div>

              <div className="stat-card survived">
                <div className="stat-icon">✅</div>
                <div className="stat-number">{stats.survived}</div>
                <div className="stat-label">Survived</div>
              </div>

              <div className="stat-card executed">
                <div className="stat-icon">💀</div>
                <div className="stat-number">{stats.executed}</div>
                <div className="stat-label">Executed</div>
              </div>

              <div className="stat-card disappeared">
                <div className="stat-icon">👻</div>
                <div className="stat-number">{stats.disappeared}</div>
                <div className="stat-label">Disappeared</div>
              </div>

              <div className="stat-card assassinated">
                <div className="stat-icon">⚡</div>
                <div className="stat-number">{stats.assassinated}</div>
                <div className="stat-label">Assassinated</div>
              </div>

              <div className="stat-card male">
                <div className="stat-icon">👨</div>
                <div className="stat-number">{stats.male}</div>
                <div className="stat-label">Male</div>
              </div>

              <div className="stat-card female">
                <div className="stat-icon">👩</div>
                <div className="stat-number">{stats.female}</div>
                <div className="stat-label">Female</div>
              </div>

              <div className="stat-card testimony">
                <div className="stat-icon">📖</div>
                <div className="stat-number">{stats.withTestimony}</div>
                <div className="stat-label">With Testimony</div>
              </div>

              <div className="stat-card linked">
                <div className="stat-icon">🔗</div>
                <div className="stat-number">{stats.withLinkedPerpetrators}</div>
                <div className="stat-label">Linked to Perpetrators</div>
              </div>
            </div>

            {/* Detention Centers */}
            <div className="detention-centers-section">
              <h3>🏛️ Detention Centers ({detentionCenters.length})</h3>
              <div className="detention-centers-list">
                {detentionCenters.slice(0, 15).map((center, idx) => (
                  <div key={idx} className="detention-center-chip">
                    {center}
                  </div>
                ))}
              </div>
            </div>

            {/* Perpetrators */}
            <div className="perpetrators-section">
              <h3>👤 Known Perpetrators ({perpetrators.length})</h3>
              <div className="perpetrators-list">
                {perpetrators.slice(0, 15).map((perp, idx) => (
                  <div key={idx} className="perpetrator-chip">
                    {perp}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DETAIL VIEW */}
        {activeView === 'detail' && selectedVictim && (
          <div className="detail-view">
            <button className="back-button" onClick={() => setActiveView('list')}>
              ← Back to List
            </button>

            <div className="victim-detail-card">
              <h2>{selectedVictim.fullName}</h2>

              <div className="detail-section">
                <h3>👤 Personal Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>ID Number:</strong> {selectedVictim.idNumber || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Age:</strong> {selectedVictim.age || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Gender:</strong> {selectedVictim.gender || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Occupation:</strong> {selectedVictim.occupation || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Political Affiliation:</strong> {selectedVictim.politicalAffiliation || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Outcome:</strong>
                    <span className={`outcome-badge ${getOutcomeColor(selectedVictim.outcome)}`}>
                      {selectedVictim.outcome || 'UNKNOWN'}
                    </span>
                  </div>
                </div>
              </div>

              {selectedVictim.detentionInfo && (
                <div className="detail-section">
                  <h3>🔒 Detention Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <strong>Arrested:</strong> {selectedVictim.detentionInfo.arrested
                        ? new Date(selectedVictim.detentionInfo.arrested).toLocaleDateString()
                        : 'N/A'}
                    </div>
                    <div className="detail-item">
                      <strong>Released:</strong> {selectedVictim.detentionInfo.released
                        ? new Date(selectedVictim.detentionInfo.released).toLocaleDateString()
                        : 'N/A'}
                    </div>
                    <div className="detail-item">
                      <strong>Duration:</strong> {selectedVictim.detentionInfo.duration
                        ? `${selectedVictim.detentionInfo.duration} days`
                        : 'N/A'}
                    </div>
                    <div className="detail-item full-width">
                      <strong>Circumstances:</strong> {selectedVictim.detentionInfo.circumstances || 'N/A'}
                    </div>
                  </div>
                </div>
              )}

              {selectedVictim.detentionCenters && selectedVictim.detentionCenters.length > 0 && (
                <div className="detail-section">
                  <h3>🏛️ Detention Centers</h3>
                  {selectedVictim.detentionCenters.map((center, idx) => (
                    <div key={idx} className="detention-center-detail">
                      <strong>{center.name}</strong>
                      {center.codeName && ` (${center.codeName})`}
                      {center.datesHeld && (
                        <div className="dates-held">
                          From: {center.datesHeld.from ? new Date(center.datesHeld.from).toLocaleDateString() : 'N/A'} →
                          To: {center.datesHeld.to ? new Date(center.datesHeld.to).toLocaleDateString() : 'N/A'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedVictim.tortureReported && (
                <div className="detail-section">
                  <h3>⚠️ Torture Reported</h3>
                  {selectedVictim.tortureReported.methods && selectedVictim.tortureReported.methods.length > 0 && (
                    <div className="detail-subsection">
                      <strong>Methods:</strong>
                      <ul>
                        {selectedVictim.tortureReported.methods.map((method, idx) => (
                          <li key={idx}>{method}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedVictim.tortureReported.perpetrators && selectedVictim.tortureReported.perpetrators.length > 0 && (
                    <div className="detail-subsection">
                      <strong>Perpetrators:</strong>
                      <ul>
                        {selectedVictim.tortureReported.perpetrators.map((perp, idx) => (
                          <li key={idx}>{perp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedVictim.tortureReported.medicalConsequences && (
                    <div className="detail-subsection">
                      <strong>Medical Consequences:</strong>
                      <p>{selectedVictim.tortureReported.medicalConsequences}</p>
                    </div>
                  )}
                </div>
              )}

              {selectedVictim.testimonyText && (
                <div className="detail-section">
                  <h3>📖 Testimony</h3>
                  <div className="testimony-text">
                    {selectedVictim.testimonyText}
                  </div>
                </div>
              )}

              {selectedVictim.linkedPerpetrators && selectedVictim.linkedPerpetrators.length > 0 && (
                <div className="detail-section">
                  <h3>🔗 Linked Perpetrators</h3>
                  <div className="linked-perpetrators-list">
                    {selectedVictim.linkedPerpetrators.map((perp, idx) => (
                      <div key={idx} className="linked-perpetrator-chip">
                        {perp}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedVictim.significance && (
                <div className="detail-section">
                  <h3>⭐ Significance</h3>
                  <p>{selectedVictim.significance}</p>
                </div>
              )}

              {selectedVictim.source && (
                <div className="detail-section">
                  <h3>📚 Source</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <strong>Commission:</strong> {selectedVictim.source.commission || 'N/A'}
                    </div>
                    <div className="detail-item">
                      <strong>Verification:</strong> {selectedVictim.source.verificationStatus || 'N/A'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="valech-viewer-footer">
        <p>🕊️ In memory of all victims of dictatorship</p>
        <p className="footer-quote">
          "Those who do not remember the past are condemned to repeat it." - George Santayana
        </p>
      </div>
    </div>
  );
}

export default ValechDataViewer;
