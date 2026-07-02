/**
 * GraphQL Mutations - Loan Module
 * Single Source of Truth: peminjaman.json
 */

import { gql } from '@apollo/client';

export const AJUKAN_PEMINJAMAN = gql`
  mutation AjukanPeminjaman($input: AjukanPeminjamanInput!) {
    ajukanPeminjaman(input: $input) {
      id
      asset_id
      peminjam_id
      approver_id
      tanggal_pinjam
      tanggal_rencana_kembali
      tanggal_kembali
      foto_sebelum
      foto_sesudah
      catatan_pengaju
      catatan_approver
      status
      created_at
      updated_at
      asset {
        id
        kode_barang
        nomor_register
        nama_barang
      }
    }
  }
`;

export const SETUJUI_PEMINJAMAN = gql`
  mutation SetujuiPeminjaman($id: ID!, $catatan: String) {
    setujuiPeminjaman(id: $id, catatan: $catatan) {
      id
      status
      catatan_approver
      updated_at
    }
  }
`;

export const TOLAK_PEMINJAMAN = gql`
  mutation TolakPeminjaman($id: ID!, $catatan: String) {
    tolakPeminjaman(id: $id, catatan: $catatan) {
      id
      status
      catatan_approver
      updated_at
    }
  }
`;

export const MULAI_PEMINJAMAN = gql`
  mutation MulaiPeminjaman($id: ID!, $fotoSebelum: String) {
    mulaiPeminjaman(id: $id, fotoSebelum: $fotoSebelum) {
      id
      status
      tanggal_pinjam
      foto_sebelum
      updated_at
    }
  }
`;

export const KEMBALIKAN_ASET = gql`
  mutation KembalikanAset($id: ID!, $fotoSesudah: String) {
    kembalikanAset(id: $id, fotoSesudah: $fotoSesudah) {
      id
      status
      tanggal_kembali
      foto_sesudah
      updated_at
    }
  }
`;

export const BATALKAN_PEMINJAMAN = gql`
  mutation BatalkanPeminjaman($id: ID!) {
    batalkanPeminjaman(id: $id) {
      id
      status
      updated_at
    }
  }
`;
