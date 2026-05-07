/**
 * AMS Frontend Configuration
 *
 * Centralized configuration for the application
 */

export const config = {
  // API
  graphql: {
    endpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
  },

  // Pagination defaults
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
  },

  // Workflow
  workflow: {
    statusColors: {
      pending: 'yellow',
      approved: 'green',
      rejected: 'red',
    },
  },

  // Feature flags
  features: {
    enableAsync: true,
    enableNotifications: true,
  },
};

export default config;
