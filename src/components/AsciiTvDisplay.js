// 🐾 ASCII TV Display Component
import React from 'react';

function AsciiTvDisplay({ artPiece, total, current }) {
  if (!artPiece) {
    return (
      <div className="ascii-tv">
        <div className="tv-frame">
          <p>No art loaded yet, nyaa~! 🐾</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ascii-tv">
      <div className="tv-controls">
        <span className="tv-title">{artPiece.name}</span>
        <span className="tv-counter">{current} / {total}</span>
      </div>
      
      <div className="tv-frame">
        <div className="tv-screen">
          <pre className="ascii-art">
            {Array.isArray(artPiece.art) ? artPiece.art.join('\n') : artPiece.art}
          </pre>
        </div>
      </div>

      <div className="tv-info">
        <span className="threat-badge" data-level={artPiece.threat_level}>
          THREAT: {artPiece.threat_level || 'N/A'}
        </span>
        <span className="category-badge">
          CATEGORY: {artPiece.category}
        </span>
      </div>

      <div className="tv-description">
        {artPiece.description}
      </div>
    </div>
  );
}

export default AsciiTvDisplay;
