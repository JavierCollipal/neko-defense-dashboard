// 🐾⚖️ DINA ARMY LIST (2008 - 1097 Agents) - GraphQL Integration 🐾⚖️
'use client';
import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import {
  GET_DINA_AGENTS,
  GET_DINA_AGENT,
  SEARCH_DINA_AGENTS,
  GET_DINA_STATISTICS
} from '../graphql/dinaArmyListQueries';
import '../styles/DinaArmyList.css';

const DinaArmyList = () => {
  // State management
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [sortBy, setSortBy] = useState('FULL_NAME_ASC');
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // GraphQL Queries
  const { data, loading, error, refetch } = useQuery(GET_DINA_AGENTS, {
    variables: {
      page,
      limit,
      sortBy,
      filter: Object.keys(filters).length > 0 ? filters : null,
    },
    fetchPolicy: 'network-only',
  });

  const { data: statsData, loading: statsLoading } = useQuery(GET_DINA_STATISTICS);

  const [searchAgents, { data: searchData, loading: searchLoading }] = useLazyQuery(SEARCH_DINA_AGENTS);

  const [getAgent, { data: agentData }] = useLazyQuery(GET_DINA_AGENT);

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchAgents({ variables: { query: searchQuery, limit: 50 } });
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    if (value === '' || value === null) {
      const newFilters = { ...filters };
      delete newFilters[filterName];
      setFilters(newFilters);
    } else {
      setFilters({
        ...filters,
        [filterName]: value,
      });
    }
    setPage(1); // Reset to page 1 when filtering
  };

  // Handle agent selection
  const handleSelectAgent = (agentId) => {
    getAgent({ variables: { agent_id: agentId } });
  };

  // Close detail modal
  useEffect(() => {
    if (agentData?.getDINAAgent) {
      setSelectedAgent(agentData.getDINAAgent);
    }
  }, [agentData]);

  // Pagination data
  const agents = searchData?.searchDINAAgents || data?.getDINAAgents?.agents || [];
  const pagination = data?.getDINAAgents?.pagination;
  const stats = statsData?.getDINAStatistics;

  // Loading state
  if (loading && !data) {
    return (
      <div className="army-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading 2008 DINA Army List (1,097 agents), nyaa~...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="army-list-error">
        <h3>❌ Failed to load DINA Army List</h3>
        <p>Error: {error.message}</p>
        <p>Make sure the NestJS API is running on http://localhost:5001</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dina-army-list-container">
      {/* Header */}
      <div className="army-list-header">
        <h2>📋 2008 DINA ARMY LIST - 1,097 Total Known Agents</h2>
        <p className="header-subtitle">
          Official Chilean Army submission to Judge Alejandro Solís (2008)
        </p>
        <p className="header-sources">
          Sources: 2008 Army List, León Gómez Araneda compilation, CIPER Chile investigation
        </p>
      </div>

      {/* Statistics Dashboard */}
      {stats && !statsLoading && (
        <div className="army-stats-dashboard">
          <div className="stat-card primary">
            <div className="stat-number">{stats.total_agents}</div>
            <div className="stat-label">Total Agents (2008 List)</div>
          </div>
          <div className="stat-card success">
            <div className="stat-number">{stats.verified_count}</div>
            <div className="stat-label">Verified Records</div>
          </div>
          <div className="stat-card warning">
            <div className="stat-number">{stats.pending_count}</div>
            <div className="stat-label">Pending Verification</div>
          </div>
          <div className="stat-card info">
            <div className="stat-number">{stats.by_category?.length || 0}</div>
            <div className="stat-label">Categories</div>
          </div>
          <div className="stat-card info">
            <div className="stat-number">{stats.by_brigade?.length || 0}</div>
            <div className="stat-label">Brigades</div>
          </div>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="army-controls-bar">
        {/* Search */}
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            className="search-button"
            onClick={handleSearch}
            disabled={searchLoading}
          >
            {searchLoading ? '🔍 Searching...' : '🔍 Search'}
          </button>
          {searchData && (
            <button
              className="clear-search-button"
              onClick={() => {
                setSearchQuery('');
                refetch();
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Toggle Filters Button */}
        <button
          className="toggle-filters-button"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? '▼ Hide Filters' : '▶ Show Filters'}
        </button>

        {/* Sort Dropdown */}
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
        >
          <option value="FULL_NAME_ASC">Name (A-Z)</option>
          <option value="FULL_NAME_DESC">Name (Z-A)</option>
          <option value="RANK_ASC">Rank (A-Z)</option>
          <option value="RANK_DESC">Rank (Z-A)</option>
          <option value="CATEGORY_ASC">Category (A-Z)</option>
          <option value="CREATED_AT_DESC">Recently Added</option>
        </select>

        {/* Results Per Page */}
        <select
          className="limit-select"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
        </select>
      </div>

      {/* Filters Panel (Collapsible) */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Category:</label>
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="DINA_STATE_STAFF">DINA State Staff</option>
              <option value="REGIONAL_COMMAND">Regional Command</option>
              <option value="BRIGADE">Brigade</option>
              <option value="DEPARTMENT">Department</option>
              <option value="ENLISTED">Enlisted</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Legal Status:</label>
            <select
              value={filters.legal_status || ''}
              onChange={(e) => handleFilterChange('legal_status', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="convicted">Convicted</option>
              <option value="indicted">Indicted</option>
              <option value="investigated">Investigated</option>
              <option value="at_large">At Large</option>
              <option value="deceased">Deceased</option>
              <option value="unprosecuted">Unprosecuted</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Region:</label>
            <input
              type="text"
              placeholder="e.g., Metropolitan, I, V..."
              value={filters.region || ''}
              onChange={(e) => handleFilterChange('region', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Brigade:</label>
            <input
              type="text"
              placeholder="e.g., Lautaro, Mulchén..."
              value={filters.brigade || ''}
              onChange={(e) => handleFilterChange('brigade', e.target.value)}
            />
          </div>

          <button
            className="clear-filters-button"
            onClick={() => {
              setFilters({});
              setPage(1);
            }}
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Agents Table */}
      <div className="agents-table-wrapper">
        {loading ? (
          <div className="table-loading">Loading agents...</div>
        ) : agents.length === 0 ? (
          <div className="no-results">
            <p>No agents found matching your criteria.</p>
            <button onClick={() => { setFilters({}); setSearchQuery(''); refetch(); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <table className="agents-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Rank</th>
                <th>Category</th>
                <th>Brigade</th>
                <th>Region</th>
                <th>Legal Status</th>
                <th>Verification</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, index) => (
                <tr key={agent.agent_id} className={`row-${agent.legal_status || 'unknown'}`}>
                  <td>{(page - 1) * limit + index + 1}</td>
                  <td className="name-cell">
                    <strong>{agent.full_name}</strong>
                    {agent.rut && <div className="rut-cell">{agent.rut}</div>}
                  </td>
                  <td>{agent.rank}</td>
                  <td>
                    <span className={`category-badge ${agent.category?.toLowerCase().replace('_', '-')}`}>
                      {agent.category?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>{agent.brigade || '-'}</td>
                  <td>{agent.region || '-'}</td>
                  <td>
                    <span className={`status-badge status-${agent.legal_status || 'unknown'}`}>
                      {agent.legal_status || 'Unknown'}
                    </span>
                  </td>
                  <td>
                    <span className={`verification-badge ${agent.verification_status}`}>
                      {agent.verification_status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view-details-btn"
                      onClick={() => handleSelectAgent(agent.agent_id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination && !searchData && (
        <div className="pagination-controls">
          <div className="pagination-info">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} agents
          </div>
          <div className="pagination-buttons">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="pagination-btn"
            >
              ⏮ First
            </button>
            <button
              onClick={() => setPage(page - 1)}
              disabled={!pagination.hasPreviousPage}
              className="pagination-btn"
            >
              ◀ Previous
            </button>
            <span className="page-indicator">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!pagination.hasNextPage}
              className="pagination-btn"
            >
              Next ▶
            </button>
            <button
              onClick={() => setPage(pagination.totalPages)}
              disabled={page === pagination.totalPages}
              className="pagination-btn"
            >
              Last ⏭
            </button>
          </div>
        </div>
      )}

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div className="agent-detail-modal" onClick={() => setSelectedAgent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedAgent(null)}>
              ✕
            </button>
            <h3>{selectedAgent.full_name}</h3>
            {selectedAgent.rut && <p><strong>RUT:</strong> {selectedAgent.rut}</p>}

            <div className="detail-section">
              <h4>Military Information</h4>
              <p><strong>Rank:</strong> {selectedAgent.rank}</p>
              {selectedAgent.branch && <p><strong>Branch:</strong> {selectedAgent.branch}</p>}
              {selectedAgent.service_number && <p><strong>Service Number:</strong> {selectedAgent.service_number}</p>}
            </div>

            <div className="detail-section">
              <h4>DINA Organization</h4>
              <p><strong>Category:</strong> {selectedAgent.category?.replace(/_/g, ' ')}</p>
              {selectedAgent.region && <p><strong>Region:</strong> {selectedAgent.region}</p>}
              {selectedAgent.brigade && <p><strong>Brigade:</strong> {selectedAgent.brigade}</p>}
              {selectedAgent.department && <p><strong>Department:</strong> {selectedAgent.department}</p>}
              {selectedAgent.position && <p><strong>Position:</strong> {selectedAgent.position}</p>}
              {selectedAgent.service_period_text && <p><strong>Service Period:</strong> {selectedAgent.service_period_text}</p>}
            </div>

            {selectedAgent.legal_status && (
              <div className="detail-section">
                <h4>⚖️ Legal Status</h4>
                <p className={`status-${selectedAgent.legal_status}`}>
                  <strong>{selectedAgent.legal_status}</strong>
                </p>
              </div>
            )}

            {selectedAgent.convictions && selectedAgent.convictions.length > 0 && (
              <div className="detail-section">
                <h4>Convictions</h4>
                {selectedAgent.convictions.map((conv, i) => (
                  <div key={i} className="conviction-item">
                    <p><strong>Case:</strong> {conv.case_name}</p>
                    <p><strong>Verdict:</strong> {conv.verdict}</p>
                    {conv.sentence && <p><strong>Sentence:</strong> {conv.sentence}</p>}
                  </div>
                ))}
              </div>
            )}

            {selectedAgent.investigations && selectedAgent.investigations.length > 0 && (
              <div className="detail-section">
                <h4>Investigations</h4>
                {selectedAgent.investigations.map((inv, i) => (
                  <div key={i} className="investigation-item">
                    <p><strong>Case:</strong> {inv.case_name}</p>
                    <p><strong>Status:</strong> {inv.status}</p>
                    {inv.judge && <p><strong>Judge:</strong> {inv.judge}</p>}
                  </div>
                ))}
              </div>
            )}

            {selectedAgent.alleged_crimes && selectedAgent.alleged_crimes.length > 0 && (
              <div className="detail-section">
                <h4>Alleged Crimes</h4>
                <ul>
                  {selectedAgent.alleged_crimes.map((crime, i) => (
                    <li key={i}>{crime}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedAgent.known_operations && selectedAgent.known_operations.length > 0 && (
              <div className="detail-section">
                <h4>Known Operations</h4>
                <ul>
                  {selectedAgent.known_operations.map((op, i) => (
                    <li key={i}>{op}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedAgent.victims_linked && selectedAgent.victims_linked.length > 0 && (
              <div className="detail-section">
                <h4>Victims Linked</h4>
                <ul>
                  {selectedAgent.victims_linked.map((victim, i) => (
                    <li key={i}>{victim}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedAgent.post_dina_positions && selectedAgent.post_dina_positions.length > 0 && (
              <div className="detail-section">
                <h4>Post-DINA Career</h4>
                {selectedAgent.post_dina_positions.map((pos, i) => (
                  <div key={i} className="position-item">
                    <p><strong>Institution:</strong> {pos.institution}</p>
                    <p><strong>Position:</strong> {pos.position} ({pos.rank})</p>
                  </div>
                ))}
              </div>
            )}

            {selectedAgent.aliases && selectedAgent.aliases.length > 0 && (
              <div className="detail-section">
                <h4>Aliases</h4>
                <p>{selectedAgent.aliases.join(', ')}</p>
              </div>
            )}

            {selectedAgent.biographical_notes && (
              <div className="detail-section">
                <h4>Biographical Notes</h4>
                <p>{selectedAgent.biographical_notes}</p>
              </div>
            )}

            {selectedAgent.data_sources && selectedAgent.data_sources.length > 0 && (
              <div className="detail-section">
                <h4>Data Sources</h4>
                {selectedAgent.data_sources.map((source, i) => (
                  <div key={i} className="source-item">
                    <p><strong>{source.source_name}</strong> ({source.confidence})</p>
                  </div>
                ))}
              </div>
            )}

            <div className="detail-section verification-footer">
              <p><strong>Verification Status:</strong> {selectedAgent.verification_status}</p>
              <p><strong>Record Created:</strong> {new Date(selectedAgent.created_at).toLocaleDateString()}</p>
              <p><strong>Last Updated:</strong> {new Date(selectedAgent.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DinaArmyList;
