import { gql } from '@apollo/client'

export const GET_DISPOSALS = gql`
  query GetDisposals($status: String, $page: Int, $limit: Int) {
    disposals(status: $status, page: $page, limit: $limit) {
      total
      page
      limit
      totalPages
      data {
        id
        asset_id
        alasan_penghapusan
        dokumen_path
        nilai_penjualan
        tanggal_penghapusan
        created_at
        asset {
          id
          nama_barang
          nomor_register
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

export const AJUKAN_DISPOSAL = gql`
  mutation AjukanDisposal($input: AjukanDisposalInput!, $dokumen: Upload) {
    ajukanDisposal(input: $input, dokumen: $dokumen) {
      id
      asset_id
      alasan_penghapusan
    }
  }
`
