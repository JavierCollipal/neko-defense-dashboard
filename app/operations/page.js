'use client';
import { useState, useEffect } from 'react';

export default function OperationsPage() {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOperations() {
      try {
        const response = await fetch('/api/ready-operations');
        if (!response.ok) throw new Error('Failed to fetch ready operations');
        const result = await response.json();
        setOperations(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOperations();
  }, []);

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>⚡ Ready Operations</h1>
      <p>Loading queued operations...</p>
    </div>
  );

  if (error) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
      <h1>⚡ Ready Operations</h1>
      <p>Error: {error}</p>
    </div>
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h1>⚡ Ready Operations</h1>
      <p>Total operations queued: {operations.length}</p>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
        {operations.map((op, index) => (
          <div key={index} style={{
            border: '1px solid #ddd',
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}>
            <h3>{op.operation_name || 'Unnamed Operation'}</h3>
            <p><strong>Type:</strong> {op.operation_type}</p>
            <p><strong>Priority:</strong> {op.priority}</p>
            <p><strong>Status:</strong> {op.status}</p>
            {op.description && <p><strong>Description:</strong> {op.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
