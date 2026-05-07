import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  query Me {
    me {
      id
      nama_lengkap
      nrp
      email
      unit_id
      unit_kerja_kode
      jabatan
      is_active
      status
      unit {
        nama_unit
        kode_unit
      }
      roles {
        nama_role
      }
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      nama_lengkap
      email
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }
`;

export const GET_USERS_QUERY = gql`
  query GetUsers($page: Int, $limit: Int, $search: String, $isActive: Boolean) {
    users(page: $page, limit: $limit, search: $search, isActive: $isActive) {
      total
      page
      limit
      totalPages
      data {
        id
        nama_lengkap
        nrp
        email
        jabatan
        is_active
        unit {
          nama_unit
        }
        roles {
          nama_role
        }
      }
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export const ACTIVATE_USER_MUTATION = gql`
  mutation ActivateUser($id: ID!) {
    activateUser(id: $id) {
      id
      is_active
    }
  }
`;

export const DEACTIVATE_USER_MUTATION = gql`
  mutation DeactivateUser($id: ID!) {
    deactivateUser(id: $id) {
      id
      is_active
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      nama_lengkap
      nrp
      email
      jabatan
      is_active
    }
  }
`;

export const GET_ROLES_QUERY = gql`
  query GetRoles {
    roles {
      id
      nama_role
      deskripsi
    }
  }
`;

export const GET_UNITS_QUERY = gql`
  query GetUnits {
    units {
      id
      nama_unit
      kode_unit
    }
  }
`;

