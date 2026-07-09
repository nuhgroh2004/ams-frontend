'use client'

import React, { useState } from 'react'
import { PageShell, DataTable } from '@/components/patterns'
import { AppButton, AppCard, AppCardContent, AppModal, AppInput, AppSelect, AppTextarea } from '@/components/primitives'
import { gql, useQuery, useMutation } from '@apollo/client'
import { toast } from '@/lib/toast'
import { Plus, Play, Check, AlertCircle } from 'lucide-react'
import dayjs from 'dayjs'

const GET_MAINTENANCE_RECORDS = gql`
  query GetMaintenanceRecords($status: MaintenanceStatus, $page: Int, $limit: Int) {
    maintenanceRecords(status: $status, page: $page, limit: $limit) {
      total
      page
      limit
      totalPages
      data {
        id
        asset_id
        jenis_perawatan
        deskripsi
        estimasi_biaya
        biaya_real
        tanggal_mulai
        tanggal_selesai
        kondisi_setelah
        status
        asset {
          id
          nama_barang
          nomor_register
        }
      }
    }
  }
`

const GET_ASSETS_SIMPLE = gql`
  query GetAssetsSimple {
    assets(limit: 100) {
      data {
        id
        nama_barang
        nomor_register
      }
    }
  }
`

const CREATE_MAINTENANCE = gql`
  mutation CreateMaintenance($input: CreateMaintenanceInput!) {
    createMaintenance(input: $input) {
      id
      status
    }
  }
`

const START_MAINTENANCE = gql`
  mutation StartMaintenance($id: ID!) {
    startMaintenance(id: $id) {
      id
      status
    }
  }
`

const FINISH_MAINTENANCE = gql`
  mutation FinishMaintenance($id: ID!, $biaya_real: Float!, $kondisi_setelah: MaintenanceCondition!, $tanggal_selesai: String!) {
    finishMaintenance(id: $id, biaya_real: $biaya_real, kondisi_setelah: $kondisi_setelah, tanggal_selesai: $tanggal_selesai) {
      id
      status
    }
  }
`

