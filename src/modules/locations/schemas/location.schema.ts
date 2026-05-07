import { z } from 'zod';

export const locationSchema = z.object({
  nama_gedung: z.string().min(1, 'Nama gedung is required'),
  lantai: z.string().optional(),
  ruangan: z.string().optional(),
  kode_lokasi: z.string().optional(),
  unit_id: z.string().optional(),
});

export type LocationSchema = z.infer<typeof locationSchema>;