import { gql } from '@apollo/client'

export const GET_MAINTENANCE_RECORDS = gql`
  query GetMaintenanceRecords($status: MaintenanceStatus, $page: Int, $limit: Int) {
    maintenanceRecords(status: $status, page: $page, limit: $limit) {
      total
      page
      limit
      totalPages
      data {
        id
        asset_id
        jenis_perawatan
        deskripsi
        estimasi_biaya
        biaya_real
        tanggal_mulai
        tanggal_selesai
        kondisi_setelah
        status
        asset {
          id
          nama_barang
          nomor_register
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

export const CREATE_MAINTENANCE = gql`
  mutation CreateMaintenance($input: CreateMaintenanceInput!) {
    createMaintenance(input: $input) {
      id
      status
    }
  }
`

export const START_MAINTENANCE = gql`
  mutation StartMaintenance($id: ID!) {
    startMaintenance(id: $id) {
      id
      status
    }
  }
`

export const FINISH_MAINTENANCE = gql`
  mutation FinishMaintenance($id: ID!, $biaya_real: Float!, $kondisi_setelah: MaintenanceCondition!, $tanggal_selesai: String!) {
    finishMaintenance(id: $id, biaya_real: $biaya_real, kondisi_setelah: $kondisi_setelah, tanggal_selesai: $tanggal_selesai) {
      id
      status
    }
  }
`
