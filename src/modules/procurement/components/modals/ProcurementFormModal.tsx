'use client'

import React from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@apollo/client'
import { Plus, Trash } from 'lucide-react'
import { 
  AppButton, 
  AppInput, 
  AppModal 
} from '@/components/primitives'
import { createProcurementSchema, CreateProcurementSchemaInput } from '../../schemas/procurement.schema'
import { CREATE_PROCUREMENT } from '../../services/procurement.graphql'
import { toast } from '@/lib/toast'

interface ProcurementFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ProcurementFormModal({
  isOpen,
  onClose,
  onSuccess
}: ProcurementFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm<CreateProcurementSchemaInput>({
    resolver: zodResolver(createProcurementSchema),
    defaultValues: {
      nomor_pengadaan: '',
      vendor: '',
      nomor_kontrak: '',
      tanggal_pengadaan: new Date().toISOString().split('T')[0],
      items: [{ nama_barang: '', quantity: 1, harga_satuan: 0 }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  })

  const [createProcurement] = useMutation(CREATE_PROCUREMENT)

  const onSubmit = async (values: CreateProcurementSchemaInput) => {
    try {
      const input = {
        ...values,
        vendor: values.vendor || undefined,
        nomor_kontrak: values.nomor_kontrak || undefined,
        tanggal_pengadaan: values.tanggal_pengadaan || undefined,
      }

      await createProcurement({
        variables: { input }
      })

      toast.success('Transaksi pengadaan berhasil disimpan')
      onSuccess()
      reset()
      onClose()
    } catch (error: any) {
      toast.graphqlError(error, 'Gagal menyimpan transaksi pengadaan')
    }
  }

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Catat Pengadaan Aset Baru"
      description="Masukkan detail kontrak pengadaan beserta rincian barang yang diadakan."
      size="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Main Contract Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Nomor Pengadaan
            </label>
            <AppInput
              {...register('nomor_pengadaan')}
              placeholder="Contoh: PENG-BMN-2026-001"
              error={errors.nomor_pengadaan?.message}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Nomor Kontrak / SPK
            </label>
            <AppInput
              {...register('nomor_kontrak')}
              placeholder="Contoh: SPK/BMN/IV/2026"
              error={errors.nomor_kontrak?.message}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Vendor / Penyedia Aset
            </label>
            <AppInput
              {...register('vendor')}
              placeholder="Contoh: PT. Computindo Nusantara"
              error={errors.vendor?.message}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Tanggal Pengadaan
            </label>
            <AppInput
              type="date"
              {...register('tanggal_pengadaan')}
              error={errors.tanggal_pengadaan?.message}
            />
          </div>
        </div>

        {/* Procurement Items Section */}
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Rincian Barang yang Diadakan
            </h4>
            <AppButton
              type="button"
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={() => append({ nama_barang: '', quantity: 1, harga_satuan: 0 })}
            >
              Tambah Item
            </AppButton>
          </div>

          {errors.items?.message && (
            <p className="text-xs text-destructive font-medium">{errors.items.message}</p>
          )}

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div 
                key={field.id} 
                className="grid grid-cols-12 gap-3 items-start p-3 bg-muted/30 rounded-xl border border-border"
              >
                {/* Nama Barang */}
                <div className="col-span-12 sm:col-span-6 space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                    Nama Barang
                  </label>
                  <AppInput
                    {...register(`items.${index}.nama_barang` as const)}
                    placeholder="Contoh: Laptop Asus ExpertBook"
                    error={errors.items?.[index]?.nama_barang?.message}
                  />
                </div>

                {/* Qty */}
                <div className="col-span-4 sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                    Qty
                  </label>
                  <AppInput
                    type="number"
                    {...register(`items.${index}.quantity` as const)}
                    error={errors.items?.[index]?.quantity?.message}
                  />
                </div>

                {/* Harga Satuan */}
                <div className="col-span-6 sm:col-span-3 space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                    Harga Satuan (Rp)
                  </label>
                  <AppInput
                    type="number"
                    {...register(`items.${index}.harga_satuan` as const)}
                    error={errors.items?.[index]?.harga_satuan?.message}
                  />
                </div>

                {/* Action Delete */}
                <div className="col-span-2 sm:col-span-1 pt-6 text-center">
                  <AppButton
                    type="button"
                    variant="ghost"
                    size="icon_sm"
                    className="text-muted-foreground hover:text-destructive"
                    disabled={fields.length <= 1}
                    onClick={() => remove(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </AppButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <AppButton
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </AppButton>
          <AppButton
            type="submit"
            variant="primary"
            loading={isSubmitting}
          >
            Simpan Pengadaan
          </AppButton>
        </div>
      </form>
    </AppModal>
  )
}
