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

            {/* Problem */}
            <div style={{ marginTop: '1rem' }}>
              <strong>Problem:</strong>
              <p style={{ marginLeft: '1rem' }}>
                {typeof pattern.problem === 'string' ? pattern.problem : JSON.stringify(pattern.problem)}
              </p>
            </div>

            {/* Solution */}
            {pattern.solution && (
              <div style={{ marginTop: '1rem' }}>
                <strong>Solution:</strong>
                {typeof pattern.solution === 'object' ? (
                  <div style={{ marginLeft: '1rem' }}>
                    {pattern.solution.approach && <p><em>Approach:</em> {pattern.solution.approach}</p>}
                    {pattern.solution.steps && Array.isArray(pattern.solution.steps) && (
                      <div>
                        <em>Steps:</em>
                        <ol>
                          {pattern.solution.steps.map((step, i) => (
                            <li key={i}>{String(step)}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                    {pattern.solution.outcome && <p><em>Outcome:</em> {pattern.solution.outcome}</p>}
                  </div>
                ) : (
                  <p style={{ marginLeft: '1rem' }}>{String(pattern.solution)}</p>
                )}
              </div>
            )}

            {/* Tags */}
            {pattern.tags && Array.isArray(pattern.tags) && pattern.tags.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <strong>Tags:</strong> {pattern.tags.map(tag => String(tag)).join(', ')}
              </div>
            )}

            {/* Metadata */}
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {pattern.difficulty && <span><strong>Difficulty:</strong> {pattern.difficulty}</span>}
              {pattern.reusability && <span><strong>Reusability:</strong> {pattern.reusability}</span>}
              {pattern.estimatedTime && <span><strong>Time:</strong> {pattern.estimatedTime}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
