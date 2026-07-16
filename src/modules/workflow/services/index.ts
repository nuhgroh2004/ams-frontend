import { gql } from '@apollo/client'

export const GET_PENDING_APPROVALS = gql`
  query GetMyPendingApprovals {
    myPendingApprovals {
      id
      status
      step {
        nama_step
        step_order
        role {
          nama_role
        }
      }
      workflowInstance {
        id
        entity_type
        entity_id
        workflow {
          nama_workflow
          entity_type
          steps {
            id
            step_order
            nama_step
            role {
              nama_role
            }
          }
        }
        approvals {
          id
          step_id
          status
          notes
          approved_at
          approver {
            nama_lengkap
          }
        }
        startedBy {
          nama_lengkap
        }
        started_at
      }
    }
  }
`

export const APPROVE_STEP = gql`
  mutation ApproveStep($approvalId: ID!, $notes: String) {
    approveStep(approvalId: $approvalId, notes: $notes) {
      id
      status
    }
  }
`

export const REJECT_STEP = gql`
  mutation RejectStep($approvalId: ID!, $notes: String!) {
    rejectStep(approvalId: $approvalId, notes: $notes) {
      id
      status
    }
  }
`

export const GET_MUTASI_DETAILS = gql`
  query GetMutasiDetails($id: ID!) {
    mutasi(id: $id) {
      id
      jenis_mutasi
      alasan_mutasi
      asset {
        nama_barang
        nomor_register
      }
      unitAsal {
        nama_unit
      }
      unitTujuan {
        nama_unit
      }
      pjAsal {
        nama_lengkap
      }
      pjTujuan {
        nama_lengkap
      }
    }
  }
`

export const GET_DISPOSAL_DETAILS = gql`
  query GetDisposalDetails($id: ID!) {
    disposal(id: $id) {
      id
      alasan_penghapusan
      nilai_penjualan
      asset {
        nama_barang
        nomor_register
      }
    }
  }
`

export const GET_LOSS_DETAILS = gql`
  query GetLossDetails($id: ID!) {
    lossReport(id: $id) {
      id
      kronologi
      status_proses
      nilai_ganti_rugi
      asset {
        nama_barang
        nomor_register
      }
    }
  }
`

export const GET_LOAN_DETAILS = gql`
  query GetLoanDetails($id: ID!) {
    peminjaman(id: $id) {
      id
      status
      tanggal_pinjam
      tanggal_rencana_kembali
      catatan_pengaju
      asset {
        nama_barang
        nomor_register
      }
      peminjam {
        nama_lengkap
      }
    }
  }
`
