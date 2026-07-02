import { gql } from '@apollo/client';

export const CREATE_ASSET = gql`
  mutation CreateAsset($input: CreateAssetInput!) {
    createAsset(input: $input) {
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
      created_at
    }
  }
`;

export const UPDATE_ASSET = gql`
  mutation UpdateAsset($id: ID!, $input: UpdateAssetInput!) {
    updateAsset(id: $id, input: $input) {
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
      updated_at
    }
  }
`;

export const DELETE_ASSET = gql`
  mutation DeleteAsset($id: ID!) {
    deleteAsset(id: $id)
  }
`;
