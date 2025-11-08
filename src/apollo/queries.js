// 🐾⚡ NEKO DEFENSE - GraphQL Queries ⚡🐾
import { gql } from '@apollo/client';

// 🔐 Authentication Mutation
export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      access_token
      user {
        username
        role
      }
    }
  }
`;

// 📊 Threat Actors Queries
export const GET_THREAT_COUNTS = gql`
  query ThreatCounts {
    threatCounts {
      all
      predators
      pedophiles
      dina_network
      ransomware
      state_sponsored
      crypto_crime
    }
  }
`;

export const GET_THREAT_ACTORS = gql`
  query ThreatActors($category: String!) {
    threatActors(category: $category) {
      name
      description
      type
      category
      threat_level
      rank
    }
  }
`;

// ⚖️ DINA Documentation Queries
export const GET_DINA_STATS = gql`
  query DinaStats {
    dinaStats {
      total_documents
      perpetrators {
        total
        convicted
        unprosecuted
        total_known_agents
      }
      torture_centers
      international_crimes
      victims_estimated
      disappeared
      executed
      last_updated
    }
  }
`;

export const GET_DINA_PERPETRATORS = gql`
  query DinaPerpetrators {
    dinaPerpetrators {
      id
      fullName
      name
      role
      position
      organization
      prosecution_status
      legal_status
      legalStatus {
        convicted
        status
      }
      major_crimes
      crimesAccused
    }
  }
`;
