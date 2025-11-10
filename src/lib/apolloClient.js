// 🐾⚡ APOLLO CLIENT CONFIGURATION - GraphQL Client for NestJS API 🐾⚡
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// API URL - Use environment variable or default to localhost:5001
const GRAPHQL_API_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'http://localhost:5001/graphql';

const httpLink = new HttpLink({
  uri: GRAPHQL_API_URL,
  credentials: 'same-origin', // Include cookies if needed
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default apolloClient;
