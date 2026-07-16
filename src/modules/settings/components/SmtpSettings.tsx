import React from 'react'
import { AppInput } from '@/components/primitives'

interface SmtpSettingsProps {
  formState: Record<string, { value: string; description: string }>
  onInputChange: (key: string, value: string) => void
}

export function SmtpSettings({ formState, onInputChange }: SmtpSettingsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold">Server SMTP untuk Notifikasi Email</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">
            SMTP Host
          </label>
          <AppInput
            value={formState['smtp_host']?.value || ''}
            onChange={(e) => onInputChange('smtp_host', e.target.value)}
            placeholder="smtp.example.com"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">
            SMTP Port
          </label>
          <AppInput
            value={formState['smtp_port']?.value || ''}
            onChange={(e) => onInputChange('smtp_port', e.target.value)}
            placeholder="587"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">
            SMTP Username
          </label>
          <AppInput
            value={formState['smtp_user']?.value || ''}
            onChange={(e) => onInputChange('smtp_user', e.target.value)}
            placeholder="user@example.com"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">
            SMTP Password
          </label>
          <AppInput
            type="password"
            value={formState['smtp_pass']?.value || ''}
            onChange={(e) => onInputChange('smtp_pass', e.target.value)}
            placeholder="••••••••"
          />
        </div>
      </div>
    </div>
  )
}
