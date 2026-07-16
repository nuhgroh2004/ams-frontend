import React from 'react'
import { AppInput } from '@/components/primitives'

interface DepreciationSettingsProps {
  formState: Record<string, { value: string; description: string }>
  onInputChange: (key: string, value: string) => void
}

export function DepreciationSettings({ formState, onInputChange }: DepreciationSettingsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold">Metode & Parameter Penyusutan</h3>
      <div>
        <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">
          Metode Penyusutan Default
        </label>
        <AppInput
          value={formState['depreciation_method']?.value || ''}
          onChange={(e) => onInputChange('depreciation_method', e.target.value)}
          placeholder="straight_line"
        />
        <p className="text-[11px] text-muted-foreground mt-1">
          Metode penyusutan aset secara global. Nilai saat ini: straight_line (Garis Lurus).
        </p>
      </div>
    </div>
  )
}
