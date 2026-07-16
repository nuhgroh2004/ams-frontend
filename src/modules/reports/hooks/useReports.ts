import { useQuery, useLazyQuery } from '@apollo/client'
import { useState } from 'react'
import { toast } from '@/lib/toast'
import {
  GET_FILTER_DATA,
  GENERATE_ASSET_REPORT,
  GENERATE_DEPRECIATION_REPORT,
  GENERATE_MAINTENANCE_REPORT,
} from '../services'

export function useReports() {
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

  return {
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
  }
}
