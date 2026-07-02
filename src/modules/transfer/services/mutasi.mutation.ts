import { gql } from '@apollo/client';

export const AJUKAN_MUTASI = gql`
  mutation AjukanMutasi($input: AjukanMutasiInput!) {
    ajukanMutasi(input: $input) {
      id
      asset_id
      jenis_mutasi
      status
      alasan_mutasi
      tanggal_pengajuan
    }
  }
`;

export const SETUJUI_MUTASI = gql`
  mutation SetujuiMutasi($id: ID!, $catatan: String) {
    setujuiMutasi(id: $id, catatan: $catatan) {
      id
      status
      catatan_approval
      tanggal_approval
    }
  }
`;

export const TOLAK_MUTASI = gql`
  mutation TolakMutasi($id: ID!, $catatan: String!) {
    tolakMutasi(id: $id, catatan: $catatan) {
      id
      status
      catatan_approval
      tanggal_approval
    }
  }
`;

export const SELESAIKAN_MUTASI = gql`
  mutation SelesaikanMutasi($id: ID!, $beritaAcara: Upload) {
    selesaikanMutasi(id: $id, beritaAcara: $beritaAcara) {
      id
      status
      berita_acara_path
      tanggal_selesai
    }
  }
`;

export const GENERATE_BAST_MUTASI = gql`
  mutation GenerateBeritaAcaraMutasi($id: ID!) {
    generateBeritaAcaraMutasi(id: $id)
  }
`;
