/**
 * Assignment Validation Schemas
 * Using Zod for validation
 */

import { z } from 'zod';

// Assign to User Schema
export const assignToUserSchema = z.object({
  asset_id: z.string().min(1, 'Aset harus dipilih'),
  user_id: z.string().min(1, 'User penerima harus dipilih'),
  unit_id: z.string().optional(),
  notes: z.string().max(500, 'Catatan maksimal 500 karakter').optional(),
});

export type AssignToUserFormInput = z.infer<typeof assignToUserSchema>;

// Assign to Unit Schema
export const assignToUnitSchema = z.object({
  asset_id: z.string().min(1, 'Aset harus dipilih'),
  unit_id: z.string().min(1, 'Unit kerja tujuan harus dipilih'),
  notes: z.string().max(500, 'Catatan maksimal 500 karakter').optional(),
});

export type AssignToUnitFormInput = z.infer<typeof assignToUnitSchema>;

export * from './mutasi';

