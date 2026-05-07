import { gql } from '@apollo/client'

/**
 * Get all unit kerja with pagination and search
 */
export const GET_UNIT_KERJAS_QUERY = gql`
  query GetUnitKerjas($page: Int, $limit: Int, $search: String) {
    unitKerjas(page: $page, limit: $limit, search: $search) {
      data {
        kode
        name
        hirarki
        hirarki_abbr
        singkatan
        is_unor
        is_satker
        is_subsatker
        is_sekretariat
        parentKode
        jabatan_name
        pemimpin_non_pns_id
        pemimpin_pns_id
        eselonId
        eselon_1_kode
        eselon_2_kode
        eselon_3_kode
        eselon_4_kode
        created_at
        updated_at
      }
      total
      page
      limit
      totalPages
    }
  }
`

/**
 * Get all unit kerja for dropdown/select options
 */
export const GET_UNIT_KERJAS_SIMPLE_QUERY = gql`
  query GetUnitKerjasSimple {
    unitKerjas {
      data {
        kode
        name
        singkatan
      }
    }
  }
`

/**
 * Create new unit kerja
 */
export const CREATE_UNIT_KERJA_MUTATION = gql`
  mutation CreateUnitKerja($input: CreateUnitKerjaInput!) {
    createUnitKerja(input: $input) {
      kode
      name
      hirarki
      hirarki_abbr
      singkatan
      is_unor
      is_satker
      is_subsatker
      is_sekretariat
      parentKode
      jabatan_name
      pemimpin_non_pns_id
      pemimpin_pns_id
      eselonId
      eselon_1_kode
      eselon_2_kode
      eselon_3_kode
      eselon_4_kode
      created_at
      updated_at
    }
  }
`

/**
 * Update existing unit kerja
 */
export const UPDATE_UNIT_KERJA_MUTATION = gql`
  mutation UpdateUnitKerja($kode: ID!, $input: UpdateUnitKerjaInput!) {
    updateUnitKerja(kode: $kode, input: $input) {
      kode
      name
      hirarki
      hirarki_abbr
      singkatan
      is_unor
      is_satker
      is_subsatker
      is_sekretariat
      parentKode
      jabatan_name
      pemimpin_non_pns_id
      pemimpin_pns_id
      eselonId
      eselon_1_kode
      eselon_2_kode
      eselon_3_kode
      eselon_4_kode
      created_at
      updated_at
    }
  }
`

/**
 * Delete unit kerja by kode
 */
export const DELETE_UNIT_KERJA_MUTATION = gql`
  mutation DeleteUnitKerja($kode: ID!) {
    deleteUnitKerja(kode: $kode)
  }
`
