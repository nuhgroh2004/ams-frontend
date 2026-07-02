'use client';

import { useQuery } from '@apollo/client';
import { GET_RIWAYAT_MUTASI, GET_MUTASI_MENUNGGU_APPROVAL } from '@/modules/transfer/services/mutasi.query';
import { parseApolloError, type ParsedError } from '@/lib/core/api/error-handler';
import { AssetMutasi, MutasiFilterInput } from '../types';

export interface UseMutasiHistoryOptions {
  page?: number;
  limit?: number;
  filter?: MutasiFilterInput;
}

export interface UseMutasiHistoryResult {
  mutasis: AssetMutasi[];
  loading: boolean;
  error: ParsedError | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  refetch: () => Promise<any>;
}

export function useMutasiHistory(
  options: UseMutasiHistoryOptions = {}
): UseMutasiHistoryResult {
  const { page = 1, limit = 10, filter = {} } = options;

  const { data, loading, error, refetch } = useQuery(GET_RIWAYAT_MUTASI, {
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
    mutasis: data?.riwayatMutasi?.data || [],
    loading,
    error: parsedError,
    total: data?.riwayatMutasi?.total || 0,
    page: data?.riwayatMutasi?.page || page,
    limit: data?.riwayatMutasi?.limit || limit,
    totalPages: data?.riwayatMutasi?.totalPages || 0,
    refetch,
  };
}

export function useMutasiMenungguApproval(options: { page?: number; limit?: number } = {}): UseMutasiHistoryResult {
  const { page = 1, limit = 10 } = options;

  const { data, loading, error, refetch } = useQuery(GET_MUTASI_MENUNGGU_APPROVAL, {
    variables: {
      page,
      limit,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const parsedError = error ? parseApolloError(error) : null;

  return {
    mutasis: data?.mutasiMenungguApproval?.data || [],
    loading,
    error: parsedError,
    total: data?.mutasiMenungguApproval?.total || 0,
    page: data?.mutasiMenungguApproval?.page || page,
    limit: data?.mutasiMenungguApproval?.limit || limit,
    totalPages: data?.mutasiMenungguApproval?.totalPages || 0,
    refetch,
  };
}
