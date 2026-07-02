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
import { 
  useLoans 
} from '../hooks/useLoans'
import { 
  useAjukanPeminjaman,
  useSetujuiPeminjaman,
  useTolakPeminjaman,
  useMulaiPeminjaman,
  useKembalikanAset,
  useBatalkanPeminjaman 
} from '../hooks/useLoanMutations'
import { useAssets } from '@/modules/asset/hooks/useAssets'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { 
  Plus, 
  Eye, 
  Check, 
  X as XIcon, 
  Play, 
  RotateCcw, 
  Trash, 
  AlertCircle,
  FileText,
  Calendar,
  User as UserIcon,
  MapPin,
  Image as ImageIcon
} from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { LoanDTO } from '../types'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createLoanSchema, CreateLoanInput } from '../schemas'
import dayjs from 'dayjs'

const STATUS_LABELS: Record<string, string> = {
  menunggu: 'Menunggu Approval',
  disetujui: 'Disetujui',
  ditolak: 'Ditolak',
  dipinjam: 'Sedang Dipinjam',
  selesai: 'Selesai',
  terlambat: 'Terlambat',
  dibatalkan: 'Dibatalkan'
}

const STATUS_VARIANTS: Record<string, 'neutral' | 'info' | 'success' | 'danger' | 'warning'> = {
  menunggu: 'warning',
  disetujui: 'info',
  ditolak: 'danger',
  dipinjam: 'success',
  selesai: 'neutral',
  terlambat: 'danger',
  dibatalkan: 'neutral'
}

