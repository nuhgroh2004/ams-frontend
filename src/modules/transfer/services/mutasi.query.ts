import { gql } from '@apollo/client';

export const GET_RIWAYAT_MUTASI = gql`
  query GetRiwayatMutasi($filter: MutasiFilterInput, $page: Int, $limit: Int) {
    riwayatMutasi(filter: $filter, page: $page, limit: $limit) {
      total
      page
      limit
      totalPages
      data {
        id
        asset_id
        jenis_mutasi
        status
        lokasi_asal_id
        unit_asal_id
        pj_asal_id
        lokasi_tujuan_id
        unit_tujuan_id
        pj_tujuan_id
        diajukan_oleh
        disetujui_oleh
        alasan_mutasi
        catatan_approval
        berita_acara_path
        tanggal_pengajuan
        tanggal_approval
        tanggal_selesai
        asset {
          id
          kode_barang
          nomor_register
          nama_barang
          kondisi
          status_penggunaan
        }
        lokasiAsal {
          id
          nama_gedung
          lantai
          ruangan
          kode_lokasi
        }
        lokasiTujuan {
          id
          nama_gedung
          lantai
          ruangan
          kode_lokasi
        }
        unitAsal {
          id
          nama_unit
          kode_unit
        }
        unitTujuan {
          id
          nama_unit
          kode_unit
        }
        pjAsal {
          id
          nama_lengkap
          nrp
          email
        }
        pjTujuan {
          id
          nama_lengkap
          nrp
          email
        }
        diajukanOleh {
          id
          nama_lengkap
          nrp
          email
        }
        disetujuiOleh {
          id
          nama_lengkap
          nrp
          email
        }
      }
    }
  }
`;

export const GET_MUTASI_DETAIL = gql`
  query GetMutasiDetail($id: ID!) {
    mutasi(id: $id) {
      id
      asset_id
      jenis_mutasi
      status
      lokasi_asal_id
      unit_asal_id
      pj_asal_id
      lokasi_tujuan_id
      unit_tujuan_id
      pj_tujuan_id
      diajukan_oleh
      disetujui_oleh
      alasan_mutasi
      catatan_approval
      berita_acara_path
      tanggal_pengajuan
      tanggal_approval
      tanggal_selesai
      asset {
        id
        kode_barang
        nomor_register
        nama_barang
        kondisi
        status_penggunaan
      }
      lokasiAsal {
        id
        nama_gedung
        lantai
        ruangan
        kode_lokasi
      }
      lokasiTujuan {
        id
        nama_gedung
        lantai
        ruangan
        kode_lokasi
      }
      unitAsal {
        id
        nama_unit
        kode_unit
      }
      unitTujuan {
        id
        nama_unit
        kode_unit
      }
      pjAsal {
        id
        nama_lengkap
        nrp
        email
      }
      pjTujuan {
        id
        nama_lengkap
        nrp
        email
      }
      diajukanOleh {
        id
        nama_lengkap
        nrp
        email
      }
      disetujuiOleh {
        id
        nama_lengkap
        nrp
        email
      }
    }
  }
`;

export const GET_MUTASI_MENUNGGU_APPROVAL = gql`
  query GetMutasiMenungguApproval($page: Int, $limit: Int) {
    mutasiMenungguApproval(page: $page, limit: $limit) {
      total
      page
      limit
      totalPages
      data {
        id
        asset_id
        jenis_mutasi
        status
        lokasi_asal_id
        unit_asal_id
        pj_asal_id
        lokasi_tujuan_id
        unit_tujuan_id
        pj_tujuan_id
        diajukan_oleh
        disetujui_oleh
        alasan_mutasi
        catatan_approval
        berita_acara_path
        tanggal_pengajuan
        tanggal_approval
        tanggal_selesai
        asset {
          id
          kode_barang
          nomor_register
          nama_barang
        }
        diajukanOleh {
          id
          nama_lengkap
          nrp
        }
      }
    }
  }
`;
