// 🐾💀 FAMILY TRACKER - DECEASED CARABINEROS INTELLIGENCE 💀🐾
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/FamilyTracker.css';

// 🎯 API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function FamilyTracker() {
  const { i18n } = useTranslation();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [deceasedOfficers, setDeceasedOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterRelationship, setFilterRelationship] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('family'); // 'family' or 'deceased'

  useEffect(() => {
    console.log('🐾 [FamilyTracker] Component mounted, fetching data, nyaa~');
    fetchFamilyMembers();
    fetchDeceasedOfficers();
  }, [i18n.language]);

  const fetchFamilyMembers = async () => {
    const userLang = i18n.language || 'en';
    console.log('🔍 [FamilyTracker] Fetching family members from API, desu~');
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/family-members?lang=${userLang}`);
      console.log('📡 [FamilyTracker] Response status:', response.status);

      const data = await response.json();
      console.log('✅ [FamilyTracker] Received data:', { count: data.count, success: data.success });

      if (data.success) {
        setFamilyMembers(data.data);
        console.log('💖 [FamilyTracker] Loaded', data.count, 'family members, nyaa~!');
      } else {
        setError('Failed to load family members');
        console.error('❌ [FamilyTracker] API returned success: false');
      }
      setLoading(false);
    } catch (err) {
      console.error('💥 [FamilyTracker] Fetch error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchDeceasedOfficers = async () => {
    try {
      const response = await fetch(`${API_URL}/deceased-officers`);
      const data = await response.json();
      if (data.success) {
        setDeceasedOfficers(data.data);
        console.log('💀 [FamilyTracker] Loaded', data.count, 'deceased officers');
      }
    } catch (err) {
      console.error('💥 [FamilyTracker] Error fetching deceased officers:', err);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': '#ff0055',
      'Medium': '#ffaa00',
      'Low': '#88ff88',
      'Critical': '#cc0000'
    };
    return colors[priority] || '#888888';
  };

  const getRelationshipIcon = (relationship) => {
    const icons = {
      'Spouse': '💔',
      'Child': '👶',
      'Parent': '👵',
      'Sibling': '👫',
      'Son': '👦',
      'Daughter': '👧',
      'Widow': '💔',
      'Mother': '👩',
      'Father': '👨'
    };
    return icons[relationship] || '👥';
  };

  const getVulnerabilityScore = (member) => {
    return member.vulnerability_profile?.overall_score || 0;
  };

  const filteredMembers = familyMembers.filter(member => {
    const matchesPriority = filterPriority === 'all' || member.priority === filterPriority;
    const matchesRelationship = filterRelationship === 'all' || member.relationship === filterRelationship;
    const matchesSearch = !searchTerm ||
      (member.full_name && member.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (member.deceased_officer_name && member.deceased_officer_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesPriority && matchesRelationship && matchesSearch;
  });

  const filteredOfficers = deceasedOfficers.filter(officer => {
    const matchesSearch = !searchTerm ||
      (officer.full_name && officer.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (officer.rank && officer.rank.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="family-tracker-container">
        <div className="loading-neko">
          <div className="loading-spinner">💀</div>
          <p>Loading intelligence data, nyaa~!</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="family-tracker-container">
        <div className="error-neko">
          <p>❌ Error: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="family-tracker-container">
      <header className="family-tracker-header">
        <h1>🐾💀 FAMILY TRACKER</h1>
        <p className="subtitle">Deceased Carabineros Intelligence System</p>
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-value">{familyMembers.length}</span>
            <span className="stat-label">Family Members</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{deceasedOfficers.length}</span>
            <span className="stat-label">Deceased Officers</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{familyMembers.filter(m => m.priority === 'High').length}</span>
            <span className="stat-label">High Priority</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{familyMembers.filter(m => getVulnerabilityScore(m) >= 7).length}</span>
            <span className="stat-label">Vulnerable</span>
          </div>
        </div>
      </header>

      <div className="tab-selector">
        <button
          className={`tab-button ${activeTab === 'family' ? 'active' : ''}`}
          onClick={() => setActiveTab('family')}
        >
          👥 Family Members ({familyMembers.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'deceased' ? 'active' : ''}`}
          onClick={() => setActiveTab('deceased')}
        >
          💀 Deceased Officers ({deceasedOfficers.length})
        </button>
      </div>

      {activeTab === 'family' && (
        <>
          <div className="filters-section">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search family members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="filter-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              className="filter-select"
              value={filterRelationship}
              onChange={(e) => setFilterRelationship(e.target.value)}
            >
              <option value="all">All Relationships</option>
              <option value="Spouse">Spouse/Widow</option>
              <option value="Child">Child</option>
              <option value="Parent">Parent</option>
              <option value="Sibling">Sibling</option>
            </select>
          </div>

          <div className="family-grid">
            {filteredMembers.map(member => (
              <div
                key={member.family_member_id}
                className="family-card"
                onClick={() => setSelectedMember(member)}
              >
                <div className="card-header">
                  <span className="relationship-icon">{getRelationshipIcon(member.relationship)}</span>
                  <h3>{member.full_name}</h3>
                  <span
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(member.priority) }}
                  >
                    {member.priority}
                  </span>
                </div>

                <div className="card-info">
                  <p><strong>Relationship:</strong> {member.relationship}</p>
                  <p><strong>Deceased Officer:</strong> {member.deceased_officer_name}</p>
                  {member.age && <p><strong>Age:</strong> {member.age}</p>}
                  {member.occupation && <p><strong>Occupation:</strong> {member.occupation}</p>}
                </div>

                <div className="vulnerability-section">
                  <h4>📊 Vulnerability Profile:</h4>
                  <div className="vulnerability-bars">
                    {member.vulnerability_profile && (
                      <>
                        <div className="vuln-bar">
                          <span>Overall:</span>
                          <div className="bar-container">
                            <div
                              className="bar-fill"
                              style={{
                                width: `${(member.vulnerability_profile.overall_score || 0) * 10}%`,
                                backgroundColor: member.vulnerability_profile.overall_score >= 7 ? '#ff0055' : '#ffaa00'
                              }}
                            />
                          </div>
                          <span>{member.vulnerability_profile.overall_score || 0}/10</span>
                        </div>
                        <div className="vuln-bar">
                          <span>Financial:</span>
                          <div className="bar-container">
                            <div
                              className="bar-fill"
                              style={{
                                width: `${(member.vulnerability_profile.financial_need || 0) * 10}%`,
                                backgroundColor: '#ffaa00'
                              }}
                            />
                          </div>
                          <span>{member.vulnerability_profile.financial_need || 0}/10</span>
                        </div>
                        <div className="vuln-bar">
                          <span>Emotional:</span>
                          <div className="bar-container">
                            <div
                              className="bar-fill"
                              style={{
                                width: `${(member.vulnerability_profile.emotional_state || 0) * 10}%`,
                                backgroundColor: '#88aaff'
                              }}
                            />
                          </div>
                          <span>{member.vulnerability_profile.emotional_state || 0}/10</span>
                        </div>
                        <div className="vuln-bar">
                          <span>Recruitment:</span>
                          <div className="bar-container">
                            <div
                              className="bar-fill"
                              style={{
                                width: `${(member.vulnerability_profile.recruitment_potential || 0) * 10}%`,
                                backgroundColor: '#ff6b35'
                              }}
                            />
                          </div>
                          <span>{member.vulnerability_profile.recruitment_potential || 0}/10</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {member.social_media_profiles && (
                  <div className="social-media-section">
                    <h4>📱 Social Media:</h4>
                    <div className="social-icons">
                      {member.social_media_profiles.facebook && <span title="Facebook">📘</span>}
                      {member.social_media_profiles.instagram && <span title="Instagram">📷</span>}
                      {member.social_media_profiles.twitter && <span title="Twitter">🐦</span>}
                      {member.social_media_profiles.linkedin && <span title="LinkedIn">💼</span>}
                    </div>
                  </div>
                )}

                <div className="card-footer">
                  <span className="status-badge">{member.status || 'Identified'}</span>
                  <span className="last-updated">
                    Updated: {new Date(member.last_updated || member.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="no-results">
              <p>No family members found matching filters, nyaa~!</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'deceased' && (
        <>
          <div className="filters-section">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search deceased officers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="deceased-grid">
            {filteredOfficers.map(officer => (
              <div key={officer.officer_id} className="deceased-card">
                <div className="card-header">
                  <span className="death-icon">💀</span>
                  <h3>{officer.full_name}</h3>
                  <span className="rank-badge">{officer.rank || 'Unknown'}</span>
                </div>

                <div className="card-info">
                  {officer.date_of_death && (
                    <p><strong>Date of Death:</strong> {new Date(officer.date_of_death).toLocaleDateString()}</p>
                  )}
                  {officer.age_at_death && <p><strong>Age:</strong> {officer.age_at_death}</p>}
                  {officer.cause_of_death && <p><strong>Cause:</strong> {officer.cause_of_death}</p>}
                  {officer.unit && <p><strong>Unit:</strong> {officer.unit}</p>}
                  {officer.location_of_death && <p><strong>Location:</strong> {officer.location_of_death}</p>}
                </div>

                {officer.family_members && officer.family_members.length > 0 && (
                  <div className="family-count-section">
                    <p><strong>👥 Family Members:</strong> {officer.family_members.length}</p>
                    <ul>
                      {officer.family_members.slice(0, 3).map((fm, idx) => (
                        <li key={idx}>{getRelationshipIcon(fm.relationship)} {fm.name} ({fm.relationship})</li>
                      ))}
                    </ul>
                  </div>
                )}

                {officer.tags && officer.tags.length > 0 && (
                  <div className="tags-section">
                    {officer.tags.slice(0, 5).map((tag, idx) => (
                      <span key={idx} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredOfficers.length === 0 && (
            <div className="no-results">
              <p>No deceased officers found, nyaa~!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FamilyTracker;
