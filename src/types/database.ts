/**
 * Database Type Definitions
 *
 * Auto-generated from data.sql schema
 * All tables mapped to TypeScript interfaces
 *
 * Convention:
 * - PascalCase for interface names
 * - Exact field names from database (snake_case preserved in some cases for clarity)
 * - Nullable fields use | null
 * - Enums converted to type unions
 */

// ===============================
// MASTER DATA
// ===============================

export interface Unit {
  id: number;
  namaUnit: string;
  parentUnitId?: number | null;
  kodeUnit?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface Role {
  id: number;
  namaRole: string;
  deskripsi?: string | null;
}

export interface User {
  id: number;
  namaLengkap: string;
  nrp: string;
  email: string;
  passwordHash: string;
  unitId?: number | null;
  jabatan?: string | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface UserRole {
  id: number;
  userId: number;
  roleId: number;
}

export interface Location {
  id: number;
  namaGedung?: string | null;
  lantai?: string | null;
  ruangan?: string | null;
  kodeLokasi?: string | null;
  unitId?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AssetCategory {
  id: number;
  kodeKategori?: string | null;
  namaKategori: string;
}

// ===============================
// PROCUREMENT
// ===============================

export interface Procurement {
  id: number;
  nomorPengadaan: string;
  vendor: string;
  nomorKontrak: string;
  tanggalPengadaan: string;
  totalNilai: number;
  dokumenPath?: string | null;
  createdBy?: number | null;
  createdAt?: string | null;
}

export interface ProcurementItem {
  id: number;
  procurementId?: number | null;
  namaBarang: string;
  quantity: number;
  hargaSatuan: number;
  totalHarga: number;
}

// ===============================
// ASSET
// ===============================

export type AssetStatus = 'aktif' | 'dipinjam' | 'maintenance' | 'dihapus' | 'hilang';
export type AssetKlasifikasi = 'intrakomptabel' | 'ekstrakomptabel';
export type AssetKondisi = 'baik' | 'rusak_ringan' | 'rusak_berat';

export interface Asset {
  id: number;
  kodeBarang?: string | null;
  nomorRegister: string;
  namaBarang: string;
  merk?: string | null;
  kategoriId?: number | null;
  procurementItemId?: number | null;
  nilaiPerolehan: number;
  sumberDana?: string | null;
  tahunPerolehan: number;
  klasifikasi: AssetKlasifikasi;
  kondisi: AssetKondisi;
  statusPenggunaan: AssetStatus;
  lokasiId?: number | null;
  unitId?: number | null;
  penanggungJawabId?: number | null;
  qrCodePath?: string | null;
  gambarPath?: string | null;
  createdBy?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AssetDocument {
  id: number;
  assetId?: number | null;
  namaDokumen: string;
  filePath: string;
  jenisDokumen?: string | null;
  uploadedAt?: string | null;
}

export interface AssetAssignment {
  id: number;
  assetId?: number | null;
  userId?: number | null;
  unitId?: number | null;
  assignedAt: string;
  returnedAt?: string | null;
  assignedBy?: number | null;
  notes?: string | null;
}

export interface AssetStatusHistory {
  id: number;
  assetId?: number | null;
  oldStatus?: string | null;
  newStatus?: string | null;
  changedBy?: number | null;
  changedAt: string;
  notes?: string | null;
}

export interface AssetDepreciation {
  id: number;
  assetId?: number | null;
  umurManfaat?: number | null;
  nilaiPenyusutanPerTahun: number;
  akumulasiPenyusutan: number;
  nilaiBuku: number;
  tahun: number;
  createdAt?: string | null;
}

// ===============================
// WORKFLOW
// ===============================

export interface Workflow {
  id: number;
  namaWorkflow: string;
  entityType: string;
}

export interface WorkflowStep {
  id: number;
  workflowId?: number | null;
  stepOrder: number;
  roleId?: number | null;
  namaStep: string;
}

export type WorkflowInstanceStatus = 'pending' | 'approved' | 'rejected';

export interface WorkflowInstance {
  id: number;
  workflowId?: number | null;
  entityType: string;
  entityId: number;
  status: WorkflowInstanceStatus;
  startedBy?: number | null;
  startedAt: string;
  completedAt?: string | null;
}

export type WorkflowApprovalStatus = 'pending' | 'approved' | 'rejected' | 'commented';

export interface WorkflowApproval {
  id: number;
  workflowInstanceId?: number | null;
  stepId?: number | null;
  approverId?: number | null;
  status: WorkflowApprovalStatus;
  approvedAt?: string | null;
  notes?: string | null;
}

// ===============================
// TRANSACTION
// ===============================

export interface AssetTransfer {
  id: number;
  assetId?: number | null;
  dariUnitId?: number | null;
  keUnitId?: number | null;
  dariLokasiId?: number | null;
  keLokasiId?: number | null;
  dariUserId?: number | null;
  keUserId?: number | null;
  workflowInstanceId?: number | null;
  tanggalTransfer: string;
  beritaAcaraPath?: string | null;
  createdAt?: string | null;
}

export type LoanStatus = 'menunggu' | 'disetujui' | 'ditolak' | 'dipinjam' | 'selesai' | 'terlambat';

export interface AssetLoan {
  id: number;
  assetId?: number | null;
  peminjamId?: number | null;
  approverId?: number | null;
  workflowInstanceId?: number | null;
  tanggalPinjam: string;
  tanggalRencanKembali: string;
  tanggalKembali?: string | null;
  fotoSebelum?: string | null;
  fotoSesudah?: string | null;
  status: LoanStatus;
  createdAt?: string | null;
}

export interface LoanDocument {
  id: number;
  loanId?: number | null;
  jenisDokumen: string;
  filePath: string;
  uploadedAt?: string | null;
}

export type MaintenanceType = 'preventive' | 'corrective';
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface MaintenanceRecord {
  id: number;
  assetId?: number | null;
  jenisPerawatan: string;
  deskripsi?: string | null;
  estimasiBiaya?: number | null;
  vendor?: string | null;
  tanggalMulai: string;
  tanggalSelesai?: string | null;
  kondisiSetelah: AssetKondisi;
  createdAt?: string | null;
}

export type DisposalStatus = 'pending' | 'approved' | 'completed' | 'rejected';

export interface AssetDisposal {
  id: number;
  assetId?: number | null;
  workflowInstanceId?: number | null;
  alasanPenghapusan?: string | null;
  dokumenPath?: string | null;
  tanggalPenghapusan: string;
  createdAt?: string | null;
}

export interface Inventory {
  id: number;
  tanggalMulai: string;
  tanggalSelesai?: string | null;
  unitId?: number | null;
  beritaAcaraPath?: string | null;
  createdAt?: string | null;
}

export type InventoryStatus = 'sesuai' | 'tidak_ditemukan' | 'rusak';

export interface InventoryDetail {
  id: number;
  inventoryId?: number | null;
  assetId?: number | null;
  statusFisik: InventoryStatus;
  keterangan?: string | null;
}

export type LossStatus = 'lapor' | 'proses_tgr' | 'selesai';

export interface LossReport {
  id: number;
  assetId?: number | null;
  pelaporId?: number | null;
  workflowInstanceId?: number | null;
  kronologi?: string | null;
  dokumenPath?: string | null;
  statusProses: LossStatus;
  createdAt?: string | null;
}

// ===============================
// SUPPORT
// ===============================

export interface Notification {
  id: number;
  userId?: number | null;
  title: string;
  message?: string | null;
  entityType?: string | null;
  entityId?: number | null;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  userId?: number | null;
  aktivitas: string;
  tabelTerkait?: string | null;
  dataId?: number | null;
  waktu: string;
  ipAddress?: string | null;
}

// ===============================
// API RESPONSE TYPES
// ===============================

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateResponse<T> {
  id: number;
  success: boolean;
  data: T;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

export interface UpdateResponse<T> {
  success: boolean;
  data: T;
}
