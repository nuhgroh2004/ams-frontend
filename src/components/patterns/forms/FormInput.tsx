/**
 * Form Input Component
 * Extends base Input with form field integration
 */

import * as React from "react"
import { AppInput } from "@/components/primitives"
import { cn } from "@/lib/utils"

interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, error, ...props }, ref) => (
    <div className="relative">
      <AppInput
        ref={ref}
        className={cn(className)}
        error={error}
        {...props}
      />
    </div>
  )
)

FormInput.displayName = "FormInput"

export { FormInput }
export type { FormInputProps }
