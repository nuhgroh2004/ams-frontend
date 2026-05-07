'use client'

import React, { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  AppButton,
  AppInput,
  AppSelect,
  AppModal
} from '@/components/primitives'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_ROLES_QUERY,
  CREATE_USER_MUTATION,
  UPDATE_USER_MUTATION
} from '@/modules/users/services/user.graphql'
import { useUnitKerjaOptions } from '@/modules/unit-kerja/hooks/useUnitKerjaList'
import { toast } from '@/lib/toast'

const userSchema = z.object({
  nama_lengkap: z.string().min(3, 'Nama minimal 3 karakter'),
  nrp: z.string().min(5, 'NRP minimal 5 karakter'),
  email: z.string().email('Email tidak valid'),
  jabatan: z.string().min(2, 'Jabatan wajib diisi'),
  unit_id: z.string().min(1, 'Unit wajib dipilih'),
  role_id: z.string().min(1, 'Role wajib dipilih'),
  password: z.string().min(6, 'Password minimal 6 karakter').optional().or(z.literal('')),
})

type UserFormValues = z.infer<typeof userSchema>

interface InitialUserData {
  id?: string
  nama_lengkap?: string
  nrp?: string
  email?: string
  jabatan?: string
  unit_id?: string
  unit?: { id?: string }
  roles?: Array<{ id: string }>
}

interface UserFormModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: InitialUserData
  onSuccess: () => void
}

/**
 * UserFormModal
 * Modal untuk Tambah atau Edit Pengguna dengan validasi Zod.
 */
export function UserFormModal({
  isOpen,
  onClose,
  initialData,
  onSuccess
}: UserFormModalProps) {
  const isEdit = !!initialData

  const { data: rolesData } = useQuery(GET_ROLES_QUERY)
  const { options: unitOptions, loading: unitsLoading } = useUnitKerjaOptions()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting }
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nama_lengkap: '',
      nrp: '',
      email: '',
      jabatan: '',
      unit_id: '',
      role_id: '',
      password: '',
    }
  })

  // Prefill form if editing
  useEffect(() => {
    if (initialData && isOpen) {
      reset({
        nama_lengkap: initialData.nama_lengkap || '',
        nrp: initialData.nrp || '',
        email: initialData.email || '',
        jabatan: initialData.jabatan || '',
        unit_id: initialData.unit_id || initialData.unit?.id || '',
        role_id: initialData.roles?.[0]?.id || '',
        password: '',
      })
    } else if (isOpen) {
      reset({
        nama_lengkap: '',
        nrp: '',
        email: '',
        jabatan: '',
        unit_id: '',
        role_id: '',
        password: '',
      })
    }
  }, [initialData, isOpen, reset])

  const [createUser] = useMutation(CREATE_USER_MUTATION)
  const [updateUser] = useMutation(UPDATE_USER_MUTATION)

  const onSubmit = async (values: UserFormValues) => {
    try {
      const { role_id, password, ...rest } = values
      const input: Record<string, unknown> = {
        ...rest,
        role_ids: [role_id]
      }

      if (isEdit) {
        if (password) {
          input.password = password
        }
        await updateUser({
          variables: { id: initialData?.id, input }
        })
        toast.success('Data pengguna berhasil diperbarui')
      } else {
        if (password) {
          input.password = password
        }
        await createUser({
          variables: { input }
        })
        toast.success('Pengguna baru berhasil ditambahkan')
      }
      onSuccess()
      onClose()
    } catch (error: unknown) {
      toast.graphqlError(error, isEdit ? 'Gagal memperbarui pengguna' : 'Gagal menambahkan pengguna')
    }
  }

  const selectedUnitId = useWatch({ control, name: 'unit_id' })
  const selectedRoleId = useWatch({ control, name: 'role_id' })

  const roleOptions = rolesData?.roles?.map((r: { id: string; nama_role: string }) => ({
    value: r.id,
    label: r.nama_role
  })) || []

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
      description={isEdit ? `Memperbarui data akun ${initialData.nama_lengkap}` : 'Daftarkan personel baru ke dalam sistem.'}
      size="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Nama Lengkap
            </label>
            <AppInput
              {...register('nama_lengkap')}
              placeholder="Contoh: John Doe"
              error={errors.nama_lengkap?.message}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              NRP
            </label>
            <AppInput
              {...register('nrp')}
              placeholder="Masukkan NRP"
              error={errors.nrp?.message}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Email
            </label>
            <AppInput
              {...register('email')}
              placeholder="email@example.com"
              type="email"
              error={errors.email?.message}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Jabatan
            </label>
            <AppInput
              {...register('jabatan')}
              placeholder="Contoh: Staff IT"
              error={errors.jabatan?.message}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Unit Kerja
            </label>
            <AppSelect
              value={selectedUnitId}
              onValueChange={(val) => setValue('unit_id', val)}
              placeholder="Pilih Unit"
              options={unitOptions}
              error={errors.unit_id?.message}
              disabled={unitsLoading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Role Akses
            </label>
            <AppSelect
              value={selectedRoleId}
              onValueChange={(val) => setValue('role_id', val)}
              placeholder="Pilih Role"
              options={roleOptions}
              error={errors.role_id?.message}
            />
          </div>

          <div className="lg:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Password {isEdit && '(Kosongkan jika tidak ingin ganti)'}
            </label>
            <AppInput
              {...register('password')}
              placeholder={isEdit ? '••••••••' : 'Masukkan password'}
              type="password"
              error={errors.password?.message}
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
            {isEdit ? 'Simpan Perubahan' : 'Simpan Pengguna'}
          </AppButton>
        </div>
      </form>
    </AppModal>
  )
}
