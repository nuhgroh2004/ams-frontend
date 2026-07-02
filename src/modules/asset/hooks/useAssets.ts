'use client';

import { useQuery } from '@apollo/client';
import { GET_ASSETS } from '@/modules/asset/services/asset.query';
import { parseApolloError, type ParsedError } from '@/lib/core/api/error-handler';
import { Asset, AssetFilterInput, AssetListResponse } from '../types';

export interface UseAssetsOptions {
  page?: number;
  limit?: number;
  filter?: AssetFilterInput;
}

export interface UseAssetsResult {
  assets: Asset[];
  loading: boolean;
  error: ParsedError | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  refetch: () => Promise<any>;
}

export function useAssets(options: UseAssetsOptions = {}): UseAssetsResult {
  const { 
    page = 1, 
    limit = 10, 
    filter = {}
  } = options;

  const { data, loading, error, refetch } = useQuery<{ assets: AssetListResponse }>(GET_ASSETS, {
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
    assets: data?.assets?.data || [],
    loading,
    error: parsedError,
    total: data?.assets?.total || 0,
    page: data?.assets?.page || page,
    limit: data?.assets?.limit || limit,
    totalPages: data?.assets?.totalPages || 0,
    refetch,
  };
}
