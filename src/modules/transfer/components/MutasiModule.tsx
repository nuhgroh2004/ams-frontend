'use client'

import React, { useState } from 'react'
import { PageShell } from '@/components/patterns'
import {
  AppCard,
  AppCardContent,
  AppButton,
  AppBadge,
  AppModal,
  AppInput,
  AppTextarea,
  AppSelect
} from '@/components/primitives'
import { DataTable } from '@/components/patterns/tables/DataTable'
import { useMutasiHistory } from '../hooks/useMutasiHistory'
import {
  useAjukanMutasi,
  useSetujuiMutasi,
  useTolakMutasi,
  useSelesaikanMutasi,
  useGenerateBAST
} from '../hooks/useMutasiMutations'
import { GET_TRANSFER_ASSETS } from '../services/mutasi.query'
import { useLocations } from '@/modules/locations/hooks/useLocations'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { hasPermissionForUser } from '@/lib/permissions'
import { useQuery } from '@apollo/client'
import { GET_USERS_QUERY, GET_UNITS_QUERY } from '@/modules/users/services/user.graphql'
import {
  Plus,
  Eye,
  Check,
  X as XIcon,
  FileText,
  Calendar,
  User as UserIcon,
  Building2,
  MapPin,
  FileDown,
  UploadCloud,
  ArrowRight,
  AlertCircle
} from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { AssetMutasi, MutasiFilterInput, MutasiStatus, MutasiJenis } from '../types'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ajukanMutasiSchema, AjukanMutasiFormInput } from '../schemas'
import dayjs from 'dayjs'

const STATUS_LABELS: Record<MutasiStatus, string> = {
  menunggu_approval: 'Menunggu Approval',
  disetujui: 'Disetujui (Menunggu BAST)',
  ditolak: 'Ditolak',
  selesai: 'Selesai'
}

const STATUS_VARIANTS: Record<MutasiStatus, 'neutral' | 'info' | 'success' | 'danger' | 'warning'> = {
  menunggu_approval: 'warning',
  disetujui: 'info',
  ditolak: 'danger',
  selesai: 'success'
}

const JENIS_LABELS: Record<MutasiJenis, string> = {
  ruangan: 'Mutasi Ruangan/Lokasi',
  unit_kerja: 'Mutasi Unit Kerja',
  penanggung_jawab: 'Pergantian PJ'
}

