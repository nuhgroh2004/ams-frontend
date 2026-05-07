'use client'

import * as React from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  ME_QUERY,
  UPDATE_USER_MUTATION,
  CHANGE_PASSWORD_MUTATION
} from '../../../users/services/user.graphql'
import { toast } from '@/lib/toast'
import { ProfileForm } from './ProfileForm'
import { PasswordForm } from './PasswordForm'
import { AppBadge } from '@/components/primitives'
import { PageShell } from '@/components/patterns'
import { AlertCircle } from 'lucide-react'

/**
 * ProfileModule
 * Logical container for User Profile and Security settings.
 */
export function ProfileModule() {
  // Query data user saat ini
  const { data, loading: queryLoading, refetch } = useQuery(ME_QUERY)

  // Mutation: Update Profil
  const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: () => {
      refetch()
      toast.success('Profil diperbarui', 'Informasi akun Anda telah berhasil disimpan.')
    },
    onError: (error) => {
      toast.graphqlError(error, 'Gagal memperbarui profil')
    }
  })

  // Mutation: Ganti Password
  const [changePassword, { loading: passwordLoading }] = useMutation(CHANGE_PASSWORD_MUTATION, {
    onCompleted: () => {
      toast.success('Password diperbarui', 'Kata sandi akun Anda telah berhasil diganti.')
    },
    onError: (error) => {
      toast.graphqlError(error, 'Gagal mengganti password')
    }
  })

  const user = data?.me

  if (queryLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <PageShell
      title="Pengaturan Akun"
      description="Kelola informasi profil dan keamanan akun Anda di sini."
    >
      <div className="max-w-4xl space-y-10">
        {/* Status Badges */}
        <div className="flex items-center gap-2">
          <AppBadge variant={user?.is_active ? 'success' : 'neutral'} badgeStyle="dot">
            {user?.is_active ? 'Akun Aktif' : 'Akun Non-aktif'}
          </AppBadge>
          <AppBadge variant="info" badgeStyle="solid">
            {user?.roles?.[0]?.nama_role || 'User'}
          </AppBadge>
        </div>

        {/* Vertical Stack Content */}
        <div className="space-y-10">
          {/* SECTION 1: Profile Info */}
          <section className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground">Informasi Profil</h2>
              <p className="text-sm text-muted-foreground">Perbarui data diri dan informasi kontak Anda.</p>
            </div>

            <ProfileForm
              isLoading={updateLoading}
              initialData={{
                nama_lengkap: user?.nama_lengkap,
                email: user?.email,
                nrp: user?.nrp,
                jabatan: user?.jabatan,
                unit_kerja: user?.unit?.nama_unit,
              }}
              onSave={(formData) => {
                updateUser({
                  variables: {
                    id: user?.id,
                    input: {
                      nama_lengkap: formData.nama_lengkap,
                      email: formData.email
                    }
                  }
                })
              }}
            />
          </section>

          <hr className="border-border" />

          {/* SECTION 2: Security & Password */}
          <section className="space-y-4 pb-10">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground">Keamanan & Password</h2>
              <p className="text-sm text-muted-foreground">Pastikan akun Anda menggunakan kata sandi yang kuat dan aman.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-2/3">
                <PasswordForm
                  isLoading={passwordLoading}
                  onUpdate={(formData) => {
                    changePassword({
                      variables: {
                        oldPassword: formData.oldPassword,
                        newPassword: formData.newPassword
                      }
                    })
                  }}
                />
              </div>

              <div className="w-full md:w-1/3 p-5 rounded-xl border border-warning/20 bg-warning/5 space-y-3">
                <div className="flex items-center gap-2 text-warning font-semibold">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">Tips Keamanan</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-2.5 list-disc pl-4 leading-relaxed">
                  <li>Gunakan minimal 8 karakter dengan kombinasi huruf, angka, dan simbol khusus.</li>
                  <li>Jangan gunakan informasi pribadi (tanggal lahir, nama) sebagai sandi.</li>
                  <li>Ganti password secara berkala setiap 3-6 bulan sekali.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  )
}
