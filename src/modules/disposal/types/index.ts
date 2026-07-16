import { DocumentNode } from 'graphql'

export interface WorkflowApproval {
  id: string
  status: string
  notes?: string
  approved_at?: string
  step: {
    nama_step: string
    role?: {
      nama_role: string
    }
  }
  approver?: {
    nama_lengkap: string
  }
}

export interface WorkflowInstance {
  id: string
  status: string
  approvals: WorkflowApproval[]
}

export interface AssetSimple {
  id: string
  nama_barang: string
  nomor_register?: string
}

export interface DisposalDTO {
  id: string
  asset_id: string
  alasan_penghapusan: string
  dokumen_path?: string
  nilai_penjualan?: string
  tanggal_penghapusan?: string
  created_at: string
  asset: AssetSimple
  workflowInstance?: WorkflowInstance
}

export interface DisposalPaginated {
  total: number
  page: number
  limit: number
  totalPages: number
  data: DisposalDTO[]
}

export interface AjukanDisposalInput {
  asset_id: string
  alasan_penghapusan: string
  nilai_penjualan?: number
}
