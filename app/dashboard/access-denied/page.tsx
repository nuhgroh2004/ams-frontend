'use client'

import React from 'react'
import { PageShell } from '@/components/patterns'
import { AppCard, AppCardContent, AppButton } from '@/components/primitives'
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

export default function AccessDeniedPage() {
  return (
    <PageShell 
      title="Akses Ditolak" 
      description="Halaman yang Anda coba akses memerlukan tingkat otorisasi yang lebih tinggi."
    >
      <div className="flex items-center justify-center py-12">
        <AppCard className="max-w-md w-full border-danger/25 bg-gradient-to-br from-card to-danger/5 shadow-lg shadow-danger/5">
          <AppCardContent className="p-8 text-center space-y-6">
            <div className="h-16 w-16 mx-auto bg-danger/10 border border-danger/20 rounded-2xl flex items-center justify-center">
              <ShieldAlert className="h-8 w-8 text-danger" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-foreground">Otorisasi Terbatas</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Maaf, peran akun Anda tidak memiliki izin untuk melihat modul atau data di halaman ini. Silakan hubungi Administrator Sistem BMN jika Anda merasa ini adalah kesalahan.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/dashboard" className="flex-1">
                <AppButton fullWidth icon={Home} variant="outline">
                  Dashboard
                </AppButton>
              </Link>
              <button onClick={() => window.history.back()} className="flex-1">
                <AppButton fullWidth icon={ArrowLeft} variant="primary">
                  Kembali
                </AppButton>
              </button>
            </div>
          </AppCardContent>
        </AppCard>
      </div>
    </PageShell>
  )
}
