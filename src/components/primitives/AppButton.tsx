'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

/**
 * AppButton
 * Design system controlled button primitive
 * * ENTRY POINT for all button usage in the app
 * Wraps ui/button with design system styling and behavior
 */

const appButtonVariants = cva(
  // UPDATE: Mengubah rounded-lg menjadi rounded-full untuk bentuk pill sesuai desain
  'inline-flex items-center justify-center rounded-full font-medium transition-all focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        // Primary - Menggunakan warna Oranye (Primary variable)
        primary:
          'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 focus-visible:ring-primary',

        // Secondary - Menggunakan warna Muted sesuai desain visual (Navy/Grey)
        secondary:
          'bg-muted text-foreground hover:bg-muted/80 active:bg-muted/90 focus-visible:ring-muted',

        // Outline - Menggunakan border dan teks Primary
        outline:
          'border border-primary text-primary hover:bg-primary/10 active:bg-primary/20 focus-visible:ring-primary',

        // Danger - Menggunakan semantic destructive
        danger:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80 focus-visible:ring-destructive',

        // Ghost - Transparent background
        ghost:
          'text-foreground hover:bg-muted active:bg-muted/80 focus-visible:ring-muted',
      },
      size: {
        // Compact - 36px height (touch minimum 44px with padding)
        sm: 'h-8 px-4 gap-2 text-xs',
        md: 'h-10 px-6 gap-2 text-sm', // Disesuaikan agar sedikit lebih lebar dan nyaman untuk pill shape
        lg: 'h-12 px-8 gap-2 text-base',
        // Icon only
        icon: 'h-10 w-10 p-0',
        icon_sm: 'h-8 w-8 p-0',
        icon_lg: 'h-12 w-12 p-0',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
)

interface AppButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof appButtonVariants> {
  loading?: boolean
  icon?: React.ComponentType<{ className?: string }>
  iconPosition?: 'left' | 'right'
}

const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading,
      icon: Icon,
      iconPosition = 'left',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          appButtonVariants({ variant, size, fullWidth }),
          'relative',
          className
        )}
        {...props}
      >
        {/* Loading spinner overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        {/* Content - fade when loading */}
        <span className={cn('flex items-center gap-2', loading && 'invisible')}>
          {Icon && iconPosition === 'left' && (
            <Icon className={size?.startsWith('icon') ? 'h-5 w-5' : 'h-4 w-4'} />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon className={size?.startsWith('icon') ? 'h-5 w-5' : 'h-4 w-4'} />
          )}
        </span>
      </button>
    )
  }
)

AppButton.displayName = 'AppButton'

export { AppButton, appButtonVariants }
export type { AppButtonProps }