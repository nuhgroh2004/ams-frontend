import * as z from 'zod'

export const disposalSchema = z.object({
  asset_id: z.string().min(1, 'Aset wajib dipilih'),
  alasan_penghapusan: z.string().min(5, 'Alasan minimal 5 karakter'),
  nilai_penjualan: z.coerce.number().optional(),
})

export type DisposalFormValues = z.infer<typeof disposalSchema>
