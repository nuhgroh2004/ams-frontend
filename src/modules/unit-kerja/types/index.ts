/**
 * Unit Kerja Entity - Single source of truth for GraphQL response structure
 */
export interface UnitKerja {
  kode: string
  name: string
  hirarki: string
  hirarki_abbr: string
  singkatan: string
  is_unor: boolean
  is_satker: boolean
  is_subsatker: boolean
  is_sekretariat: boolean
  parentKode: string | null
  jabatan_name: string
  pemimpin_non_pns_id: string | null
  pemimpin_pns_id: string | null
  eselonId: number
  eselon_1_kode: string
  eselon_2_kode: string
  eselon_3_kode: string
  eselon_4_kode: string
  created_at: string
  updated_at: string
}

/**
 * Create/Update input for mutations
 */
export interface CreateUnitKerjaInput {
  kode: string
  name: string
  hirarki: string
  hirarki_abbr: string
  singkatan: string
  is_unor: boolean
  is_satker: boolean
  is_subsatker: boolean
  is_sekretariat: boolean
  parentKode?: string | null
  jabatan_name: string
  pemimpin_non_pns_id?: string | null
  pemimpin_pns_id?: string | null
  eselonId: number
  eselon_1_kode: string
  eselon_2_kode: string
  eselon_3_kode: string
  eselon_4_kode: string
}

export interface UpdateUnitKerjaInput {
  name?: string
  hirarki?: string
  hirarki_abbr?: string
  singkatan?: string
  is_unor?: boolean
  is_satker?: boolean
  is_subsatker?: boolean
  is_sekretariat?: boolean
  parentKode?: string | null
  jabatan_name?: string
  pemimpin_non_pns_id?: string | null
  pemimpin_pns_id?: string | null
  eselonId?: number
  eselon_1_kode?: string
  eselon_2_kode?: string
  eselon_3_kode?: string
  eselon_4_kode?: string
}

/**
 * List response with pagination
 */
export interface UnitKerjaListResponse {
  data: UnitKerja[]
  total: number
  page: number
  limit: number
  totalPages: number
}
