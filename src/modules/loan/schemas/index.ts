/**
 * Loan Validation Schemas
 *
 * Using Zod for validation
 */

import { z } from 'zod';

// Create Loan Schema
export const createLoanSchema = z.object({
  assetId: z.string().min(1, 'Asset is required'),
  borrowerId: z.string().min(1, 'Borrower is required'),
  expectedReturnDate: z.string().min(1, 'Expected return date is required'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

export type CreateLoanInput = z.infer<typeof createLoanSchema>;

// Return Loan Schema
export const returnLoanSchema = z.object({
  id: z.string().min(1, 'Loan ID is required'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

export type ReturnLoanInput = z.infer<typeof returnLoanSchema>;

// Filter Schema
export const loanFilterSchema = z.object({
  status: z.enum(['active', 'returned', 'overdue', 'cancelled']).optional(),
  search: z.string().optional(),
});

export type LoanFilterInput = z.infer<typeof loanFilterSchema>;
