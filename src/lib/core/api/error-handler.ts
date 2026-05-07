/**
 * API Error Handler
 *
 * Centralized error handling for GraphQL and network errors
 */

import { ApolloError } from '@apollo/client';

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ParsedError {
  code: string;
  message: string;
  isNetworkError: boolean;
  isGraphQLError: boolean;
  details?: Record<string, any>;
}

/**
 * Parse Apollo errors into a standardized format
 */
export function parseApolloError(error: ApolloError): ParsedError {
  // Network error
  if (error.networkError) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Network error. Please check your connection.',
      isNetworkError: true,
      isGraphQLError: false,
      details: {
        statusCode: (error.networkError as any)?.statusCode,
        message: (error.networkError as any)?.message,
      },
    };
  }

  // GraphQL error
  if (error.graphQLErrors?.length > 0) {
    const gqlError = error.graphQLErrors[0];
    return {
      code: (gqlError.extensions?.code as string) || 'GRAPHQL_ERROR',
      message: gqlError.message || 'An error occurred',
      isNetworkError: false,
      isGraphQLError: true,
      details: gqlError.extensions,
    };
  }

  // Generic error
  return {
    code: 'UNKNOWN_ERROR',
    message: error.message || 'An unknown error occurred',
    isNetworkError: false,
    isGraphQLError: false,
  };
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: ApolloError | Error | string): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof ApolloError) {
    const parsed = parseApolloError(error);
    return parsed.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred';
}

/**
 * Check if error is a specific type
 */
export function isNetworkError(error: ApolloError): boolean {
  return !!error.networkError;
}

export function isGraphQLError(error: ApolloError): boolean {
  return (error.graphQLErrors?.length ?? 0) > 0;
}

export function isAuthenticationError(error: ApolloError): boolean {
  const parsed = parseApolloError(error);
  return parsed.code === 'UNAUTHENTICATED' || parsed.code === 'AUTHENTICATION_ERROR';
}

export function isAuthorizationError(error: ApolloError): boolean {
  const parsed = parseApolloError(error);
  return parsed.code === 'FORBIDDEN' || parsed.code === 'AUTHORIZATION_ERROR';
}

/**
 * Handle mutation errors
 */
export function handleMutationError(error: ApolloError): ParsedError {
  return parseApolloError(error);
}

/**
 * Handle query errors
 */
export function handleQueryError(error: ApolloError): ParsedError {
  return parseApolloError(error);
}
