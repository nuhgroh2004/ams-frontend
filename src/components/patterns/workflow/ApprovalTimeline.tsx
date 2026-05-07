'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle2, Clock, XCircle } from 'lucide-react'

/**
 * ApprovalTimeline Pattern Component
 * Reusable timeline for approval workflows
 */

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'in-progress'

interface TimelineStep {
  id: string
  title: string
  description?: string
  status: ApprovalStatus
  timestamp?: Date
  approver?: string
  comment?: string
}

interface ApprovalTimelineProps {
  steps: TimelineStep[]
  currentStep?: string
  vertical?: boolean
  compact?: boolean
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
  },
  approved: {
    icon: CheckCircle2,
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
  },
  rejected: {
    icon: XCircle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/30',
  },
  'in-progress': {
    icon: Clock,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    borderColor: 'border-secondary/30',
  },
}

const ApprovalTimeline = React.forwardRef<
  HTMLDivElement,
  ApprovalTimelineProps
>(({ steps, currentStep, vertical = true, compact = false }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'space-y-4',
        vertical ? 'divide-y divide-border' : 'flex gap-4'
      )}
    >
      {steps.map((step, index) => {
        const config = statusConfig[step.status]
        const Icon = config.icon
        const isLastStep = index === steps.length - 1

        return (
          <div
            key={step.id}
            className={cn(
              'relative',
              vertical ? 'pt-4 first:pt-0' : 'flex-1'
            )}
          >
            {vertical && !isLastStep && (
              <div className="absolute left-5 top-12 w-0.5 h-8 bg-border" />
            )}

            <div className={cn('flex gap-4', compact && 'gap-3')}>
              <div
                className={cn(
                  'relative flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center',
                  config.bgColor,
                  'border border-border'
                )}
              >
                <Icon className={cn('h-5 w-5', config.color)} />
              </div>

              <div className={cn('flex-1 pb-2', compact && 'pb-0')}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      {step.title}
                    </p>
                    {step.description && !compact && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {step.description}
                      </p>
                    )}
                  </div>
                  {step.status && (
                    <span
                      className={cn(
                        'inline-flex px-2 py-1 rounded text-xs font-medium whitespace-nowrap',
                        'capitalize',
                        config.bgColor,
                        config.color,
                        'border',
                        config.borderColor
                      )}
                    >
                      {step.status.replace('-', ' ')}
                    </span>
                  )}
                </div>

                {!compact && (
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                    {step.timestamp && (
                      <div>
                        {step.timestamp.toLocaleDateString()} at{' '}
                        {step.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    )}
                    {step.approver && <div>By {step.approver}</div>}
                  </div>
                )}

                {step.comment && !compact && (
                  <div className="mt-2 p-2 rounded bg-muted border border-border">
                    <p className="text-xs text-muted-foreground italic">
                      {step.comment}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
})

ApprovalTimeline.displayName = 'ApprovalTimeline'

export { ApprovalTimeline, statusConfig }
export type { ApprovalTimelineProps, TimelineStep }
