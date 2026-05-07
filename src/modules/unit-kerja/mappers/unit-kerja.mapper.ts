import { UnitKerja, CreateUnitKerjaInput, UpdateUnitKerjaInput } from '../types'
import { UnitKerjaFormValues } from '../schemas/unit-kerja.schema'

/**
 * Maps GraphQL responses and form data to/from UnitKerja entities
 * Single source of truth for data transformations
 */
export const unitKerjaMapper = {
  /**
   * Map GraphQL response to UI domain model
   */
  toUI: (data: any): UnitKerja => ({
    kode: data.kode,
    name: data.name,
    hirarki: data.hirarki,
    hirarki_abbr: data.hirarki_abbr,
    singkatan: data.singkatan,
    is_unor: Boolean(data.is_unor),
    is_satker: Boolean(data.is_satker),
    is_subsatker: Boolean(data.is_subsatker),
    is_sekretariat: Boolean(data.is_sekretariat),
    parentKode: data.parentKode || null,
    jabatan_name: data.jabatan_name,
    pemimpin_non_pns_id: data.pemimpin_non_pns_id || null,
    pemimpin_pns_id: data.pemimpin_pns_id || null,
    eselonId: Number(data.eselonId),
    eselon_1_kode: data.eselon_1_kode,
    eselon_2_kode: data.eselon_2_kode,
    eselon_3_kode: data.eselon_3_kode,
    eselon_4_kode: data.eselon_4_kode,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }),

  /**
   * Map form values to create mutation input
   */
  toCreateInput: (values: UnitKerjaFormValues): CreateUnitKerjaInput => ({
    kode: values.kode ?? '',
    name: values.name,
    hirarki: values.hirarki,
    hirarki_abbr: values.hirarki_abbr,
    singkatan: values.singkatan,
    is_unor: Boolean(values.is_unor),
    is_satker: Boolean(values.is_satker),
    is_subsatker: Boolean(values.is_subsatker),
    is_sekretariat: Boolean(values.is_sekretariat),
    parentKode:
      values.parentKode === '__NONE__' || values.parentKode == null
        ? null
        : values.parentKode,
    jabatan_name: values.jabatan_name,
    pemimpin_non_pns_id: values.pemimpin_non_pns_id || null,
    pemimpin_pns_id: values.pemimpin_pns_id || null,
    eselonId: Number(values.eselonId),
    eselon_1_kode: values.eselon_1_kode,
    eselon_2_kode: values.eselon_2_kode,
    eselon_3_kode: values.eselon_3_kode,
    eselon_4_kode: values.eselon_4_kode,
  }),

  /**
   * Map form values to update mutation input
   */
  toUpdateInput: (values: UnitKerjaFormValues): UpdateUnitKerjaInput => ({
    name: values.name,
    hirarki: values.hirarki,
    hirarki_abbr: values.hirarki_abbr,
    singkatan: values.singkatan,
    is_unor: Boolean(values.is_unor),
    is_satker: Boolean(values.is_satker),
    is_subsatker: Boolean(values.is_subsatker),
    is_sekretariat: Boolean(values.is_sekretariat),
    parentKode:
      values.parentKode === '__NONE__' || values.parentKode == null
        ? null
        : values.parentKode,
    jabatan_name: values.jabatan_name,
    pemimpin_non_pns_id: values.pemimpin_non_pns_id || null,
    pemimpin_pns_id: values.pemimpin_pns_id || null,
    eselonId: Number(values.eselonId),
    eselon_1_kode: values.eselon_1_kode,
    eselon_2_kode: values.eselon_2_kode,
    eselon_3_kode: values.eselon_3_kode,
    eselon_4_kode: values.eselon_4_kode,
  }),

  /**
   * Map UI entity to form values for editing
   */
  toFormValues: (data: UnitKerja): Partial<UnitKerjaFormValues> => ({
    kode: data.kode,
    name: data.name,
    hirarki: data.hirarki,
    hirarki_abbr: data.hirarki_abbr,
    singkatan: data.singkatan,
    is_unor: data.is_unor,
    is_satker: data.is_satker,
    is_subsatker: data.is_subsatker,
    is_sekretariat: data.is_sekretariat,
    parentKode: data.parentKode ?? undefined,
    jabatan_name: data.jabatan_name,
    pemimpin_non_pns_id: data.pemimpin_non_pns_id ?? '',
    pemimpin_pns_id: data.pemimpin_pns_id ?? '',
    eselonId: data.eselonId,
    eselon_1_kode: data.eselon_1_kode,
    eselon_2_kode: data.eselon_2_kode,
    eselon_3_kode: data.eselon_3_kode,
    eselon_4_kode: data.eselon_4_kode,
  }),
}
