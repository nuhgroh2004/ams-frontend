'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { AppButton } from '@/components/primitives'
import { AppTextarea } from '@/components/primitives'
import { Check, X } from 'lucide-react'

/**
 * ApprovalAction Pattern Component
 * Action buttons and comment form for workflows
 */

interface ApprovalActionProps {
  onApprove: (comment?: string) => Promise<void> | void
  onReject: (comment?: string) => Promise<void> | void
  isLoading?: boolean
  showComment?: boolean
  commentPlaceholder?: string
  approveLabel?: string
  rejectLabel?: string
}

const ApprovalAction = React.forwardRef<
  HTMLDivElement,
  ApprovalActionProps
>(
  (
    {
      onApprove,
      onReject,
      isLoading = false,
      showComment = false,
      commentPlaceholder = 'Add a comment (optional)',
      approveLabel = 'Approve',
      rejectLabel = 'Reject',
    },
    ref
  ) => {
    const [comment, setComment] = React.useState('')
    const [isApproving, setIsApproving] = React.useState(false)
    const [isRejecting, setIsRejecting] = React.useState(false)

    const handleApprove = React.useCallback(async () => {
      setIsApproving(true)
      try {
        await onApprove(comment || undefined)
        setComment('')
      } finally {
        setIsApproving(false)
      }
    }, [comment, onApprove])

    const handleReject = React.useCallback(async () => {
      setIsRejecting(true)
      try {
        await onReject(comment || undefined)
        setComment('')
      } finally {
        setIsRejecting(false)
      }
    }, [comment, onReject])

    return (
      <div ref={ref} className="space-y-4">
        {showComment && (
          <div>
            <label htmlFor="approval-comment" className="block text-sm font-medium text-foreground mb-2">
              Comment (optional)
            </label>
            <AppTextarea
              id="approval-comment"
              placeholder={commentPlaceholder}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isLoading || isApproving || isRejecting}
              maxLength={500}
              showCharCount
            />
          </div>
        )}

        <div className="flex gap-3">
          <AppButton
            onClick={handleApprove}
            disabled={isLoading || isApproving || isRejecting}
            loading={isApproving}
            variant="primary"
            fullWidth
            icon={Check}
          >
            {approveLabel}
          </AppButton>

          <AppButton
            onClick={handleReject}
            disabled={isLoading || isApproving || isRejecting}
            loading={isRejecting}
            variant="danger"
            fullWidth
            icon={X}
          >
            {rejectLabel}
          </AppButton>
        </div>
      </div>
    )
  }
)

ApprovalAction.displayName = 'ApprovalAction'

export { ApprovalAction }
export type { ApprovalActionProps }
