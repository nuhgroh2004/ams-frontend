/**
 * GraphQL Queries - Asset Module
 */

import { gql } from '@apollo/client';

export const GET_ASSETS = gql`
  query GetAssets($page: Int!, $pageSize: Int!, $search: String, $sortBy: String, $sortOrder: String) {
    assets(page: $page, pageSize: $pageSize, search: $search, sortBy: $sortBy, sortOrder: $sortOrder) {
      items {
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
        updatedAt
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export const GET_ASSET_BY_ID = gql`
  query GetAssetById($id: ID!) {
    asset(id: $id) {
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
      qrCodePath
      gambarPath
      createdAt
      updatedAt
    }
  }
`;

export const GET_ASSET_CATEGORIES = gql`
  query GetAssetCategories {
    assetCategories {
      id
      kodeKategori
      namaKategori
    }
  }
`;
