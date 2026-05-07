'use client'

import * as React from 'react'
import { Textarea as UITextarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

/**
 * AppTextarea
 * Design system controlled textarea primitive
 * 
 * ENTRY POINT for all textarea usage
 * Wraps ui/textarea with design system styling
 * 
 * @example
 * import { AppTextarea } from '@/components/primitives'
 * 
 * <AppTextarea maxLength={500} showCharCount />
 */

interface AppTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  showCharCount?: boolean
}

const AppTextarea = React.forwardRef<HTMLTextAreaElement, AppTextareaProps>(
  ({ className, error, showCharCount, maxLength, value, ...props }, ref) => {
    const charCount = typeof value === 'string' ? value.length : 0

    return (
      <div className="space-y-1">
        <UITextarea
          ref={ref}
          className={cn(
            // Design system colors
            'bg-white text-slate-900 placeholder-slate-400',
            'border border-slate-300',
            'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
            // Dark mode
            'dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500',
            'dark:border-slate-700',
            'dark:focus:border-blue-400 dark:focus:ring-blue-400/20',
            // Error state
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            // Spacing
            'px-3 py-2 text-sm',
            // Disabled
            'disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed',
            'dark:disabled:bg-slate-900 dark:disabled:text-slate-600',
            className
          )}
          maxLength={maxLength}
          value={value}
          {...props}
        />
        <div className="flex items-center justify-between gap-2">
          {error && (
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          )}
          {showCharCount && maxLength && (
            <p className="text-xs text-slate-500 dark:text-slate-400 ml-auto">
              {charCount} / {maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)

AppTextarea.displayName = 'AppTextarea'

export { AppTextarea }
export type { AppTextareaProps }
