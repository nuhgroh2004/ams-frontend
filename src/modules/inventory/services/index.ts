import { gql } from '@apollo/client'

export const GET_INVENTORIES = gql`
  query GetInventories($status: InventoryStatus, $page: Int, $limit: Int) {
    inventories(status: $status, page: $page, limit: $limit) {
      total
      page
      limit
      totalPages
      data {
        id
        tanggal_mulai
        tanggal_selesai
        status
        berita_acara_path
        unit {
          id
          nama_unit
        }
      }
    }
  }
`

export const GET_INVENTORY_DETAILS = gql`
  query GetInventory($id: ID!) {
    inventory(id: $id) {
      id
      status
      berita_acara_path
      unit {
        id
        nama_unit
      }
      details {
        id
        status_fisik
        keterangan
        asset {
          id
          nama_barang
          nomor_register
          kondisi
        }
      }
    }
  }
`

export const GET_UNITS_AND_USERS = gql`
  query GetUnitsAndUsers {
    units {
      id
      nama_unit
    }
    users(limit: 100) {
      data {
        id
        nama_lengkap
      }
    }
  }
`

export const CREATE_INVENTORY_SCHEDULE = gql`
  mutation CreateInventorySchedule($input: CreateInventoryScheduleInput!) {
    createInventorySchedule(input: $input) {
      id
      status
    }
  }
`

export const UPDATE_INVENTORY_DETAIL = gql`
  mutation UpdateInventoryDetail($inventory_id: ID!, $asset_id: ID!, $status_fisik: InventoryPhysicalStatus!, $keterangan: String) {
    updateInventoryDetail(inventory_id: $inventory_id, asset_id: $asset_id, status_fisik: $status_fisik, keterangan: $keterangan) {
      id
      status_fisik
    }
  }
`

export const COMPLETE_INVENTORY = gql`
  mutation CompleteInventory($id: ID!, $beritaAcara: Upload!) {
    completeInventory(id: $id, beritaAcara: $beritaAcara) {
      id
      status
    }
  }
`
