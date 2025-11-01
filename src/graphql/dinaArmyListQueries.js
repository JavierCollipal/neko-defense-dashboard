// 🐾⚖️ DINA ARMY LIST GraphQL QUERIES 🐾⚖️
import { gql } from '@apollo/client';

// Get paginated DINA agents with optional filters
export const GET_DINA_AGENTS = gql`
  query GetDINAAgents(
    $page: Int!
    $limit: Int!
    $sortBy: DINASortBy
    $filter: DINAAgentFilter
  ) {
    getDINAAgents(
      page: $page
      limit: $limit
      sortBy: $sortBy
      filter: $filter
    ) {
      agents {
        agent_id
        full_name
        rut
        rank
        branch
        category
        region
        brigade
        department
        position
        legal_status
        created_at
        verification_status
      }
      pagination {
        total
        page
        limit
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

// Get single DINA agent by ID
export const GET_DINA_AGENT = gql`
  query GetDINAAgent($agent_id: String!) {
    getDINAAgent(agent_id: $agent_id) {
      agent_id
      full_name
      rut
      rank
      branch
      service_number
      category
      region
      brigade
      department
      position
      position_number
      service_period_text
      legal_status
      convictions {
        case_name
        verdict
        sentence
      }
      investigations {
        case_name
        status
        judge
      }
      post_dina_positions {
        institution
        rank
        position
      }
      known_operations
      alleged_crimes
      victims_linked
      data_sources {
        source_name
        confidence
      }
      aliases
      biographical_notes
      created_at
      updated_at
      verification_status
    }
  }
`;

// Search DINA agents by name
export const SEARCH_DINA_AGENTS = gql`
  query SearchDINAAgents($query: String!, $limit: Int!) {
    searchDINAAgents(query: $query, limit: $limit) {
      agent_id
      full_name
      rank
      category
      region
      brigade
      legal_status
      verification_status
    }
  }
`;

// Get DINA statistics
export const GET_DINA_STATISTICS = gql`
  query GetDINAStatistics {
    getDINAStatistics {
      total_agents
      by_category {
        category
        count
      }
      by_legal_status {
        status
        count
      }
      by_region {
        region
        count
      }
      by_brigade {
        brigade
        count
      }
      verified_count
      pending_count
    }
  }
`;
