/**
 * Loan Validation Schemas
 * Using Zod for validation
 */

import { z } from 'zod';

// Create Loan Schema
export const createLoanSchema = z.object({
  asset_id: z.string().min(1, 'Aset harus dipilih'),
  tanggal_rencana_kembali: z.string().min(1, 'Tanggal rencana kembali harus diisi'),
  catatan_pengaju: z.string().max(500, 'Catatan maksimal 500 karakter').optional(),
});

export type CreateLoanInput = z.infer<typeof createLoanSchema>;

// Filter Schema
export const loanFilterSchema = z.object({
  status: z.enum(['menunggu', 'disetujui', 'ditolak', 'dipinjam', 'selesai', 'terlambat', 'dibatalkan']).optional(),
  search: z.string().optional(),
});

export type LoanFilterInput = z.infer<typeof loanFilterSchema>;
