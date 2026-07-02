'use client';

import { useQuery } from '@apollo/client';
import { GET_ASSIGNMENT_HISTORY } from '@/modules/transfer/services/assignment.query';
import { parseApolloError, type ParsedError } from '@/lib/core/api/error-handler';
import { AssetAssignment, AssetAssignmentFilterInput } from '../types';

export interface UseAssignmentHistoryOptions {
  page?: number;
  limit?: number;
  filter?: AssetAssignmentFilterInput;
}

export interface UseAssignmentHistoryResult {
  assignments: AssetAssignment[];
  loading: boolean;
  error: ParsedError | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  refetch: () => Promise<any>;
}

export function useAssignmentHistory(
  options: UseAssignmentHistoryOptions = {}
): UseAssignmentHistoryResult {
  const { page = 1, limit = 10, filter = {} } = options;

  const { data, loading, error, refetch } = useQuery(GET_ASSIGNMENT_HISTORY, {
    variables: {
      page,
      limit,
      filter,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const parsedError = error ? parseApolloError(error) : null;

  return {
    assignments: data?.assetAssignmentHistory?.data || [],
    loading,
    error: parsedError,
    total: data?.assetAssignmentHistory?.total || 0,
    page: data?.assetAssignmentHistory?.page || page,
    limit: data?.assetAssignmentHistory?.limit || limit,
    totalPages: data?.assetAssignmentHistory?.totalPages || 0,
    refetch,
  };
}
