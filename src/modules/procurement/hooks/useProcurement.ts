'use client';

import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_PROCUREMENTS, 
  CREATE_PROCUREMENT, 
  DELETE_PROCUREMENT 
} from '../services/procurement.graphql';
import { parseApolloError, type ParsedError } from '@/lib/core/api/error-handler';
import { Procurement, ProcurementListResponse, CreateProcurementInput } from '../types';

export interface UseProcurementsOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UseProcurementsResult {
  procurements: Procurement[];
  loading: boolean;
  error: ParsedError | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  refetch: () => Promise<any>;
}

export function useProcurements(options: UseProcurementsOptions = {}): UseProcurementsResult {
  const { page = 1, limit = 10, search = '' } = options;

  const { data, loading, error, refetch } = useQuery<{ procurements: ProcurementListResponse }>(GET_PROCUREMENTS, {
    variables: {
      page,
      limit,
      search: search || undefined,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const parsedError = error ? parseApolloError(error) : null;

  return {
    procurements: data?.procurements?.data || [],
    loading,
    error: parsedError,
    total: data?.procurements?.total || 0,
    page: data?.procurements?.page || page,
    limit: data?.procurements?.limit || limit,
    totalPages: data?.procurements?.totalPages || 0,
    refetch,
  };
}

export interface UseCreateProcurementResult {
  createProcurement: (input: CreateProcurementInput) => Promise<Procurement>;
  loading: boolean;
  error: ParsedError | null;
}

export function useCreateProcurement(): UseCreateProcurementResult {
  const [mutate, { loading, error }] = useMutation(CREATE_PROCUREMENT);

  const parsedError = error ? parseApolloError(error) : null;

  return {
    createProcurement: async (input: CreateProcurementInput) => {
      const result = await mutate({ variables: { input } });
      return result.data?.createProcurement;
    },
    loading,
    error: parsedError,
  };
}

export interface UseDeleteProcurementResult {
  deleteProcurement: (id: string) => Promise<boolean>;
  loading: boolean;
  error: ParsedError | null;
}

export function useDeleteProcurement(): UseDeleteProcurementResult {
  const [mutate, { loading, error }] = useMutation(DELETE_PROCUREMENT);

  const parsedError = error ? parseApolloError(error) : null;

  return {
    deleteProcurement: async (id: string) => {
      const result = await mutate({ variables: { id } });
      return result.data?.deleteProcurement;
    },
    loading,
    error: parsedError,
  };
}
