'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

interface AppModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full'
  showCloseButton?: boolean
}

const sizeClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
  full: 'sm:max-w-[95%]',
}

export function AppModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  size = 'md',
  showCloseButton = true,
}: AppModalProps) {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogPrimitive.Portal>
        {/* Soft, minimal Notion overlay */}
        <DialogPrimitive.Overlay className="bg-black/30 dark:bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200 fixed inset-0 z-50" />
        <DialogPrimitive.Content 
          className={cn(
            "fixed z-50 w-full sm:w-[unset] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]",
            // Mobile: slide up drawer style; Desktop: centered card
            "bottom-0 sm:bottom-auto max-h-[85vh] sm:max-h-[90vh]",
            "bg-background border border-border shadow-xl p-0 outline-none flex flex-col",
            // Notion-like: border-radius is medium (12px), transition is subtle
            "rounded-t-2xl sm:rounded-xl",
            "animate-in fade-in zoom-in-95 duration-200",
            size !== 'full' && sizeClasses[size],
            size === 'full' && 'sm:max-w-[95vw]',
            className
          )}
        >
          {/* Notion Header: borderless, simple, clean */}
          <div className="pt-5 px-6 pb-2 relative shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <DialogPrimitive.Title className="text-lg font-semibold text-foreground tracking-tight">
                  {title}
                </DialogPrimitive.Title>
                {description && (
                  <DialogPrimitive.Description className="text-xs text-muted-foreground">
                    {description}
                  </DialogPrimitive.Description>
                )}
              </div>
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors outline-none"
                >
                  <X className="h-4.5 w-4.5" />
                  <span className="sr-only">Close</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Content Area with custom scrollbar */}
          <div className="px-6 pb-6 pt-3 overflow-y-auto flex-1 custom-scrollbar scroll-smooth">
            <div className="min-h-0 text-sm text-foreground/90">
              {children}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
