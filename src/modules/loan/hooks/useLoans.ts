'use client';

import { useQuery, ApolloError } from '@apollo/client';
import { GET_LOANS } from '@/modules/loan/services/loan.query';
import { parseApolloError, type ParsedError } from '@/lib/core/api/error-handler';

/**
 * useLoans Hook
 *
 * Fetches paginated loans from GraphQL backend using Apollo's useQuery
 *
 * Data Flow: Component → Hook → Apollo useQuery → GraphQL → Backend
 */

export interface LoanData {
  id: string;
  assetId: string;
  peminjamId: string;
  approverId?: string;
  workflowInstanceId?: string;
  tanggalPinjam: string;
  tanggalRencanKembali: string;
  tanggalKembali?: string;
  status: 'menunggu' | 'disetujui' | 'ditolak' | 'dipinjam' | 'selesai' | 'terlambat';
  createdAt: string;
}

export interface UseLoansOptions {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
}

export interface UseLoansResult {
  loans: LoanData[];
  loading: boolean;
  error: ParsedError | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  refetch: () => Promise<any>;
}

export function useLoans(options: UseLoansOptions = {}): UseLoansResult {
  const { 
    page = 1, 
    pageSize = 10, 
    status = '', 
    search = '' 
  } = options;

  const { data, loading, error, refetch } = useQuery(GET_LOANS, {
    variables: {
      page,
      pageSize,
      status: status || undefined,
      search: search || undefined,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const parsedError = error ? parseApolloError(error) : null;

  return {
    loans: data?.loans?.items || [],
    loading,
    error: parsedError,
    total: data?.loans?.total || 0,
    page: data?.loans?.page || page,
    pageSize: data?.loans?.pageSize || pageSize,
    totalPages: data?.loans?.totalPages || 0,
    refetch,
  };
}
