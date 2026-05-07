'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from '@/components/ui/dialog'
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="bg-background/80 backdrop-blur-sm animate-in fade-in duration-200 fixed inset-0 z-50" />
        <DialogContent 
          className={cn(
            "fixed left-[50%] top-[50%] z-50 w-[95vw] sm:w-[unset] translate-x-[-50%] translate-y-[-50%]",
            "bg-card border border-border shadow-2xl rounded-2xl p-0 outline-none",
            "animate-in fade-in zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-48 duration-200",
            "flex flex-col max-h-[90vh]", 
            size !== 'full' && sizeClasses[size],
            size === 'full' && 'sm:max-w-[95vw]',
            className
          )}
        >
          {/* Header */}
          <DialogHeader className="p-6 pb-4 relative border-b border-border shrink-0">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <DialogTitle className="text-xl font-bold text-foreground tracking-tight">
                  {title}
                </DialogTitle>
                {description && (
                  <DialogDescription className="text-sm text-muted-foreground">
                    {description}
                  </DialogDescription>
                )}
              </div>
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all outline-none border border-transparent hover:border-border"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </button>
              )}
            </div>
          </DialogHeader>
          
          {/* Content Area with Auto-Scroll */}
          <div className="p-6 pt-4 overflow-y-auto flex-1 custom-scrollbar scroll-smooth">
            <div className="min-h-0">
              {children}
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}