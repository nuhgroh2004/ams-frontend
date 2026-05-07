'use client'

import * as React from 'react'
import { Checkbox as CheckboxPrimitive } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

export interface AppCheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive> {
  label?: string
  error?: string
}

const AppCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive>,
  AppCheckboxProps
>(({ className, label, error, ...props }, ref) => (
  <div className="space-y-1">
    <div className="flex items-center space-x-2">
      <CheckboxPrimitive
        ref={ref}
        className={cn(
          'h-5 w-5 rounded border-border bg-input transition-all',
          'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground',
          'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        {...props}
      />
      {label && (
        <label
          className={cn(
            'text-sm font-medium leading-none cursor-pointer select-none',
            props.disabled && 'cursor-not-allowed opacity-50'
          )}
          onClick={() => {
            if (!props.disabled) {
              // We rely on the peer-checked logic if needed, but manual trigger is also fine
            }
          }}
        >
          {label}
        </label>
      )}
    </div>
    {error && <p className="text-xs text-destructive ml-7">{error}</p>}
  </div>
))

AppCheckbox.displayName = 'AppCheckbox'

export { AppCheckbox }
