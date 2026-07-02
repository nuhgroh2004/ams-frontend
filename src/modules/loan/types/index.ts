/**
 * Loan Module Types
 * Corresponds to database structures and peminjaman.json schema.
 */

export interface UserDTO {
  id: string;
  nama_lengkap: string;
  nrp: string;
  email: string;
  unit_id?: string;
  unit_kerja_kode?: string;
  jabatan?: string;
  is_active?: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface KategoriDTO {
  id: string;
  kode_kategori: string;
  nama_kategori: string;
}

export interface LokasiDTO {
  id: string;
  nama_gedung: string;
  lantai?: string;
  ruangan?: string;
  kode_lokasi?: string;
}

export interface AssetDTO {
  id: string;
  kode_barang: string;
  nomor_register: string;
  nama_barang: string;
  kategori_id?: string;
  nilai_perolehan?: number;
  sumber_dana?: string;
  tahun_perolehan?: number;
  klasifikasi?: string;
  kondisi: string;
  status_penggunaan: string;
  lokasi_id?: string;
  unit_id?: string;
  penanggung_jawab_id?: string;
  qr_code_path?: string;
  gambar_path?: string;
  kategori?: KategoriDTO;
  lokasi?: LokasiDTO;
}

export interface LoanDTO {
  id: string;
  asset_id: string;
  peminjam_id: string;
  approver_id?: string;
  tanggal_pinjam?: string;
  tanggal_rencana_kembali: string;
  tanggal_kembali?: string;
  foto_sebelum?: string;
  foto_sesudah?: string;
  catatan_pengaju?: string;
  catatan_approver?: string;
  status: 'menunggu' | 'disetujui' | 'ditolak' | 'dipinjam' | 'selesai' | 'terlambat' | 'dibatalkan';
  created_at: string;
  updated_at: string;
  asset: AssetDTO;
  peminjam: UserDTO;
  approver?: UserDTO;
}

export interface AjukanPeminjamanInput {
  asset_id: string;
  tanggal_rencana_kembali: string;
  catatan_pengaju?: string;
}
