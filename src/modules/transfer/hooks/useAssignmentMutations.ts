'use client';

import { useMutation } from '@apollo/client';
import { useCallback } from 'react';
import { toast } from '@/lib/toast';
import {
  ASSIGN_ASSET_TO_USER,
  ASSIGN_ASSET_TO_UNIT,
  RETURN_ASSET_ASSIGNMENT,
} from '@/modules/transfer/services/assignment.mutation';
import { parseApolloError, type ParsedError } from '@/lib/core/api/error-handler';
import {
  AssetAssignment,
  AssignAssetToUserInput,
  AssignAssetToUnitInput,
} from '../types';

export function useAssignAssetToUser() {
  const [mutate, { loading, error }] = useMutation(ASSIGN_ASSET_TO_USER);

  const assign = useCallback(
    async (input: AssignAssetToUserInput) => {
      try {
        const { data } = await mutate({ variables: { input } });
        toast.success('Aset berhasil di-assign ke user');
        return data.assignAssetToUser as AssetAssignment;
      } catch (err) {
        toast.graphqlError(err);
        throw err;
      }
    },
    [mutate]
  );

  return { assign, loading, error: error ? parseApolloError(error) : null };
}

export function useAssignAssetToUnit() {
  const [mutate, { loading, error }] = useMutation(ASSIGN_ASSET_TO_UNIT);

  const assign = useCallback(
    async (input: AssignAssetToUnitInput) => {
      try {
        const { data } = await mutate({ variables: { input } });
        toast.success('Aset berhasil di-assign ke unit kerja');
        return data.assignAssetToUnit as AssetAssignment;
      } catch (err) {
        toast.graphqlError(err);
        throw err;
      }
    },
    [mutate]
  );

  return { assign, loading, error: error ? parseApolloError(error) : null };
}

export function useReturnAssignment() {
  const [mutate, { loading, error }] = useMutation(RETURN_ASSET_ASSIGNMENT);

  const returnAssignment = useCallback(
    async (id: string, notes?: string) => {
      try {
        const { data } = await mutate({ variables: { id, notes } });
        toast.success('Assignment berhasil dikembalikan');
        return data.returnAssetAssignment as AssetAssignment;
      } catch (err) {
        toast.graphqlError(err);
        throw err;
      }
    },
    [mutate]
  );

  return { returnAssignment, loading, error: error ? parseApolloError(error) : null };
}
