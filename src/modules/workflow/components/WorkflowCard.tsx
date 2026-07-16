import React from 'react'
import { AppCard, AppCardContent, AppButton } from '@/components/primitives'
import { Clock, Check, X } from 'lucide-react'
import dayjs from 'dayjs'

interface WorkflowCardProps {
  app: any
  onAction: (app: any, type: 'approve' | 'reject') => void
}

export function WorkflowCard({ app, onAction }: WorkflowCardProps) {
  return (
    <AppCard className="hover:shadow-md transition-shadow">
      <AppCardContent className="p-6 flex flex-col justify-between h-full">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary w-fit">
                <Clock className="h-3.5 w-3.5" />
                Langkah {app.step.step_order}: {app.step.nama_step}
              </span>
              {app.step.role?.nama_role && (
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider pl-1">
                  Peran Approver: {app.step.role.nama_role}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {dayjs(app.workflowInstance.started_at).format('YYYY-MM-DD')}
            </span>
          </div>

          <div className="flex justify-between items-start gap-4">
            <div>
              <h4 className="font-semibold text-base">{app.workflowInstance.workflow?.nama_workflow}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                ID Pengajuan: <strong className="text-foreground">#{app.workflowInstance.entity_id}</strong>
              </p>
            </div>
          </div>

          {/* Workflow progress line */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Detail Alur Instansi
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {app.workflowInstance.workflow?.steps.map((st: any, idx: number) => {
                const isCurrent = st.step_order === app.step.step_order
                const isPassed = st.step_order < app.step.step_order
                return (
                  <React.Fragment key={st.id}>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        isCurrent
                          ? 'bg-primary text-primary-foreground font-semibold ring-1 ring-primary/30'
                          : isPassed
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {st.nama_step}
                    </span>
                    {idx < app.workflowInstance.workflow.steps.length - 1 && (
                      <span className="text-muted-foreground text-xs font-mono">→</span>
                    )}
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          <div className="pt-2 text-xs flex justify-between items-center text-muted-foreground">
            <span>
              Diajukan oleh: <strong className="text-foreground">{app.workflowInstance.startedBy?.nama_lengkap}</strong>
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border mt-6">
          <AppButton
            variant="outline"
            size="sm"
            className="text-danger hover:text-danger hover:bg-danger/5 border-danger/20 hover:border-danger/40"
            icon={X}
            onClick={() => onAction(app, 'reject')}
          >
            Tolak
          </AppButton>
          <AppButton
            size="sm"
            icon={Check}
            onClick={() => onAction(app, 'approve')}
          >
            Setujui
          </AppButton>
        </div>
      </AppCardContent>
    </AppCard>
  )
}
export default WorkflowCard
