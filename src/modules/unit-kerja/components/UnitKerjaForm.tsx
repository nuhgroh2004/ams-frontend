'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { unitKerjaSchema, UnitKerjaFormValues } from '../schemas/unit-kerja.schema'
import { useUnitKerjaOptions } from '../hooks/useUnitKerjaList'
import {
  AppInput,
  AppButton,
  AppCheckbox,
  AppSelect,
} from '@/components/primitives/index'
import {
  FormWrapper,
  FormField,
} from '@/components/patterns/forms'

const PARENT_NONE_VALUE = '__NONE__'

interface UnitKerjaFormProps {
  initialValues?: Partial<UnitKerjaFormValues>
  onSubmit: (values: UnitKerjaFormValues) => void
  loading?: boolean
  submitLabel?: string
  isEdit?: boolean
}

/**
 * Unit Kerja Form Component
 * Supports create and edit modes with responsive design
 * Parent dropdown for hierarchy support
 */
export function UnitKerjaForm({
  initialValues,
  onSubmit,
  loading,
  submitLabel = 'Simpan',
  isEdit = false,
}: UnitKerjaFormProps) {
  const { options: parentOptions, loading: parentLoading } = useUnitKerjaOptions()

  const form = useForm<UnitKerjaFormValues>({
    resolver: zodResolver(unitKerjaSchema),
    mode: 'onBlur',
    defaultValues: {
      kode: initialValues?.kode ?? '',
      name: initialValues?.name ?? '',
      hirarki: initialValues?.hirarki ?? '',
      hirarki_abbr: initialValues?.hirarki_abbr ?? '',
      singkatan: initialValues?.singkatan ?? '',
      is_unor: initialValues?.is_unor ?? false,
      is_satker: initialValues?.is_satker ?? false,
      is_subsatker: initialValues?.is_subsatker ?? false,
      is_sekretariat: initialValues?.is_sekretariat ?? false,
      parentKode: initialValues?.parentKode ?? PARENT_NONE_VALUE,
      jabatan_name: initialValues?.jabatan_name ?? '',
      pemimpin_non_pns_id: initialValues?.pemimpin_non_pns_id ?? '',
      pemimpin_pns_id: initialValues?.pemimpin_pns_id ?? '',
      eselonId: initialValues?.eselonId ?? 0,
      eselon_1_kode: initialValues?.eselon_1_kode ?? '',
      eselon_2_kode: initialValues?.eselon_2_kode ?? '',
      eselon_3_kode: initialValues?.eselon_3_kode ?? '',
      eselon_4_kode: initialValues?.eselon_4_kode ?? '',
    },
  })

  // Reset form when initialValues change (crucial for Update/Edit mode)
  useEffect(() => {
    if (initialValues) {
      form.reset({
        kode: initialValues.kode ?? '',
        name: initialValues.name ?? '',
        hirarki: initialValues.hirarki ?? '',
        hirarki_abbr: initialValues.hirarki_abbr ?? '',
        singkatan: initialValues.singkatan ?? '',
        is_unor: Boolean(initialValues.is_unor),
        is_satker: Boolean(initialValues.is_satker),
        is_subsatker: Boolean(initialValues.is_subsatker),
        is_sekretariat: Boolean(initialValues.is_sekretariat),
        parentKode: initialValues.parentKode ?? PARENT_NONE_VALUE,
        jabatan_name: initialValues.jabatan_name ?? '',
        pemimpin_non_pns_id: initialValues.pemimpin_non_pns_id ?? '',
        pemimpin_pns_id: initialValues.pemimpin_pns_id ?? '',
        eselonId: initialValues.eselonId ?? 0,
        eselon_1_kode: initialValues.eselon_1_kode ?? '',
        eselon_2_kode: initialValues.eselon_2_kode ?? '',
        eselon_3_kode: initialValues.eselon_3_kode ?? '',
        eselon_4_kode: initialValues.eselon_4_kode ?? '',
      })
    }
  }, [initialValues, form])

  return (
    <FormWrapper form={form} onSubmit={onSubmit} isLoading={loading}>
      {/* Basic Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Kode (only on create) */}
          {!isEdit && (
            <FormField
              control={form.control}
              name="kode"
              label="Kode Unit Kerja"
              required
            >
              <AppInput
                placeholder="Contoh: UK001, DTI-01"
                disabled={isEdit}
              />
            </FormField>
          )}

          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            label="Nama Unit Kerja"
            required
          >
            <AppInput placeholder="Masukkan nama unit kerja" />
          </FormField>

          {/* Abbreviations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="singkatan"
              label="Singkatan"
              required
            >
              <AppInput placeholder="Contoh: DTI, IT" />
            </FormField>
            <FormField
              control={form.control}
              name="hirarki_abbr"
              label="Singkatan Hirarki"
              required
            >
              <AppInput placeholder="Contoh: KEMEN > SETJEN" />
            </FormField>
          </div>

          {/* Hierarchy */}
          <FormField
            control={form.control}
            name="hirarki"
            label="Hirarki"
            required
          >
            <AppInput placeholder="Contoh: Kementerian > Sekretariat Jenderal > Direktorat" />
          </FormField>

          {/* Parent Selection - Optional Dropdown */}
          <FormField
            control={form.control}
            name="parentKode"
            label="Parent Unit (Opsional)"
          >
            <AppSelect
              placeholder="Pilih parent unit (kosongkan jika top-level)"
              options={[
                { value: PARENT_NONE_VALUE, label: 'Tidak ada parent (Top Level)' },
                ...parentOptions,
              ]}
              disabled={parentLoading}
            />
          </FormField>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Leadership Position */}
          <FormField
            control={form.control}
            name="jabatan_name"
            label="Nama Jabatan Pemimpin"
            required
          >
            <AppInput placeholder="Contoh: Direktur, Kepala Bagian" />
          </FormField>

          {/* Leadership IDs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="pemimpin_pns_id"
              label="ID Pemimpin (PNS)"
            >
              <AppInput placeholder="ID PNS" />
            </FormField>
            <FormField
              control={form.control}
              name="pemimpin_non_pns_id"
              label="ID Pemimpin (Non-PNS)"
            >
              <AppInput placeholder="ID Non-PNS" />
            </FormField>
          </div>

          {/* Unit Type Checkboxes */}
          <div className="p-4 rounded-lg border border-border bg-muted/20 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tipe Unit Kerja
            </p>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="is_unor"
                render={({ field }) => (
                  <AppCheckbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    label="Unor"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="is_satker"
                render={({ field }) => (
                  <AppCheckbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    label="Satker"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="is_subsatker"
                render={({ field }) => (
                  <AppCheckbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    label="Sub Satker"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="is_sekretariat"
                render={({ field }) => (
                  <AppCheckbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    label="Sekretariat"
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Eselon Section */}
      <div className="p-6 rounded-lg border border-border bg-muted/10 space-y-4">
        <div className="flex items-center gap-2">
          <span className="h-1 w-6 bg-primary rounded-full" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Informasi Eselon
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          <FormField
            control={form.control}
            name="eselonId"
            label="ID Eselon"
            required
          >
            <AppInput type="number" min="0" placeholder="0" sz="sm" />
          </FormField>
          <FormField
            control={form.control}
            name="eselon_1_kode"
            label="Eselon 1"
            required
          >
            <AppInput placeholder="E1-01" sz="sm" />
          </FormField>
          <FormField
            control={form.control}
            name="eselon_2_kode"
            label="Eselon 2"
            required
          >
            <AppInput placeholder="E2-03" sz="sm" />
          </FormField>
          <FormField
            control={form.control}
            name="eselon_3_kode"
            label="Eselon 3"
            required
          >
            <AppInput placeholder="E3-00" sz="sm" />
          </FormField>
          <FormField
            control={form.control}
            name="eselon_4_kode"
            label="Eselon 4"
            required
          >
            <AppInput placeholder="E4-00" sz="sm" />
          </FormField>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-border">
        <AppButton
          type="submit"
          loading={loading}
          disabled={loading || parentLoading}
          className="w-full sm:w-auto"
        >
          {submitLabel}
        </AppButton>
      </div>
    </FormWrapper>
  )
}