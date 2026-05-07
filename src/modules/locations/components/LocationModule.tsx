'use client'

import React from 'react'
import { PageShell } from '@/components/patterns'
import { LocationList } from './LocationList'

export function LocationModule() {
  return (
    <PageShell
      title="Manajemen Lokasi"
      description="Atur gedung, ruangan, dan area penyimpanan aset."
    >
      <LocationList />
    </PageShell>
  )
}
