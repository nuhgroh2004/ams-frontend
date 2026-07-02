/**
 * GraphQL Queries - Loan Module
 * Single Source of Truth: peminjaman.json
 */

import { gql } from '@apollo/client';

export const GET_PEMINJAMAN_SAYA = gql`
  query GetPeminjamanSaya($status: AssetLoanStatus, $page: Int, $limit: Int) {
    peminjamanSaya(status: $status, page: $page, limit: $limit) {
      total
      page
      limit
      totalPages
      data {
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
          kategori_id
          nilai_perolehan
          sumber_dana
          tahun_perolehan
          klasifikasi
          kondisi
          status_penggunaan
          lokasi_id
          unit_id
          penanggung_jawab_id
          qr_code_path
          gambar_path
          kategori {
            id
            kode_kategori
            nama_kategori
          }
          lokasi {
            id
            nama_gedung
            lantai
            ruangan
            kode_lokasi
          }
        }
        peminjam {
          id
          nama_lengkap
          nrp
          email
          unit_kerja_kode
          jabatan
        }
        approver {
          id
          nama_lengkap
          nrp
          email
          unit_kerja_kode
          jabatan
        }
      }
    }
  }
`;

export const GET_PEMINJAMAN_DETAIL = gql`
  query GetPeminjamanDetail($id: ID) {
    peminjaman(id: $id) {
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
        kategori_id
        nilai_perolehan
        sumber_dana
        tahun_perolehan
        klasifikasi
        kondisi
        status_penggunaan
        lokasi_id
        unit_id
        penanggung_jawab_id
        qr_code_path
        gambar_path
        kategori {
          id
          kode_kategori
          nama_kategori
        }
        lokasi {
          id
          nama_gedung
          lantai
          ruangan
          kode_lokasi
        }
      }
      peminjam {
        id
        nama_lengkap
        nrp
        email
        unit_kerja_kode
        jabatan
      }
      approver {
        id
        nama_lengkap
        nrp
        email
        unit_kerja_kode
        jabatan
      }
    }
  }
`;

export const GET_PEMINJAMAN_MENUNGGU_APPROVAL = gql`
  query GetPeminjamanMenungguApproval($page: Int, $limit: Int) {
    peminjamanMenungguApproval(page: $page, limit: $limit) {
      total
      page
      limit
      totalPages
      data {
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
          kategori_id
          kondisi
          status_penggunaan
        }
        peminjam {
          id
          nama_lengkap
          nrp
          email
          unit_kerja_kode
          jabatan
        }
      }
    }
  }
`;
