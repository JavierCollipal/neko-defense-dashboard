// 🐾⚡ NEKO DEFENSE - Apollo Client Configuration ⚡🐾
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

console.log('🎮 [Apollo Client] Initializing GraphQL client, nyaa~!');

// HTTP connection to the GraphQL API
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
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

// Create Apollo Client instance
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

console.log('✅ [Apollo Client] GraphQL client ready, desu~!');