export function MutasiModule() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string>('')

  // Build filter from state
  const buildFilter = (): MutasiFilterInput => {
    const filter: MutasiFilterInput = {}
    if (statusFilter) {
      filter.status = statusFilter as MutasiStatus
    }
    return filter
  }

  // Data Queries
  const { mutasis, loading, error, refetch, total, totalPages } = useMutasiHistory({
    page,
    limit,
    filter: buildFilter()
  })

  const { data: transferAssetsData, loading: loadingAssets } = useQuery<{ transferAssets: any[] }>(
    GET_TRANSFER_ASSETS,
    { fetchPolicy: 'network-only' }
  )
  const assets = transferAssetsData?.transferAssets || []
  const { locations, loading: loadingLocations } = useLocations(1, 100)
  const { data: usersData, loading: loadingUsers } = useQuery(GET_USERS_QUERY, {
    variables: { page: 1, limit: 200, isActive: true }
  })
  const { data: unitsData, loading: loadingUnits } = useQuery(GET_UNITS_QUERY)

  // Mutations
  const { ajukan, loading: submittingAjukan } = useAjukanMutasi()
  const { setujui, loading: submittingSetujui } = useSetujuiMutasi()
  const { tolak, loading: submittingTolak } = useTolakMutasi()
  const { selesaikan, loading: submittingSelesaikan } = useSelesaikanMutasi()
  const { generate: generateBAST, loading: generatingBAST } = useGenerateBAST()

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedMutasi, setSelectedMutasi] = useState<AssetMutasi | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'complete' | null>(null)
  const [actionNotes, setActionNotes] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Create Form Hook

  const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm<AjukanMutasiFormInput>({
    resolver: zodResolver(ajukanMutasiSchema),
    defaultValues: {
      asset_id: '',
      jenis_mutasi: 'ruangan',
      alasan_mutasi: ''
    }
  })

  const selectedJenis = watch('jenis_mutasi')

  const currentUser = useAuthStore((state) => state.user)

  // Granular permission flags
  const canCreate   = hasPermissionForUser(currentUser, 'transfer:create')
  const canApprove  = hasPermissionForUser(currentUser, 'transfer:approve')
  const canDownload = hasPermissionForUser(currentUser, 'transfer:bast')

  const handleCreateClose = () => {
    setIsCreateOpen(false)
    reset()
  }

  const onCreateSubmit = async (data: AjukanMutasiFormInput) => {
    try {
      await ajukan({
        asset_id: data.asset_id,
        jenis_mutasi: data.jenis_mutasi,
        lokasi_tujuan_id: data.jenis_mutasi === 'ruangan' ? data.lokasi_tujuan_id : undefined,
        unit_tujuan_id: data.jenis_mutasi === 'unit_kerja' ? data.unit_tujuan_id : undefined,
        pj_tujuan_id: data.jenis_mutasi === 'penanggung_jawab' ? data.pj_tujuan_id : undefined,
        alasan_mutasi: data.alasan_mutasi
      })
      handleCreateClose()
      refetch()
    } catch {
      // error handled by hook
    }
  }

  const handleActionSubmit = async () => {
    if (!selectedMutasi) return
    try {
      if (actionType === 'approve') {
        await setujui(selectedMutasi.id, actionNotes || undefined)
      } else if (actionType === 'reject') {
        await tolak(selectedMutasi.id, actionNotes)
      } else if (actionType === 'complete') {
        if (!selectedFile) return
        await selesaikan(selectedMutasi.id, selectedFile)
      }

      setActionType(null)
      setActionNotes('')
      setSelectedFile(null)
      setSelectedMutasi(null)
      refetch()
    } catch {
      // error handled by hook
    }
  }

  const handleDownloadBAST = async (id: string) => {
    try {
      const path = await generateBAST(id)
      if (path) {
        // Open download link in new tab or trigger directly
        window.open(`http://localhost:8080${path}`, '_blank')
      }
    } catch {
      // error handled by hook
    }
  }

  // --- Select Options ---

  const assetOptions = assets.map((a) => ({
    value: a.id,
    label: `${a.nama_barang} (Reg: ${a.nomor_register || '-'})`
  }))

  const locationOptions = locations.map((l: any) => ({
    value: l.id,
    label: `${l.nama_gedung}${l.lantai ? `, Lt ${l.lantai}` : ''}${l.ruangan ? `, Ruang ${l.ruangan}` : ''}`
  }))

  const userOptions = (usersData?.users?.data || []).map((u: any) => ({
    value: u.id,
    label: `${u.nama_lengkap} (NRP: ${u.nrp || '-'})`
  }))

  const unitOptions = (unitsData?.units || []).map((u: any) => ({
    value: u.id,
    label: `${u.nama_unit} (${u.kode_unit || '-'})`
  }))

  // --- Filter tabs ---

  const statusTabs = [
    { value: '', label: 'Semua Status' },
    { value: 'menunggu_approval', label: 'Menunggu Approval' },
    { value: 'disetujui', label: 'Disetujui' },
    { value: 'ditolak', label: 'Ditolak' },
    { value: 'selesai', label: 'Selesai' }
  ]

  // --- Columns Setup ---

  const columns: ColumnDef<AssetMutasi, any>[] = [
    {
      id: 'asset',
      header: 'Aset / Barang',
      cell: ({ row }) => {
        const asset = row.original.asset
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-foreground">
              {asset?.nama_barang || 'Aset Tidak Dikenal'}
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              Reg: {asset?.nomor_register || '-'} | Kode: {asset?.kode_barang || '-'}
            </span>
          </div>
        )
      }
    },
    {
      id: 'jenis_mutasi',
      header: 'Jenis Mutasi',
      cell: ({ row }) => {
        const val = row.original.jenis_mutasi
        return (
          <AppBadge variant={val === 'ruangan' ? 'info' : val === 'unit_kerja' ? 'success' : 'warning'}>
            {JENIS_LABELS[val] || val}
          </AppBadge>
        )
      }
    },
    {
      id: 'perubahan',
      header: 'Perubahan',
      cell: ({ row }) => {
        const { jenis_mutasi, lokasiAsal, lokasiTujuan, unitAsal, unitTujuan, pjAsal, pjTujuan } = row.original
        
        let labelAsal = '-'
        let labelTujuan = '-'

        if (jenis_mutasi === 'ruangan') {
          labelAsal = lokasiAsal?.nama_gedung || '-'
          labelTujuan = lokasiTujuan?.nama_gedung || '-'
        } else if (jenis_mutasi === 'unit_kerja') {
          labelAsal = unitAsal?.nama_unit || '-'
          labelTujuan = unitTujuan?.nama_unit || '-'
        } else if (jenis_mutasi === 'penanggung_jawab') {
          labelAsal = pjAsal?.nama_lengkap || '-'
          labelTujuan = pjTujuan?.nama_lengkap || '-'
        }

        return (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground font-medium">{labelAsal}</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-foreground font-semibold">{labelTujuan}</span>
          </div>
        )
      }
    },
    {
      id: 'pengaju',
      header: 'Pengaju',
      cell: ({ row }) => {
        const by = row.original.diajukanOleh
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">{by?.nama_lengkap || '-'}</span>
            <span className="text-[11px] text-muted-foreground">
              {row.original.tanggal_pengajuan ? dayjs(row.original.tanggal_pengajuan).format('DD MMM YYYY') : '-'}
            </span>
          </div>
        )
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const val = getValue() as MutasiStatus
        return (
          <AppBadge variant={STATUS_VARIANTS[val] || 'neutral'} dot>
            {STATUS_LABELS[val] || val}
          </AppBadge>
        )
      }
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => {
        const mutasi = row.original
        return (
          <div className="flex flex-wrap gap-1.5">
            <AppButton
              size="sm"
              variant="outline"
              icon={Eye}
              onClick={() => {
                setSelectedMutasi(mutasi)
                setIsDetailOpen(true)
              }}
            >
              Detail
            </AppButton>

            {/* Approve / Reject — transfer:approve */}
            {canApprove && mutasi.status === 'menunggu_approval' && (
              <>
                <AppButton
                  size="sm"
                  variant="outline"
                  className="text-success hover:text-success border-success/30 hover:border-success/60"
                  icon={Check}
                  onClick={() => {
                    setSelectedMutasi(mutasi)
                    setActionType('approve')
                  }}
                >
                  Setujui
                </AppButton>
                <AppButton
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60"
                  icon={XIcon}
                  onClick={() => {
                    setSelectedMutasi(mutasi)
                    setActionType('reject')
                  }}
                >
                  Tolak
                </AppButton>
              </>
            )}

            {/* BAST download + complete — disetujui state */}
            {mutasi.status === 'disetujui' && (
              <>
                {canDownload && (
                  <AppButton
                    size="sm"
                    variant="outline"
                    className="text-primary hover:text-primary border-primary/30 hover:border-primary/60"
                    icon={FileDown}
                    onClick={() => handleDownloadBAST(mutasi.id)}
                    loading={generatingBAST}
                  >
                    BAST
                  </AppButton>
                )}
                
                {canApprove && (
                  <AppButton
                    size="sm"
                    variant="outline"
                    className="text-success hover:text-success border-success/30 hover:border-success/60"
                    icon={UploadCloud}
                    onClick={() => {
                      setSelectedMutasi(mutasi)
                      setActionType('complete')
                    }}
                  >
                    Selesai
                  </AppButton>
                )}
              </>
            )}

            {mutasi.status === 'selesai' && mutasi.berita_acara_path && (
              <AppButton
                size="sm"
                variant="outline"
                icon={FileText}
                onClick={() => window.open(`http://localhost:8080${mutasi.berita_acara_path}`, '_blank')}
              >
                BAST Final
              </AppButton>
            )}
          </div>
        )
      }
    }
  ]

  return (
    <PageShell
      title="Mutasi Aset"
      description="Catat, ajukan, dan pantau perpindahan aset antar lokasi, unit kerja, atau penanggung jawab."
    >
      <div className="space-y-6">
        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-xl border border-border">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setStatusFilter(tab.value)
                  setPage(1)
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
                  statusFilter === tab.value
                    ? 'bg-primary border-primary text-primary-foreground shadow-sm'
                    : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {canCreate && (
            <AppButton
              variant="primary"
              icon={Plus}
              onClick={() => setIsCreateOpen(true)}
            >
              Ajukan Mutasi
            </AppButton>
          )}
        </div>

        {/* Data View */}
        {error && (
          <AppCard variant="alert">
            <AppCardContent className="flex items-center gap-3 pt-5 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">Gagal memuat data: {error.message}</p>
            </AppCardContent>
          </AppCard>
        )}

        {!error && (
          <DataTable
            columns={columns}
            data={mutasis}
            isLoading={loading}
            pageCount={totalPages}
            pageIndex={page - 1}
            pageSize={limit}
            onPaginationChange={(state) => setPage(state.pageIndex + 1)}
          />
        )}
      </div>

      {/* ====== CREATE MUTASI MODAL ====== */}
      <AppModal
        isOpen={isCreateOpen}
        onClose={handleCreateClose}
        title="Ajukan Permohonan Mutasi Aset"
        size="lg"
      >
        <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-5">
          <div className="space-y-4">
            {/* Asset Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">Aset / Barang</label>
              <Controller
                name="asset_id"
                control={control}
                render={({ field }) => (
                  <AppSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    options={assetOptions}
                    placeholder="Pilih aset yang ingin dimutasi"
                    error={errors.asset_id?.message}
                    disabled={loadingAssets}
                  />
                )}
              />
            </div>

            {/* Jenis Mutasi Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">Jenis Mutasi</label>
              <Controller
                name="jenis_mutasi"
                control={control}
                render={({ field }) => (
                  <AppSelect
                    {...field}
                    options={[
                      { value: 'ruangan', label: 'Perpindahan Ruangan/Lokasi' },
                      { value: 'unit_kerja', label: 'Perpindahan Unit Kerja' },
                      { value: 'penanggung_jawab', label: 'Pergantian Penanggung Jawab' }
                    ]}
                    placeholder="Pilih jenis mutasi"
                    error={errors.jenis_mutasi?.message}
                  />
                )}
              />
            </div>

            {/* Dynamic Target Location Select */}
            {selectedJenis === 'ruangan' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">Lokasi / Ruangan Tujuan</label>
                <Controller
                  name="lokasi_tujuan_id"
                  control={control}
                  render={({ field }) => (
                    <AppSelect
                      {...field}
                      options={locationOptions}
                      placeholder="Pilih lokasi tujuan baru"
                      error={errors.lokasi_tujuan_id?.message}
                      disabled={loadingLocations}
                    />
                  )}
                />
              </div>
            )}

            {/* Dynamic Target Unit Select */}
            {selectedJenis === 'unit_kerja' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">Unit Kerja Tujuan</label>
                <Controller
                  name="unit_tujuan_id"
                  control={control}
                  render={({ field }) => (
                    <AppSelect
                      {...field}
                      options={unitOptions}
                      placeholder="Pilih unit kerja tujuan baru"
                      error={errors.unit_tujuan_id?.message}
                      disabled={loadingUnits}
                    />
                  )}
                />
              </div>
            )}

            {/* Dynamic Target PJ Select */}
            {selectedJenis === 'penanggung_jawab' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">Penanggung Jawab Baru</label>
                <Controller
                  name="pj_tujuan_id"
                  control={control}
                  render={({ field }) => (
                    <AppSelect
                      {...field}
                      options={userOptions}
                      placeholder="Pilih penanggung jawab baru"
                      error={errors.pj_tujuan_id?.message}
                      disabled={loadingUsers}
                    />
                  )}
                />
              </div>
            )}

            {/* Alasan Mutasi */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">Alasan Mutasi</label>
              <Controller
                name="alasan_mutasi"
                control={control}
                render={({ field }) => (
                  <AppTextarea
                    {...field}
                    placeholder="Tuliskan alasan pemindahan / mutasi aset ini..."
                    error={errors.alasan_mutasi?.message}
                    rows={3}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <AppButton type="button" variant="outline" onClick={handleCreateClose}>
              Batal
            </AppButton>
            <AppButton type="submit" variant="primary" loading={submittingAjukan}>
              Ajukan Mutasi
            </AppButton>
          </div>
        </form>
      </AppModal>

      {/* ====== DETAIL MODAL ====== */}
      <AppModal
        isOpen={isDetailOpen && !!selectedMutasi}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedMutasi(null)
        }}
        title="Detail Mutasi Aset"
        size="2xl"
      >
        {selectedMutasi && (
          <div className="space-y-6">
            {/* Status Info */}
            <div className="flex justify-between items-center bg-muted/30 p-4 rounded-xl border border-border">
              <div className="space-y-0.5">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Status Mutasi</span>
                <div className="flex items-center gap-2">
                  <AppBadge variant={STATUS_VARIANTS[selectedMutasi.status]} dot>
                    {STATUS_LABELS[selectedMutasi.status]}
                  </AppBadge>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Tanggal Pengajuan</span>
                <p className="text-sm font-semibold">
                  {selectedMutasi.tanggal_pengajuan ? dayjs(selectedMutasi.tanggal_pengajuan).format('DD MMM YYYY HH:mm') : '-'}
                </p>
              </div>
            </div>

            {/* Core Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Asset Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-2 text-foreground font-bold">
                  <FileText className="h-4.5 w-4.5 text-primary" />
                  <h4>Informasi Aset</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">Nama Barang</span>
                    <span className="font-semibold text-foreground">{selectedMutasi.asset?.nama_barang}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-muted-foreground block">Nomor Register</span>
                      <span className="font-mono text-xs">{selectedMutasi.asset?.nomor_register || '-'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Kode Barang</span>
                      <span className="font-mono text-xs">{selectedMutasi.asset?.kode_barang || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mutation Comparison Asal -> Tujuan */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-2 text-foreground font-bold">
                  <Building2 className="h-4.5 w-4.5 text-primary" />
                  <h4>Perubahan Mutasi</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">Jenis Mutasi</span>
                    <span className="font-semibold">{JENIS_LABELS[selectedMutasi.jenis_mutasi]}</span>
                  </div>

                  {selectedMutasi.jenis_mutasi === 'ruangan' && (
                    <div className="grid grid-cols-1 gap-2 p-3 bg-muted/20 border border-border rounded-lg text-xs">
                      <div>
                        <span className="text-muted-foreground block">Dari Ruangan (Asal):</span>
                        <span className="font-medium text-foreground">{selectedMutasi.lokasiAsal?.nama_gedung || '-'}</span>
                      </div>
                      <div className="py-1 border-t border-border/50 flex justify-center">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Ke Ruangan (Tujuan):</span>
                        <span className="font-semibold text-primary">{selectedMutasi.lokasiTujuan?.nama_gedung || '-'}</span>
                      </div>
                    </div>
                  )}

                  {selectedMutasi.jenis_mutasi === 'unit_kerja' && (
                    <div className="grid grid-cols-1 gap-2 p-3 bg-muted/20 border border-border rounded-lg text-xs">
                      <div>
                        <span className="text-muted-foreground block">Dari Unit Kerja (Asal):</span>
                        <span className="font-medium text-foreground">{selectedMutasi.unitAsal?.nama_unit || '-'}</span>
                      </div>
                      <div className="py-1 border-t border-border/50 flex justify-center">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Ke Unit Kerja (Tujuan):</span>
                        <span className="font-semibold text-primary">{selectedMutasi.unitTujuan?.nama_unit || '-'}</span>
                      </div>
                    </div>
                  )}

                  {selectedMutasi.jenis_mutasi === 'penanggung_jawab' && (
                    <div className="grid grid-cols-1 gap-2 p-3 bg-muted/20 border border-border rounded-lg text-xs">
                      <div>
                        <span className="text-muted-foreground block">PJ Sebelumnya (Asal):</span>
                        <span className="font-medium text-foreground">{selectedMutasi.pjAsal?.nama_lengkap || '-'}</span>
                      </div>
                      <div className="py-1 border-t border-border/50 flex justify-center">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <span className="text-muted-foreground block">PJ Pengganti (Tujuan):</span>
                        <span className="font-semibold text-primary">{selectedMutasi.pjTujuan?.nama_lengkap || '-'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Date Details & Notes */}
            <div className="space-y-4 border-t border-border pt-4">
              <div className="flex items-center gap-2 border-b border-border pb-2 text-foreground font-bold">
                <Calendar className="h-4.5 w-4.5 text-primary" />
                <h4>Riwayat Alur Dokumen & Catatan</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">Diajukan Oleh</span>
                  <span className="font-medium">{selectedMutasi.diajukanOleh?.nama_lengkap}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Disetujui Oleh</span>
                  <span className="font-medium">{selectedMutasi.disetujuiOleh?.nama_lengkap || '-'}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Tanggal Selesai</span>
                  <span className="font-medium text-success">
                    {selectedMutasi.tanggal_selesai ? dayjs(selectedMutasi.tanggal_selesai).format('DD MMM YYYY') : '-'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
                <div className="bg-muted/20 p-3 rounded-lg border border-border/60">
                  <span className="text-xs text-muted-foreground font-bold block mb-1">ALASAN MUTASI (PENGAJU)</span>
                  <p className="text-xs text-foreground italic">
                    &quot;{selectedMutasi.alasan_mutasi || 'Tidak ada alasan'}&quot;
                  </p>
                </div>
                <div className="bg-muted/20 p-3 rounded-lg border border-border/60">
                  <span className="text-xs text-muted-foreground font-bold block mb-1">CATATAN APPROVAL</span>
                  <p className="text-xs text-foreground italic">
                    &quot;{selectedMutasi.catatan_approval || 'Tidak ada catatan approval'}&quot;
                  </p>
                </div>
              </div>

              {selectedMutasi.berita_acara_path && (
                <div className="flex justify-end pt-2">
                  <AppButton
                    variant="outline"
                    icon={FileText}
                    onClick={() => window.open(`http://localhost:8080${selectedMutasi.berita_acara_path}`, '_blank')}
                  >
                    Lihat Dokumen BAST Final
                  </AppButton>
                </div>
              )}
            </div>
          </div>
        )}
      </AppModal>

      {/* ====== ACTION MODAL (APPROVE / REJECT / COMPLETE) ====== */}
      <AppModal
        isOpen={!!actionType && !!selectedMutasi}
        onClose={() => {
          setActionType(null)
          setActionNotes('')
          setSelectedFile(null)
          setSelectedMutasi(null)
        }}
        title={
          actionType === 'approve' ? 'Setujui Pengajuan Mutasi' :
          actionType === 'reject' ? 'Tolak Pengajuan Mutasi' :
          actionType === 'complete' ? 'Selesaikan Mutasi (Upload BAST)' : 'Konfirmasi Tindakan'
        }
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Apakah Anda yakin ingin memproses mutasi ini untuk aset{' '}
            <strong className="text-foreground">{selectedMutasi?.asset?.nama_barang}</strong>?
          </p>

          {/* Notes for approve / reject */}
          {(actionType === 'approve' || actionType === 'reject') && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                Catatan Persetujuan / Alasan Penolakan {actionType === 'reject' && <span className="text-destructive">*</span>}
              </label>
              <AppTextarea
                placeholder="Masukkan catatan pendukung persetujuan atau alasan penolakan mutasi..."
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {/* Document Upload for complete */}
          {actionType === 'complete' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Unggah File Berita Acara Serah Terima (BAST) <span className="text-destructive">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setSelectedFile(e.target.files[0])
                      }
                    }}
                    className="block w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                  />
                </div>
              </div>
              <span className="text-[11px] text-muted-foreground">
                *Dokumen BAST yang ditandatangani basah oleh pihak penyerah dan penerima wajib dilampirkan sebelum mutasi dianggap sah/selesai di sistem.
              </span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <AppButton
              variant="outline"
              onClick={() => {
                setActionType(null)
                setActionNotes('')
                setSelectedFile(null)
                setSelectedMutasi(null)
              }}
            >
              Batal
            </AppButton>
            <AppButton
              variant={actionType === 'reject' ? 'danger' : 'primary'}
              onClick={handleActionSubmit}
              disabled={
                (actionType === 'reject' && !actionNotes.trim()) ||
                (actionType === 'complete' && !selectedFile)
              }
              loading={submittingSetujui || submittingTolak || submittingSelesaikan}
            >
              Konfirmasi
            </AppButton>
          </div>
        </div>
      </AppModal>
    </PageShell>
  )
}
