'use client'

import * as React from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { useLayoutStore } from '@/lib/store/layout.store'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { hasPermissionForUser } from '@/lib/permissions'
import Link from 'next/link'

// Map every protected route to its required View permission.
// If a route is not listed here, it is accessible to all authenticated users.
const ROUTE_PERMISSIONS: Record<string, string> = {
  '/dashboard/assets':            'asset:view',
  '/dashboard/locations':         'location:view',
  '/dashboard/unit-kerja':        'unit:view',
  '/dashboard/users':             'user:view',
  '/dashboard/role-matrix':       'user:view',
  '/dashboard/procurement':       'procurement:view',
  '/dashboard/assignment':        'asset:view',
  '/dashboard/mutasi':            'transfer:view',
  '/dashboard/peminjaman':        'loan:view',
  '/dashboard/perawatan':         'maintenance:view',
  '/dashboard/inventarisasi':     'inventory:view',
  '/dashboard/penghapusan':       'disposal:view',
  '/dashboard/laporan-kehilangan':'loss:view',
  '/dashboard/reports':           'report:view',
  '/dashboard/audit-log':         'audit:view',
  '/dashboard/approval-workflow': 'workflow:view',
  '/dashboard/settings':          'settings:view',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isSidebarOpen } = useLayoutStore()
  const pathname = usePathname()
  const router = useRouter()

  // Reactive user — same selector as Sidebar.
  // When Zustand rehydrates from localStorage, this updates and triggers a re-render.
  const user = useAuthStore((state) => state.user)

  // Memoize the permission check so it only recomputes when user or pathname changes.
  const isAllowed = React.useMemo(() => {
    const requiredPermission = ROUTE_PERMISSIONS[pathname]

    // Route is open (no permission required): allow everyone through.
    if (!requiredPermission) return true

    // If user is not yet available (still rehydrating), withhold judgement.
    if (!user) return null

    return hasPermissionForUser(user, requiredPermission)
  }, [user, pathname])

  // Guard effect: do NOT run until user is known (null = not yet hydrated).
  React.useEffect(() => {
    if (isAllowed === null) return  // still waiting for store rehydration
    if (isAllowed === false) {
      console.warn(`[Layout] Access denied: "${pathname}" requires missing permission.`)
      router.replace('/dashboard/access-denied')
    }
  }, [isAllowed, pathname, router])

  // While the store is rehydrating (user === null) show a spinner.
  // This replaces the old fake mount-based isHydrated state.
  if (user === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out',
          isSidebarOpen ? 'lg:ml-72' : 'ml-0'
        )}
      >
        {/* Sticky Header */}
        <Header />

        {/* Dynamic Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden bg-muted/10">
          <div className="max-w-[1600px] mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="px-4 sm:px-8 py-6 border-t border-border bg-card/50 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest font-medium">
            <p>© 2024 BMN NEGARA - Asset Management System (AMS)</p>
            <div className="flex items-center gap-4">
              <Link href="https://drive.google.com/drive/folders/1EJMj8BA-DE72z4I3JXATXVE6bA4RGvWB?usp=sharing" target="_blank">
                Documentation
              </Link>
              <span className="h-4 w-px bg-border hidden sm:block" />
              <span className="font-bold text-primary">v1.0.0-PRO</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
