import React from 'react'
import { AppModal, AppButton } from '@/components/primitives'
import { FileText, HelpCircle, CheckCircle2, XCircle } from 'lucide-react'
import { LossReportDTO } from '../types'

interface LossReportDetailModalProps {
  loss: LossReportDTO | null
  onClose: () => void
}

export function LossReportDetailModal({ loss, onClose }: LossReportDetailModalProps) {
  if (!loss) return null

  return (
    <AppModal isOpen={!!loss} onClose={onClose} title="Detail Laporan Kehilangan">
      <div className="space-y-6 pt-3">
        <div className="grid grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-xl border border-border">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase">Nama Aset</p>
            <p className="font-medium mt-0.5">{loss.asset.nama_barang}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase">Nomor Register</p>
            <p className="font-medium mt-0.5">{loss.asset.nomor_register || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase">Pelapor</p>
            <p className="font-medium mt-0.5">{loss.pelapor.nama_lengkap}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase">Nilai TGR</p>
            <p className="font-medium mt-0.5">{loss.nilai_ganti_rugi ? `Rp ${parseFloat(loss.nilai_ganti_rugi).toLocaleString()}` : '-'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-muted-foreground font-semibold uppercase">Kronologi Kejadian</p>
            <p className="mt-0.5">{loss.kronologi}</p>
          </div>
        </div>

        {/* Workflow Progress */}
        {loss.workflowInstance && (
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Pelacakan Alur Persetujuan Laporan</h4>
            <div className="space-y-4">
              {loss.workflowInstance.approvals.map((app: any) => {
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
                      <p className="font-semibold text-sm">
                        {app.step.nama_step} {app.step.role?.nama_role && `(${app.step.role.nama_role})`}
                      </p>
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
          {loss.dokumen_path ? (
            <a
              href={loss.dokumen_path}
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
          <AppButton variant="outline" onClick={onClose}>
            Tutup
          </AppButton>
        </div>
      </div>
    </AppModal>
  )
}
