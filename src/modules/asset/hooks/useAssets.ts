'use client';

import * as React from 'react';
import { useQuery, ApolloError } from '@apollo/client';
import { GET_ASSETS } from '@/modules/asset/services/asset.query';
import { parseApolloError, type ParsedError } from '@/lib/core/api/error-handler';

/**
 * useAssets Hook
 *
 * Fetches paginated assets from GraphQL backend using Apollo's useQuery
 *
 * Pattern:
 * 1. Hook uses Apollo's useQuery
 * 2. Returns data, loading, error, and refetch
 * 3. Component uses hook
 *
 * Data Flow: Component → Hook → Apollo useQuery → GraphQL → Backend
 */

export interface AssetData {
  id: string;
  kodeBarang: string;
  nomorRegister: string;
  namaBarang: string;
  merk?: string;
  kategoriId: number;
  nilaiPerolehan: number;
  sumberDana: string;
  tahunPerolehan: number;
  klasifikasi: string;
  kondisi: string;
  statusPenggunaan: string;
  lokasiId: number;
  unitId: number;
  penanggungJawabId: number;
  createdAt: string;
  updatedAt: string;
}

export interface UseAssetsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UseAssetsResult {
  assets: AssetData[];
  loading: boolean;
  error: ParsedError | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  refetch: () => Promise<any>;
}

export function useAssets(options: UseAssetsOptions = {}): UseAssetsResult {
  const { 
    page = 1, 
    pageSize = 10, 
    search = '', 
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;

  const { data, loading, error, refetch } = useQuery(GET_ASSETS, {
    variables: {
      page,
      pageSize,
      search,
      sortBy,
      sortOrder,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const parsedError = error ? parseApolloError(error) : null;

  return {
    assets: data?.assets?.items || [],
    loading,
    error: parsedError,
    total: data?.assets?.total || 0,
    page: data?.assets?.page || page,
    pageSize: data?.assets?.pageSize || pageSize,
    totalPages: data?.assets?.totalPages || 0,
    refetch,
  };
}
