import * as z from 'zod'

/**
 * Validation schema for Unit Kerja form
 * Aligns with GraphQL CreateUnitKerjaInput & UpdateUnitKerjaInput
 */
export const unitKerjaSchema = z.object({
  kode: z.string().min(1, 'Kode unit kerja harus diisi').optional(),
  name: z.string().min(1, 'Nama unit kerja harus diisi'),
  hirarki: z.string().min(1, 'Hirarki harus diisi'),
  hirarki_abbr: z.string().min(1, 'Singkatan hirarki harus diisi'),
  singkatan: z.string().min(1, 'Singkatan harus diisi'),
  is_unor: z.boolean().default(false),
  is_satker: z.boolean().default(false),
  is_subsatker: z.boolean().default(false),
  is_sekretariat: z.boolean().default(false),
  parentKode: z.string().nullable().optional(),
  jabatan_name: z.string().min(1, 'Nama jabatan harus diisi'),
  pemimpin_non_pns_id: z.string().nullable().optional(),
  pemimpin_pns_id: z.string().nullable().optional(),
  eselonId: z.coerce.number().int('Eselon ID harus berupa angka'),
  eselon_1_kode: z.string().min(1, 'Eselon 1 kode harus diisi'),
  eselon_2_kode: z.string().min(1, 'Eselon 2 kode harus diisi'),
  eselon_3_kode: z.string().min(1, 'Eselon 3 kode harus diisi'),
  eselon_4_kode: z.string().min(1, 'Eselon 4 kode harus diisi'),
})

export type UnitKerjaFormValues = z.infer<typeof unitKerjaSchema>
