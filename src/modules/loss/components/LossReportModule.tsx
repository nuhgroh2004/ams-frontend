'use client'

import React, { useState } from 'react'
import { PageShell, DataTable } from '@/components/patterns'
import { AppButton, AppCard, AppCardContent, AppModal, AppInput, AppSelect, AppTextarea } from '@/components/primitives'
import { gql, useQuery, useMutation } from '@apollo/client'
import { toast } from '@/lib/toast'
import { Plus, Eye, FileText, CheckCircle2, XCircle, HelpCircle, AlertTriangle, Landmark } from 'lucide-react'
import dayjs from 'dayjs'

const GET_LOSS_REPORTS = gql`
  query GetLossReports($status: LossReportStatus, $page: Int, $limit: Int) {
    lossReports(status: $status, page: $page, limit: $limit) {
      total
      page
      limit
      totalPages
      data {
        id
        asset_id
        pelapor_id
        kronologi
        dokumen_path
        status_proses
        nilai_ganti_rugi
        created_at
        asset {
          id
          nama_barang
          nomor_register
        }
        pelapor {
          id
          nama_lengkap
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

const AJUKAN_KEHILANGAN = gql`
  mutation AjukanKehilangan($input: AjukanKehilanganInput!, $dokumen: Upload) {
    ajukanKehilangan(input: $input, dokumen: $dokumen) {
      id
    }
  }
`

const PROSES_TGR = gql`
  mutation ProsesTGR($id: ID!, $nilai_ganti_rugi: Float!) {
    prosesTGR(id: $id, nilai_ganti_rugi: $nilai_ganti_rugi) {
      id
      status_proses
    }
  }
`

const SELESAIKAN_KEHILANGAN = gql`
  mutation SelesaikanKehilangan($id: ID!) {
    selesaikanKehilangan(id: $id) {
      id
      status_proses
    }
  }
