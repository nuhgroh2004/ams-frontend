import { gql } from '@apollo/client';

export const GET_LOCATIONS = gql`
  query GetLocations($page: Int, $limit: Int, $search: String) {
    locations(page: $page, limit: $limit, search: $search) {
      data {
        id
        nama_gedung
        lantai
        ruangan
        kode_lokasi
        unit_id
        unit {
          kode
          name
        }
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const CREATE_LOCATION = gql`
  mutation CreateLocation($input: CreateLocationInput!) {
    createLocation(input: $input) {
      id
      nama_gedung
      lantai
      ruangan
      kode_lokasi
      unit_id
      unit {
        kode
        name
      }
    }
  }
`;

export const UPDATE_LOCATION = gql`
  mutation UpdateLocation($id: ID!, $input: UpdateLocationInput!) {
    updateLocation(id: $id, input: $input) {
      id
      nama_gedung
      lantai
      ruangan
      kode_lokasi
      unit_id
      unit {
        kode
          name
      }
    }
  }
`;

export const DELETE_LOCATION = gql`
  mutation DeleteLocation($id: ID!) {
    deleteLocation(id: $id)
  }
`;