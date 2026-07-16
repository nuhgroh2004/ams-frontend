import { gql } from '@apollo/client'

export const GET_LOSS_REPORTS = gql`
  query GetLossReports($status: LossReportStatus, $page: Int, $limit: Int) {
    lossReports(status: $status, page: $page, limit: $limit) {
      total
      page
      limit
      totalPages
      data {
        id
        asset_id
        pelapor_id
        kronologi
        dokumen_path
        status_proses
        nilai_ganti_rugi
        created_at
        asset {
          id
          nama_barang
          nomor_register
        }
        pelapor {
          id
          nama_lengkap
        }
        workflowInstance {
          id
          status
          approvals {
            id
            status
            notes
            approved_at
            step {
              nama_step
              role {
                nama_role
              }
            }
            approver {
              nama_lengkap
            }
          }
        }
      }
    }
  }
`

export const GET_ASSETS_SIMPLE = gql`
  query GetAssetsSimple {
    assets(limit: 100) {
      data {
        id
        nama_barang
        nomor_register
      }
    }
  }
`

export const AJUKAN_KEHILANGAN = gql`
  mutation AjukanKehilangan($input: AjukanKehilanganInput!, $dokumen: Upload) {
    ajukanKehilangan(input: $input, dokumen: $dokumen) {
      id
    }
  }
`

export const PROSES_TGR = gql`
  mutation ProsesTGR($id: ID!, $nilai_ganti_rugi: Float!) {
    prosesTGR(id: $id, nilai_ganti_rugi: $nilai_ganti_rugi) {
      id
      status_proses
    }
  }
`

export const SELESAIKAN_KEHILANGAN = gql`
  mutation SelesaikanKehilangan($id: ID!) {
    selesaikanKehilangan(id: $id) {
      id
      status_proses
    }
  }
`
