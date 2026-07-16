'use client'

import React, { useState } from 'react'
import { PageShell, DataTable } from '@/components/patterns'
import { AppButton, AppCard, AppCardContent, AppModal, AppInput, AppSelect } from '@/components/primitives'
import { gql, useQuery, useMutation } from '@apollo/client'
import { toast } from '@/lib/toast'
import { Plus, Check, ClipboardList, ShieldAlert, FileText } from 'lucide-react'
import dayjs from 'dayjs'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { hasPermissionForUser } from '@/lib/permissions'

const GET_INVENTORIES = gql`
  query GetInventories($status: InventoryStatus, $page: Int, $limit: Int) {
    inventories(status: $status, page: $page, limit: $limit) {
      total
      page
      limit
      totalPages
      data {
        id
        tanggal_mulai
        tanggal_selesai
        status
        berita_acara_path
        unit {
          id
          nama_unit
        }
      }
    }
  }
`

const GET_INVENTORY_DETAILS = gql`
  query GetInventory($id: ID!) {
    inventory(id: $id) {
      id
      status
      unit {
        id
        nama_unit
      }
      details {
        id
        status_fisik
        keterangan
        asset {
          id
          nama_barang
          nomor_register
          kondisi
        }
      }
    }
  }
`

const GET_UNITS = gql`
  query GetUnits {
    units {
      id
      nama_unit
    }
    users(limit: 100) {
      data {
        id
        nama_lengkap
      }
    }
  }
`

const CREATE_INVENTORY = gql`
  mutation CreateInventorySchedule($input: CreateInventoryScheduleInput!) {
    createInventorySchedule(input: $input) {
      id
      status
    }
  }
`

const UPDATE_DETAIL = gql`
  mutation UpdateInventoryDetail($inventory_id: ID!, $asset_id: ID!, $status_fisik: InventoryPhysicalStatus!, $keterangan: String) {
    updateInventoryDetail(inventory_id: $inventory_id, asset_id: $asset_id, status_fisik: $status_fisik, keterangan: $keterangan) {
      id
      status_fisik
    }
  }
`

const COMPLETE_INVENTORY = gql`
  mutation CompleteInventory($id: ID!, $beritaAcara: Upload!) {
    completeInventory(id: $id, beritaAcara: $beritaAcara) {
      id
      status
    }
  }
`

