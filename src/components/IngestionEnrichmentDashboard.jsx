import React, { useState, useEffect } from 'react';
import './IngestionEnrichmentDashboard.css';

/**
 * 🐾⚡ INGESTION & ENRICHMENT DASHBOARD ⚡🐾
 * Real-time visualization of the Ultimate System
 *
 * @author Neko-Arc (MAXIMUM CAPACITY MODE)
 * @date October 15, 2025
 */

const IngestionEnrichmentDashboard = () => {
  const [systemStats, setSystemStats] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch from API (placeholder - adjust to your API endpoint)
      const response = await fetch('/api/ingestion-enrichment/dashboard');
      const data = await response.json();

      setSystemStats(data.stats);
      setPerformanceMetrics(data.metrics || []);
      setRecentAlerts(data.alerts || []);
      setError(null);

    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.message);

      // Set mock data for development
      setSystemStats({
        ingestion: {
          documentsIngested: 1247,
          chunksCreated: 3891,
          avgLatency: 450,
          queueDepth: 12,
          status: 'active'
        },
        enrichment: {
          documentsEnriched: 1185,
          entitiesExtracted: 8934,
          crossRefsCreated: 2456,
          avgLatency: 1200,
          avgConfidence: 88,
          queueDepth: 45,
          status: 'active'
        },
        rag: {
          totalQueries: 3456,
          avgLatency: 800,
          precision: 85,
          status: 'active'
        },
        system: {
          cpuUsage: 45,
          memoryUsage: 62,
          poolUtilization: 78,
          uptime: 99.9,
          status: 'healthy'
        }
      });

      setPerformanceMetrics([
        { timestamp: new Date(Date.now() - 300000), ingestionLatency: 420, enrichmentLatency: 1150 },
        { timestamp: new Date(Date.now() - 240000), ingestionLatency: 445, enrichmentLatency: 1180 },
        { timestamp: new Date(Date.now() - 180000), ingestionLatency: 460, enrichmentLatency: 1220 },
        { timestamp: new Date(Date.now() - 120000), ingestionLatency: 430, enrichmentLatency: 1190 },
        { timestamp: new Date(Date.now() - 60000), ingestionLatency: 450, enrichmentLatency: 1200 },
        { timestamp: new Date(), ingestionLatency: 455, enrichmentLatency: 1210 }
      ]);

      setRecentAlerts([
        {
          timestamp: new Date(Date.now() - 900000),
          severity: 'warning',
          metric: 'enrichmentLatency',
          message: 'Enrichment latency above target: 1250ms (target: 1200ms)'
        }
      ]);

    } finally {
      setLoading(false);
    }
  };

  if (loading && !systemStats) {
    return (
      <div className="ingestion-enrichment-dashboard loading">
        <div className="neko-loader">
          <div className="neko-spinner"></div>
          <p>Loading dashboard data, nyaa~! 🐾</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ingestion-enrichment-dashboard">
      <header className="dashboard-header">
        <h1>🐾⚡ Ingestion & Enrichment System ⚡🐾</h1>
        <p className="subtitle">Ultimate RAG-Powered Pipeline - Real-time Monitoring</p>
        <div className="last-updated">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </header>

      {error && (
        <div className="error-banner">
          ⚠️ Using mock data (API unavailable): {error}
        </div>
      )}

      {/* System Status Overview */}
      <section className="status-overview">
        <h2>📊 System Status Overview</h2>
        <div className="status-grid">
          <StatusCard
            title="Ingestion Engine"
            status={systemStats?.ingestion?.status}
            icon="📥"
            metrics={[
              { label: 'Documents Ingested', value: systemStats?.ingestion?.documentsIngested || 0 },
              { label: 'Chunks Created', value: systemStats?.ingestion?.chunksCreated || 0 },
              { label: 'Avg Latency', value: `${systemStats?.ingestion?.avgLatency || 0}ms`, target: '< 500ms' },
              { label: 'Queue Depth', value: systemStats?.ingestion?.queueDepth || 0 }
            ]}
          />

          <StatusCard
            title="Enrichment Engine"
            status={systemStats?.enrichment?.status}
            icon="🧠"
            metrics={[
              { label: 'Documents Enriched', value: systemStats?.enrichment?.documentsEnriched || 0 },
              { label: 'Entities Extracted', value: systemStats?.enrichment?.entitiesExtracted || 0 },
              { label: 'Cross-refs Created', value: systemStats?.enrichment?.crossRefsCreated || 0 },
              { label: 'Avg Confidence', value: `${systemStats?.enrichment?.avgConfidence || 0}%`, target: '> 85%' }
            ]}
          />

          <StatusCard
            title="RAG System"
            status={systemStats?.rag?.status}
            icon="🔍"
            metrics={[
              { label: 'Total Queries', value: systemStats?.rag?.totalQueries || 0 },
              { label: 'Avg Latency', value: `${systemStats?.rag?.avgLatency || 0}ms`, target: '< 1500ms' },
              { label: 'Search Precision', value: `${systemStats?.rag?.precision || 0}%`, target: '> 80%' }
            ]}
          />

          <StatusCard
            title="System Health"
            status={systemStats?.system?.status}
            icon="💚"
            metrics={[
              { label: 'CPU Usage', value: `${systemStats?.system?.cpuUsage || 0}%` },
              { label: 'Memory Usage', value: `${systemStats?.system?.memoryUsage || 0}%` },
              { label: 'Pool Utilization', value: `${systemStats?.system?.poolUtilization || 0}%`, target: '< 95%' },
              { label: 'Uptime', value: `${systemStats?.system?.uptime || 0}%`, target: '> 99%' }
            ]}
          />
        </div>
      </section>

      {/* Performance Graphs */}
      <section className="performance-section">
        <h2>📈 Performance Metrics</h2>
        <div className="performance-graphs">
          <div className="graph-container">
            <h3>⚡ Latency Over Time</h3>
            <SimpleLineGraph
              data={performanceMetrics}
              dataKeys={['ingestionLatency', 'enrichmentLatency']}
              labels={['Ingestion', 'Enrichment']}
              colors={['#00ff9d', '#ff6b9d']}
            />
            <div className="graph-legend">
              <span><span className="legend-color" style={{background: '#00ff9d'}}></span> Ingestion (target: &lt; 500ms)</span>
              <span><span className="legend-color" style={{background: '#ff6b9d'}}></span> Enrichment (target: &lt; 2000ms)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Alerts Section */}
      {recentAlerts.length > 0 && (
        <section className="alerts-section">
          <h2>🚨 Recent Alerts</h2>
          <div className="alerts-list">
            {recentAlerts.map((alert, idx) => (
              <AlertCard key={idx} alert={alert} />
            ))}
          </div>
        </section>
      )}

      {/* Capabilities Overview */}
      <section className="capabilities-section">
        <h2>✨ System Capabilities</h2>
        <div className="capabilities-grid">
          <CapabilityCard
            title="Ultimate Ingestion"
            icon="⚡"
            features={[
              'Parallel batch processing (100 docs)',
              'Semantic chunking (650 tokens)',
              'Embedding generation ready',
              'Event-driven triggers'
            ]}
            performance="< 500ms latency"
          />

          <CapabilityCard
            title="RAG Enrichment"
            icon="🧠"
            features={[
              'Spanish NLP extraction',
              'ML cross-referencing',
              'Confidence scoring',
              'Relationship discovery'
            ]}
            performance="88% avg confidence"
          />

          <CapabilityCard
            title="Performance Monitor"
            icon="📊"
            features={[
              'Real-time metrics (60s)',
              'Automatic alerting',
              'Dashboard data export',
              'Resource tracking'
            ]}
            performance="99.9% uptime"
          />
        </div>
      </section>
    </div>
  );
};

