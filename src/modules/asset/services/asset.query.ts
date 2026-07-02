import { gql } from '@apollo/client';

export const GET_ASSETS = gql`
  query GetAssets($filter: AssetFilterInput, $page: Int, $limit: Int) {
    assets(filter: $filter, page: $page, limit: $limit) {
      data {
        id
        kode_barang
        nomor_register
        nama_barang
        kategori_id
        nilai_perolehan
        sumber_dana
        tahun_perolehan
        klasifikasi
        kondisi
        status_penggunaan
        lokasi_id
        unit_id
        penanggung_jawab_id
        qr_code_path
        gambar_path
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
        }
        unit {
          id
          nama_unit
          kode_unit
        }
        penanggungJawab {
          id
          nama_lengkap
        }
        created_at
        updated_at
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_ASSET_BY_ID = gql`
  query GetAssetById($id: ID!) {
    asset(id: $id) {
      id
      kode_barang
      nomor_register
      nama_barang
      kategori_id
      nilai_perolehan
      sumber_dana
      tahun_perolehan
      klasifikasi
      kondisi
      status_penggunaan
      lokasi_id
      unit_id
      penanggung_jawab_id
      qr_code_path
      gambar_path
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
      }
      unit {
        id
        nama_unit
        kode_unit
      }
      penanggungJawab {
        id
        nama_lengkap
      }
      created_at
      updated_at
    }
  }
`;

export const GET_ASSET_CATEGORIES = gql`
  query GetAssetCategories {
    assetCategories {
      id
      kode_kategori
      nama_kategori
    }
  }
`;
