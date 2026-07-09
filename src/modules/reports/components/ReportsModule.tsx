'use client'

import React, { useState } from 'react'
import { PageShell } from '@/components/patterns'
import { AppButton, AppCard, AppCardContent, AppInput, AppSelect } from '@/components/primitives'
import { gql, useQuery, useLazyQuery } from '@apollo/client'
import { toast } from '@/lib/toast'
import { Download, FileSpreadsheet, Layers, Settings, Wrench } from 'lucide-react'

const GET_FILTER_DATA = gql`
  query GetFilterData {
    units {
      id
      nama_unit
    }
    assetCategories {
      id
      nama_kategori
    }
  }
`

const GENERATE_ASSET_REPORT = gql`
  query GenerateAssetReport($filter: AssetReportFilterInput) {
    generateAssetReport(filter: $filter)
  }
`

const GENERATE_DEPRECIATION_REPORT = gql`
  query GenerateDepreciationReport($tahun: Int!) {
    generateDepreciationReport(tahun: $tahun)
  }
`

const GENERATE_MAINTENANCE_REPORT = gql`
  query GenerateMaintenanceReport($filter: MaintenanceReportFilterInput) {
    generateMaintenanceReport(filter: $filter)
  }
`

export function ReportsModule() {
  const { data: filterData } = useQuery(GET_FILTER_DATA)

  // Filters State for Asset Report
  const [selectedUnitId, setSelectedUnitId] = useState('all')
  const [selectedCategoryId, setSelectedCategoryId] = useState('all')
  const [selectedKondisi, setSelectedKondisi] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedKlasifikasi, setSelectedKlasifikasi] = useState('all')
  const [tahunPerolehan, setTahunPerolehan] = useState('')
  const [sumberDana, setSumberDana] = useState('')

  // Filters for Depreciation Report
  const [depreciationYear, setDepreciationYear] = useState(new Date().getFullYear().toString())

  // Lazy Queries for Export
  const [runAssetReport, { loading: loadingAsset }] = useLazyQuery(GENERATE_ASSET_REPORT)
  const [runDepreciationReport, { loading: loadingDepr }] = useLazyQuery(GENERATE_DEPRECIATION_REPORT)
  const [runMaintenanceReport, { loading: loadingMaint }] = useLazyQuery(GENERATE_MAINTENANCE_REPORT)

  const units = filterData?.units || []
  const categories = filterData?.assetCategories || []

  const getBackendUrl = () => {
    const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:8080/graphql'
    return endpoint.replace('/graphql', '')
  }

  const triggerDownload = (filePath: string) => {
    const link = document.createElement('a')
    link.href = `${getBackendUrl()}${filePath}`
    link.setAttribute('download', filePath.split('/').pop() || 'report.xlsx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportAsset = async () => {
    const filter: any = {}
    if (selectedUnitId !== 'all') filter.unit_id = selectedUnitId
    if (selectedCategoryId !== 'all') filter.kategori_id = selectedCategoryId
    if (selectedKondisi !== 'all') filter.kondisi = selectedKondisi
    if (selectedStatus !== 'all') filter.status_penggunaan = selectedStatus
    if (selectedKlasifikasi !== 'all') filter.klasifikasi = selectedKlasifikasi
    if (tahunPerolehan) filter.tahun_perolehan = parseInt(tahunPerolehan, 10)
    if (sumberDana) filter.sumber_dana = sumberDana

    try {
      const { data } = await runAssetReport({ variables: { filter } })
      if (data?.generateAssetReport) {
        toast.success('Laporan BMN berhasil disusun, memulai unduhan...')
        triggerDownload(data.generateAssetReport)
      }
    } catch (err: any) {
      toast.error('Gagal mengekspor laporan', err.message)
    }
  }

  const handleExportDepreciation = async () => {
    if (!depreciationYear) {
      toast.error('Tahun penyusutan wajib diisi')
      return
    }

    try {
      const { data } = await runDepreciationReport({
        variables: { tahun: parseInt(depreciationYear, 10) },
      })
      if (data?.generateDepreciationReport) {
        toast.success('Laporan Penyusutan berhasil disusun, memulai unduhan...')
        triggerDownload(data.generateDepreciationReport)
      }
    } catch (err: any) {
      toast.error('Gagal mengekspor laporan penyusutan', err.message)
    }
  }

  const handleExportMaintenance = async () => {
    try {
      const { data } = await runMaintenanceReport({ variables: { filter: {} } })
      if (data?.generateMaintenanceReport) {
        toast.success('Laporan Pemeliharaan berhasil disusun, memulai unduhan...')
        triggerDownload(data.generateMaintenanceReport)
      }
    } catch (err: any) {
      toast.error('Gagal mengekspor laporan pemeliharaan', err.message)
    }
  }

  return (
    <PageShell title="Pusat Laporan & Ekspor" description="Buat dan unduh laporan aset BMN, log pemeliharaan, serta kalkulasi penyusutan nilai buku.">
      <div className="space-y-8">
        {/* Asset Report Filter & Trigger */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Depreciation Report */}
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

          {/* Maintenance Report */}
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
        </div>
      </div>
    </PageShell>
  )
}
