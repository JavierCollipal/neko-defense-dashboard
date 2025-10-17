// 🐾📝 NEKO DEFENSE - Confessions Blog Component 📝🐾
// Community-driven reporting system for predators, pedophiles, and evidence documentation

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/ConfessionsBlog.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function ConfessionsBlog() {
  const { t } = useTranslation();
  const [view, setView] = useState('list'); // 'list' or 'submit'
  const [confessions, setConfessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    category: 'predators',
    title: '',
    description: '',
    threat_actor_name: '',
    threat_actor_location: '',
    evidence_links: '',
    submitted_by: 'Anonymous',
    contact_info: '',
    priority: 'high'
  });

  // Fetch confessions
  useEffect(() => {
    fetchConfessions();
    fetchStats();
  }, [selectedCategory]);

  const fetchConfessions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/confessions?category=${selectedCategory}`);
      const data = await response.json();
      if (data.success) {
        setConfessions(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch confessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/confessions/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert evidence_links string to array
      const evidence_array = formData.evidence_links
        .split('\n')
        .map(link => link.trim())
        .filter(link => link.length > 0);

      const submission = {
        ...formData,
        evidence_links: evidence_array
      };

      const response = await fetch(`${API_URL}/confessions/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission)
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(true);
        // Reset form
        setFormData({
          category: 'predators',
          title: '',
          description: '',
          threat_actor_name: '',
          threat_actor_location: '',
          evidence_links: '',
          submitted_by: 'Anonymous',
          contact_info: '',
          priority: 'high'
        });
        // Switch back to list view after 3 seconds
        setTimeout(() => {
          setView('list');
          setSubmitSuccess(false);
          fetchStats(); // Refresh stats
        }, 3000);
      }
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="confessions-container">
      {/* Header */}
      <div className="confessions-header">
        <h1 className="confessions-title">
          📝 CONFESSIONS BLOG - COMMUNITY REPORTING 📝
        </h1>
        <div className="confessions-subtitle">
          🔥 Expose Predators • Document Evidence • Protect the Community 🔥
        </div>
        <div className="live-indicator">
          <div className="live-dot"></div>
          <span>PUBLIC REPORTING SYSTEM ACTIVE</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="confessions-nav">
        <button
          className={`nav-button ${view === 'list' ? 'active' : ''}`}
          onClick={() => setView('list')}
        >
          📖 VIEW CONFESSIONS
        </button>
        <button
          className={`nav-button ${view === 'submit' ? 'active' : ''}`}
          onClick={() => setView('submit')}
        >
          📝 SUBMIT REPORT
        </button>
      </div>

      {/* Stats Bar */}
      {stats && (
        <div className="confessions-stats">
          <div className="stat-item">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Reports</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.approved}</div>
            <div className="stat-label">Approved</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.by_category?.predators || 0}</div>
            <div className="stat-label">Predators</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.by_category?.pedophiles || 0}</div>
            <div className="stat-label">Pedophiles</div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="confessions-content">
        {view === 'list' ? (
          // Confessions List View
          <>
            <div className="category-filter">
              <button
                className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                ALL
              </button>
              <button
                className={`filter-btn ${selectedCategory === 'predators' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('predators')}
              >
                🎯 PREDATORS
              </button>
              <button
                className={`filter-btn ${selectedCategory === 'pedophiles' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('pedophiles')}
              >
                🚨 PEDOPHILES
              </button>
              <button
                className={`filter-btn ${selectedCategory === 'evidence' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('evidence')}
              >
                📋 EVIDENCE
              </button>
              <button
                className={`filter-btn ${selectedCategory === 'general' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('general')}
              >
                💬 GENERAL
              </button>
            </div>

            {loading ? (
              <div className="loading">Loading confessions, nyaa~! 🐾</div>
            ) : confessions.length === 0 ? (
              <div className="no-confessions">
                <h3>No confessions in this category yet</h3>
                <p>Be the first to report! Click "SUBMIT REPORT" above.</p>
              </div>
            ) : (
              <div className="confessions-list">
                {confessions.map((confession) => (
                  <div key={confession.confession_id} className="confession-card">
                    <div className="confession-header-line">
                      <span className={`category-badge ${confession.category}`}>
                        {confession.category.toUpperCase()}
                      </span>
                      <span className={`priority-badge ${confession.priority}`}>
                        {confession.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>

                    <h3 className="confession-title-text">{confession.title}</h3>

                    <div className="confession-meta">
                      <div>🎯 <strong>Target:</strong> {confession.threat_actor_name}</div>
                      <div>📍 <strong>Location:</strong> {confession.threat_actor_location}</div>
                      <div>👤 <strong>Reported by:</strong> {confession.submitted_by}</div>
                      <div>📅 <strong>Date:</strong> {formatDate(confession.submitted_at)}</div>
                    </div>

                    <div className="confession-description">
                      {confession.description}
                    </div>

                    {confession.evidence_links && confession.evidence_links.length > 0 && (
                      <div className="evidence-section">
                        <strong>📋 Evidence Links:</strong>
                        <ul className="evidence-list">
                          {confession.evidence_links.map((link, idx) => (
                            <li key={idx}>
                              <a href={link} target="_blank" rel="noopener noreferrer">
                                {link}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="confession-footer">
                      <div className="views">👁️ {confession.views} views</div>
                      <div className="upvotes">⬆️ {confession.upvotes} upvotes</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          // Submission Form View
          <div className="submission-form-container">
            {submitSuccess ? (
              <div className="success-message">
                <h2>✅ CONFESSION SUBMITTED SUCCESSFULLY!</h2>
                <p>Thank you for reporting! Your confession has been sent for moderation.</p>
                <p>You will be redirected to the confessions list...</p>
                <div className="success-animation">🐾 NYA NYA NYA~! 🐾</div>
              </div>
            ) : (
              <form className="confession-form" onSubmit={handleSubmit}>
                <h2>🔥 SUBMIT A NEW REPORT 🔥</h2>
                <p className="form-description">
                  Report predators, pedophiles, or submit evidence. All submissions are reviewed before publication.
                </p>

                <div className="form-group">
                  <label>📂 Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="predators">🎯 Predators</option>
                    <option value="pedophiles">🚨 Pedophiles</option>
                    <option value="evidence">📋 Evidence</option>
                    <option value="general">💬 General Report</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>📝 Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Brief title of your report..."
                    required
                    maxLength={200}
                  />
                </div>

                <div className="form-group">
                  <label>🎯 Threat Actor Name *</label>
                  <input
                    type="text"
                    name="threat_actor_name"
                    value={formData.threat_actor_name}
                    onChange={handleInputChange}
                    placeholder="Name of the person being reported..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>📍 Location</label>
                  <input
                    type="text"
                    name="threat_actor_location"
                    value={formData.threat_actor_location}
                    onChange={handleInputChange}
                    placeholder="City, Country (if known)..."
                  />
                </div>

                <div className="form-group">
                  <label>📄 Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Detailed description of the incident, behavior, or evidence..."
                    rows={8}
                    required
                    maxLength={5000}
                  />
                  <div className="char-count">
                    {formData.description.length}/5000 characters
                  </div>
                </div>

                <div className="form-group">
                  <label>🔗 Evidence Links (one per line)</label>
                  <textarea
                    name="evidence_links"
                    value={formData.evidence_links}
                    onChange={handleInputChange}
                    placeholder="https://example.com/evidence1
https://example.com/evidence2"
                    rows={4}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>👤 Your Name (Optional)</label>
                    <input
                      type="text"
                      name="submitted_by"
                      value={formData.submitted_by}
                      onChange={handleInputChange}
                      placeholder="Anonymous"
                    />
                  </div>

                  <div className="form-group">
                    <label>📧 Contact Info (Optional)</label>
                    <input
                      type="text"
                      name="contact_info"
                      value={formData.contact_info}
                      onChange={handleInputChange}
                      placeholder="Email or phone (optional)"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>⚡ Priority Level</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="low">LOW - General concern</option>
                    <option value="medium">MEDIUM - Ongoing situation</option>
                    <option value="high">HIGH - Active threat</option>
                    <option value="critical">CRITICAL - Immediate danger</option>
                  </select>
                </div>

                <div className="form-notice">
                  ⚠️ <strong>IMPORTANT:</strong> All submissions are reviewed before publication.
                  False reports may result in legal action. Submit only factual information.
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? 'SUBMITTING...' : '🔥 SUBMIT REPORT 🔥'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="confessions-footer">
        *purrs in community justice* 😻⚖️ Together we protect! NYA NYA NYA~! 🐾
      </div>
    </div>
  );
}

export default ConfessionsBlog;
