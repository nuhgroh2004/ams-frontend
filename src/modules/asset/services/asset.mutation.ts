/**
 * GraphQL Mutations - Asset Module
 */

import { gql } from '@apollo/client';

export const CREATE_ASSET = gql`
  mutation CreateAsset($input: CreateAssetInput!) {
    createAsset(input: $input) {
      id
      kodeBarang
      nomorRegister
      namaBarang
      merk
      kategoriId
      nilaiPerolehan
      sumberDana
      tahunPerolehan
      klasifikasi
      kondisi
      statusPenggunaan
      lokasiId
      unitId
      penanggungJawabId
      createdAt
    }
  }
`;

export const UPDATE_ASSET = gql`
  mutation UpdateAsset($id: ID!, $input: UpdateAssetInput!) {
    updateAsset(id: $id, input: $input) {
      id
      kodeBarang
      nomorRegister
      namaBarang
      merk
      kategoriId
      nilaiPerolehan
      sumberDana
      tahunPerolehan
      klasifikasi
      kondisi
      statusPenggunaan
      lokasiId
      unitId
      penanggungJawabId
      updatedAt
    }
  }
`;

export const DELETE_ASSET = gql`
  mutation DeleteAsset($id: ID!) {
    deleteAsset(id: $id) {
      success
      message
    }
  }
`;
