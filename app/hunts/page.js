'use client';
import { useState, useEffect } from 'react';

export default function HuntsPage() {
  const [hunts, setHunts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHunts() {
      try {
        const response = await fetch('/api/hunt-conversations');
        if (!response.ok) throw new Error('Failed to fetch hunt conversations');
        const result = await response.json();
        setHunts(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchHunts();
  }, []);

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>🔍 Hunt Conversations</h1>
      <p>Loading hunt operations...</p>
    </div>
  );

  if (error) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
      <h1>🔍 Hunt Conversations</h1>
      <p>Error: {error}</p>
    </div>
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🔍 Hunt Conversations</h1>
      <p>Total hunt operations: {hunts.length}</p>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
        {hunts.map((hunt, index) => (
          <div key={index} style={{
            border: '1px solid #ddd',
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}>
            <h3>{hunt.title || 'Untitled Hunt'}</h3>
            <p><strong>Session:</strong> {hunt.session_id || 'Unknown'}</p>
            <p><strong>Category:</strong> {hunt.category || 'Unknown'}</p>
            <p><strong>Objective:</strong> {typeof hunt.objective === 'object' ? JSON.stringify(hunt.objective) : (hunt.objective || 'No objective')}</p>
            <p><strong>Outcome:</strong> {typeof hunt.outcome === 'object' ? JSON.stringify(hunt.outcome) : (hunt.outcome || 'Unknown')}</p>
            <p><strong>Date:</strong> {hunt.date ? new Date(hunt.date).toLocaleDateString() : 'Unknown'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
