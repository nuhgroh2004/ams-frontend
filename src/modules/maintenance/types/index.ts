export interface AssetSimple {
  id: string
  nama_barang: string
  nomor_register?: string
}

export interface MaintenanceRecordDTO {
  id: string
  asset_id: string
  jenis_perawatan: string
  deskripsi?: string
  estimasi_biaya?: string
  biaya_real?: string
  tanggal_mulai?: string
  tanggal_selesai?: string
  kondisi_setelah?: string
  status: string
  asset: AssetSimple
}

export interface MaintenanceRecordsPaginated {
  total: number
  page: number
  limit: number
  totalPages: number
  data: MaintenanceRecordDTO[]
}
