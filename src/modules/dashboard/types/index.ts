/**
 * Dashboard Types
 */

export interface DashboardKategoriTotal {
  kategori_id: string | null;
  nama_kategori: string;
  total: number;
}

export interface DashboardKlasifikasiTotal {
  klasifikasi: string;
  total: number;
}

export interface DashboardKondisiTotal {
  kondisi: string;
  total: number;
}

export interface DashboardUnitMonitoring {
  unit_id: string | null;
  nama_unit: string;
  total_aset: number;
  aset_aktif: number;
  aset_dipinjam: number;
  aset_maintenance: number;
  aset_dihapus: number;
  aset_hilang: number;
}

export interface DashboardOverview {
  total_aset_per_kategori: DashboardKategoriTotal[];
  klasifikasi_intra_ekstra: DashboardKlasifikasiTotal[];
  status_kondisi_aset: DashboardKondisiTotal[];
  aset_dipinjam_dan_belum_kembali: number;
  aset_mendekati_jadwal_perawatan: number;
  monitoring_aset_per_unit_kerja: DashboardUnitMonitoring[];
}
