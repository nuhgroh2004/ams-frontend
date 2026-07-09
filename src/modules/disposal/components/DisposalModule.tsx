'use client'

import React, { useState } from 'react'
import { PageShell, DataTable } from '@/components/patterns'
import { AppButton, AppCard, AppCardContent, AppModal, AppInput, AppSelect, AppTextarea } from '@/components/primitives'
import { gql, useQuery, useMutation } from '@apollo/client'
import { toast } from '@/lib/toast'
import { Plus, Eye, ShieldAlert, FileText, CheckCircle2, XCircle, HelpCircle } from 'lucide-react'
import dayjs from 'dayjs'

const GET_DISPOSALS = gql`
  query GetDisposals($status: String, $page: Int, $limit: Int) {
    disposals(status: $status, page: $page, limit: $limit) {
      total
      page
      limit
      totalPages
      data {
        id
        asset_id
        alasan_penghapusan
        dokumen_path
        nilai_penjualan
        tanggal_penghapusan
        created_at
        asset {
          id
          nama_barang
          nomor_register
        }
        workflowInstance {
          id
          status
          approvals {
            id
            status
            notes
            approved_at
            step {
              nama_step
            }
            approver {
              nama_lengkap
            }
          }
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

const AJUKAN_DISPOSAL = gql`
  mutation AjukanDisposal($input: AjukanDisposalInput!, $dokumen: Upload) {
    ajukanDisposal(input: $input, dokumen: $dokumen) {
      id
    }
  }
