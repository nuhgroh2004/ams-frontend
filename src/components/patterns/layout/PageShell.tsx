'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface PageShellProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

/**
 * PageShell Pattern
 * Standard container for all dashboard pages to ensure consistent spacing,
 * animations, and typography.
 */
export function PageShell({ 
  title, 
  description, 
  children, 
  className 
}: PageShellProps) {
  return (
    <div className={cn("space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500", className)}>
      {/* Page Header Area */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {/* Page Content Area */}
      <div className="min-h-[400px]">
        {children}
      </div>
    </div>
  )
}
