'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { User } from 'lucide-react'
import { 
  AppCard, 
  AppInput, 
  AppButton 
} from '@/components/primitives'
import { 
  FormWrapper, 
  FormField 
} from '@/components/patterns'

/**
 * ProfileForm Component
 * Mengelola informasi dasar user (Nama & Email).
 * NRp & Jabatan bersifat read-only.
 */

const profileSchema = z.object({
  nama_lengkap: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  nrp: z.string().optional(),
  jabatan: z.string().optional(),
  unit_kerja: z.string().optional(),
})

type ProfileValues = z.infer<typeof profileSchema>

interface ProfileFormProps {
  initialData?: Partial<ProfileValues>
  isLoading?: boolean
  onSave: (data: ProfileValues) => void
}

export function ProfileForm({ initialData, isLoading, onSave }: ProfileFormProps) {
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nama_lengkap: initialData?.nama_lengkap || '',
      email: initialData?.email || '',
      nrp: initialData?.nrp || '',
      jabatan: initialData?.jabatan || '',
      unit_kerja: initialData?.unit_kerja || '',
    },
  })

  // Sinkronisasi data saat initialData berubah (misal setelah query selesai)
  React.useEffect(() => {
    if (initialData) {
      form.reset({
        nama_lengkap: initialData.nama_lengkap || '',
        email: initialData.email || '',
        nrp: initialData.nrp || '',
        jabatan: initialData.jabatan || '',
        unit_kerja: initialData.unit_kerja || '',
      })
    }
  }, [initialData, form])

  return (
    <AppCard className="overflow-hidden">
      <div className="p-6 border-b border-border bg-muted/30">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Informasi Profil</h2>
            <p className="text-sm text-muted-foreground">Perbarui informasi identitas akun Anda.</p>
          </div>
        </div>
      </div>

      <FormWrapper 
        form={form} 
        onSubmit={onSave} 
        className="p-6 space-y-6"
        isLoading={isLoading}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nrp"
            label="NRP (Nomor Registrasi Pokok)"
          >
            <AppInput disabled className="bg-muted/50 cursor-not-allowed" />
          </FormField>

          <FormField
            control={form.control}
            name="jabatan"
            label="Jabatan"
          >
            <AppInput disabled className="bg-muted/50 cursor-not-allowed" />
          </FormField>

          <FormField
            control={form.control}
            name="unit_kerja"
            label="Unit Kerja"
          >
            <AppInput disabled className="bg-muted/50 cursor-not-allowed" />
          </FormField>

          <FormField
            control={form.control}
            name="email"
            label="Alamat Email"
            required
          >
            <AppInput placeholder="Masukkan email aktif" />
          </FormField>

          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="nama_lengkap"
              label="Nama Lengkap"
              required
            >
              <AppInput placeholder="Masukkan nama sesuai identitas" />
            </FormField>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <AppButton 
            type="submit" 
            variant="primary" 
            loading={isLoading}
            className="w-full md:w-auto"
          >
            Simpan Perubahan
          </AppButton>
        </div>
      </FormWrapper>
    </AppCard>
  )
}
