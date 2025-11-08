// 🗺️🏢 DINA TORTURE CENTERS INTERACTIVE MAP COMPONENT 🏢🗺️
import React, { useState } from 'react';
import '../styles/DinaCentersMap.css';

const DinaCentersMap = () => {
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [mapView, setMapView] = useState('santiago'); // 'santiago' or 'chile'

  // DINA Torture Centers Data with coordinates
  const tortureCenters = [
    {
      id: 'villa-grimaldi',
      name: 'Villa Grimaldi',
      codeName: 'Cuartel Terranova',
      location: 'Av. José Arrieta 8401, Peñalolén',
      city: 'Santiago',
      coordinates: { lat: -33.4894, lng: -70.5820 },
      period: 'Mid-1974 to Mid-1978',
      detainees: '~4,500',
      killed: '240+',
      significance: 'MOST IMPORTANT DINA COMPLEX',
      level: 'critical',
      tortureMethods: [
        'La Parrilla (Electric Shock Bed)',
        'Electric shock to sensitive areas',
        'Waterboarding',
        'Psychological torture',
        'Mock executions'
      ],
      currentStatus: 'Parque por la Paz (Peace Park Memorial)',
      visitInfo: 'Open to public',
      description: 'The most important DINA interrogation and torture complex. About 4,500 detainees passed through this facility, with at least 240 disappeared or killed.'
    },
    {
      id: 'londres-38',
      name: 'Londres 38',
      codeName: 'Yucatán',
      location: 'Londres 38, Downtown',
      city: 'Santiago',
      coordinates: { lat: -33.4423, lng: -70.6506 },
      period: 'September 1973 - December 1974',
      detainees: '~1,100',
      killed: '94 executed',
      significance: 'FIRST DINA DETENTION CENTER',
      level: 'critical',
      tortureMethods: [
        'Interrogation under torture',
        'Electric shock',
        'Physical abuse',
        'Psychological torture'
      ],
      currentStatus: 'Memorial & Human Rights Center',
      visitInfo: 'Open to public',
      description: 'First link in DINA\'s chain of detention facilities. Approximately 1,100 people passed through, with 94 executed including 2 pregnant women.'
    },
    {
      id: 'jose-domingo-canas',
      name: 'Jose Domingo Cañas',
      codeName: 'Ollague',
      location: 'Jose Domingo Cañas street',
      city: 'Santiago',
      coordinates: { lat: -33.4567, lng: -70.6234 },
      period: '1974-1975',
      detainees: 'Unknown',
      killed: 'Multiple documented',
      significance: 'Major interrogation center',
      level: 'high',
      tortureMethods: [
        'Systematic torture',
        'Interrogation',
        'Physical abuse'
      ],
      currentStatus: 'Memorial site',
      visitInfo: 'Preserved as historical site',
      description: 'Major DINA interrogation center operating during peak terror period.'
    },
    {
      id: 'cuatro-alamos',
      name: 'Cuatro Alamos',
      codeName: 'Cuatro Alamos',
      location: 'Santiago region',
      city: 'Santiago',
      coordinates: { lat: -33.4689, lng: -70.6012 },
      period: '1974-1976',
      detainees: 'Hundreds',
      killed: 'Multiple documented',
      significance: 'Transit detention center',
      level: 'medium',
      tortureMethods: [
        'Interrogation',
        'Torture',
        'Temporary detention'
      ],
      currentStatus: 'Documented site',
      visitInfo: 'Historical record preserved',
      description: 'Transit center where prisoners were held before transfer or release.'
    },
    {
      id: 'venecia',
      name: 'Venecia',
      codeName: 'Venecia',
      location: 'Santiago region',
      city: 'Santiago',
      coordinates: { lat: -33.5123, lng: -70.6789 },
      period: '1974-1977',
      detainees: 'Unknown',
      killed: 'Documented victims',
      significance: 'Secret detention facility',
      level: 'medium',
      tortureMethods: [
        'Secret detention',
        'Torture',
        'Interrogation'
      ],
      currentStatus: 'Historical documentation',
      visitInfo: 'Location preserved in records',
      description: 'Secret DINA facility used for clandestine detention and torture.'
    },
    {
      id: 'malloco',
      name: 'Malloco',
      codeName: 'Malloco',
      location: 'Santiago region',
      city: 'Santiago',
      coordinates: { lat: -33.5456, lng: -70.8234 },
      period: '1974-1977',
      detainees: 'Unknown',
      killed: 'Documented victims',
      significance: 'Secret detention facility',
      level: 'medium',
      tortureMethods: [
        'Secret detention',
        'Torture',
        'Interrogation'
      ],
      currentStatus: 'Historical documentation',
      visitInfo: 'Location preserved in records',
      description: 'Secret DINA facility operating during dictatorship.'
    }
  ];

  const handleCenterClick = (center) => {
    setSelectedCenter(center);
  };

  const closeDetails = () => {
    setSelectedCenter(null);
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'critical': return '#dc2626'; // Red
      case 'high': return '#ea580c'; // Orange
      case 'medium': return '#ca8a04'; // Yellow
      default: return '#65a30d'; // Green
    }
  };

  return (
    <div className="dina-centers-map-container">
      <div className="map-header">
        <h2>🗺️ DINA Torture Centers - Santiago Metropolitan Region</h2>
        <p className="map-subtitle">Interactive map of secret detention and torture facilities</p>
      </div>

      <div className="map-controls">
        <button
          className={`map-view-btn ${mapView === 'santiago' ? 'active' : ''}`}
          onClick={() => setMapView('santiago')}
        >
          📍 Santiago Focus
        </button>
        <button
          className={`map-view-btn ${mapView === 'chile' ? 'active' : ''}`}
          onClick={() => setMapView('chile')}
        >
          🌎 Chile Overview
        </button>
      </div>

      <div className="map-legend">
        <h4>Legend:</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-marker critical"></span>
            <span>Critical - Major complex</span>
          </div>
          <div className="legend-item">
            <span className="legend-marker high"></span>
            <span>High - Major center</span>
          </div>
          <div className="legend-item">
            <span className="legend-marker medium"></span>
            <span>Medium - Secret facility</span>
          </div>
        </div>
      </div>

      {/* Interactive Map Area */}
      <div className="interactive-map-area">
        <div className="map-canvas">
          <h3 className="map-title">Santiago Metropolitan Region</h3>
          <p className="map-note">DINA operated a systematic network across Santiago</p>

          {/* Map markers */}
          <div className="map-markers">
            {tortureCenters.map((center) => (
              <div
                key={center.id}
                className={`map-marker ${center.level} ${selectedCenter?.id === center.id ? 'selected' : ''}`}
                style={{
                  backgroundColor: getLevelColor(center.level),
                  left: `${((center.coordinates.lng + 70.8234) / 0.2414) * 100}%`,
                  top: `${((center.coordinates.lat + 33.5456) / 0.1033) * 100}%`
                }}
                onClick={() => handleCenterClick(center)}
                title={center.name}
              >
                <div className="marker-pin"></div>
                <div className="marker-label">{center.name}</div>
              </div>
            ))}
          </div>

          {/* Map background grid */}
          <div className="map-grid">
            <div className="grid-line horizontal"></div>
            <div className="grid-line horizontal"></div>
            <div className="grid-line horizontal"></div>
            <div className="grid-line vertical"></div>
            <div className="grid-line vertical"></div>
            <div className="grid-line vertical"></div>
          </div>
        </div>

        {/* Center details panel */}
        {selectedCenter && (
          <div className="center-details-panel">
            <div className="panel-header">
              <h3>{selectedCenter.name}</h3>
              <button className="close-btn" onClick={closeDetails}>✕</button>
            </div>
            <div className="panel-content">
              <div className="detail-row">
                <strong>Code Name:</strong> {selectedCenter.codeName}
              </div>
              <div className="detail-row">
                <strong>Location:</strong> {selectedCenter.location}
              </div>
              <div className="detail-row">
                <strong>Period:</strong> {selectedCenter.period}
              </div>
              <div className="detail-row critical-stat">
                <strong>Detainees:</strong> {selectedCenter.detainees}
              </div>
              <div className="detail-row critical-stat">
                <strong>Killed/Disappeared:</strong> {selectedCenter.killed}
              </div>
              <div className="detail-row">
                <strong>Significance:</strong>
                <span className="significance-badge">{selectedCenter.significance}</span>
              </div>

              <div className="torture-methods-section">
                <h4>Documented Torture Methods:</h4>
                <ul>
                  {selectedCenter.tortureMethods.map((method, i) => (
                    <li key={i}>⚡ {method}</li>
                  ))}
                </ul>
              </div>

              <div className="current-status-section">
                <h4>Current Status:</h4>
                <p className="status-text">✅ {selectedCenter.currentStatus}</p>
                <p className="visit-info">🚶 {selectedCenter.visitInfo}</p>
              </div>

              <div className="description-section">
                <p>{selectedCenter.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Centers list view */}
      <div className="centers-list-compact">
        <h3>All DINA Torture Centers ({tortureCenters.length})</h3>
        <div className="centers-compact-grid">
          {tortureCenters.map((center) => (
            <div
              key={center.id}
              className={`center-compact-card ${center.level}`}
              onClick={() => handleCenterClick(center)}
            >
              <div className="compact-card-header">
                <h4>{center.name}</h4>
                <span className="level-badge" style={{ backgroundColor: getLevelColor(center.level) }}>
                  {center.level}
                </span>
              </div>
              <div className="compact-card-info">
                <p>📍 {center.location}</p>
                <p>📅 {center.period}</p>
                <p className="victim-count">💀 {center.killed}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="map-footer">
        <p className="memorial-note">
          🕊️ Many of these sites are now memorials that can be visited to honor victims and preserve historical memory, nyaa~!
        </p>
        <p className="network-note">
          🗺️ DINA operated a systematic network of clandestine detention centers across Chile for secret arrests, torture, and forced disappearances.
        </p>
      </div>
    </div>
  );
};

export default DinaCentersMap;