`

export function LossReportModule() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')
  const limit = 10

  const variables: any = { page, limit }
  if (statusFilter !== 'all') variables.status = statusFilter

  const { data, loading, refetch } = useQuery(GET_LOSS_REPORTS, { variables })
  const { data: assetData } = useQuery(GET_ASSETS_SIMPLE)

  const [ajukanKehilanganMutation] = useMutation(AJUKAN_KEHILANGAN)
  const [prosesTGRMutation] = useMutation(PROSES_TGR)
  const [selesaikanKehilanganMutation] = useMutation(SELESAIKAN_KEHILANGAN)

  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [isTGROpen, setIsTGROpen] = useState(false)
  const [selectedLoss, setSelectedLoss] = useState<any | null>(null)

  // Submit Form States
  const [selectedAssetId, setSelectedAssetId] = useState('')
  const [kronologi, setKronologi] = useState('')
  const [file, setFile] = useState<File | null>(null)

  // TGR State
  const [nilaiGantiRugi, setNilaiGantiRugi] = useState('')

  const lossList = data?.lossReports?.data || []
  const totalPages = data?.lossReports?.totalPages || 0
  const assets = assetData?.assets?.data || []

  const handleSubmitLoss = async () => {
    if (!selectedAssetId || !kronologi) {
      toast.error('Aset dan Kronologi wajib diisi')
      return
    }

    try {
      await ajukanKehilanganMutation({
        variables: {
          input: {
            asset_id: selectedAssetId,
            kronologi,
          },
          dokumen: file,
        },
      })
      toast.success('Laporan kehilangan berhasil dibuat dan workflow persetujuan dimulai')
      setIsSubmitOpen(false)
      refetch()
      // reset
      setSelectedAssetId('')
      setKronologi('')
      setFile(null)
    } catch (err: any) {
      toast.error('Gagal melaporkan kehilangan', err.message)
    }
  }

  const handleProsesTGRClick = (loss: any) => {
    setSelectedLoss(loss)
    setIsTGROpen(true)
    setNilaiGantiRugi('')
  }

  const handleProsesTGRConfirm = async () => {
    if (!selectedLoss || !nilaiGantiRugi) return

    try {
      await prosesTGRMutation({
        variables: {
          id: selectedLoss.id,
          nilai_ganti_rugi: parseFloat(nilaiGantiRugi) || 0,
        },
      })
      toast.success('TGR berhasil diproses')
      setIsTGROpen(false)
      setSelectedLoss(null)
      refetch()
    } catch (err: any) {
      toast.error('Gagal memproses TGR', err.message)
    }
  }

  const handleSelesaikanKehilangan = async (id: string) => {
    try {
      await selesaikanKehilanganMutation({ variables: { id } })
      toast.success('Laporan ganti rugi diselesaikan')
      refetch()
    } catch (err: any) {
      toast.error('Gagal menyelesaikan kasus', err.message)
    }
  }

  const columns = [
    {
      accessorKey: 'asset.nama_barang',
      header: 'Aset Hilang',
      cell: ({ row }: any) => (
        <div>
          <p className="font-semibold text-sm">{row.original.asset.nama_barang}</p>
          <p className="text-xs text-muted-foreground">{row.original.asset.nomor_register || '-'}</p>
        </div>
      ),
    },
    {
      accessorKey: 'pelapor.nama_lengkap',
      header: 'Pelapor',
    },
    {
      accessorKey: 'status_proses',
      header: 'Status Kasus',
      cell: ({ row }: any) => {
        const statusMap: Record<string, { label: string; class: string }> = {
          lapor: { label: 'Laporan Masuk', class: 'bg-yellow-500/10 text-yellow-500' },
          proses_tgr: { label: 'Proses TGR', class: 'bg-blue-500/10 text-blue-500' },
          selesai: { label: 'Selesai', class: 'bg-green-500/10 text-green-500' },
          ditolak: { label: 'Ditolak', class: 'bg-red-500/10 text-red-500' },
        }
        const state = statusMap[row.original.status_proses] || { label: 'Draft', class: 'bg-muted text-muted-foreground' }
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${state.class}`}>
            {state.label}
          </span>
        )
      },
    },
    {
      accessorKey: 'nilai_ganti_rugi',
      header: 'Nilai TGR',
      cell: ({ row }: any) => row.original.nilai_ganti_rugi ? `Rp ${parseFloat(row.original.nilai_ganti_rugi).toLocaleString()}` : '-',
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }: any) => {
        if (row.original.status_proses === 'proses_tgr') {
          return (
            <div className="flex gap-2">
              <AppButton size="sm" icon={Landmark} onClick={() => handleProsesTGRClick(row.original)}>
                TGR
              </AppButton>
              <AppButton size="sm" variant="outline" onClick={() => handleSelesaikanKehilangan(row.original.id)}>
                Selesai
              </AppButton>
            </div>
          )
        }
        return (
          <AppButton size="sm" variant="outline" icon={Eye} onClick={() => setSelectedLoss(row.original)}>
            Detail
          </AppButton>
        )
      },
    },
  ]

  return (
    <PageShell title="Laporan Kehilangan Aset BMN" description="Laporkan aset negara yang hilang dan proses tuntutan ganti rugi (TGR) sesuai peraturan yang berlaku.">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-end bg-card p-4 rounded-2xl border border-border">
          <div className="w-full md:w-64">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-1.5 block">
              Filter Status Kasus
            </label>
            <AppSelect
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={[
                { value: 'all', label: 'Semua Status' },
                { value: 'lapor', label: 'Laporan Baru' },
                { value: 'proses_tgr', label: 'Tuntutan Ganti Rugi (TGR)' },
                { value: 'selesai', label: 'Selesai' },
              ]}
            />
          </div>
          <AppButton icon={Plus} onClick={() => setIsSubmitOpen(true)}>
            Lapor Kehilangan
          </AppButton>
        </div>

        <DataTable
          columns={columns}
          data={lossList}
          isLoading={loading}
          manualPagination
          pageCount={totalPages}
          pageIndex={page - 1}
          onPaginationChange={(state) => setPage(state.pageIndex + 1)}
        />
      </div>

      {/* Modal Lapor Kehilangan */}
      {isSubmitOpen && (
        <AppModal isOpen={isSubmitOpen} onClose={() => setIsSubmitOpen(false)} title="Buat Laporan Kehilangan BMN">
          <div className="space-y-4 pt-3">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Pilih Aset yang Hilang</label>
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
              <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Kronologi Kejadian</label>
              <AppTextarea
                placeholder="Tuliskan tempat kejadian, tanggal, dan kronologi hilangnya aset secara jelas..."
                value={kronologi}
                onChange={(e) => setKronologi(e.target.value)}
                rows={4}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Surat Laporan / Bukti Pendukung (Opsional)</label>
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
              <AppButton onClick={handleSubmitLoss}>Kirim Laporan</AppButton>
            </div>
          </div>
        </AppModal>
      )}

      {/* Modal TGR */}
      {isTGROpen && (
        <AppModal isOpen={isTGROpen} onClose={() => { setIsTGROpen(false); setSelectedLoss(null); }} title="Proses Tuntutan Ganti Rugi (TGR)">
          <div className="space-y-4 pt-3">
            <div className="p-4 rounded-xl bg-danger/5 border border-danger/10 flex gap-3 text-danger">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <p className="text-xs leading-relaxed">
                Peringatan: Tentukan nilai ganti rugi (TGR) yang wajib dibayarkan oleh personel penanggung jawab atas hilangnya barang milik negara.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Nilai Ganti Rugi (Rp)</label>
              <AppInput
                type="number"
                placeholder="Masukkan besaran tuntutan nominal..."
                value={nilaiGantiRugi}
                onChange={(e) => setNilaiGantiRugi(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <AppButton variant="outline" onClick={() => { setIsTGROpen(false); setSelectedLoss(null); }}>
                Batal
              </AppButton>
              <AppButton variant="danger" onClick={handleProsesTGRConfirm}>
                Terapkan TGR
              </AppButton>
            </div>
          </div>
        </AppModal>
      )}

      {/* Modal Detail Loss & Pelacakan */}
      {selectedLoss && !isTGROpen && (
        <AppModal isOpen={!!selectedLoss} onClose={() => setSelectedLoss(null)} title="Detail Laporan Kehilangan">
          <div className="space-y-6 pt-3">
            <div className="grid grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-xl border border-border">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Nama Aset</p>
                <p className="font-medium mt-0.5">{selectedLoss.asset.nama_barang}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Nomor Register</p>
                <p className="font-medium mt-0.5">{selectedLoss.asset.nomor_register || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Pelapor</p>
                <p className="font-medium mt-0.5">{selectedLoss.pelapor.nama_lengkap}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Nilai TGR</p>
                <p className="font-medium mt-0.5">{selectedLoss.nilai_ganti_rugi ? `Rp ${parseFloat(selectedLoss.nilai_ganti_rugi).toLocaleString()}` : '-'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground font-semibold uppercase">Kronologi Kejadian</p>
                <p className="mt-0.5">{selectedLoss.kronologi}</p>
              </div>
            </div>

            {/* Workflow Progress */}
            {selectedLoss.workflowInstance && (
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Pelacakan Alur Persetujuan Laporan</h4>
                <div className="space-y-4">
                  {selectedLoss.workflowInstance.approvals.map((app: any) => {
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
            )}

            <div className="flex justify-between items-center pt-4 border-t border-border">
              {selectedLoss.dokumen_path ? (
                <a
                  href={selectedLoss.dokumen_path}
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
              <AppButton variant="outline" onClick={() => setSelectedLoss(null)}>
                Tutup
              </AppButton>
            </div>
          </div>
        </AppModal>
      )}
    </PageShell>
  )
}
