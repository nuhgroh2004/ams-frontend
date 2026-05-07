import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        nama_lengkap
        nrp
        email
        unit_id
        jabatan
        roles {
          id
          nama_role
        }
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        nama_lengkap
        email
        roles {
          id
          nama_role
        }
      }
    }
  }
`;