/**
 * GraphQL Mutations - Loan Module
 */

import { gql } from '@apollo/client';

export const CREATE_LOAN = gql`
  mutation CreateLoan($input: CreateLoanInput!) {
    createLoan(input: $input) {
      id
      assetId
      peminjamId
      tanggalPinjam
      tanggalRencanKembali
      status
      createdAt
    }
  }
`;

export const APPROVE_LOAN = gql`
  mutation ApproveLoan($id: ID!, $comment: String) {
    approveLoan(id: $id, comment: $comment) {
      id
      status
      workflowInstanceId
    }
  }
`;

export const REJECT_LOAN = gql`
  mutation RejectLoan($id: ID!, $reason: String!) {
    rejectLoan(id: $id, reason: $reason) {
      id
      status
    }
  }
`;

export const RETURN_LOAN = gql`
  mutation ReturnLoan($id: ID!, $notes: String) {
    returnLoan(id: $id, notes: $notes) {
      id
      tanggalKembali
      status
    }
  }
`;
