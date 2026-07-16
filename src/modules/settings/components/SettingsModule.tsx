'use client'

import React, { useState } from 'react'
import { PageShell } from '@/components/patterns'
import { AppButton, AppCard, AppCardContent } from '@/components/primitives'
import { Save, Settings, Mail, Percent } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { GeneralSettings } from './GeneralSettings'
import { DepreciationSettings } from './DepreciationSettings'
import { SmtpSettings } from './SmtpSettings'

export function SettingsModule() {
  const { formState, loading, isSaving, handleInputChange, handleSave } = useSettings()
  const [activeTab, setActiveTab] = useState<'general' | 'depreciation' | 'smtp'>('general')

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
                <GeneralSettings formState={formState} onInputChange={handleInputChange} />
              )}

              {activeTab === 'depreciation' && (
                <DepreciationSettings formState={formState} onInputChange={handleInputChange} />
              )}

              {activeTab === 'smtp' && (
                <SmtpSettings formState={formState} onInputChange={handleInputChange} />
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
