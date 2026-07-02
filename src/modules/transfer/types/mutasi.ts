/**
 * Mutasi Aset Types
 */

export type MutasiStatus = 'menunggu_approval' | 'disetujui' | 'ditolak' | 'selesai';
export type MutasiJenis = 'ruangan' | 'unit_kerja' | 'penanggung_jawab';

export interface MutasiUserDTO {
  id: string;
  nama_lengkap: string;
  nrp?: string;
  email?: string;
}

export interface MutasiAssetDTO {
  id: string;
  kode_barang?: string;
  nomor_register?: string;
  nama_barang: string;
  kondisi?: string;
  status_penggunaan?: string;
}

export interface MutasiLocationDTO {
  id: string;
  nama_gedung: string;
  lantai?: string;
  ruangan?: string;
  kode_lokasi?: string;
}

export interface MutasiUnitDTO {
  id: string;
  nama_unit: string;
  kode_unit?: string;
}

export interface AssetMutasi {
  id: string;
  asset_id: string;
  jenis_mutasi: MutasiJenis;
  status: MutasiStatus;
  
  lokasi_asal_id: string | null;
  unit_asal_id: string | null;
  pj_asal_id: string | null;
  
  lokasi_tujuan_id: string | null;
  unit_tujuan_id: string | null;
  pj_tujuan_id: string | null;

  diajukan_oleh: string;
  disetujui_oleh: string | null;

  alasan_mutasi: string | null;
  catatan_approval: string | null;
  berita_acara_path: string | null;
  
  tanggal_pengajuan: string | null;
  tanggal_approval: string | null;
  tanggal_selesai: string | null;

  asset: MutasiAssetDTO;
  lokasiAsal: MutasiLocationDTO | null;
  lokasiTujuan: MutasiLocationDTO | null;
  unitAsal: MutasiUnitDTO | null;
  unitTujuan: MutasiUnitDTO | null;
  pjAsal: MutasiUserDTO | null;
  pjTujuan: MutasiUserDTO | null;
  diajukanOleh: MutasiUserDTO;
  disetujuiOleh: MutasiUserDTO | null;
}

export interface MutasiPaginatedResult {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: AssetMutasi[];
}

export interface MutasiFilterInput {
  asset_id?: string;
  jenis_mutasi?: MutasiJenis;
  status?: MutasiStatus;
}

export interface AjukanMutasiInput {
  asset_id: string;
  jenis_mutasi: MutasiJenis;
  lokasi_tujuan_id?: string;
  unit_tujuan_id?: string;
  pj_tujuan_id?: string;
  alasan_mutasi: string;
}
