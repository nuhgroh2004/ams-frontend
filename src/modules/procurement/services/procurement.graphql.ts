import { gql } from '@apollo/client';

export const GET_PROCUREMENTS = gql`
  query GetProcurements($page: Int, $limit: Int, $search: String) {
    procurements(page: $page, limit: $limit, search: $search) {
      data {
        id
        nomor_pengadaan
        vendor
        nomor_kontrak
        tanggal_pengadaan
        total_nilai
        dokumen_path
        created_at
        createdBy {
          id
          nama_lengkap
          nrp
        }
        items {
          id
          nama_barang
          quantity
          harga_satuan
          total_harga
        }
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_PROCUREMENT_BY_ID = gql`
  query GetProcurementById($id: ID!) {
    procurement(id: $id) {
      id
      nomor_pengadaan
      vendor
      nomor_kontrak
      tanggal_pengadaan
      total_nilai
      dokumen_path
      created_at
      createdBy {
        id
        nama_lengkap
        nrp
      }
      items {
        id
        nama_barang
        quantity
        harga_satuan
        total_harga
      }
    }
  }
`;

export const CREATE_PROCUREMENT = gql`
  mutation CreateProcurement($input: CreateProcurementInput!) {
    createProcurement(input: $input) {
      id
      nomor_pengadaan
      vendor
      nomor_kontrak
      total_nilai
      created_at
    }
  }
`;

export const DELETE_PROCUREMENT = gql`
  mutation DeleteProcurement($id: ID!) {
    deleteProcurement(id: $id)
  }
`;
