'use client';
import { useState, useEffect } from 'react';

export default function HoneypotsPage() {
  const [honeypots, setHoneypots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHoneypots() {
      try {
        const response = await fetch('/api/honeypots');
        if (!response.ok) throw new Error('Failed to fetch honeypots');
        const result = await response.json();
        setHoneypots(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchHoneypots();
  }, []);

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>🍯 Honeypot Triggers</h1>
      <p>Loading honeypot data...</p>
    </div>
  );

  if (error) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
      <h1>🍯 Honeypot Triggers</h1>
      <p>Error: {error}</p>
    </div>
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🍯 Honeypot Triggers</h1>
      <p>Total triggers: {honeypots.length}</p>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
        {honeypots.map((honeypot, index) => (
          <div key={index} style={{
            border: '1px solid #ddd',
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}>
            <h3>{honeypot.honeypot_name || 'Unnamed Honeypot'}</h3>
            <p><strong>IP:</strong> {honeypot.ip_address}</p>
            <p><strong>Triggered:</strong> {new Date(honeypot.triggered_at).toLocaleString()}</p>
            {honeypot.details && <p><strong>Details:</strong> {honeypot.details}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
