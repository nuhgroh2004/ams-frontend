import { gql } from '@apollo/client';

export const GET_DASHBOARD_OVERVIEW = gql`
  query GetDashboardOverview($batas_tahun_perawatan: Int) {
    dashboardOverview(batas_tahun_perawatan: $batas_tahun_perawatan) {
      total_aset_per_kategori {
        kategori_id
        nama_kategori
        total
      }
      klasifikasi_intra_ekstra {
        klasifikasi
        total
      }
      status_kondisi_aset {
        kondisi
        total
      }
      aset_dipinjam_dan_belum_kembali
      aset_mendekati_jadwal_perawatan
      monitoring_aset_per_unit_kerja {
        unit_id
        nama_unit
        total_aset
        aset_aktif
        aset_dipinjam
        aset_maintenance
        aset_dihapus
        aset_hilang
      }
    }
  }
`;
