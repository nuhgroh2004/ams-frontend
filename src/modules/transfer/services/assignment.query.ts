/**
 * GraphQL Queries - Assignment Module
 * Matches backend assignment.typeDef.js
 */

import { gql } from '@apollo/client';

export const GET_ASSIGNMENT_HISTORY = gql`
  query GetAssignmentHistory(
    $filter: AssetAssignmentFilterInput
    $page: Int
    $limit: Int
  ) {
    assetAssignmentHistory(filter: $filter, page: $page, limit: $limit) {
      total
      page
      limit
      totalPages
      data {
        id
        asset_id
        user_id
        unit_id
        assigned_by
        assigned_at
        returned_at
        is_returned
        notes
        asset {
          id
          kode_barang
          nomor_register
          nama_barang
          kondisi
          status_penggunaan
          kategori {
            id
            kode_kategori
            nama_kategori
          }
          lokasi {
            id
            nama_gedung
            lantai
            ruangan
            kode_lokasi
          }
        }
        user {
          id
          nama_lengkap
          nrp
          email
        }
        unit {
          id
          nama_unit
          kode_unit
        }
        assignedBy {
          id
          nama_lengkap
          nrp
        }
      }
    }
  }
`;