export function MaintenanceModule() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')
  const limit = 10

  const variables: any = { page, limit }
  if (statusFilter !== 'all') variables.status = statusFilter

  const { data, loading, refetch } = useQuery(GET_MAINTENANCE_RECORDS, { variables })
  const { data: assetData } = useQuery(GET_ASSETS_SIMPLE)

  const [createMaintenanceMutation] = useMutation(CREATE_MAINTENANCE)
  const [startMaintenanceMutation] = useMutation(START_MAINTENANCE)
  const [finishMaintenanceMutation] = useMutation(FINISH_MAINTENANCE)

  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [isFinishOpen, setIsFinishOpen] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)

  // Submit Form States
  const [selectedAssetId, setSelectedAssetId] = useState('')
  const [jenisPerawatan, setJenisPerawatan] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [estimasiBiaya, setEstimasiBiaya] = useState('')

  // Finish Form States
  const [biayaReal, setBiayaReal] = useState('')
  const [kondisiSetelah, setKondisiSetelah] = useState('baik')

  const records = data?.maintenanceRecords?.data || []
  const totalPages = data?.maintenanceRecords?.totalPages || 0
  const assets = assetData?.assets?.data || []

  const handleSubmitMaintenance = async () => {
    if (!selectedAssetId || !jenisPerawatan) {
      toast.error('Aset dan Jenis Perawatan wajib diisi')
      return
    }

    try {
      await createMaintenanceMutation({
        variables: {
          input: {
            asset_id: selectedAssetId,
            jenis_perawatan: jenisPerawatan,
            deskripsi,
            estimasi_biaya: parseFloat(estimasiBiaya) || 0,
            tanggal_mulai: dayjs().format('YYYY-MM-DD'),
          },
        },
      })
      toast.success('Pengajuan perawatan berhasil dibuat')
      setIsSubmitOpen(false)
      refetch()
      // reset
      setSelectedAssetId('')
      setJenisPerawatan('')
      setDeskripsi('')
      setEstimasiBiaya('')
    } catch (err: any) {
      toast.error('Gagal mengajukan perawatan', err.message)
    }
  }

  const handleStartMaintenance = async (id: string) => {
    try {
      await startMaintenanceMutation({ variables: { id } })
      toast.success('Proses perbaikan dimulai')
      refetch()
    } catch (err: any) {
      toast.error('Gagal memulai perbaikan', err.message)
    }
  }

  const handleFinishClick = (id: string) => {
    setSelectedRecordId(id)
    setIsFinishOpen(true)
    setBiayaReal('')
    setKondisiSetelah('baik')
  }

  const handleFinishConfirm = async () => {
    if (!selectedRecordId || !biayaReal) {
      toast.error('Biaya riil wajib diisi')
      return
    }

    try {
      await finishMaintenanceMutation({
        variables: {
          id: selectedRecordId,
          biaya_real: parseFloat(biayaReal) || 0,
          kondisi_setelah: kondisiSetelah,
          tanggal_selesai: dayjs().format('YYYY-MM-DD'),
        },
      })
      toast.success('Perawatan diselesaikan, status aset kembali aktif')
      setIsFinishOpen(false)
      refetch()
    } catch (err: any) {
      toast.error('Gagal menyelesaikan perawatan', err.message)
    }
  }

  const columns = [
    {
      accessorKey: 'asset.nama_barang',
      header: 'Nama Aset',
      cell: ({ row }: any) => (
        <div>
          <p className="font-semibold text-sm">{row.original.asset.nama_barang}</p>
          <p className="text-xs text-muted-foreground">{row.original.asset.nomor_register || '-'}</p>
        </div>
      ),
    },
    {
      accessorKey: 'jenis_perawatan',
      header: 'Jenis Perawatan',
    },
    {
      accessorKey: 'tanggal_mulai',
      header: 'Tanggal Mulai',
      cell: ({ row }: any) => row.original.tanggal_mulai || '-',
    },
    {
      accessorKey: 'estimasi_biaya',
      header: 'Estimasi Biaya',
      cell: ({ row }: any) => row.original.estimasi_biaya ? `Rp ${parseFloat(row.original.estimasi_biaya).toLocaleString()}` : '-',
    },
    {
      accessorKey: 'biaya_real',
      header: 'Biaya Riil',
      cell: ({ row }: any) => row.original.biaya_real ? `Rp ${parseFloat(row.original.biaya_real).toLocaleString()}` : '-',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const colors: Record<string, string> = {
          pengajuan: 'bg-yellow-500/10 text-yellow-500',
          proses: 'bg-blue-500/10 text-blue-500',
          selesai: 'bg-green-500/10 text-green-500',
          batal: 'bg-red-500/10 text-red-500',
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${colors[row.original.status] || ''}`}>
            {row.original.status}
          </span>
        )
      },
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }: any) => {
        if (row.original.status === 'pengajuan') {
          return (
            <AppButton size="sm" icon={Play} onClick={() => handleStartMaintenance(row.original.id)}>
              Mulai
            </AppButton>
          )
        }
        if (row.original.status === 'proses') {
          return (
            <AppButton size="sm" icon={Check} variant="primary" onClick={() => handleFinishClick(row.original.id)}>
              Selesai
            </AppButton>
          )
        }
        return '-'
      },
    },
  ]

  return (
    <PageShell title="Perawatan Aset" description="Jadwalkan dan catat riwayat pemeliharaan serta perbaikan aset.">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-end bg-card p-4 rounded-2xl border border-border">
          <div className="w-full md:w-64">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-1.5 block">
              Filter Status
            </label>
            <AppSelect
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={[
                { value: 'all', label: 'Semua Status' },
                { value: 'pengajuan', label: 'Pengajuan' },
                { value: 'proses', label: 'Dalam Proses' },
                { value: 'selesai', label: 'Selesai' },
                { value: 'batal', label: 'Batal' },
              ]}
            />
          </div>
          <AppButton icon={Plus} onClick={() => setIsSubmitOpen(true)}>
            Ajukan Perawatan
          </AppButton>
        </div>

        <DataTable
          columns={columns}
          data={records}
          isLoading={loading}
          manualPagination
          pageCount={totalPages}
          pageIndex={page - 1}
          onPaginationChange={(state) => setPage(state.pageIndex + 1)}
        />
      </div>

      {/* Modal Ajukan Perawatan */}
      {isSubmitOpen && (
        <AppModal isOpen={isSubmitOpen} onClose={() => setIsSubmitOpen(false)} title="Ajukan Perawatan Baru">
          <div className="space-y-4 pt-3">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Pilih Aset</label>
              <AppSelect
                value={selectedAssetId}
                onValueChange={setSelectedAssetId}
                options={[
                  { value: '', label: 'Pilih aset yang ingin dirawat...' },
                  ...assets.map((a: any) => ({
                    value: a.id,
                    label: `${a.nama_barang} (${a.nomor_register || '-'})`,
                  })),
                ]}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Jenis Perawatan</label>
              <AppInput
                placeholder="Misal: Ganti Oli, Perbaikan Layar LCD, Service AC..."
                value={jenisPerawatan}
                onChange={(e) => setJenisPerawatan(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Estimasi Biaya (Rp)</label>
              <AppInput
                type="number"
                placeholder="150000"
                value={estimasiBiaya}
                onChange={(e) => setEstimasiBiaya(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Deskripsi / Keluhan</label>
              <AppTextarea
                placeholder="Jelaskan detail keluhan atau alasan perawatan dilakukan..."
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <AppButton variant="outline" onClick={() => setIsSubmitOpen(false)}>
                Batal
              </AppButton>
              <AppButton onClick={handleSubmitMaintenance}>Kirim Pengajuan</AppButton>
            </div>
          </div>
        </AppModal>
      )}

      {/* Modal Selesaikan Perawatan */}
      {isFinishOpen && (
        <AppModal isOpen={isFinishOpen} onClose={() => setIsFinishOpen(false)} title="Selesaikan Perawatan">
          <div className="space-y-4 pt-3">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Biaya Riil (Rp)</label>
              <AppInput
                type="number"
                placeholder="Masukkan biaya aktual yang dikeluarkan..."
                value={biayaReal}
                onChange={(e) => setBiayaReal(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Kondisi Aset Pasca Perbaikan</label>
              <AppSelect
                value={kondisiSetelah}
                onValueChange={setKondisiSetelah}
                options={[
                  { value: 'baik', label: 'Baik' },
                  { value: 'rusak_ringan', label: 'Rusak Ringan' },
                  { value: 'rusak_berat', label: 'Rusak Berat' },
                ]}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <AppButton variant="outline" onClick={() => setIsFinishOpen(false)}>
                Batal
              </AppButton>
              <AppButton onClick={handleFinishConfirm}>Konfirmasi Selesai</AppButton>
            </div>
          </div>
        </AppModal>
      )}
    </PageShell>
  )
}
