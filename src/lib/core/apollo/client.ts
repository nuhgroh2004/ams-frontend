import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

/**
 * Apollo Client Configuration
 *
 * Setup:
 * 1. Configure your GraphQL endpoint in GRAPHQL_ENDPOINT
 * 2. Add authentication middleware if needed
 * 3. Setup error handling policies
 */

import { setContext } from '@apollo/client/link/context';
import { getToken } from '@/modules/auth/utils/auth-token';

import { onError } from '@apollo/client/link/error';
import { useAuthStore } from '@/modules/auth/store/auth.store';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';

// Error handling link
const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === 'UNAUTHENTICATED') {
        // Task 13.4: if token invalid → logout
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
  }
});

// Authentication link
const authLink = setContext((_, { headers }) => {
  const token = getToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// HTTP link
const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
});

// Combine links
const link = ApolloLink.from([errorLink, authLink, httpLink]);

// Initialize Apollo Client
export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
});

export default apolloClient;
