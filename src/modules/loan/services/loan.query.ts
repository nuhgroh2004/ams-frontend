/**
 * GraphQL Queries - Loan Module
 */

import { gql } from '@apollo/client';

export const GET_LOANS = gql`
  query GetLoans($page: Int!, $pageSize: Int!, $status: String, $search: String) {
    loans(page: $page, pageSize: $pageSize, status: $status, search: $search) {
      items {
        id
        assetId
        peminjamId
        approverId
        workflowInstanceId
        tanggalPinjam
        tanggalRencanKembali
        tanggalKembali
        status
        createdAt
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export const GET_LOAN_BY_ID = gql`
  query GetLoanById($id: ID!) {
    loan(id: $id) {
      id
      assetId
      peminjamId
      approverId
      workflowInstanceId
      tanggalPinjam
      tanggalRencanKembali
      tanggalKembali
      fotoSebelum
      fotoSesudah
      status
      createdAt
    }
  }
`;
