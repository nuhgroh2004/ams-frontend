import React from 'react'
import { AppInput } from '@/components/primitives'

interface GeneralSettingsProps {
  formState: Record<string, { value: string; description: string }>
  onInputChange: (key: string, value: string) => void
}

export function GeneralSettings({ formState, onInputChange }: GeneralSettingsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold">Pengaturan Umum</h3>
      <div>
        <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">
          Nama Aplikasi
        </label>
        <AppInput
          value={formState['app_name']?.value || ''}
          onChange={(e) => onInputChange('app_name', e.target.value)}
          placeholder="Masukkan nama aplikasi..."
        />
      </div>
      <div>
        <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">
          Nama Instansi / Satker
        </label>
        <AppInput
          value={formState['org_name']?.value || ''}
          onChange={(e) => onInputChange('org_name', e.target.value)}
          placeholder="Masukkan nama instansi..."
        />
      </div>
    </div>
  )
}
