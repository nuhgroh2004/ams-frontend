import { z } from 'zod';

export const createAssetSchema = z.object({
  nama_barang: z.string().min(1, 'Nama barang wajib diisi').max(150, 'Nama barang maksimal 150 karakter'),
  kode_barang: z.string().max(50, 'Kode barang maksimal 50 karakter').optional().or(z.literal('')),
  nilai_perolehan: z.coerce.number().min(0, 'Nilai perolehan harus berupa angka positif').optional(),
  sumber_dana: z.string().max(100, 'Sumber dana maksimal 100 karakter').optional().or(z.literal('')),
  tahun_perolehan: z.coerce.number().min(1900, 'Tahun perolehan tidak valid').max(new Date().getFullYear() + 1, 'Tahun perolehan tidak valid').optional(),
  kondisi: z.enum(['baik', 'rusak_ringan', 'rusak_berat']).optional(),
  status_penggunaan: z.enum(['aktif', 'dipinjam', 'maintenance', 'dihapus', 'hilang']).optional(),
  kategori_id: z.string().min(1, 'Kategori wajib dipilih').optional().or(z.literal('')),
  lokasi_id: z.string().min(1, 'Lokasi wajib dipilih').optional().or(z.literal('')),
  unit_id: z.string().min(1, 'Unit wajib dipilih').optional().or(z.literal('')),
  penanggung_jawab_id: z.string().min(1, 'Penanggung jawab wajib dipilih').optional().or(z.literal('')),
});

export type CreateAssetSchemaInput = z.infer<typeof createAssetSchema>;

export const updateAssetSchema = createAssetSchema.partial();

export type UpdateAssetSchemaInput = z.infer<typeof updateAssetSchema>;

export const assetFilterSchema = z.object({
  search: z.string().optional(),
  kondisi: z.string().optional(),
  status_penggunaan: z.string().optional(),
  klasifikasi: z.string().optional(),
  kategori_id: z.string().optional(),
  lokasi_id: z.string().optional(),
  unit_id: z.string().optional(),
  penanggung_jawab_id: z.string().optional(),
  tahun_perolehan: z.coerce.number().optional(),
});

export type AssetFilterSchemaInput = z.infer<typeof assetFilterSchema>;
