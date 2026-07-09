'use client'

import React, { useState, useEffect } from 'react'
import { PageShell } from '@/components/patterns'
import { AppButton, AppInput, AppCard, AppCardContent } from '@/components/primitives'
import { gql, useQuery, useMutation } from '@apollo/client'
import { toast } from '@/lib/toast'
import { Save, Settings, Mail, Percent } from 'lucide-react'

const GET_SETTINGS = gql`
  query GetSettings {
    settings {
      id
      key
      value
      description
    }
  }
`

const UPDATE_SETTINGS = gql`
  mutation UpdateSettings($input: [SettingInput!]!) {
    updateSettings(input: $input) {
      id
      key
      value
    }
  }
`

export function SettingsModule() {
  const { data, loading, refetch } = useQuery(GET_SETTINGS)
  const [updateSettingsMutation, { loading: isSaving }] = useMutation(UPDATE_SETTINGS)
  const [activeTab, setActiveTab] = useState<'general' | 'depreciation' | 'smtp'>('general')

  const [formState, setFormState] = useState<Record<string, { value: string; description: string }>>({})

  useEffect(() => {
    if (data?.settings) {
      const state: Record<string, { value: string; description: string }> = {}
      data.settings.forEach((s: any) => {
        state[s.key] = { value: s.value, description: s.description || '' }
      })
      setFormState(state)
    }
  }, [data])

  const handleInputChange = (key: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [key]: { ...prev[key], value },
    }))
  }

  const handleSave = async () => {
    const input = Object.entries(formState).map(([key, val]) => ({
      key,
      value: val.value,
      description: val.description,
    }))

    try {
      await updateSettingsMutation({ variables: { input } })
      toast.success('Pengaturan berhasil diperbarui')
      refetch()
    } catch (err: any) {
      toast.error('Gagal memperbarui pengaturan', err.message)
    }
  }

  if (loading) {
    return (
      <PageShell title="Pengaturan Sistem" description="Konfigurasi variabel global, SMTP, dan penyusutan aset.">
        <div className="flex items-center justify-center h-64">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell title="Pengaturan Sistem" description="Konfigurasi variabel global, SMTP, dan penyusutan aset.">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'general'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <Settings className="h-4 w-4" />
            Umum & Instansi
          </button>
          <button
            onClick={() => setActiveTab('depreciation')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'depreciation'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <Percent className="h-4 w-4" />
            Penyusutan BMN
          </button>
          <button
            onClick={() => setActiveTab('smtp')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'smtp'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <Mail className="h-4 w-4" />
            Konfigurasi SMTP
          </button>
        </div>

        {/* Form Area */}
        <div className="lg:col-span-9 space-y-6">
          <AppCard>
            <AppCardContent className="p-6 space-y-6">
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold">Pengaturan Umum</h3>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">
                      Nama Aplikasi
                    </label>
                    <AppInput
                      value={formState['app_name']?.value || ''}
                      onChange={(e) => handleInputChange('app_name', e.target.value)}
                      placeholder="Masukkan nama aplikasi..."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">
                      Nama Instansi / Satker
                    </label>
                    <AppInput
                      value={formState['org_name']?.value || ''}
                      onChange={(e) => handleInputChange('org_name', e.target.value)}
                      placeholder="Masukkan nama instansi..."
                    />
                  </div>
                </div>
              )}

              {activeTab === 'depreciation' && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold">Metode & Parameter Penyusutan</h3>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">
                      Metode Penyusutan Default
                    </label>
                    <AppInput
                      value={formState['depreciation_method']?.value || ''}
                      onChange={(e) => handleInputChange('depreciation_method', e.target.value)}
                      placeholder="straight_line"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Metode penyusutan aset secara global. Nilai saat ini: straight_line (Garis Lurus).
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'smtp' && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold">Server SMTP untuk Notifikasi Email</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">
                        SMTP Host
                      </label>
                      <AppInput
                        value={formState['smtp_host']?.value || ''}
                        onChange={(e) => handleInputChange('smtp_host', e.target.value)}
                        placeholder="smtp.example.com"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">
                        SMTP Port
                      </label>
                      <AppInput
                        value={formState['smtp_port']?.value || ''}
                        onChange={(e) => handleInputChange('smtp_port', e.target.value)}
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
                        onChange={(e) => handleInputChange('smtp_user', e.target.value)}
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
                        onChange={(e) => handleInputChange('smtp_pass', e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-border">
                <AppButton onClick={handleSave} icon={Save} isLoading={isSaving}>
                  Simpan Perubahan
                </AppButton>
              </div>
            </AppCardContent>
          </AppCard>
        </div>
      </div>
    </PageShell>
  )
}
