'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

const appBadgeVariants = cva(
  'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition-all',
  {
    variants: {
      variant: {
        success: 'text-success',
        warning: 'text-warning',
        danger: 'text-destructive',
        info: 'text-secondary',
        neutral: 'text-muted-foreground',
      },
      badgeStyle: {
        // Dot style (seperti di gambar "Baik", "Rusak")
        dot: 'bg-card border border-border shadow-sm', 
        // Solid style (seperti di gambar "Intrakomptabel")
        solid: 'bg-muted text-foreground border border-transparent',
        // Outline style
        outline: 'border border-current bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      badgeStyle: 'solid',
    },
  }
)

export interface AppBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof appBadgeVariants> {
  dot?: boolean
  removable?: boolean
  onRemove?: () => void
  icon?: React.ComponentType<{ className?: string }>
}

const AppBadge = React.forwardRef<HTMLSpanElement, AppBadgeProps>(
  (
    { 
      className, 
      variant, 
      badgeStyle, 
      dot,
      removable, 
      onRemove, 
      icon: Icon, 
      children, 
      ...props 
    },
    ref
  ) => {
    // Jika prop dot={true} dikirim, paksa style menjadi 'dot'
    const activeStyle = dot ? 'dot' : badgeStyle

    return (
      <span
        ref={ref}
        className={cn(appBadgeVariants({ variant, badgeStyle: activeStyle }), className)}
        {...props}
      >
        {/* Jika style dot, tampilkan titik bulat kecil */}
        {activeStyle === 'dot' && (
        <span 
          className={cn('h-1.5 w-1.5 rounded-full', {
            'bg-success': variant === 'success',
            'bg-warning': variant === 'warning',
            'bg-destructive': variant === 'danger',
            'bg-secondary': variant === 'info',
            'bg-muted-foreground': variant === 'neutral',
          })} 
        />
      )}
      
      {Icon && <Icon className="h-3 w-3" />}
      {children}
      
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 hover:opacity-70"
          aria-label="Remove"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  )
})

AppBadge.displayName = 'AppBadge'

export { AppBadge, appBadgeVariants }