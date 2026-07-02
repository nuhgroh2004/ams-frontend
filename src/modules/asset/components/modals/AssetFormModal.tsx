'use client'

import React, { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation } from '@apollo/client'
import { 
  AppButton, 
  AppInput, 
  AppSelect, 
  AppModal 
} from '@/components/primitives'
import { createAssetSchema, CreateAssetSchemaInput } from '../../schemas/asset.schema'
import { GET_ASSET_CATEGORIES } from '../../services/asset.query'
import { GET_LOCATIONS } from '@/modules/locations/graphql/location.graphql'
import { GET_UNITS_QUERY, GET_USERS_QUERY } from '@/modules/users/services/user.graphql'
import { CREATE_ASSET, UPDATE_ASSET } from '../../services/asset.mutation'
import { toast } from '@/lib/toast'
import { Asset } from '../../types'

interface AssetFormModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: Asset | null
  onSuccess: () => void
}

export function AssetFormModal({
  isOpen,
  onClose,
  initialData,
  onSuccess
}: AssetFormModalProps) {
  const isEdit = !!initialData

  // Queries for form options
  const { data: categoriesData, loading: catLoading } = useQuery(GET_ASSET_CATEGORIES)
  const { data: locationsData, loading: locLoading } = useQuery(GET_LOCATIONS, {
    variables: { limit: 1000 }
  })
  const { data: unitsData, loading: unitsLoading } = useQuery(GET_UNITS_QUERY)
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS_QUERY, {
    variables: { limit: 1000 }
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting }
  } = useForm<CreateAssetSchemaInput>({
    resolver: zodResolver(createAssetSchema),
    defaultValues: {
      nama_barang: '',
      kode_barang: '',
      nilai_perolehan: 0,
      sumber_dana: '',
      tahun_perolehan: new Date().getFullYear(),
      kondisi: 'baik',
      status_penggunaan: 'aktif',
      kategori_id: '',
      lokasi_id: '',
      unit_id: '',
      penanggung_jawab_id: '',
    }
  })

  // Prefill form if editing
  useEffect(() => {
    if (initialData && isOpen) {
      reset({
        nama_barang: initialData.nama_barang || '',
        kode_barang: initialData.kode_barang || '',
        nilai_perolehan: initialData.nilai_perolehan ? parseFloat(initialData.nilai_perolehan) : 0,
        sumber_dana: initialData.sumber_dana || '',
        tahun_perolehan: initialData.tahun_perolehan || new Date().getFullYear(),
        kondisi: (initialData.kondisi as any) || 'baik',
        status_penggunaan: (initialData.status_penggunaan as any) || 'aktif',
        kategori_id: initialData.kategori_id || '',
        lokasi_id: initialData.lokasi_id || '',
        unit_id: initialData.unit_id || '',
        penanggung_jawab_id: initialData.penanggung_jawab_id || '',
      })
    } else if (isOpen) {
      reset({
        nama_barang: '',
        kode_barang: '',
        nilai_perolehan: 0,
        sumber_dana: '',
        tahun_perolehan: new Date().getFullYear(),
        kondisi: 'baik',
        status_penggunaan: 'aktif',
        kategori_id: '',
        lokasi_id: '',
        unit_id: '',
        penanggung_jawab_id: '',
      })
    }
  }, [initialData, isOpen, reset])

  const [createAsset] = useMutation(CREATE_ASSET)
  const [updateAsset] = useMutation(UPDATE_ASSET)

  const onSubmit = async (values: CreateAssetSchemaInput) => {
    try {
      // Map empty strings to undefined to let backend handle optional fields
      const input = Object.entries(values).reduce((acc, [key, val]) => {
        acc[key] = val === '' ? undefined : val
        return acc
      }, {} as any)

      if (isEdit) {
        await updateAsset({
          variables: { id: initialData?.id, input }
        })
        toast.success('Data aset berhasil diperbarui')
      } else {
        await createAsset({
          variables: { input }
        })
        toast.success('Aset baru berhasil ditambahkan')
      }
      onSuccess()
      onClose()
    } catch (error: unknown) {
      toast.graphqlError(error, isEdit ? 'Gagal memperbarui aset' : 'Gagal menambahkan aset')
    }
  }

  const selectedKondisi = useWatch({ control, name: 'kondisi' })
  const selectedStatus = useWatch({ control, name: 'status_penggunaan' })
  const selectedKategoriId = useWatch({ control, name: 'kategori_id' })
  const selectedLokasiId = useWatch({ control, name: 'lokasi_id' })
  const selectedUnitId = useWatch({ control, name: 'unit_id' })
  const selectedPjId = useWatch({ control, name: 'penanggung_jawab_id' })

  // Form options mapping
  const categoryOptions = categoriesData?.assetCategories?.map((c: any) => ({
    value: c.id,
    label: c.nama_kategori
  })) || []

  const locationOptions = locationsData?.locations?.data?.map((l: any) => ({
    value: l.id,
    label: [l.nama_gedung, l.lantai, l.ruangan].filter(Boolean).join(' - ')
  })) || []

  const unitOptions = unitsData?.units?.map((u: any) => ({
    value: u.id,
    label: u.nama_unit
  })) || []

  const userOptions = usersData?.users?.data?.map((u: any) => ({
    value: u.id,
    label: u.nama_lengkap
  })) || []

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Aset' : 'Tambah Aset Baru'}
      description={isEdit ? `Memperbarui detail data aset ${initialData.nama_barang}` : 'Daftarkan data sarana prasarana baru ke dalam inventaris.'}
      size="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
          <div className="space-y-1.5 lg:col-span-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Nama Barang
            </label>
            <AppInput
              {...register('nama_barang')}
              placeholder="Contoh: Laptop Asus ROG Zephyrus"
              error={errors.nama_barang?.message}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Kode Barang
            </label>
            <AppInput
              {...register('kode_barang')}
              placeholder="Contoh: LAP-001"
              error={errors.kode_barang?.message}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Nilai Perolehan (Rp)
            </label>
            <AppInput
              type="number"
              {...register('nilai_perolehan')}
              placeholder="0"
              error={errors.nilai_perolehan?.message}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Sumber Dana
            </label>
            <AppInput
              {...register('sumber_dana')}
              placeholder="Contoh: APBN 2026, Hibah"
              error={errors.sumber_dana?.message}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Tahun Perolehan
            </label>
            <AppInput
              type="number"
              {...register('tahun_perolehan')}
              placeholder="2026"
              error={errors.tahun_perolehan?.message}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Kondisi Aset
            </label>
            <AppSelect
              value={selectedKondisi}
              onValueChange={(val) => setValue('kondisi', val as any)}
              options={[
                { value: 'baik', label: 'Baik' },
                { value: 'rusak_ringan', label: 'Rusak Ringan' },
                { value: 'rusak_berat', label: 'Rusak Berat' },
              ]}
              error={errors.kondisi?.message}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Status Penggunaan
            </label>
            <AppSelect
              value={selectedStatus}
              onValueChange={(val) => setValue('status_penggunaan', val as any)}
              options={[
                { value: 'aktif', label: 'Aktif' },
                { value: 'dipinjam', label: 'Dipinjam' },
                { value: 'maintenance', label: 'Perawatan (Maintenance)' },
                { value: 'dihapus', label: 'Dihapus' },
                { value: 'hilang', label: 'Hilang' },
              ]}
              error={errors.status_penggunaan?.message}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Kategori Aset
            </label>
            <AppSelect
              value={selectedKategoriId}
              onValueChange={(val) => setValue('kategori_id', val)}
              placeholder="Pilih Kategori"
              options={categoryOptions}
              disabled={catLoading}
              error={errors.kategori_id?.message}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Lokasi Penempatan
            </label>
            <AppSelect
              value={selectedLokasiId}
              onValueChange={(val) => setValue('lokasi_id', val)}
              placeholder="Pilih Lokasi"
              options={locationOptions}
              disabled={locLoading}
              error={errors.lokasi_id?.message}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Unit Pemilik
            </label>
            <AppSelect
              value={selectedUnitId}
              onValueChange={(val) => setValue('unit_id', val)}
              placeholder="Pilih Unit"
              options={unitOptions}
              disabled={unitsLoading}
              error={errors.unit_id?.message}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Penanggung Jawab (PIC)
            </label>
            <AppSelect
              value={selectedPjId}
              onValueChange={(val) => setValue('penanggung_jawab_id', val)}
              placeholder="Pilih PIC"
              options={userOptions}
              disabled={usersLoading}
              error={errors.penanggung_jawab_id?.message}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-border">
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
            {isEdit ? 'Simpan Perubahan' : 'Simpan Aset'}
          </AppButton>
        </div>
      </form>
    </AppModal>
  )
}
