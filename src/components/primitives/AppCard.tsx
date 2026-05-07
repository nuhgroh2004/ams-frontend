'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const appCardVariants = cva(
  'rounded-xl border transition-all overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-card border-border shadow-sm',
        elevated: 'bg-card border-border shadow-md',
        alert: 'bg-card border-border border-l-4 border-l-warning shadow-sm',
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-lg hover:border-primary/50',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      interactive: false,
    },
  }
)

interface AppCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appCardVariants> {}

const AppCard = React.forwardRef<HTMLDivElement, AppCardProps>(
  ({ className, variant, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(appCardVariants({ variant, interactive }), className)}
      {...props}
    />
  )
)
AppCard.displayName = 'AppCard'

const AppCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-5', className)} {...props} />
  )
)
AppCardHeader.displayName = 'AppCardHeader'

const AppCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight text-foreground', className)}
      {...props}
    />
  )
)
AppCardTitle.displayName = 'AppCardTitle'

const AppCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
)
AppCardDescription.displayName = 'AppCardDescription'

const AppCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-5 pt-0', className)} {...props} />
  )
)
AppCardContent.displayName = 'AppCardContent'

const AppCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-5 pt-0', className)} {...props} />
  )
)
AppCardFooter.displayName = 'AppCardFooter'

export { 
  AppCard, 
  AppCardHeader, 
  AppCardTitle, 
  AppCardDescription,
  AppCardContent, 
  AppCardFooter,
  appCardVariants 
}
export type { AppCardProps }