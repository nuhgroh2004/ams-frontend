import React from 'react'
import { AppCard, AppCardContent, AppSelect, AppInput, AppButton } from '@/components/primitives'
import { FileSpreadsheet, Download } from 'lucide-react'

interface AssetReportCardProps {
  units: any[]
  categories: any[]
  selectedUnitId: string
  setSelectedUnitId: (v: string) => void
  selectedCategoryId: string
  setSelectedCategoryId: (v: string) => void
  selectedKondisi: string
  setSelectedKondisi: (v: string) => void
  selectedStatus: string
  setSelectedStatus: (v: string) => void
  selectedKlasifikasi: string
  setSelectedKlasifikasi: (v: string) => void
  tahunPerolehan: string
  setTahunPerolehan: (v: string) => void
  sumberDana: string
  setSumberDana: (v: string) => void
  handleExportAsset: () => void
  loadingAsset: boolean
}

export function AssetReportCard({
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
  handleExportAsset,
  loadingAsset,
}: AssetReportCardProps) {
  return (
    <AppCard>
      <AppCardContent className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">1. Laporan Kartu Inventaris Barang (KIB)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Unit Kerja</label>
            <AppSelect
              value={selectedUnitId}
              onValueChange={setSelectedUnitId}
              options={[
                { value: 'all', label: 'Semua Unit Kerja' },
                ...units.map((u: any) => ({ value: u.id, label: u.nama_unit })),
              ]}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Kategori</label>
            <AppSelect
              value={selectedCategoryId}
              onValueChange={setSelectedCategoryId}
              options={[
                { value: 'all', label: 'Semua Kategori' },
                ...categories.map((c: any) => ({ value: c.id, label: c.nama_kategori })),
              ]}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Kondisi</label>
            <AppSelect
              value={selectedKondisi}
              onValueChange={setSelectedKondisi}
              options={[
                { value: 'all', label: 'Semua Kondisi' },
                { value: 'baik', label: 'Baik' },
                { value: 'rusak_ringan', label: 'Rusak Ringan' },
                { value: 'rusak_berat', label: 'Rusak Berat' },
              ]}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Status Penggunaan</label>
            <AppSelect
              value={selectedStatus}
              onValueChange={setSelectedStatus}
              options={[
                { value: 'all', label: 'Semua Status' },
                { value: 'aktif', label: 'Aktif' },
                { value: 'dipinjam', label: 'Dipinjam' },
                { value: 'maintenance', label: 'Perawatan' },
                { value: 'dihapus', label: 'Dihapus' },
                { value: 'hilang', label: 'Hilang' },
              ]}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Klasifikasi</label>
            <AppSelect
              value={selectedKlasifikasi}
              onValueChange={setSelectedKlasifikasi}
              options={[
                { value: 'all', label: 'Semua Klasifikasi' },
                { value: 'intrakomptabel', label: 'Intrakomptabel' },
                { value: 'ekstrakomptabel', label: 'Ekstrakomptabel' },
              ]}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Tahun Perolehan</label>
            <AppInput
              type="number"
              placeholder="2026"
              value={tahunPerolehan}
              onChange={(e) => setTahunPerolehan(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Sumber Dana</label>
            <AppInput
              placeholder="APBN, Hibah, dll."
              value={sumberDana}
              onChange={(e) => setSumberDana(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <AppButton icon={Download} onClick={handleExportAsset} isLoading={loadingAsset}>
            Ekspor Laporan KIB (Excel)
          </AppButton>
        </div>
      </AppCardContent>
    </AppCard>
  )
}
