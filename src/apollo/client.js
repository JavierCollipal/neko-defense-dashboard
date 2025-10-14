// 🐾⚡ NEKO DEFENSE - Apollo Client Configuration ⚡🐾
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';

console.log('🎮 [Apollo Client] Initializing GraphQL client, nyaa~!');

// 🎯 Dynamic GraphQL API URL from environment variables
// Falls back to port 4000 if not specified, desu~!
const GRAPHQL_URI = process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:4000/graphql';
console.log('🔗 [Apollo Client] Connecting to GraphQL API:', GRAPHQL_URI);

// HTTP connection to the GraphQL API
const httpLink = createHttpLink({
  uri: GRAPHQL_URI,
});

// 🔄 Retry logic for failed requests - MAXIMUM RESILIENCE!
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 5000,
    jitter: true,
  },
  attempts: {
    max: 5,
    retryIf: (error, _operation) => {
      console.log('🔄 [Apollo Client] Connection error, retrying...', error.message);
      return !!error;
    },
  },
});

// 🚨 Error handling link - Log all GraphQL errors, nyaa~!
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `❌ [GraphQL Error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error('🌐 [Network Error]:', networkError.message);
    console.log('🔄 [Apollo Client] Will retry connection automatically, desu~!');
  }
});

// Add authentication token to requests
const authLink = setContext((_, { headers }) => {
  // Get token from localStorage
  const token = localStorage.getItem('neko_auth_token');

  console.log('🔐 [Apollo Client] Adding auth header:', token ? 'Token present' : 'No token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// Create Apollo Client instance with full middleware chain
// Order: errorLink -> retryLink -> authLink -> httpLink
export const apolloClient = new ApolloClient({
  link: errorLink.concat(retryLink).concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all', // Return partial data on errors
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

console.log('✅ [Apollo Client] GraphQL client ready with auto-reconnection, desu~!');