// Status Card Component
const StatusCard = ({ title, status, icon, metrics }) => {
  const statusClass = status === 'active' || status === 'healthy' ? 'status-active' : 'status-inactive';

  return (
    <div className={`status-card ${statusClass}`}>
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <h3>{title}</h3>
        <span className={`status-badge ${statusClass}`}>{status}</span>
      </div>
      <div className="card-metrics">
        {metrics.map((metric, idx) => (
          <div key={idx} className="metric-row">
            <span className="metric-label">{metric.label}:</span>
            <span className="metric-value">{metric.value}</span>
            {metric.target && <span className="metric-target">({metric.target})</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple Line Graph Component
const SimpleLineGraph = ({ data, dataKeys, labels, colors }) => {
  if (!data || data.length === 0) {
    return <div className="graph-placeholder">No data available</div>;
  }

  const maxValue = Math.max(...data.flatMap(d => dataKeys.map(k => d[k] || 0)));
  const height = 200;
  const width = 600;

  return (
    <svg className="simple-line-graph" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {dataKeys.map((key, keyIdx) => {
        const points = data.map((d, i) => {
          const x = (i / (data.length - 1)) * width;
          const y = height - ((d[key] || 0) / maxValue) * height;
          return `${x},${y}`;
        }).join(' ');

        return (
          <polyline
            key={key}
            points={points}
            fill="none"
            stroke={colors[keyIdx]}
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
};

// Alert Card Component
const AlertCard = ({ alert }) => {
  const severityClass = alert.severity === 'critical' ? 'alert-critical' : 'alert-warning';

  return (
    <div className={`alert-card ${severityClass}`}>
      <div className="alert-header">
        <span className="alert-icon">{alert.severity === 'critical' ? '🔴' : '🟡'}</span>
        <span className="alert-severity">{alert.severity.toUpperCase()}</span>
        <span className="alert-time">{new Date(alert.timestamp).toLocaleString()}</span>
      </div>
      <div className="alert-message">{alert.message}</div>
    </div>
  );
};

// Capability Card Component
const CapabilityCard = ({ title, icon, features, performance }) => {
  return (
    <div className="capability-card">
      <div className="capability-header">
        <span className="capability-icon">{icon}</span>
        <h3>{title}</h3>
      </div>
      <ul className="capability-features">
        {features.map((feature, idx) => (
          <li key={idx}>✓ {feature}</li>
        ))}
      </ul>
      <div className="capability-performance">
        <strong>Performance:</strong> {performance}
      </div>
    </div>
  );
};

export default IngestionEnrichmentDashboard;