`

export function DisposalModule() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')
  const limit = 10

  const variables: any = { page, limit }
  if (statusFilter !== 'all') variables.status = statusFilter

  const { data, loading, refetch } = useQuery(GET_DISPOSALS, { variables })
  const { data: assetData } = useQuery(GET_ASSETS_SIMPLE)

  const [ajukanDisposalMutation] = useMutation(AJUKAN_DISPOSAL)

  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [selectedDisposal, setSelectedDisposal] = useState<any | null>(null)

  // Submit Form States
  const [selectedAssetId, setSelectedAssetId] = useState('')
  const [alasan, setAlasan] = useState('')
  const [nilaiPenjualan, setNilaiPenjualan] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const disposalsList = data?.disposals?.data || []
  const totalPages = data?.disposals?.totalPages || 0
  const assets = assetData?.assets?.data || []

  const handleSubmitDisposal = async () => {
    if (!selectedAssetId || !alasan) {
      toast.error('Aset dan Alasan wajib diisi')
      return
    }

    try {
      await ajukanDisposalMutation({
        variables: {
          input: {
            asset_id: selectedAssetId,
            alasan_penghapusan: alasan,
            nilai_penjualan: parseFloat(nilaiPenjualan) || 0,
          },
          dokumen: file,
        },
      })
      toast.success('Pengajuan penghapusan berhasil diajukan untuk proses persetujuan')
      setIsSubmitOpen(false)
      refetch()
      // reset
      setSelectedAssetId('')
      setAlasan('')
      setNilaiPenjualan('')
      setFile(null)
    } catch (err: any) {
      toast.error('Gagal mengajukan penghapusan', err.message)
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
      accessorKey: 'alasan_penghapusan',
      header: 'Alasan',
      cell: ({ row }: any) => <span className="truncate block max-w-xs">{row.original.alasan_penghapusan}</span>,
    },
    {
      accessorKey: 'nilai_penjualan',
      header: 'Nilai Penjualan',
      cell: ({ row }: any) => row.original.nilai_penjualan ? `Rp ${parseFloat(row.original.nilai_penjualan).toLocaleString()}` : '-',
    },
    {
      accessorKey: 'workflowInstance.status',
      header: 'Status Approval',
      cell: ({ row }: any) => {
        const statusMap: Record<string, { label: string; class: string }> = {
          dalam_proses: { label: 'Dalam Proses', class: 'bg-blue-500/10 text-blue-500' },
          disetujui: { label: 'Disetujui', class: 'bg-green-500/10 text-green-500' },
          ditolak: { label: 'Ditolak', class: 'bg-red-500/10 text-red-500' },
        }
        const state = statusMap[row.original.workflowInstance?.status] || { label: 'Draft', class: 'bg-muted text-muted-foreground' }
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${state.class}`}>
            {state.label}
          </span>
        )
      },
    },
    {
      id: 'actions',
      header: 'Detail',
      cell: ({ row }: any) => (
        <AppButton size="sm" variant="outline" icon={Eye} onClick={() => setSelectedDisposal(row.original)}>
          Detail
        </AppButton>
      ),
    },
  ]

  return (
    <PageShell title="Penghapusan Aset BMN" description="Ajukan dan pantau persetujuan penghapusan aset negara yang rusak berat atau hilang dari inventaris.">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-end bg-card p-4 rounded-2xl border border-border">
          <div className="w-full md:w-64">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-1.5 block">
              Filter Status Workflow
            </label>
            <AppSelect
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={[
                { value: 'all', label: 'Semua Status' },
                { value: 'dalam_proses', label: 'Dalam Proses' },
                { value: 'disetujui', label: 'Disetujui (Selesai)' },
                { value: 'ditolak', label: 'Ditolak' },
              ]}
            />
          </div>
          <AppButton icon={Plus} onClick={() => setIsSubmitOpen(true)}>
            Ajukan Penghapusan
          </AppButton>
        </div>

        <DataTable
          columns={columns}
          data={disposalsList}
          isLoading={loading}
          manualPagination
          pageCount={totalPages}
          pageIndex={page - 1}
          onPaginationChange={(state) => setPage(state.pageIndex + 1)}
        />
      </div>

      {/* Modal Ajukan Disposal */}
      {isSubmitOpen && (
        <AppModal isOpen={isSubmitOpen} onClose={() => setIsSubmitOpen(false)} title="Ajukan Usulan Penghapusan BMN">
          <div className="space-y-4 pt-3">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Pilih Aset</label>
              <AppSelect
                value={selectedAssetId}
                onValueChange={setSelectedAssetId}
                options={[
                  { value: '', label: 'Pilih aset...' },
                  ...assets.map((a: any) => ({
                    value: a.id,
                    label: `${a.nama_barang} (${a.nomor_register || '-'})`,
                  })),
                ]}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Alasan Penghapusan</label>
              <AppTextarea
                placeholder="Tulis alasan logis pemusnahan atau penghapusan aset (misal: rusak berat & tidak bernilai ekonomis)..."
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Perkiraan Nilai Jual/Lelang (Rp) (Opsional)</label>
              <AppInput
                type="number"
                placeholder="0"
                value={nilaiPenjualan}
                onChange={(e) => setNilaiPenjualan(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Dokumen Justifikasi (PDF/Gambar)</label>
              <input
                type="file"
                className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <AppButton variant="outline" onClick={() => setIsSubmitOpen(false)}>
                Batal
              </AppButton>
              <AppButton onClick={handleSubmitDisposal}>Ajukan Usulan</AppButton>
            </div>
          </div>
        </AppModal>
      )}

      {/* Modal Detail & Pelacakan Workflow */}
      {selectedDisposal && (
        <AppModal isOpen={!!selectedDisposal} onClose={() => setSelectedDisposal(null)} title="Detail Usulan Penghapusan">
          <div className="space-y-6 pt-3">
            <div className="grid grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-xl border border-border">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Nama Aset</p>
                <p className="font-medium mt-0.5">{selectedDisposal.asset.nama_barang}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Nomor Register</p>
                <p className="font-medium mt-0.5">{selectedDisposal.asset.nomor_register || '-'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground font-semibold uppercase">Alasan Penghapusan</p>
                <p className="mt-0.5">{selectedDisposal.alasan_penghapusan}</p>
              </div>
            </div>

            {/* Workflow Progress */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Pelacakan Alur Persetujuan</h4>
              <div className="space-y-4">
                {selectedDisposal.workflowInstance?.approvals.map((app: any, idx: number) => {
                  let Icon = HelpCircle
                  let color = 'text-muted-foreground border-muted'
                  if (app.status === 'disetujui') {
                    Icon = CheckCircle2
                    color = 'text-green-500 border-green-500 bg-green-500/5'
                  } else if (app.status === 'ditolak') {
                    Icon = XCircle
                    color = 'text-danger border-danger bg-danger/5'
                  }

                  return (
                    <div key={app.id} className={`flex items-start gap-3 p-3 rounded-xl border ${color}`}>
                      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-semibold text-sm">{app.step.nama_step}</p>
                        <p className="text-xs">
                          Status: <strong className="uppercase">{app.status}</strong> 
                          {app.approver?.nama_lengkap && ` oleh ${app.approver.nama_lengkap}`}
                        </p>
                        {app.notes && <p className="text-xs italic bg-background/50 p-2 rounded mt-1.5 border border-border">Catatan: {app.notes}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border">
              {selectedDisposal.dokumen_path ? (
                <a
                  href={selectedDisposal.dokumen_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <FileText className="h-4 w-4" />
                  Lihat Dokumen Pendukung
                </a>
              ) : (
                <span className="text-xs text-muted-foreground italic">Tidak ada dokumen pendukung.</span>
              )}
              <AppButton variant="outline" onClick={() => setSelectedDisposal(null)}>
                Tutup
              </AppButton>
            </div>
          </div>
        </AppModal>
      )}
    </PageShell>
  )
}