export function LoanModule() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string>('')
  
  // Data Queries
  const { loans, loading, error, refetch, total, totalPages } = useLoans({
    page,
    limit,
    status: statusFilter
  })

  const { assets, loading: loadingAssets } = useAssets({ page: 1, limit: 100 })

  // Mutations
  const { ajukan, loading: submittingAjukan } = useAjukanPeminjaman()
  const { setujui, loading: submittingSetujui } = useSetujuiPeminjaman()
  const { tolak, loading: submittingTolak } = useTolakPeminjaman()
  const { mulai, loading: submittingMulai } = useMulaiPeminjaman()
  const { kembalikan, loading: submittingKembalikan } = useKembalikanAset()
  const { batalkan, loading: submittingBatalkan } = useBatalkanPeminjaman()

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<LoanDTO | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  
  // Action Modals
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'handover' | 'return' | 'cancel' | null>(null)
  const [actionNotes, setActionNotes] = useState('')
  const [actionPhoto, setActionPhoto] = useState('')

  // Create Form Hook
  const { 
    control, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<CreateLoanInput>({
    resolver: zodResolver(createLoanSchema),
    defaultValues: {
      asset_id: '',
      tanggal_rencana_kembali: '',
      catatan_pengaju: ''
    }
  })

  const onCreateSubmit = async (data: CreateLoanInput) => {
    try {
      await ajukan(data)
      setIsCreateOpen(false)
      reset()
      refetch()
    } catch (err) {
      // toast is automatically handled by the hook
    }
  }

  const handleActionSubmit = async () => {
    if (!selectedLoan) return
    try {
      if (actionType === 'approve') {
        await setujui(selectedLoan.id, actionNotes)
      } else if (actionType === 'reject') {
        await tolak(selectedLoan.id, actionNotes)
      } else if (actionType === 'handover') {
        await mulai(selectedLoan.id, actionPhoto || 'uploads/loans/default-before.jpg')
      } else if (actionType === 'return') {
        await kembalikan(selectedLoan.id, actionPhoto || 'uploads/loans/default-after.jpg')
      } else if (actionType === 'cancel') {
        await batalkan(selectedLoan.id)
      }
      
      setActionType(null)
      setActionNotes('')
      setActionPhoto('')
      setSelectedLoan(null)
      refetch()
    } catch (err) {
      // error handled by hook
    }
  }

  const isOperator = user?.roles?.some(r => r.nama_role === 'operator_bmn' || r.nama_role === 'admin')

  // Table Columns Setup
  const columns: ColumnDef<LoanDTO>[] = [
    {
      id: 'asset',
      header: 'Barang / Aset',
      cell: ({ row }) => {
        const asset = row.original.asset
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-foreground">{asset?.nama_barang || 'Aset Tidak Dikenal'}</span>
            <span className="text-[11px] text-muted-foreground font-mono">
              Reg: {asset?.nomor_register || '-'} | Kode: {asset?.kode_barang || '-'}
            </span>
          </div>
        )
      }
    },
    {
      id: 'borrower',
      header: 'Peminjam',
      cell: ({ row }) => {
        const borrower = row.original.peminjam
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">{borrower?.nama_lengkap || '-'}</span>
            <span className="text-[11px] text-muted-foreground font-mono">NRP: {borrower?.nrp || '-'}</span>
          </div>
        )
      }
    },
    {
      id: 'dates',
      header: 'Durasi Peminjaman',
      cell: ({ row }) => {
        const pinjam = row.original.tanggal_pinjam 
          ? dayjs(row.original.tanggal_pinjam).format('DD MMM YYYY') 
          : '-'
        const rencana = dayjs(row.original.tanggal_rencana_kembali).format('DD MMM YYYY')
        const kembali = row.original.tanggal_kembali
          ? dayjs(row.original.tanggal_kembali).format('DD MMM YYYY')
          : null

        return (
          <div className="flex flex-col gap-0.5 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="font-medium text-foreground">Rencana:</span>
              <span>{rencana}</span>
            </div>
            {row.original.tanggal_pinjam && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span className="font-medium text-foreground">Pinjam:</span>
                <span>{pinjam}</span>
              </div>
            )}
            {kembali && (
              <div className="flex items-center gap-1.5 text-success">
                <span className="font-medium">Kembali:</span>
                <span>{kembali}</span>
              </div>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const val = getValue() as string
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
        const loan = row.original
        const isOwnLoan = loan.peminjam_id === user?.id

        return (
          <div className="flex flex-wrap gap-1.5">
            <AppButton
              size="sm"
              variant="outline"
              icon={Eye}
              onClick={() => {
                setSelectedLoan(loan)
                setIsDetailOpen(true)
              }}
            >
              Detail
            </AppButton>

            {/* Operator Actions */}
            {isOperator && loan.status === 'menunggu' && (
              <>
                <AppButton
                  size="sm"
                  variant="outline"
                  className="text-success hover:text-success border-success/30 hover:border-success/60"
                  icon={Check}
                  onClick={() => {
                    setSelectedLoan(loan)
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
                    setSelectedLoan(loan)
                    setActionType('reject')
                  }}
                >
                  Tolak
                </AppButton>
              </>
            )}

            {/* Handover & Return Actions */}
            {loan.status === 'disetujui' && (isOperator || isOwnLoan) && (
              <AppButton
                size="sm"
                variant="outline"
                className="text-info hover:text-info border-info/30 hover:border-info/60"
                icon={Play}
                onClick={() => {
                  setSelectedLoan(loan)
                  setActionType('handover')
                }}
              >
                Mulai Pinjam
              </AppButton>
            )}

            {loan.status === 'dipinjam' && (isOperator || isOwnLoan) && (
              <AppButton
                size="sm"
                variant="outline"
                className="text-success hover:text-success border-success/30 hover:border-success/60"
                icon={RotateCcw}
                onClick={() => {
                  setSelectedLoan(loan)
                  setActionType('return')
                }}
              >
                Kembalikan
              </AppButton>
            )}

            {/* Cancel Action */}
            {loan.status === 'menunggu' && isOwnLoan && (
              <AppButton
                size="sm"
                variant="outline"
                className="text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60"
                icon={Trash}
                onClick={() => {
                  setSelectedLoan(loan)
                  setActionType('cancel')
                }}
              >
                Batal
              </AppButton>
            )}
          </div>
        )
      }
    }
  ]

  // Status Tab filters styling
  const statusTabs = [
    { value: '', label: 'Semua Status' },
    { value: 'menunggu', label: 'Menunggu' },
    { value: 'disetujui', label: 'Disetujui' },
    { value: 'dipinjam', label: 'Sedang Dipinjam' },
    { value: 'selesai', label: 'Selesai' },
    { value: 'ditolak', label: 'Ditolak' },
    { value: 'dibatalkan', label: 'Dibatalkan' }
  ]

  const assetOptions = assets.map(a => ({
    value: a.id,
    label: `${a.nama_barang} (Reg: ${a.nomor_register || '-'})`
  }))

  return (
    <PageShell 
      title="Peminjaman Aset" 
      description="Kelola peminjaman aset jangka pendek dan alur pengembaliannya."
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

          <AppButton
            variant="primary"
            icon={Plus}
            onClick={() => setIsCreateOpen(true)}
          >
            Ajukan Peminjaman
          </AppButton>
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
            data={loans}
            isLoading={loading}
            pageCount={totalPages}
            pageIndex={page - 1}
            pageSize={limit}
            onPaginationChange={(state) => setPage(state.pageIndex + 1)}
          />
        )}
      </div>

      {/* CREATE LOAN MODAL */}
      <AppModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false)
          reset()
        }}
        title="Ajukan Peminjaman Aset Baru"
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
                    {...field}
                    options={assetOptions}
                    placeholder="Pilih aset yang ingin dipinjam"
                    error={errors.asset_id?.message}
                    disabled={loadingAssets}
                  />
                )}
              />
            </div>

            {/* Expected Return Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">Tanggal Rencana Kembali</label>
              <Controller
                name="tanggal_rencana_kembali"
                control={control}
                render={({ field }) => (
                  <AppInput
                    type="date"
                    {...field}
                    error={errors.tanggal_rencana_kembali?.message}
                    min={dayjs().format('YYYY-MM-DD')}
                  />
                )}
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">Catatan Pengaju</label>
              <Controller
                name="catatan_pengaju"
                control={control}
                render={({ field }) => (
                  <AppTextarea
                    {...field}
                    placeholder="Tuliskan tujuan peminjaman barang ini..."
                    error={errors.catatan_pengaju?.message}
                    rows={4}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <AppButton
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false)
                reset()
              }}
            >
              Batal
            </AppButton>
            <AppButton
              type="submit"
              variant="primary"
              loading={submittingAjukan}
            >
              Ajukan
            </AppButton>
          </div>
        </form>
      </AppModal>

      {/* DETAIL MODAL */}
      <AppModal
        isOpen={isDetailOpen && !!selectedLoan}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedLoan(null)
        }}
        title="Detail Peminjaman Aset"
        size="2xl"
      >
        {selectedLoan && (
          <div className="space-y-6">
            {/* Status Section */}
            <div className="flex justify-between items-center bg-muted/30 p-4 rounded-xl border border-border">
              <div className="space-y-0.5">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Status Saat Ini</span>
                <div className="flex items-center gap-2">
                  <AppBadge variant={STATUS_VARIANTS[selectedLoan.status]} dot>
                    {STATUS_LABELS[selectedLoan.status]}
                  </AppBadge>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Diajukan Pada</span>
                <p className="text-sm font-semibold">{dayjs(selectedLoan.created_at).format('DD MMM YYYY HH:mm')}</p>
              </div>
            </div>

            {/* Core Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Asset Info Card */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-2 text-foreground font-bold">
                  <FileText className="h-4.5 w-4.5 text-primary" />
                  <h4>Informasi Aset</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">Nama Barang</span>
                    <span className="font-semibold text-foreground">{selectedLoan.asset?.nama_barang}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-muted-foreground block">Nomor Register</span>
                      <span className="font-mono text-xs">{selectedLoan.asset?.nomor_register || '-'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Kode Barang</span>
                      <span className="font-mono text-xs">{selectedLoan.asset?.kode_barang || '-'}</span>
                    </div>
                  </div>
                  {selectedLoan.asset?.lokasi && (
                    <div className="flex gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-muted-foreground block">Lokasi Penyimpanan</span>
                        <span className="text-xs font-medium">
                          {selectedLoan.asset.lokasi.nama_gedung}
                          {selectedLoan.asset.lokasi.lantai && `, Lantai ${selectedLoan.asset.lokasi.lantai}`}
                          {selectedLoan.asset.lokasi.ruangan && `, Ruang ${selectedLoan.asset.lokasi.ruangan}`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* People Info Card */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-2 text-foreground font-bold">
                  <UserIcon className="h-4.5 w-4.5 text-primary" />
                  <h4>Informasi Pihak Terkait</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">Peminjam (Pengaju)</span>
                    <span className="font-semibold text-foreground">{selectedLoan.peminjam?.nama_lengkap}</span>
                    <span className="text-xs text-muted-foreground block font-mono">NRP: {selectedLoan.peminjam?.nrp}</span>
                  </div>
                  {selectedLoan.approver && (
                    <div>
                      <span className="text-xs text-muted-foreground block">Penyetuju (Operator)</span>
                      <span className="font-medium text-foreground">{selectedLoan.approver.nama_lengkap}</span>
                      <span className="text-xs text-muted-foreground block font-mono">NRP: {selectedLoan.approver.nrp}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Date Details & Notes */}
            <div className="space-y-4 border-t border-border pt-4">
              <div className="flex items-center gap-2 border-b border-border pb-2 text-foreground font-bold">
                <Calendar className="h-4.5 w-4.5 text-primary" />
                <h4>Tanggal & Catatan</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">Mulai Pinjam</span>
                  <span className="font-medium">
                    {selectedLoan.tanggal_pinjam ? dayjs(selectedLoan.tanggal_pinjam).format('DD MMM YYYY') : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Rencana Kembali</span>
                  <span className="font-medium">
                    {dayjs(selectedLoan.tanggal_rencana_kembali).format('DD MMM YYYY')}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Realisasi Kembali</span>
                  <span className="font-medium text-success">
                    {selectedLoan.tanggal_kembali ? dayjs(selectedLoan.tanggal_kembali).format('DD MMM YYYY') : '-'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
                <div className="bg-muted/20 p-3 rounded-lg border border-border/60">
                  <span className="text-xs text-muted-foreground font-bold block mb-1">CATATAN PENGAJU</span>
                  <p className="text-xs text-foreground italic">
                    "{selectedLoan.catatan_pengaju || 'Tidak ada catatan'}"
                  </p>
                </div>
                <div className="bg-muted/20 p-3 rounded-lg border border-border/60">
                  <span className="text-xs text-muted-foreground font-bold block mb-1">CATATAN APPROVER / REASON</span>
                  <p className="text-xs text-foreground italic">
                    "{selectedLoan.catatan_approver || 'Tidak ada catatan/alasan'}"
                  </p>
                </div>
              </div>
            </div>

            {/* Photos Section */}
            {(selectedLoan.foto_sebelum || selectedLoan.foto_sesudah) && (
              <div className="space-y-4 border-t border-border pt-4">
                <div className="flex items-center gap-2 border-b border-border pb-2 text-foreground font-bold">
                  <ImageIcon className="h-4.5 w-4.5 text-primary" />
                  <h4>Dokumentasi Visual (Foto)</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {selectedLoan.foto_sebelum && (
                    <div className="space-y-1.5">
                      <span className="text-xs text-muted-foreground font-medium block text-center">Foto Sebelum Peminjaman</span>
                      <div className="aspect-video bg-muted border border-border rounded-lg overflow-hidden flex items-center justify-center relative">
                        <img 
                          src={selectedLoan.foto_sebelum.startsWith('http') ? selectedLoan.foto_sebelum : `/${selectedLoan.foto_sebelum}`}
                          alt="Foto Sebelum"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=300'
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {selectedLoan.foto_sesudah && (
                    <div className="space-y-1.5">
                      <span className="text-xs text-muted-foreground font-medium block text-center">Foto Sesudah Pengembalian</span>
                      <div className="aspect-video bg-muted border border-border rounded-lg overflow-hidden flex items-center justify-center relative">
                        <img 
                          src={selectedLoan.foto_sesudah.startsWith('http') ? selectedLoan.foto_sesudah : `/${selectedLoan.foto_sesudah}`}
                          alt="Foto Sesudah"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=300'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </AppModal>

      {/* CONFIRMATION / NOTES INPUT ACTION MODAL */}
      <AppModal
        isOpen={!!actionType}
        onClose={() => {
          setActionType(null)
          setActionNotes('')
          setActionPhoto('')
          setSelectedLoan(null)
        }}
        title={
          actionType === 'approve' ? 'Setujui Pengajuan Peminjaman' :
          actionType === 'reject' ? 'Tolak Pengajuan Peminjaman' :
          actionType === 'handover' ? 'Mulai Pinjam / Serah Terima Barang' :
          actionType === 'return' ? 'Konfirmasi Pengembalian Aset' :
          actionType === 'cancel' ? 'Batalkan Pengajuan Peminjaman' : 'Konfirmasi Aksi'
        }
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Apakah Anda yakin ingin memproses tindakan ini untuk aset{' '}
            <strong className="text-foreground">{selectedLoan?.asset?.nama_barang}</strong>?
          </p>

          {/* Notes for approve / reject */}
          {(actionType === 'approve' || actionType === 'reject') && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">Catatan Operator / Alasan</label>
              <AppTextarea
                placeholder="Masukkan catatan pendukung (misal: Lokasi pengambilan, kondisi awal dll)"
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {/* Photos for handover / return */}
          {(actionType === 'handover' || actionType === 'return') && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">URL / Path Foto Dokumentasi</label>
                <AppInput
                  placeholder="Contoh: uploads/loans/before-1.jpg"
                  value={actionPhoto}
                  onChange={(e) => setActionPhoto(e.target.value)}
                />
              </div>
              <span className="text-[11px] text-muted-foreground">
                *Foto ini digunakan sebagai lampiran bukti serah terima aset.
              </span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <AppButton
              variant="outline"
              onClick={() => {
                setActionType(null)
                setActionNotes('')
                setActionPhoto('')
                setSelectedLoan(null)
              }}
            >
              Batal
            </AppButton>
            <AppButton
              variant={actionType === 'reject' || actionType === 'cancel' ? 'danger' : 'primary'}
              onClick={handleActionSubmit}
              loading={
                submittingSetujui || 
                submittingTolak || 
                submittingMulai || 
                submittingKembalikan || 
                submittingBatalkan
              }
            >
              Konfirmasi
            </AppButton>
          </div>
        </div>
      </AppModal>
    </PageShell>
  )
}
