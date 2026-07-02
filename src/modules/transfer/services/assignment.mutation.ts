/**
 * GraphQL Mutations - Assignment Module
 * Matches backend assignment.typeDef.js
 */

import { gql } from '@apollo/client';

export const ASSIGN_ASSET_TO_USER = gql`
  mutation AssignAssetToUser($input: AssignAssetToUserInput!) {
    assignAssetToUser(input: $input) {
      id
      asset_id
      user_id
      unit_id
      assigned_by
      assigned_at
      is_returned
      notes
      asset {
        id
        nama_barang
        nomor_register
        kode_barang
      }
      user {
        id
        nama_lengkap
        nrp
      }
      unit {
        id
        nama_unit
      }
    }
  }
`;

export const ASSIGN_ASSET_TO_UNIT = gql`
  mutation AssignAssetToUnit($input: AssignAssetToUnitInput!) {
    assignAssetToUnit(input: $input) {
      id
      asset_id
      user_id
      unit_id
      assigned_by
      assigned_at
      is_returned
      notes
      asset {
        id
        nama_barang
        nomor_register
        kode_barang
      }
      unit {
        id
        nama_unit
      }
    }
  }
`;

export const RETURN_ASSET_ASSIGNMENT = gql`
  mutation ReturnAssetAssignment($id: ID!, $notes: String) {
    returnAssetAssignment(id: $id, notes: $notes) {
      id
      asset_id
      returned_at
      is_returned
      notes
    }
  }
`;
