'use client';

import { useQuery } from '@apollo/client';
import { GET_PEMINJAMAN_SAYA } from '@/modules/loan/services/loan.query';
import { parseApolloError, type ParsedError } from '@/lib/core/api/error-handler';
import { LoanDTO } from '../types';

export interface UseLoansOptions {
  page?: number;
  limit?: number;
  status?: string;
}

export interface UseLoansResult {
  loans: LoanDTO[];
  loading: boolean;
  error: ParsedError | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  refetch: () => Promise<any>;
}

export function useLoans(options: UseLoansOptions = {}): UseLoansResult {
  const { 
    page = 1, 
    limit = 10, 
    status = '' 
  } = options;

  const { data, loading, error, refetch } = useQuery(GET_PEMINJAMAN_SAYA, {
    variables: {
      page,
      limit,
      status: status || null,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const parsedError = error ? parseApolloError(error) : null;

  return {
    loans: data?.peminjamanSaya?.data || [],
    loading,
    error: parsedError,
    total: data?.peminjamanSaya?.total || 0,
    page: data?.peminjamanSaya?.page || page,
    limit: data?.peminjamanSaya?.limit || limit,
    totalPages: data?.peminjamanSaya?.totalPages || 0,
    refetch,
  };
}
