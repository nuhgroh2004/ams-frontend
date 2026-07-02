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
import { useAssignmentHistory } from '../hooks/useAssignmentHistory'
import {
  useAssignAssetToUser,
  useAssignAssetToUnit,
  useReturnAssignment,
} from '../hooks/useAssignmentMutations'
import { useAssets } from '@/modules/asset/hooks/useAssets'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useQuery } from '@apollo/client'
import { GET_USERS_QUERY, GET_UNITS_QUERY } from '@/modules/users/services/user.graphql'
import {
  Plus,
  Eye,
  RotateCcw,
  AlertCircle,
  FileText,
  Calendar,
  User as UserIcon,
  Building2,
  ClipboardCheck,
  Package,
  MapPin
} from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { AssetAssignment, AssetAssignmentFilterInput } from '../types'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  assignToUserSchema,
  assignToUnitSchema,
  AssignToUserFormInput,
  AssignToUnitFormInput,
} from '../schemas'
import dayjs from 'dayjs'

type FilterTab = 'all' | 'active' | 'returned'

export function AssignmentModule() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [filterTab, setFilterTab] = useState<FilterTab>('all')

  // Build filter from tab
  const buildFilter = (): AssetAssignmentFilterInput => {
    if (filterTab === 'active') return { is_returned: false }
    if (filterTab === 'returned') return { is_returned: true }
    return {}
  }

  // Data Queries
  const { assignments, loading, error, refetch, total, totalPages } = useAssignmentHistory({
    page,
    limit,
    filter: buildFilter(),
  })

  const { assets, loading: loadingAssets } = useAssets({ page: 1, limit: 100 })
  const { data: usersData, loading: loadingUsers } = useQuery(GET_USERS_QUERY, {
    variables: { page: 1, limit: 200, isActive: true },
  })
  const { data: unitsData, loading: loadingUnits } = useQuery(GET_UNITS_QUERY)

  // Mutations
  const { assign: assignToUser, loading: submittingUser } = useAssignAssetToUser()
  const { assign: assignToUnit, loading: submittingUnit } = useAssignAssetToUnit()
  const { returnAssignment, loading: submittingReturn } = useReturnAssignment()

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [assignMode, setAssignMode] = useState<'user' | 'unit'>('user')
  const [selectedAssignment, setSelectedAssignment] = useState<AssetAssignment | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isReturnOpen, setIsReturnOpen] = useState(false)
  const [returnNotes, setReturnNotes] = useState('')

  // Forms
  const userForm = useForm<AssignToUserFormInput>({
    resolver: zodResolver(assignToUserSchema),
    defaultValues: { asset_id: '', user_id: '', unit_id: '', notes: '' },
  })

  const unitForm = useForm<AssignToUnitFormInput>({
    resolver: zodResolver(assignToUnitSchema),
    defaultValues: { asset_id: '', unit_id: '', notes: '' },
  })

  const isOperator = user?.roles?.some(
    (r: { nama_role: string }) => r.nama_role === 'ADMIN_SISTEM' || r.nama_role === 'OPERATOR_BMN'
  )

  // --- Handlers ---

  const handleCreateClose = () => {
    setIsCreateOpen(false)
    userForm.reset()
    unitForm.reset()
    setAssignMode('user')
  }

  const onAssignToUserSubmit = async (data: AssignToUserFormInput) => {
    try {
      const input = {
        asset_id: data.asset_id,
        user_id: data.user_id,
        unit_id: data.unit_id || undefined,
        notes: data.notes || undefined,
      }
      await assignToUser(input)
      handleCreateClose()
      refetch()
    } catch {
      // error handled by hook
    }
  }

  const onAssignToUnitSubmit = async (data: AssignToUnitFormInput) => {
    try {
      const input = {
        asset_id: data.asset_id,
        unit_id: data.unit_id,
        notes: data.notes || undefined,
      }
      await assignToUnit(input)
      handleCreateClose()
      refetch()
    } catch {
      // error handled by hook
    }
  }

  const handleReturnSubmit = async () => {
    if (!selectedAssignment) return
    try {
      await returnAssignment(selectedAssignment.id, returnNotes || undefined)
      setIsReturnOpen(false)
      setReturnNotes('')
      setSelectedAssignment(null)
      refetch()
    } catch {
      // error handled by hook
    }
  }

  // --- Select Options ---

  const assetOptions = assets.map((a) => ({
    value: a.id,
    label: `${a.nama_barang} (Reg: ${a.nomor_register || '-'})`,
  }))

  const userOptions = (usersData?.users?.data || []).map((u: any) => ({
    value: u.id,
    label: `${u.nama_lengkap} (NRP: ${u.nrp || '-'})`,
  }))

  const unitOptions = (unitsData?.units || []).map((u: any) => ({
    value: u.id,
    label: `${u.nama_unit} (${u.kode_unit || '-'})`,
  }))

  // --- Filter tabs ---

  const filterTabs: { value: FilterTab; label: string }[] = [
    { value: 'all', label: 'Semua' },
    { value: 'active', label: 'Aktif' },
    { value: 'returned', label: 'Dikembalikan' },
  ]

  // --- Table Columns ---

  const columns: ColumnDef<AssetAssignment, any>[] = [
    {
      id: 'asset',
      header: 'Barang / Aset',
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
      },
    },
    {
      id: 'recipient',
      header: 'Penerima',
      cell: ({ row }) => {
        const { user: assignedUser, unit } = row.original
        if (assignedUser) {
          return (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <UserIcon className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">{assignedUser.nama_lengkap}</span>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">
                NRP: {assignedUser.nrp || '-'}
              </span>
            </div>
          )
        }
        if (unit) {
          return (
            <div className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-info" />
              <span className="font-medium">{unit.nama_unit}</span>
            </div>
          )
        }
        return <span className="text-muted-foreground">-</span>
      },
    },
    {
      id: 'assignedBy',
      header: 'Ditugaskan Oleh',
      cell: ({ row }) => {
        const by = row.original.assignedBy
        return (
          <span className="text-sm">
            {by?.nama_lengkap || '-'}
          </span>
        )
      },
    },
    {
      id: 'assignedAt',
      header: 'Tanggal Assign',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.assigned_at
            ? dayjs(row.original.assigned_at).format('DD MMM YYYY')
            : '-'}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const { is_returned, returned_at } = row.original
        if (is_returned) {
          return (
            <div className="flex flex-col gap-0.5">
              <AppBadge className="w-fit" variant="neutral" dot>Dikembalikan</AppBadge>
              {returned_at && (
                <span className="text-[10px] text-muted-foreground">
                  {dayjs(returned_at).format('DD MMM YYYY')}
                </span>
              )}
            </div>
          )
        }
        return <AppBadge variant="success" dot>Aktif</AppBadge>
      },
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => {
        const assignment = row.original
        return (
          <div className="flex flex-wrap gap-1.5">
            <AppButton
              size="sm"
              variant="outline"
              icon={Eye}
              onClick={() => {
                setSelectedAssignment(assignment)
                setIsDetailOpen(true)
              }}
            >
              Detail
            </AppButton>

            {isOperator && !assignment.is_returned && (
              <AppButton
                size="sm"
                variant="outline"
                className="text-warning hover:text-warning border-warning/30 hover:border-warning/60"
                icon={RotateCcw}
                onClick={() => {
                  setSelectedAssignment(assignment)
                  setIsReturnOpen(true)
                }}
              >
                Kembalikan
              </AppButton>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <PageShell
      title="Penyerahan Aset"
      description="Kelola proses penyerahan dan penugasan aset ke pengguna atau unit kerja."
    >
      <div className="space-y-6">
        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-xl border border-border">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setFilterTab(tab.value)
                  setPage(1)
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
                  filterTab === tab.value
                    ? 'bg-primary border-primary text-primary-foreground shadow-sm'
                    : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {isOperator && (
            <AppButton
              variant="primary"
              icon={Plus}
              onClick={() => setIsCreateOpen(true)}
            >
              Assign Aset Baru
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
            data={assignments}
            isLoading={loading}
            pageCount={totalPages}
            pageIndex={page - 1}
            pageSize={limit}
            onPaginationChange={(state) => setPage(state.pageIndex + 1)}
          />
        )}
      </div>

      {/* ====== CREATE ASSIGNMENT MODAL ====== */}
      <AppModal
        isOpen={isCreateOpen}
        onClose={handleCreateClose}
        title="Assign Aset Baru"
        size="lg"
      >
        <div className="space-y-5">
          {/* Mode Toggle */}
          <div className="flex gap-1 p-1 bg-muted/50 rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setAssignMode('user')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
                assignMode === 'user'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <UserIcon className="h-3.5 w-3.5" />
              Ke User
            </button>
            <button
              type="button"
              onClick={() => setAssignMode('unit')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
                assignMode === 'unit'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              Ke Unit Kerja
            </button>
          </div>

          {/* Assign to User Form */}
          {assignMode === 'user' && (
            <form onSubmit={userForm.handleSubmit(onAssignToUserSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Aset / Barang
                </label>
                <Controller
                  name="asset_id"
                  control={userForm.control}
                  render={({ field }) => (
                    <AppSelect
                      {...field}
                      options={assetOptions}
                      placeholder="Pilih aset yang akan di-assign"
                      error={userForm.formState.errors.asset_id?.message}
                      disabled={loadingAssets}
                    />
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  User Penerima
                </label>
                <Controller
                  name="user_id"
                  control={userForm.control}
                  render={({ field }) => (
                    <AppSelect
                      {...field}
                      options={userOptions}
                      placeholder="Pilih user penerima aset"
                      error={userForm.formState.errors.user_id?.message}
                      disabled={loadingUsers}
                    />
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Unit Kerja <span className="text-muted-foreground font-normal normal-case">(opsional)</span>
                </label>
                <Controller
                  name="unit_id"
                  control={userForm.control}
                  render={({ field }) => (
                    <AppSelect
                      {...field}
                      options={unitOptions}
                      placeholder="Pilih unit kerja (opsional)"
                      disabled={loadingUnits}
                    />
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Catatan <span className="text-muted-foreground font-normal normal-case">(opsional)</span>
                </label>
                <Controller
                  name="notes"
                  control={userForm.control}
                  render={({ field }) => (
                    <AppTextarea
                      {...field}
                      placeholder="Tuliskan catatan terkait assignment ini..."
                      error={userForm.formState.errors.notes?.message}
                      rows={3}
                    />
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <AppButton type="button" variant="outline" onClick={handleCreateClose}>
                  Batal
                </AppButton>
                <AppButton type="submit" variant="primary" loading={submittingUser}>
                  Assign ke User
                </AppButton>
              </div>
            </form>
          )}

          {/* Assign to Unit Form */}
          {assignMode === 'unit' && (
            <form onSubmit={unitForm.handleSubmit(onAssignToUnitSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Aset / Barang
                </label>
                <Controller
                  name="asset_id"
                  control={unitForm.control}
                  render={({ field }) => (
                    <AppSelect
                      {...field}
                      options={assetOptions}
                      placeholder="Pilih aset yang akan di-assign"
                      error={unitForm.formState.errors.asset_id?.message}
                      disabled={loadingAssets}
                    />
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Unit Kerja Tujuan
                </label>
                <Controller
                  name="unit_id"
                  control={unitForm.control}
                  render={({ field }) => (
                    <AppSelect
                      {...field}
                      options={unitOptions}
                      placeholder="Pilih unit kerja tujuan"
                      error={unitForm.formState.errors.unit_id?.message}
                      disabled={loadingUnits}
                    />
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Catatan <span className="text-muted-foreground font-normal normal-case">(opsional)</span>
                </label>
                <Controller
                  name="notes"
                  control={unitForm.control}
                  render={({ field }) => (
                    <AppTextarea
                      {...field}
                      placeholder="Tuliskan catatan terkait assignment ini..."
                      error={unitForm.formState.errors.notes?.message}
                      rows={3}
                    />
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <AppButton type="button" variant="outline" onClick={handleCreateClose}>
                  Batal
                </AppButton>
                <AppButton type="submit" variant="primary" loading={submittingUnit}>
                  Assign ke Unit
                </AppButton>
              </div>
            </form>
          )}
        </div>
      </AppModal>

      {/* ====== DETAIL MODAL ====== */}
      <AppModal
        isOpen={isDetailOpen && !!selectedAssignment}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedAssignment(null)
        }}
        title="Detail Penyerahan Aset"
        size="2xl"
      >
        {selectedAssignment && (
          <div className="space-y-6">
            {/* Status Section */}
            <div className="flex justify-between items-center bg-muted/30 p-4 rounded-xl border border-border">
              <div className="space-y-0.5">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Status Assignment
                </span>
                <div className="flex items-center gap-2">
                  <AppBadge
                    variant={selectedAssignment.is_returned ? 'neutral' : 'success'}
                    dot
                  >
                    {selectedAssignment.is_returned ? 'Dikembalikan' : 'Aktif'}
                  </AppBadge>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Tanggal Assign
                </span>
                <p className="text-sm font-semibold">
                  {dayjs(selectedAssignment.assigned_at).format('DD MMM YYYY HH:mm')}
                </p>
              </div>
            </div>

            {/* Core Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Asset Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-2 text-foreground font-bold">
                  <Package className="h-4.5 w-4.5 text-primary" />
                  <h4>Informasi Aset</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">Nama Barang</span>
                    <span className="font-semibold text-foreground">
                      {selectedAssignment.asset?.nama_barang}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-muted-foreground block">Nomor Register</span>
                      <span className="font-mono text-xs">
                        {selectedAssignment.asset?.nomor_register || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Kode Barang</span>
                      <span className="font-mono text-xs">
                        {selectedAssignment.asset?.kode_barang || '-'}
                      </span>
                    </div>
                  </div>
                  {selectedAssignment.asset?.lokasi && (
                    <div className="flex gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs text-muted-foreground block">Lokasi</span>
                        <span className="text-xs font-medium">
                          {selectedAssignment.asset.lokasi.nama_gedung}
                          {selectedAssignment.asset.lokasi.lantai &&
                            `, Lantai ${selectedAssignment.asset.lokasi.lantai}`}
                          {selectedAssignment.asset.lokasi.ruangan &&
                            `, Ruang ${selectedAssignment.asset.lokasi.ruangan}`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recipient & Assigner Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-2 text-foreground font-bold">
                  <UserIcon className="h-4.5 w-4.5 text-primary" />
                  <h4>Informasi Pihak Terkait</h4>
                </div>
                <div className="space-y-3 text-sm">
                  {/* Recipient */}
                  <div>
                    <span className="text-xs text-muted-foreground block">Penerima</span>
                    {selectedAssignment.user ? (
                      <>
                        <span className="font-semibold text-foreground">
                          {selectedAssignment.user.nama_lengkap}
                        </span>
                        <span className="text-xs text-muted-foreground block font-mono">
                          NRP: {selectedAssignment.user.nrp || '-'}
                        </span>
                      </>
                    ) : selectedAssignment.unit ? (
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-info" />
                        <span className="font-semibold text-foreground">
                          {selectedAssignment.unit.nama_unit}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>

                  {/* Unit (if assigned to user + unit) */}
                  {selectedAssignment.user && selectedAssignment.unit && (
                    <div>
                      <span className="text-xs text-muted-foreground block">Unit Kerja</span>
                      <span className="font-medium text-foreground">
                        {selectedAssignment.unit.nama_unit}
                      </span>
                    </div>
                  )}

                  {/* Assigner */}
                  {selectedAssignment.assignedBy && (
                    <div>
                      <span className="text-xs text-muted-foreground block">Ditugaskan Oleh</span>
                      <span className="font-medium text-foreground">
                        {selectedAssignment.assignedBy.nama_lengkap}
                      </span>
                      <span className="text-xs text-muted-foreground block font-mono">
                        NRP: {selectedAssignment.assignedBy.nrp || '-'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dates & Notes */}
            <div className="space-y-4 border-t border-border pt-4">
              <div className="flex items-center gap-2 border-b border-border pb-2 text-foreground font-bold">
                <Calendar className="h-4.5 w-4.5 text-primary" />
                <h4>Tanggal & Catatan</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">Tanggal Assign</span>
                  <span className="font-medium">
                    {dayjs(selectedAssignment.assigned_at).format('DD MMM YYYY HH:mm')}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Tanggal Dikembalikan</span>
                  <span className={`font-medium ${selectedAssignment.returned_at ? 'text-success' : ''}`}>
                    {selectedAssignment.returned_at
                      ? dayjs(selectedAssignment.returned_at).format('DD MMM YYYY HH:mm')
                      : '-'}
                  </span>
                </div>
              </div>

              {selectedAssignment.notes && (
                <div className="bg-muted/20 p-3 rounded-lg border border-border/60">
                  <span className="text-xs text-muted-foreground font-bold block mb-1">
                    CATATAN
                  </span>
                  <p className="text-xs text-foreground italic whitespace-pre-line">
                    &quot;{selectedAssignment.notes}&quot;
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </AppModal>

      {/* ====== RETURN CONFIRMATION MODAL ====== */}
      <AppModal
        isOpen={isReturnOpen && !!selectedAssignment}
        onClose={() => {
          setIsReturnOpen(false)
          setReturnNotes('')
          setSelectedAssignment(null)
        }}
        title="Konfirmasi Pengembalian Assignment"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Apakah Anda yakin ingin mengembalikan assignment untuk aset{' '}
            <strong className="text-foreground">
              {selectedAssignment?.asset?.nama_barang}
            </strong>
            ?
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              Catatan Pengembalian{' '}
              <span className="text-muted-foreground font-normal normal-case">(opsional)</span>
            </label>
            <AppTextarea
              placeholder="Masukkan catatan pengembalian..."
              value={returnNotes}
              onChange={(e) => setReturnNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <AppButton
              variant="outline"
              onClick={() => {
                setIsReturnOpen(false)
                setReturnNotes('')
                setSelectedAssignment(null)
              }}
            >
              Batal
            </AppButton>
            <AppButton
              variant="danger"
              onClick={handleReturnSubmit}
              loading={submittingReturn}
            >
              Konfirmasi Pengembalian
            </AppButton>
          </div>
        </div>
      </AppModal>
    </PageShell>
  )
}
