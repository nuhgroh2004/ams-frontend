'use client'

import * as React from 'react'
import { Input as UIInput } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface AppInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  icon?: React.ComponentType<{ className?: string }>
  iconPosition?: 'left' | 'right'
  sz?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-9 text-xs rounded-md',
  md: 'h-10 text-sm rounded-lg',
  lg: 'h-12 text-base rounded-xl',
}

const iconSizeClasses = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

const paddingClasses = {
  sm: {
    left: 'pl-9',
    right: 'pr-9',
  },
  md: {
    left: 'pl-10',
    right: 'pr-10',
  },
  lg: {
    left: 'pl-12',
    right: 'pr-12',
  },
}

const AppInput = React.forwardRef<HTMLInputElement, AppInputProps>(
  (
    {
      className,
      error,
      icon: Icon,
      iconPosition = 'left',
      sz = 'md',
      ...props
    },
    ref
  ) => {
    return (
      <div className={Icon ? 'relative' : ''}>
        {Icon && (
          <Icon
            className={cn(
              'absolute top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none',
              iconSizeClasses[sz],
              iconPosition === 'left' ? 'left-3' : 'right-3'
            )}
          />
        )}

        <UIInput
          ref={ref}
          className={cn(
            'bg-input border-border text-foreground placeholder:text-muted-foreground',
            'focus:border-primary focus:ring-1 focus:ring-primary',
            'px-3 py-2 transition-all duration-200',
            sizeClasses[sz],

            error &&
              'border-destructive focus:border-destructive focus:ring-destructive',

            Icon &&
              paddingClasses[sz][
                iconPosition === 'left' ? 'left' : 'right'
              ],

            'disabled:opacity-50 disabled:cursor-not-allowed',

            className
          )}
          {...props}
        />

        {error && (
          <p className="mt-1 text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
    )
  }
)

AppInput.displayName = 'AppInput'

export { AppInput }