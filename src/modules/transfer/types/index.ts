/**
 * Transfer / Assignment Module Types
 * Corresponds to backend assignment.typeDef.js schema
 */

// --- Shared nested DTOs ---

export interface AssignmentUserDTO {
  id: string;
  nama_lengkap: string;
  nrp?: string;
  email?: string;
  unit_kerja_kode?: string;
  jabatan?: string;
}

export interface AssignmentAssetDTO {
  id: string;
  kode_barang?: string;
  nomor_register?: string;
  nama_barang: string;
  kondisi?: string;
  status_penggunaan?: string;
  kategori?: {
    id: string;
    kode_kategori: string;
    nama_kategori: string;
  };
  lokasi?: {
    id: string;
    nama_gedung: string;
    lantai?: string;
    ruangan?: string;
    kode_lokasi?: string;
  };
}

export interface AssignmentUnitDTO {
  id: string;
  nama_unit: string;
  kode_unit?: string;
}

// --- Main DTO ---

export interface AssetAssignment {
  id: string;
  asset_id: string;
  user_id: string | null;
  unit_id: string | null;
  assigned_by: string | null;
  assigned_at: string;
  returned_at: string | null;
  is_returned: boolean;
  notes: string | null;
  asset: AssignmentAssetDTO;
  user: AssignmentUserDTO | null;
  unit: AssignmentUnitDTO | null;
  assignedBy: AssignmentUserDTO | null;
}

// --- Inputs ---

export interface AssignAssetToUserInput {
  asset_id: string;
  user_id: string;
  unit_id?: string;
  notes?: string;
}

export interface AssignAssetToUnitInput {
  asset_id: string;
  unit_id: string;
  notes?: string;
}

export interface AssetAssignmentFilterInput {
  asset_id?: string;
  user_id?: string;
  unit_id?: string;
  is_returned?: boolean;
}

// --- Paginated Response ---

export interface AssetAssignmentPaginatedResult {
  data: AssetAssignment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export * from './mutasi';

