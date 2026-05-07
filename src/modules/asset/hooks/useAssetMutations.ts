'use client';

import { useMutation } from '@apollo/client';
import { CREATE_ASSET, UPDATE_ASSET, DELETE_ASSET } from '@/modules/asset/services/asset.mutation';
import { parseApolloError, type ParsedError } from '@/lib/core/api/error-handler';

/**
 * useCreateAsset Mutation Hook
 */

export interface CreateAssetInput {
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
}

export interface UseCreateAssetResult {
  create: (input: CreateAssetInput) => Promise<any>;
  loading: boolean;
  error: ParsedError | null;
}

export function useCreateAsset(): UseCreateAssetResult {
  const [mutate, { loading, error }] = useMutation(CREATE_ASSET);

  const parsedError = error ? parseApolloError(error) : null;

  return {
    create: async (input: CreateAssetInput) => {
      const result = await mutate({ variables: { input } });
      return result.data?.createAsset;
    },
    loading,
    error: parsedError,
  };
}

/**
 * useUpdateAsset Mutation Hook
 */

export interface UpdateAssetInput {
  kodeBarang?: string;
  nomorRegister?: string;
  namaBarang?: string;
  merk?: string;
  kategoriId?: number;
  nilaiPerolehan?: number;
  sumberDana?: string;
  tahunPerolehan?: number;
  klasifikasi?: string;
  kondisi?: string;
  statusPenggunaan?: string;
  lokasiId?: number;
  unitId?: number;
  penanggungJawabId?: number;
}

export interface UseUpdateAssetResult {
  update: (id: string, input: UpdateAssetInput) => Promise<any>;
  loading: boolean;
  error: ParsedError | null;
}

export function useUpdateAsset(): UseUpdateAssetResult {
  const [mutate, { loading, error }] = useMutation(UPDATE_ASSET);

  const parsedError = error ? parseApolloError(error) : null;

  return {
    update: async (id: string, input: UpdateAssetInput) => {
      const result = await mutate({ variables: { id, input } });
      return result.data?.updateAsset;
    },
    loading,
    error: parsedError,
  };
}

/**
 * useDeleteAsset Mutation Hook
 */

export interface UseDeleteAssetResult {
  delete: (id: string) => Promise<any>;
  loading: boolean;
  error: ParsedError | null;
}

export function useDeleteAsset(): UseDeleteAssetResult {
  const [mutate, { loading, error }] = useMutation(DELETE_ASSET);

  const parsedError = error ? parseApolloError(error) : null;

  return {
    delete: async (id: string) => {
      const result = await mutate({ variables: { id } });
      return result.data?.deleteAsset;
    },
    loading,
    error: parsedError,
  };
}
