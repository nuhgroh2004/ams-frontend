export interface Asset {
  id: string;
  kode_barang?: string | null;
  nomor_register?: string | null;
  nama_barang: string;
  kategori_id?: string | null;
  nilai_perolehan?: string | null;
  sumber_dana?: string | null;
  tahun_perolehan?: number | null;
  klasifikasi?: string | null;
  kondisi?: 'baik' | 'rusak_ringan' | 'rusak_berat' | null;
  status_penggunaan?: 'aktif' | 'dipinjam' | 'maintenance' | 'dihapus' | 'hilang' | null;
  lokasi_id?: string | null;
  unit_id?: string | null;
  penanggung_jawab_id?: string | null;
  qr_code_path?: string | null;
  gambar_path?: string | null;
  kategori?: {
    id: string;
    kode_kategori?: string | null;
    nama_kategori?: string | null;
  } | null;
  lokasi?: {
    id: string;
    nama_gedung?: string | null;
    lantai?: string | null;
    ruangan?: string | null;
  } | null;
  unit?: {
    id: string;
    nama_unit: string;
    kode_unit?: string | null;
  } | null;
  penanggungJawab?: {
    id: string;
    nama_lengkap: string;
  } | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CreateAssetInput {
  nama_barang: string;
  kode_barang?: string;
  nilai_perolehan?: number;
  sumber_dana?: string;
  tahun_perolehan?: number;
  kondisi?: string;
  status_penggunaan?: string;
  kategori_id?: string;
  lokasi_id?: string;
  unit_id?: string;
  penanggung_jawab_id?: string;
}

export interface UpdateAssetInput {
  nama_barang?: string;
  kode_barang?: string;
  nilai_perolehan?: number;
  sumber_dana?: string;
  tahun_perolehan?: number;
  kondisi?: string;
  status_penggunaan?: string;
  kategori_id?: string;
  lokasi_id?: string;
  unit_id?: string;
  penanggung_jawab_id?: string;
}

export interface AssetFilterInput {
  search?: string;
  kondisi?: string;
  status_penggunaan?: string;
  klasifikasi?: string;
  kategori_id?: string;
  lokasi_id?: string;
  unit_id?: string;
  penanggung_jawab_id?: string;
  tahun_perolehan?: number;
}

export interface AssetCategory {
  id: string;
  kode_kategori?: string | null;
  nama_kategori?: string | null;
}

export interface AssetListResponse {
  data: Asset[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
