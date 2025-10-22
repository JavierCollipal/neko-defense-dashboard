'use client';
import { useState, useEffect } from 'react';

export default function EvidencePage() {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvidence() {
      try {
        const response = await fetch('/api/evidence-packages');
        if (!response.ok) throw new Error('Failed to fetch evidence packages');
        const result = await response.json();
        setEvidence(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEvidence();
  }, []);

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>📦 Evidence Packages</h1>
      <p>Loading evidence data...</p>
    </div>
  );

  if (error) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
      <h1>📦 Evidence Packages</h1>
      <p>Error: {error}</p>
    </div>
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📦 Evidence Packages</h1>
      <p>Total evidence packages: {evidence.length}</p>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
        {evidence.map((pkg, index) => (
          <div key={index} style={{
            border: '1px solid #ddd',
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}>
            <h3>{pkg.package_name || 'Unnamed Package'}</h3>
            <p><strong>Target:</strong> {pkg.target}</p>
            <p><strong>Type:</strong> {pkg.evidence_type}</p>
            <p><strong>Collected:</strong> {new Date(pkg.collected_at).toLocaleString()}</p>
            {pkg.description && <p><strong>Description:</strong> {pkg.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
