'use client';

import { useMutation } from '@apollo/client';
import { useCallback } from 'react';
import { toast } from '@/lib/toast';
import {
  AJUKAN_MUTASI,
  SETUJUI_MUTASI,
  TOLAK_MUTASI,
  SELESAIKAN_MUTASI,
  GENERATE_BAST_MUTASI,
} from '@/modules/transfer/services/mutasi.mutation';
import { parseApolloError, type ParsedError } from '@/lib/core/api/error-handler';
import { AssetMutasi, AjukanMutasiInput } from '../types';

export function useAjukanMutasi() {
  const [mutate, { loading, error }] = useMutation(AJUKAN_MUTASI);

  const ajukan = useCallback(
    async (input: AjukanMutasiInput) => {
      try {
        const { data } = await mutate({ variables: { input } });
        toast.success('Mutasi aset berhasil diajukan');
        return data.ajukanMutasi as AssetMutasi;
      } catch (err) {
        toast.graphqlError(err);
        throw err;
      }
    },
    [mutate]
  );

  return { ajukan, loading, error: error ? parseApolloError(error) : null };
}

export function useSetujuiMutasi() {
  const [mutate, { loading, error }] = useMutation(SETUJUI_MUTASI);

  const setujui = useCallback(
    async (id: string, catatan?: string) => {
      try {
        const { data } = await mutate({ variables: { id, catatan } });
        toast.success('Permohonan mutasi disetujui');
        return data.setujuiMutasi as AssetMutasi;
      } catch (err) {
        toast.graphqlError(err);
        throw err;
      }
    },
    [mutate]
  );

  return { setujui, loading, error: error ? parseApolloError(error) : null };
}

export function useTolakMutasi() {
  const [mutate, { loading, error }] = useMutation(TOLAK_MUTASI);

  const tolak = useCallback(
    async (id: string, catatan: string) => {
      try {
        const { data } = await mutate({ variables: { id, catatan } });
        toast.success('Permohonan mutasi ditolak');
        return data.tolakMutasi as AssetMutasi;
      } catch (err) {
        toast.graphqlError(err);
        throw err;
      }
    },
    [mutate]
  );

  return { tolak, loading, error: error ? parseApolloError(error) : null };
}

export function useSelesaikanMutasi() {
  const [mutate, { loading, error }] = useMutation(SELESAIKAN_MUTASI);

  const selesaikan = useCallback(
    async (id: string, beritaAcaraFile: File) => {
      try {
        const { data } = await mutate({
          variables: {
            id,
            beritaAcara: beritaAcaraFile,
          },
        });
        toast.success('Mutasi aset berhasil diselesaikan');
        return data.selesaikanMutasi as AssetMutasi;
      } catch (err) {
        toast.graphqlError(err);
        throw err;
      }
    },
    [mutate]
  );

  return { selesaikan, loading, error: error ? parseApolloError(error) : null };
}

export function useGenerateBAST() {
  const [mutate, { loading, error }] = useMutation(GENERATE_BAST_MUTASI);

  const generate = useCallback(
    async (id: string) => {
      try {
        const { data } = await mutate({ variables: { id } });
        toast.success('BAST berhasil di-generate');
        return data.generateBeritaAcaraMutasi as string;
      } catch (err) {
        toast.graphqlError(err);
        throw err;
      }
    },
    [mutate]
  );

  return { generate, loading, error: error ? parseApolloError(error) : null };
}
