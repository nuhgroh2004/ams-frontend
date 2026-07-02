export interface Location {
  id: string;
  nama_gedung: string;
  lantai: string;
  ruangan: string;
  kode_lokasi: string;
  unit_id: string | null;
  unit?: {
    kode_unit: string;
    nama_unit: string;
  } | null;
}

export interface CreateLocationInput {
  nama_gedung: string;
  lantai?: string;
  ruangan?: string;
  kode_lokasi?: string;
  unit_id?: string;
}

export interface UpdateLocationInput {
  nama_gedung?: string;
  lantai?: string;
  ruangan?: string;
  kode_lokasi?: string;
  unit_id?: string;
}

export interface LocationListResponse {
  data: Location[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LocationFormValues {
  nama_gedung: string;
  lantai: string;
  ruangan: string;
  kode_lokasi: string;
  unit_id: string;
}