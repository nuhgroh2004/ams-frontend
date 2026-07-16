import React from 'react'
import { AppCard, AppCardContent, AppInput, AppButton } from '@/components/primitives'
import { Layers, Download } from 'lucide-react'

interface DepreciationReportCardProps {
  depreciationYear: string
  setDepreciationYear: (v: string) => void
  handleExportDepreciation: () => void
  loadingDepr: boolean
}

export function DepreciationReportCard({
  depreciationYear,
  setDepreciationYear,
  handleExportDepreciation,
  loadingDepr,
}: DepreciationReportCardProps) {
  return (
    <AppCard>
      <AppCardContent className="p-6 space-y-6 flex flex-col justify-between h-full">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Layers className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold">2. Laporan Penyusutan (Depresiasi)</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ekspor kalkulasi nilai penyusutan tahunan BMN berdasarkan taksiran masa manfaat kategori barang.
          </p>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Pilih Tahun Laporan</label>
            <AppInput
              type="number"
              value={depreciationYear}
              onChange={(e) => setDepreciationYear(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end pt-6 border-t border-border mt-6">
          <AppButton icon={Download} variant="primary" onClick={handleExportDepreciation} isLoading={loadingDepr}>
            Ekspor Penyusutan (Excel)
          </AppButton>
        </div>
      </AppCardContent>
    </AppCard>
  )
}
