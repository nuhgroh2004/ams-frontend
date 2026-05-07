'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

/**
 * ThemeToggle
 * Komponen untuk mengganti tema antara Light dan Dark.
 * Desain: Pill shape, hover effect, transisi halus.
 */

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Hydration fix
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={cn("h-10 w-10 rounded-full bg-muted/50 animate-pulse", className)} />
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        "relative h-10 w-10 flex items-center justify-center rounded-full bg-transparent",
        "text-foreground hover:bg-muted border border-border transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-primary/20",
        className
      )}
      aria-label="Toggle theme"
    >
      <Sun className={cn(
        "h-5 w-5 transition-all duration-300 absolute",
        theme === 'dark' ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
      )} />
      <Moon className={cn(
        "h-5 w-5 transition-all duration-300 absolute",
        theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
      )} />
    </button>
  )
}
