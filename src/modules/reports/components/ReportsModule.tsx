'use client'

import React from 'react'
import { PageShell } from '@/components/patterns'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { hasPermissionForUser } from '@/lib/permissions'
import { useReports } from '../hooks/useReports'
import { AssetReportCard } from './AssetReportCard'
import { DepreciationReportCard } from './DepreciationReportCard'
import { MaintenanceReportCard } from './MaintenanceReportCard'

export function ReportsModule() {
  const currentUser = useAuthStore((state) => state.user)
  const canExportDepreciation = hasPermissionForUser(currentUser, 'report:depreciation')

  const {
    units,
    categories,
    selectedUnitId,
    setSelectedUnitId,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedKondisi,
    setSelectedKondisi,
    selectedStatus,
    setSelectedStatus,
    selectedKlasifikasi,
    setSelectedKlasifikasi,
    tahunPerolehan,
    setTahunPerolehan,
    sumberDana,
    setSumberDana,
    depreciationYear,
    setDepreciationYear,
    loadingAsset,
    loadingDepr,
    loadingMaint,
    handleExportAsset,
    handleExportDepreciation,
    handleExportMaintenance,
  } = useReports()

  return (
    <PageShell title="Pusat Laporan & Ekspor" description="Buat dan unduh laporan aset BMN, log pemeliharaan, serta kalkulasi penyusutan nilai buku.">
      <div className="space-y-8">
        <AssetReportCard
          units={units}
          categories={categories}
          selectedUnitId={selectedUnitId}
          setSelectedUnitId={setSelectedUnitId}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          selectedKondisi={selectedKondisi}
          setSelectedKondisi={setSelectedKondisi}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedKlasifikasi={selectedKlasifikasi}
          setSelectedKlasifikasi={setSelectedKlasifikasi}
          tahunPerolehan={tahunPerolehan}
          setTahunPerolehan={setTahunPerolehan}
          sumberDana={sumberDana}
          setSumberDana={setSumberDana}
          handleExportAsset={handleExportAsset}
          loadingAsset={loadingAsset}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {canExportDepreciation && (
            <DepreciationReportCard
              depreciationYear={depreciationYear}
              setDepreciationYear={setDepreciationYear}
              handleExportDepreciation={handleExportDepreciation}
              loadingDepr={loadingDepr}
            />
          )}

          <MaintenanceReportCard
            handleExportMaintenance={handleExportMaintenance}
            loadingMaint={loadingMaint}
          />
        </div>
      </div>
    </PageShell>
  )
}
