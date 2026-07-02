export interface ProcurementItem {
  id: string;
  procurement_id?: string | null;
  nama_barang: string;
  quantity: number;
  harga_satuan: string;
  total_harga: string;
}

export interface Procurement {
  id: string;
  nomor_pengadaan: string;
  vendor?: string | null;
  nomor_kontrak?: string | null;
  tanggal_pengadaan?: string | null;
  total_nilai: string;
  dokumen_path?: string | null;
  created_by?: string | null;
  created_at?: string | null;
  createdBy?: {
    id: string;
    nama_lengkap: string;
    nrp: string;
  } | null;
  items: ProcurementItem[];
}

export interface CreateProcurementItemInput {
  nama_barang: string;
  quantity: number;
  harga_satuan: number;
}

export interface CreateProcurementInput {
  nomor_pengadaan: string;
  vendor?: string;
  nomor_kontrak?: string;
  tanggal_pengadaan?: string;
  items: CreateProcurementItemInput[];
}

export interface ProcurementListResponse {
  data: Procurement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
