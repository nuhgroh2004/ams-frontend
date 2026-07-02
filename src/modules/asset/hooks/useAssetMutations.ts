'use client';

import { useMutation } from '@apollo/client';
import { CREATE_ASSET, UPDATE_ASSET, DELETE_ASSET } from '@/modules/asset/services/asset.mutation';
import { parseApolloError, type ParsedError } from '@/lib/core/api/error-handler';
import { CreateAssetInput, UpdateAssetInput, Asset } from '../types';

export interface UseCreateAssetResult {
  create: (input: CreateAssetInput) => Promise<Asset>;
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

export interface UseUpdateAssetResult {
  update: (id: string, input: UpdateAssetInput) => Promise<Asset>;
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

export interface UseDeleteAssetResult {
  deleteAsset: (id: string) => Promise<boolean>;
  loading: boolean;
  error: ParsedError | null;
}

export function useDeleteAsset(): UseDeleteAssetResult {
  const [mutate, { loading, error }] = useMutation(DELETE_ASSET);

  const parsedError = error ? parseApolloError(error) : null;

  return {
    deleteAsset: async (id: string) => {
      const result = await mutate({ variables: { id } });
      return result.data?.deleteAsset;
    },
    loading,
    error: parsedError,
  };
}
