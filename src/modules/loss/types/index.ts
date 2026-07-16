export interface AssetSimple {
  id: string
  nama_barang: string
  nomor_register?: string
}

export interface PelaporSimple {
  id: string
  nama_lengkap: string
}

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

export interface LossReportDTO {
  id: string
  asset_id: string
  pelapor_id: string
  kronologi: string
  dokumen_path?: string
  status_proses: string
  nilai_ganti_rugi?: string
  created_at: string
  asset: AssetSimple
  pelapor: PelaporSimple
  workflowInstance?: WorkflowInstance
}

export interface LossReportsPaginated {
  total: number
  page: number
  limit: number
  totalPages: number
  data: LossReportDTO[]
}
