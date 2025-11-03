// 🌍⚙️ NEKO DEFENSE - Enhanced Translation Management Dashboard ⚙️🌍
// Admin interface for monitoring, managing, and optimizing translation services

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './TranslationDashboard.css';

const TranslationDashboard = () => {
  const { t } = useTranslation();

  // State management for all dashboard components
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Data states
  const [stats, setStats] = useState(null);
  const [cacheStats, setCacheStats] = useState(null);
  const [providerStatus, setProviderStatus] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [languages, setLanguages] = useState([]);

  // Test translation states
  const [testText, setTestText] = useState('Hello, this is a test translation!');
  const [testTargetLang, setTestTargetLang] = useState('es');
  const [testResults, setTestResults] = useState(null);
  const [abTestResults, setAbTestResults] = useState(null);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [cacheResponse, providersResponse, languagesResponse] = await Promise.all([
        fetch('/api/translate/cache/stats'),
        fetch('/api/translate/providers/status'),
        fetch('/api/translate/languages')
      ]);

      if (cacheResponse.ok) {
        const cacheData = await cacheResponse.json();
        setCacheStats(cacheData.data);
      }

      if (providersResponse.ok) {
        const providersData = await providersResponse.json();
        setProviderStatus(providersData.data);
      }

      if (languagesResponse.ok) {
        const languagesData = await languagesResponse.json();
        setLanguages(languagesData.data);
      }

      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data: ' + err.message);
      console.error('🚨 [Translation Dashboard] Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Clear translation cache
  const clearCache = async (language = null, olderThan = null) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (language) {params.append('language', language);}
      if (olderThan) {params.append('olderThan', olderThan);}

      const response = await fetch(`/api/translate/cache/clear?${params}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ Cache cleared! Deleted ${result.deletedCount} entries, nyaa~!`);
        fetchDashboardData(); // Refresh data
      } else {
        throw new Error('Failed to clear cache');
      }
    } catch (err) {
      setError('Failed to clear cache: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Test enhanced translation
  const testTranslation = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/translate/enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: testText,
          targetLang: testTargetLang,
          context: 'dashboard_test'
        })
      });

      if (response.ok) {
        const result = await response.json();
        setTestResults(result.data);
      } else {
        throw new Error('Translation test failed');
      }
    } catch (err) {
      setError('Translation test failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Run A/B test with multiple providers
  const runABTest = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/translate/ab-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: testText,
          targetLang: testTargetLang,
          providers: ['google', 'deepl']
        })
      });

      if (response.ok) {
        const result = await response.json();
        setAbTestResults(result.data);
      } else {
        throw new Error('A/B test failed');
      }
    } catch (err) {
      setError('A/B test failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const TabButton = ({ tabId, label, active, onClick }) => (
    <button
      className={`tab-button ${active ? 'active' : ''}`}
      onClick={() => onClick(tabId)}
    >
      {label}
    </button>
  );

  const StatCard = ({ title, value, subtitle, icon, status = 'normal' }) => (
    <div className={`stat-card status-${status}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3>{title}</h3>
        <div className="stat-value">{value}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      </div>
    </div>
  );

  return (
    <div className="translation-dashboard">
      <div className="dashboard-header">
        <h1>🌍✨ Enhanced Translation Management Dashboard ✨🌍</h1>
        <p>Monitor, manage, and optimize your multi-provider translation pipeline, nyaa~!</p>
        <button
          className="refresh-button"
          onClick={fetchDashboardData}
          disabled={loading}
        >
          {loading ? '🔄 Loading...' : '🔄 Refresh Data'}
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span>❌ Error: {error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <div className="dashboard-tabs">
        <TabButton tabId="overview" label="📊 Overview" active={activeTab === 'overview'} onClick={setActiveTab} />
        <TabButton tabId="cache" label="💾 Cache Management" active={activeTab === 'cache'} onClick={setActiveTab} />
        <TabButton tabId="providers" label="⚙️ Providers" active={activeTab === 'providers'} onClick={setActiveTab} />
        <TabButton tabId="testing" label="🧪 Testing" active={activeTab === 'testing'} onClick={setActiveTab} />
        <TabButton tabId="languages" label="🌍 Languages" active={activeTab === 'languages'} onClick={setActiveTab} />
      </div>

      <div className="dashboard-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <h2>🎯 Translation System Overview</h2>

            {cacheStats && (
              <div className="stats-grid">
                <StatCard
                  title="Total Cache Entries"
                  value={cacheStats.totalEntries?.toLocaleString() || '0'}
                  subtitle="Cached translations"
                  icon="💾"
                />
                <StatCard
                  title="Cache Hit Rate"
                  value={`${Math.round((cacheStats.hitRate || 0) * 100)}%`}
                  subtitle="Performance efficiency"
                  icon="🎯"
                  status={cacheStats.hitRate > 0.8 ? 'good' : cacheStats.hitRate > 0.5 ? 'warning' : 'error'}
                />
                <StatCard
                  title="Languages Supported"
                  value={languages.length}
                  subtitle="Available languages"
                  icon="🌍"
                />
                <StatCard
                  title="Active Providers"
                  value={providerStatus ? Object.keys(providerStatus).filter(p => providerStatus[p].status === 'healthy').length : '0'}
                  subtitle="Translation providers"
                  icon="⚙️"
                  status="good"
                />
              </div>
            )}

            <div className="recent-activity">
              <h3>📈 Recent Translation Activity</h3>
              <p>Translation metrics and usage statistics will appear here once the service processes requests.</p>
            </div>
          </div>
        )}

        {/* Cache Management Tab */}
        {activeTab === 'cache' && (
          <div className="cache-tab">
            <h2>💾 Translation Cache Management</h2>

            {cacheStats && (
              <div className="cache-stats">
                <div className="cache-info-grid">
                  <div className="cache-info-card">
                    <h4>Cache Statistics</h4>
                    <ul>
                      <li>Total Entries: <strong>{cacheStats.totalEntries?.toLocaleString() || '0'}</strong></li>
                      <li>Total Size: <strong>{cacheStats.totalSize || 'Unknown'}</strong></li>
                      <li>Hit Rate: <strong>{Math.round((cacheStats.hitRate || 0) * 100)}%</strong></li>
                      <li>Average Quality: <strong>{Math.round((cacheStats.averageQuality || 0) * 100)}%</strong></li>
                    </ul>
                  </div>

                  <div className="cache-info-card">
                    <h4>Cache by Language</h4>
                    {cacheStats.byLanguage ? (
                      <ul>
                        {Object.entries(cacheStats.byLanguage).map(([lang, count]) => (
                          <li key={lang}>{lang.toUpperCase()}: <strong>{count}</strong></li>
                        ))}
                      </ul>
                    ) : (
                      <p>No language breakdown available</p>
                    )}
                  </div>
                </div>

                <div className="cache-actions">
                  <h4>Cache Management Actions</h4>
                  <div className="action-buttons">
                    <button
                      className="cache-action-btn danger"
                      onClick={() => clearCache()}
                    >
                      🧹 Clear All Cache
                    </button>
                    <button
                      className="cache-action-btn warning"
                      onClick={() => clearCache(null, '7d')}
                    >
                      🗓️ Clear Cache Older Than 7 Days
                    </button>
                    <button
                      className="cache-action-btn warning"
                      onClick={() => clearCache(null, '30d')}
                    >
                      📅 Clear Cache Older Than 30 Days
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Providers Tab */}
        {activeTab === 'providers' && (
          <div className="providers-tab">
            <h2>⚙️ Translation Providers Status</h2>

            {providerStatus ? (
              <div className="providers-grid">
                {Object.entries(providerStatus).map(([providerName, status]) => (
                  <div key={providerName} className={`provider-card status-${status.status}`}>
                    <div className="provider-header">
                      <h4>{providerName.charAt(0).toUpperCase() + providerName.slice(1)}</h4>
                      <span className={`status-badge ${status.status}`}>
                        {status.status === 'healthy' ? '✅' :
                         status.status === 'degraded' ? '⚠️' : '❌'}
                        {status.status}
                      </span>
                    </div>

                    <div className="provider-stats">
                      <p><strong>Quality:</strong> {Math.round((status.quality || 0) * 100)}%</p>
                      <p><strong>Cost:</strong> ${status.costPerChar || 'Unknown'}/char</p>
                      <p><strong>Rate Limit:</strong> {status.rateLimitPerMinute || 'Unknown'}/min</p>
                      {status.lastUsed && (
                        <p><strong>Last Used:</strong> {new Date(status.lastUsed).toLocaleString()}</p>
                      )}
                    </div>

                    {status.error && (
                      <div className="provider-error">
                        <strong>Error:</strong> {status.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="loading-placeholder">
                <p>🔄 Loading provider status...</p>
              </div>
            )}
          </div>
        )}

        {/* Testing Tab */}
        {activeTab === 'testing' && (
          <div className="testing-tab">
            <h2>🧪 Translation Testing & Quality Analysis</h2>

            <div className="test-input-section">
              <h3>Test Translation</h3>
              <div className="test-form">
                <div className="form-group">
                  <label>Text to translate:</label>
                  <textarea
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                    placeholder="Enter text to translate..."
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label>Target Language:</label>
                  <select
                    value={testTargetLang}
                    onChange={(e) => setTestTargetLang(e.target.value)}
                  >
                    <option value="es">Spanish (es)</option>
                    <option value="fr">French (fr)</option>
                    <option value="de">German (de)</option>
                    <option value="it">Italian (it)</option>
                    <option value="pt">Portuguese (pt)</option>
                    <option value="ru">Russian (ru)</option>
                    <option value="ja">Japanese (ja)</option>
                    <option value="ko">Korean (ko)</option>
                    <option value="zh">Chinese (zh)</option>
                    <option value="ar">Arabic (ar)</option>
                    <option value="hi">Hindi (hi)</option>
                    <option value="nl">Dutch (nl)</option>
                    <option value="tr">Turkish (tr)</option>
                    <option value="pl">Polish (pl)</option>
                  </select>
                </div>

                <div className="test-buttons">
                  <button
                    className="test-btn primary"
                    onClick={testTranslation}
                    disabled={loading || !testText}
                  >
                    🌟 Test Enhanced Translation
                  </button>
                  <button
                    className="test-btn secondary"
                    onClick={runABTest}
                    disabled={loading || !testText}
                  >
                    🧪 Run A/B Test (Google vs DeepL)
                  </button>
                </div>
              </div>
            </div>

            {/* Test Results */}
            {testResults && (
              <div className="test-results">
                <h3>🌟 Enhanced Translation Results</h3>
                <div className="result-card">
                  <div className="result-content">
                    <p><strong>Original:</strong> {testText}</p>
                    <p><strong>Translation:</strong> {testResults.translatedText}</p>
                    <p><strong>Provider:</strong> {testResults.provider}</p>
                    <p><strong>Quality Score:</strong> {Math.round(testResults.quality.overallScore * 100)}%</p>
                    <p><strong>Processing Time:</strong> {testResults.processingTime}</p>
                    <p><strong>Cached:</strong> {testResults.cached ? '✅ Yes' : '❌ No'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* A/B Test Results */}
            {abTestResults && (
              <div className="ab-test-results">
                <h3>🧪 A/B Test Results</h3>
                <div className="comparison-grid">
                  {abTestResults.map((result, index) => (
                    <div key={index} className="comparison-card">
                      <h4>{result.provider.charAt(0).toUpperCase() + result.provider.slice(1)}</h4>
                      <p><strong>Translation:</strong> {result.translatedText}</p>
                      <p><strong>Quality:</strong> {Math.round(result.quality.overallScore * 100)}%</p>
                      <p><strong>Time:</strong> {result.processingTime}</p>

                      <div className="quality-breakdown">
                        <small>Confidence: {Math.round(result.quality.confidence * 100)}%</small><br/>
                        <small>Fluency: {Math.round(result.quality.fluency * 100)}%</small><br/>
                        <small>Relevance: {Math.round(result.quality.contextRelevance * 100)}%</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Languages Tab */}
        {activeTab === 'languages' && (
          <div className="languages-tab">
            <h2>🌍 Supported Languages Configuration</h2>

            <div className="languages-overview">
              <p>Total supported languages: <strong>{languages.length}</strong></p>
            </div>

            {languages.length > 0 ? (
              <div className="languages-grid">
                {languages.map((lang) => (
                  <div key={lang.code} className="language-card">
                    <div className="language-header">
                      <span className="flag">{lang.flag}</span>
                      <div className="language-info">
                        <h4>{lang.name}</h4>
                        <p>{lang.nativeName}</p>
                        <small>Code: {lang.code}</small>
                      </div>
                    </div>

                    <div className="language-meta">
                      <p><strong>Direction:</strong> {lang.dir}</p>
                      <p><strong>Priority:</strong> {lang.priority}</p>
                      <p><strong>Complexity:</strong> {lang.complexityLevel || 'medium'}</p>
                      {lang.providers && (
                        <p><strong>Providers:</strong> {lang.providers.join(', ')}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="loading-placeholder">
                <p>🔄 Loading language configurations...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationDashboard;