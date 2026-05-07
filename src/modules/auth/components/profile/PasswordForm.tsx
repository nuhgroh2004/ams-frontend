'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ShieldCheck } from 'lucide-react'
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
 * PasswordForm Component
 * Mengelola pembaruan keamanan akun (Ganti Password).
 */

const passwordSchema = z.object({
  oldPassword: z.string().min(1, 'Password saat ini wajib diisi'),
  newPassword: z.string().min(8, 'Password baru minimal 8 karakter'),
  confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmPassword"],
})

type PasswordValues = z.infer<typeof passwordSchema>

interface PasswordFormProps {
  isLoading?: boolean
  onUpdate: (data: PasswordValues) => void
}

export function PasswordForm({ isLoading, onUpdate }: PasswordFormProps) {
  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  return (
    <AppCard className="overflow-hidden h-full">
      <div className="p-6 border-b border-border bg-muted/30">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center border-2 border-destructive/20">
            <ShieldCheck className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Keamanan Akun</h2>
            <p className="text-sm text-muted-foreground">Perbarui kata sandi untuk keamanan data Anda.</p>
          </div>
        </div>
      </div>

      <FormWrapper 
        form={form} 
        onSubmit={onUpdate} 
        className="p-6 space-y-6"
        isLoading={isLoading}
      >
        <FormField
          control={form.control}
          name="oldPassword"
          label="Kata Sandi Saat Ini"
          required
        >
          <AppInput type="password" placeholder="••••••••" />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="newPassword"
            label="Kata Sandi Baru"
            required
          >
            <AppInput type="password" placeholder="••••••••" />
          </FormField>

          <FormField
            control={form.control}
            name="confirmPassword"
            label="Konfirmasi Kata Sandi Baru"
            required
          >
            <AppInput type="password" placeholder="••••••••" />
          </FormField>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <AppButton 
            type="submit" 
            variant="danger" 
            loading={isLoading}
            className="w-full"
          >
            Update Password
          </AppButton>
        </div>
      </FormWrapper>
    </AppCard>
  )
}
