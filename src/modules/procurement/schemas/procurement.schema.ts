import { z } from 'zod';

export const createProcurementItemSchema = z.object({
  nama_barang: z.string().min(1, 'Nama barang wajib diisi').max(150, 'Nama barang maksimal 150 karakter'),
  quantity: z.coerce.number().min(1, 'Jumlah minimal 1'),
  harga_satuan: z.coerce.number().min(0, 'Harga satuan harus berupa angka positif'),
});

export const createProcurementSchema = z.object({
  nomor_pengadaan: z.string().min(1, 'Nomor pengadaan wajib diisi').max(100, 'Nomor pengadaan maksimal 100 karakter'),
  vendor: z.string().max(150, 'Nama vendor maksimal 150 karakter').optional().or(z.literal('')),
  nomor_kontrak: z.string().max(100, 'Nomor kontrak maksimal 100 karakter').optional().or(z.literal('')),
  tanggal_pengadaan: z.string().optional().or(z.literal('')),
  items: z.array(createProcurementItemSchema).min(1, 'Minimal harus menginput satu rincian barang'),
});

export type CreateProcurementSchemaInput = z.infer<typeof createProcurementSchema>;
export type CreateProcurementItemSchemaInput = z.infer<typeof createProcurementItemSchema>;
