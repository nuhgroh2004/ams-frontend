export interface UnitSimple {
  id: string
  nama_unit: string
}

export interface UserSimple {
  id: string
  nama_lengkap: string
}

export interface InventoryDTO {
  id: string
  tanggal_mulai: string
  tanggal_selesai: string
  status: string
  berita_acara_path?: string
  unit: UnitSimple
}

export interface InventoryDetailDTO {
  id: string
  status_fisik: string
  keterangan?: string
  asset: {
    id: string
    nama_barang: string
    nomor_register?: string
    kondisi: string
  }
}

export interface InventoryFullDTO {
  id: string
  status: string
  berita_acara_path?: string
  unit: UnitSimple
  details: InventoryDetailDTO[]
}

export interface InventoriesPaginated {
  total: number
  page: number
  limit: number
  totalPages: number
  data: InventoryDTO[]
}
