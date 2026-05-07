'use client'

import * as React from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { useLayoutStore } from '@/lib/store/layout.store'
import { cn } from '@/lib/utils'

/**
 * Dashboard Layout
 * Structure: Sidebar (Fixed Left) + Header (Sticky Top) + Main Content (Scrollable)
 */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isSidebarOpen } = useLayoutStore()

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div 
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "lg:ml-72" : "ml-0"
        )}
      >
        {/* Sticky Header */}
        <Header />

        {/* Dynamic Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden bg-muted/10">
          {/* Content Wrapper */}
          <div className="max-w-[1600px] mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            {children}
          </div>
        </main>

        {/* Optional: Dashboard Footer (Sesuai Desain System) */}
        <footer className="px-4 sm:px-8 py-6 border-t border-border bg-card/50 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest font-medium">
            <p>© 2024 BPSDM PERTAHANAN - Asset Management System (AMS)</p>
            <div className="flex items-center gap-4">
              <span className="hover:text-foreground cursor-pointer transition-colors">Documentation</span>
              <span className="h-4 w-px bg-border hidden sm:block" />
              <span className="font-bold text-primary">v1.0.0-PRO</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
