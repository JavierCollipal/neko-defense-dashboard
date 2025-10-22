'use client';
import { useState, useEffect } from 'react';

export default function CasePatternsPage() {
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPatterns() {
      try {
        const response = await fetch('/api/case-patterns');
        if (!response.ok) throw new Error('Failed to fetch case patterns');
        const result = await response.json();
        setPatterns(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPatterns();
  }, []);

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>📚 Case Patterns</h1>
      <p>Loading learned patterns...</p>
    </div>
  );

  if (error) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
      <h1>📚 Case Patterns</h1>
      <p>Error: {error}</p>
    </div>
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📚 Case Patterns</h1>
      <p>Total patterns learned: {patterns.length}</p>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
        {patterns.map((pattern, index) => (
          <div key={index} style={{
            border: '1px solid #ddd',
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}>
            <h3>{pattern.title || 'Untitled Pattern'}</h3>
            <p><strong>Category:</strong> {pattern.category || 'Unknown'}</p>
            <p><strong>Problem:</strong> {typeof pattern.problem === 'object' ? JSON.stringify(pattern.problem) : (pattern.problem || 'No description')}</p>
            <p><strong>Solution:</strong> {typeof pattern.solution === 'object' ? JSON.stringify(pattern.solution) : (pattern.solution || 'No solution')}</p>
            <p><strong>Reusability:</strong> {pattern.reusability || 'Unknown'}</p>
            {pattern.difficulty && <p><strong>Difficulty:</strong> {pattern.difficulty}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
