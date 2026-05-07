/**
 * Loan Module Types
 */

export interface LoanDTO {
  id: string;
  assetId: string;
  borrowerId: string;
  borrowerName: string;
  loanDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  status: 'active' | 'returned' | 'overdue' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoanListResponse {
  items: LoanDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
