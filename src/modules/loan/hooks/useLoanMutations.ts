'use client';

import { useMutation } from '@apollo/client';
import { CREATE_LOAN, APPROVE_LOAN, REJECT_LOAN, RETURN_LOAN } from '@/modules/loan/services/loan.mutation';
import { parseApolloError, type ParsedError } from '@/lib/core/api/error-handler';

/**
 * useCreateLoan Mutation Hook
 */

export interface CreateLoanInput {
  assetId: string;
  peminjamId: string;
  tanggalRencanKembali: string;
  notes?: string;
}

export interface UseCreateLoanResult {
  create: (input: CreateLoanInput) => Promise<any>;
  loading: boolean;
  error: ParsedError | null;
}

export function useCreateLoan(): UseCreateLoanResult {
  const [mutate, { loading, error }] = useMutation(CREATE_LOAN);

  const parsedError = error ? parseApolloError(error) : null;

  return {
    create: async (input: CreateLoanInput) => {
      const result = await mutate({ variables: { input } });
      return result.data?.createLoan;
    },
    loading,
    error: parsedError,
  };
}

/**
 * useApproveLoan Mutation Hook
 */

export interface UseApproveLoanResult {
  approve: (id: string, comment?: string) => Promise<any>;
  loading: boolean;
  error: ParsedError | null;
}

export function useApproveLoan(): UseApproveLoanResult {
  const [mutate, { loading, error }] = useMutation(APPROVE_LOAN);

  const parsedError = error ? parseApolloError(error) : null;

  return {
    approve: async (id: string, comment?: string) => {
      const result = await mutate({ variables: { id, comment } });
      return result.data?.approveLoan;
    },
    loading,
    error: parsedError,
  };
}

/**
 * useRejectLoan Mutation Hook
 */

export interface UseRejectLoanResult {
  reject: (id: string, reason: string) => Promise<any>;
  loading: boolean;
  error: ParsedError | null;
}

export function useRejectLoan(): UseRejectLoanResult {
  const [mutate, { loading, error }] = useMutation(REJECT_LOAN);

  const parsedError = error ? parseApolloError(error) : null;

  return {
    reject: async (id: string, reason: string) => {
      const result = await mutate({ variables: { id, reason } });
      return result.data?.rejectLoan;
    },
    loading,
    error: parsedError,
  };
}

/**
 * useReturnLoan Mutation Hook
 */

export interface UseReturnLoanResult {
  return: (id: string, notes?: string) => Promise<any>;
  loading: boolean;
  error: ParsedError | null;
}

export function useReturnLoan(): UseReturnLoanResult {
  const [mutate, { loading, error }] = useMutation(RETURN_LOAN);

  const parsedError = error ? parseApolloError(error) : null;

  return {
    return: async (id: string, notes?: string) => {
      const result = await mutate({ variables: { id, notes } });
      return result.data?.returnLoan;
    },
    loading,
    error: parsedError,
  };
}
