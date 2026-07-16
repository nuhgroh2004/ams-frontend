import { gql } from '@apollo/client'

export const GET_AUDIT_LOGS = gql`
  query GetAuditLogs($filter: AuditLogFilterInput, $page: Int, $limit: Int) {
    auditLogs(filter: $filter, page: $page, limit: $limit) {
      total
      page
      limit
      totalPages
      data {
        id
        waktu
        aktivitas
        tabel_terkait
        data_id
        ip_address
        user {
          id
          nama_lengkap
        }
      }
    }
  }
`
