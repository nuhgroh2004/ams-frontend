/**
 * Mutasi Validation Schemas
 */

import { z } from 'zod';

export const ajukanMutasiSchema = z.object({
  asset_id: z.string().min(1, 'Aset harus dipilih'),
  jenis_mutasi: z.enum(['ruangan', 'unit_kerja', 'penanggung_jawab']),
  lokasi_tujuan_id: z.string().optional(),
  unit_tujuan_id: z.string().optional(),
  pj_tujuan_id: z.string().optional(),
  alasan_mutasi: z.string().min(1, 'Alasan mutasi harus diisi').max(500, 'Alasan mutasi maksimal 500 karakter'),
}).refine(data => {
  if (data.jenis_mutasi === 'ruangan') {
    return !!data.lokasi_tujuan_id;
  }
  return true;
}, {
  message: 'Lokasi tujuan harus dipilih',
  path: ['lokasi_tujuan_id']
}).refine(data => {
  if (data.jenis_mutasi === 'unit_kerja') {
    return !!data.unit_tujuan_id;
  }
  return true;
}, {
  message: 'Unit kerja tujuan harus dipilih',
  path: ['unit_tujuan_id']
}).refine(data => {
  if (data.jenis_mutasi === 'penanggung_jawab') {
    return !!data.pj_tujuan_id;
  }
  return true;
}, {
  message: 'Penanggung jawab baru harus dipilih',
  path: ['pj_tujuan_id']
});

export type AjukanMutasiFormInput = z.infer<typeof ajukanMutasiSchema>;
