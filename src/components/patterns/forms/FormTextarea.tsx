/**
 * Form Textarea Component
 * Textarea integrated with form field system
 */

import * as React from "react"
import { AppTextarea } from "@/components/primitives"
import { cn } from "@/lib/utils"

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  showCharCount?: boolean
}

/**
 * FormTextarea
 * Textarea component with optional character counter
 */
const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FormTextareaProps
>(
  (
    {
      className,
      error,
      showCharCount,
      maxLength,
      value,
      ...props
    },
    ref
  ) => {
    const charCount = typeof value === "string" ? value.length : 0

    return (
      <div className="space-y-1">
        <AppTextarea
          ref={ref}
          className={cn(className)}
          maxLength={maxLength}
          value={value}
          error={error}
          {...props}
        />
        {showCharCount && maxLength && (
          <div className="text-xs text-muted-foreground text-right">
            {charCount} / {maxLength}
          </div>
        )}
      </div>
    )
  }
)

FormTextarea.displayName = "FormTextarea"

export { FormTextarea }
export type { FormTextareaProps }
