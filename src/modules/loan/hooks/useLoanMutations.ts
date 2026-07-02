'use client';

import { useMutation } from '@apollo/client';
import { useCallback } from 'react';
import { toast } from '@/lib/toast';
import { 
  AJUKAN_PEMINJAMAN, 
  SETUJUI_PEMINJAMAN, 
  TOLAK_PEMINJAMAN, 
  MULAI_PEMINJAMAN, 
  KEMBALIKAN_ASET, 
  BATALKAN_PEMINJAMAN 
} from '@/modules/loan/services/loan.mutation';
import { parseApolloError, type ParsedError } from '@/lib/core/api/error-handler';
import { LoanDTO, AjukanPeminjamanInput } from '../types';

export function useAjukanPeminjaman() {
  const [mutate, { loading, error }] = useMutation(AJUKAN_PEMINJAMAN);

  const ajukan = useCallback(
    async (input: AjukanPeminjamanInput) => {
      try {
        const { data } = await mutate({ variables: { input } });
        toast.success('Peminjaman berhasil diajukan');
        return data.ajukanPeminjaman as LoanDTO;
      } catch (err) {
        toast.graphqlError(err);
        throw err;
      }
    },
    [mutate]
  );

  return { ajukan, loading, error: error ? parseApolloError(error) : null };
}

export function useSetujuiPeminjaman() {
  const [mutate, { loading, error }] = useMutation(SETUJUI_PEMINJAMAN);

  const setujui = useCallback(
    async (id: string, catatan?: string) => {
      try {
        const { data } = await mutate({ variables: { id, catatan } });
        toast.success('Peminjaman disetujui');
        return data.setujuiPeminjaman as LoanDTO;
      } catch (err) {
        toast.graphqlError(err);
        throw err;
      }
    },
    [mutate]
  );

  return { setujui, loading, error: error ? parseApolloError(error) : null };
}

export function useTolakPeminjaman() {
  const [mutate, { loading, error }] = useMutation(TOLAK_PEMINJAMAN);

  const tolak = useCallback(
    async (id: string, catatan?: string) => {
      try {
        const { data } = await mutate({ variables: { id, catatan } });
        toast.success('Peminjaman ditolak');
        return data.tolakPeminjaman as LoanDTO;
      } catch (err) {
        toast.graphqlError(err);
        throw err;
      }
    },
    [mutate]
  );

  return { tolak, loading, error: error ? parseApolloError(error) : null };
}

export function useMulaiPeminjaman() {
  const [mutate, { loading, error }] = useMutation(MULAI_PEMINJAMAN);

  const mulai = useCallback(
    async (id: string, fotoSebelum?: string) => {
      try {
        const { data } = await mutate({ variables: { id, fotoSebelum } });
        toast.success('Peminjaman dimulai (Aset diserahkan)');
        return data.mulaiPeminjaman as LoanDTO;
      } catch (err) {
        toast.graphqlError(err);
        throw err;
      }
    },
    [mutate]
  );

  return { mulai, loading, error: error ? parseApolloError(error) : null };
}

export function useKembalikanAset() {
  const [mutate, { loading, error }] = useMutation(KEMBALIKAN_ASET);

  const kembalikan = useCallback(
    async (id: string, fotoSesudah?: string) => {
      try {
        const { data } = await mutate({ variables: { id, fotoSesudah } });
        toast.success('Aset berhasil dikembalikan');
        return data.kembalikanAset as LoanDTO;
      } catch (err) {
        toast.graphqlError(err);
        throw err;
      }
    },
    [mutate]
  );

  return { kembalikan, loading, error: error ? parseApolloError(error) : null };
}

export function useBatalkanPeminjaman() {
  const [mutate, { loading, error }] = useMutation(BATALKAN_PEMINJAMAN);

  const batalkan = useCallback(
    async (id: string) => {
      try {
        const { data } = await mutate({ variables: { id } });
        toast.success('Peminjaman dibatalkan');
        return data.batalkanPeminjaman as LoanDTO;
      } catch (err) {
        toast.graphqlError(err);
        throw err;
      }
    },
    [mutate]
  );

  return { batalkan, loading, error: error ? parseApolloError(error) : null };
}