export function InventoryModule() {
  const currentUser = useAuthStore((state) => state.user)
  const canCreate   = hasPermissionForUser(currentUser, 'inventory:create')
  const canEdit     = hasPermissionForUser(currentUser, 'inventory:edit')
  const canSignBAST = hasPermissionForUser(currentUser, 'inventory:bast')
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')
  const limit = 10

  const queryVariables: any = { page, limit }
  if (statusFilter !== 'all') {
    queryVariables.status = statusFilter
  }

  const { data, loading, refetch } = useQuery(GET_INVENTORIES, { variables: queryVariables })
  const { data: selectData } = useQuery(GET_UNITS)

  const [createInventoryMutation] = useMutation(CREATE_INVENTORY)
  const [updateDetailMutation] = useMutation(UPDATE_DETAIL)
  const [completeInventoryMutation] = useMutation(COMPLETE_INVENTORY)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isChecklistOpen, setIsChecklistOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | null>(null)

  // Checklist Detail Query
  const { data: detailData, refetch: refetchDetails, loading: loadingDetails } = useQuery(GET_INVENTORY_DETAILS, {
    variables: { id: selectedInventoryId || '' },
    skip: !selectedInventoryId,
  })

  // Create Form States
  const [selectedUnitId, setSelectedUnitId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [picId, setPicId] = useState('')

  // Upload State
  const [file, setFile] = useState<File | null>(null)

  const inventoriesList = data?.inventories?.data || []
  const totalPages = data?.inventories?.totalPages || 0
  const units = selectData?.units || []
  const usersList = selectData?.users?.data || []

  const handleCreateSchedule = async () => {
    if (!selectedUnitId || !startDate || !endDate || !picId) {
      toast.error('Semua kolom wajib diisi')
      return
    }

    try {
      await createInventoryMutation({
        variables: {
          input: {
            unit_id: selectedUnitId,
            tanggal_mulai: startDate,
            tanggal_selesai: endDate,
            pic_id: picId,
          },
        },
      })
      toast.success('Jadwal stock opname berhasil dibuat')
      setIsCreateOpen(false)
      refetch()
    } catch (err: any) {
      toast.error('Gagal membuat jadwal', err.message)
    }
  }

  const handleOpenChecklist = (id: string) => {
    setSelectedInventoryId(id)
    setIsChecklistOpen(true)
  }

  const handleUpdateStatusFisik = async (assetId: string, statusFisik: string) => {
    if (!selectedInventoryId) return
    try {
      await updateDetailMutation({
        variables: {
          inventory_id: selectedInventoryId,
          asset_id: assetId,
          status_fisik: statusFisik,
          keterangan: 'Pencocokan fisik',
        },
      })
      toast.success('Fisik aset terverifikasi')
      refetchDetails()
    } catch (err: any) {
      toast.error('Gagal memperbarui status', err.message)
    }
  }

  const handleCompleteOpname = async () => {
    if (!selectedInventoryId || !file) {
      toast.error('Dokumen BAST wajib dipilih')
      return
    }

    try {
      await completeInventoryMutation({
        variables: {
          id: selectedInventoryId,
          beritaAcara: file,
        },
      })
      toast.success('Opname berhasil diselesaikan dan status aset terupdate')
      setIsUploadOpen(false)
      setIsChecklistOpen(false)
      setSelectedInventoryId(null)
      refetch()
    } catch (err: any) {
      toast.error('Gagal menyelesaikan stock opname', err.message)
    }
  }

  const columns = [
    {
      accessorKey: 'unit.nama_unit',
      header: 'Unit Kerja',
    },
    {
      accessorKey: 'tanggal_mulai',
      header: 'Tanggal Mulai',
    },
    {
      accessorKey: 'tanggal_selesai',
      header: 'Tanggal Selesai',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const colors: Record<string, string> = {
          proses: 'bg-blue-500/10 text-blue-500',
          selesai: 'bg-green-500/10 text-green-500',
        }
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${colors[row.original.status] || ''}`}>
            {row.original.status}
          </span>
        )
      },
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }: any) => (
        <AppButton size="sm" icon={ClipboardList} onClick={() => handleOpenChecklist(row.original.id)}>
          {row.original.status === 'proses' ? 'Lakukan Checklist' : 'Lihat Detail'}
        </AppButton>
      ),
    },
  ]

  return (
    <PageShell title="Inventarisasi Aset (Stock Opname)" description="Jadwalkan stock opname dan lakukan verifikasi fisik aset secara berkala.">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-end bg-card p-4 rounded-2xl border border-border">
          <div className="w-full md:w-64">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-1.5 block">
              Filter Status Opname
            </label>
            <AppSelect
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val)
                setPage(1)
              }}
              options={[
                { value: 'all', label: 'Semua Status' },
                { value: 'proses', label: 'Dalam Proses' },
                { value: 'selesai', label: 'Selesai' },
              ]}
            />
          </div>
          {canCreate && (
            <AppButton icon={Plus} onClick={() => setIsCreateOpen(true)}>
              Buat Jadwal Opname
            </AppButton>
          )}
        </div>

        <DataTable
          columns={columns}
          data={inventoriesList}
          isLoading={loading}
          manualPagination
          pageCount={totalPages}
          pageIndex={page - 1}
          onPaginationChange={(state) => setPage(state.pageIndex + 1)}
        />
      </div>

      {/* Modal Buat Jadwal */}
      {isCreateOpen && (
        <AppModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Jadwalkan Stock Opname">
          <div className="space-y-4 pt-3">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Pilih Unit Kerja</label>
              <AppSelect
                value={selectedUnitId}
                onValueChange={setSelectedUnitId}
                options={[
                  { value: '', label: 'Pilih unit...' },
                  ...units.map((u: any) => ({ value: u.id, label: u.nama_unit })),
                ]}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Penanggung Jawab (PIC)</label>
              <AppSelect
                value={picId}
                onValueChange={setPicId}
                options={[
                  { value: '', label: 'Pilih PIC...' },
                  ...usersList.map((u: any) => ({ value: u.id, label: u.nama_lengkap })),
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Tanggal Mulai</label>
                <AppInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Tanggal Selesai</label>
                <AppInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <AppButton variant="outline" onClick={() => setIsCreateOpen(false)}>
                Batal
              </AppButton>
              <AppButton onClick={handleCreateSchedule}>Simpan Jadwal</AppButton>
            </div>
          </div>
        </AppModal>
      )}

      {/* Modal Checklist */}
      {isChecklistOpen && (
        <AppModal
          isOpen={isChecklistOpen}
          onClose={() => {
            setIsChecklistOpen(false)
            setSelectedInventoryId(null)
          }}
          title={`Checklist Fisik: ${detailData?.inventory?.unit?.nama_unit || ''}`}
          size="lg"
        >
          <div className="space-y-4 pt-3">
            {loadingDetails ? (
              <div className="flex items-center justify-center h-48">
                <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-border overflow-hidden bg-background">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b border-border text-left">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Nama Aset</th>
                        <th className="px-4 py-3 font-semibold">No Reg</th>
                        <th className="px-4 py-3 font-semibold text-center">Status Checklist</th>
                        {detailData?.inventory?.status === 'proses' && canEdit && <th className="px-4 py-3 font-semibold text-right">Verifikasi</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {detailData?.inventory?.details.map((d: any) => (
                        <tr key={d.id} className="hover:bg-muted/20">
                          <td className="px-4 py-3.5 font-medium">{d.asset.nama_barang}</td>
                          <td className="px-4 py-3.5 text-muted-foreground">{d.asset.nomor_register || '-'}</td>
                          <td className="px-4 py-3.5 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                                d.status_fisik === 'sesuai'
                                  ? 'bg-green-500/10 text-green-500'
                                  : d.status_fisik === 'rusak'
                                  ? 'bg-yellow-500/10 text-yellow-500'
                                  : 'bg-red-500/10 text-red-500'
                              }`}
                            >
                              {d.status_fisik}
                            </span>
                          </td>
                          {detailData?.inventory?.status === 'proses' && canEdit && (
                            <td className="px-4 py-3.5 text-right space-x-1.5">
                              <AppButton size="sm" onClick={() => handleUpdateStatusFisik(d.asset.id, 'sesuai')}>
                                Sesuai
                              </AppButton>
                              <AppButton size="sm" variant="outline" onClick={() => handleUpdateStatusFisik(d.asset.id, 'rusak')}>
                                Rusak
                              </AppButton>
                              <AppButton
                                size="sm"
                                variant="outline"
                                className="border-danger/30 text-danger hover:bg-danger/5"
                                onClick={() => handleUpdateStatusFisik(d.asset.id, 'tidak_ditemukan')}
                              >
                                Hilang
                              </AppButton>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border">
                  {detailData?.inventory?.berita_acara_path ? (
                    <a
                      href={detailData.inventory.berita_acara_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <FileText className="h-4 w-4" />
                      Unduh Berita Acara (BAST)
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">Belum ada dokumen BAST terunggah.</span>
                  )}
                  <div className="flex gap-2">
                    <AppButton
                      variant="outline"
                      onClick={() => {
                        setIsChecklistOpen(false)
                        setSelectedInventoryId(null)
                      }}
                    >
                      Tutup
                    </AppButton>
                    {detailData?.inventory?.status === 'proses' && canSignBAST && (
                      <AppButton onClick={() => setIsUploadOpen(true)}>
                        Selesaikan Stock Opname
                      </AppButton>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </AppModal>
      )}

      {/* Modal Upload BAST */}
      {isUploadOpen && (
        <AppModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Berita Acara Serah Terima">
          <div className="space-y-4 pt-3">
            <div className="p-4 rounded-xl bg-warning/5 border border-warning/10 flex gap-3 text-warning">
              <ShieldAlert className="h-5 w-5 flex-shrink-0" />
              <p className="text-xs leading-relaxed">
                Menyelesaikan stock opname akan memperbarui status fisik seluruh aset di database dan mengunci checklist ini.
                Anda wajib mengunggah file Berita Acara yang telah ditandatangani.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Pilih Dokumen PDF BAST</label>
              <input
                type="file"
                accept="application/pdf"
                className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <AppButton variant="outline" onClick={() => setIsUploadOpen(false)}>
                Batal
              </AppButton>
              <AppButton onClick={handleCompleteOpname}>Selesaikan</AppButton>
            </div>
          </div>
        </AppModal>
      )}
    </PageShell>
  )
}
