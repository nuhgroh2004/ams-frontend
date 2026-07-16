import React from 'react'
import { AppCard, AppCardContent, AppButton } from '@/components/primitives'
import { Wrench, Download } from 'lucide-react'

interface MaintenanceReportCardProps {
  handleExportMaintenance: () => void
  loadingMaint: boolean
}

export function MaintenanceReportCard({
  handleExportMaintenance,
  loadingMaint,
}: MaintenanceReportCardProps) {
  return (
    <AppCard>
      <AppCardContent className="p-6 space-y-6 flex flex-col justify-between h-full">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Wrench className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold">3. Laporan Pemeliharaan Aset</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ekspor seluruh log pengajuan, progres, realisasi biaya perbaikan, serta kondisi akhir aset pasca perawatan.
          </p>
        </div>
        <div className="flex justify-end pt-6 border-t border-border mt-6">
          <AppButton icon={Download} variant="primary" onClick={handleExportMaintenance} isLoading={loadingMaint}>
            Ekspor Pemeliharaan (Excel)
          </AppButton>
        </div>
      </AppCardContent>
    </AppCard>
  )
}
