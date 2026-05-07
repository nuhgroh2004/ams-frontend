'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard,
  Database,
  MapPin,
  Building2,
  UsersRound,
  ShoppingCart,
  ClipboardCheck,
  ArrowRightLeft,
  Handshake,
  Wrench,
  ClipboardList,
  Trash2,
  TriangleAlert,
  FileText,
  ShieldCheck,
  CheckSquare,
  LogOut,
  Settings,
  X
} from 'lucide-react'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { useLayoutStore } from '@/lib/store/layout.store'
import { useAppLogout } from '@/modules/auth/hooks/useAppLogout'
import { Loader2 } from 'lucide-react'

const NAV_GROUPS = [
  {
    label: '',
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: 'MASTER DATA',
    items: [
      {
        label: 'Manajemen Aset',
        href: '/dashboard/assets',
        icon: Database,
      },
      {
        label: 'Lokasi',
        href: '/dashboard/locations',
        icon: MapPin,
      },
      {
        label: 'Unit Kerja',
        href: '/dashboard/unit-kerja',
        icon: Building2,
      },
      {
        label: 'User & Role',
        href: '/dashboard/users',
        icon: UsersRound,
      },
    ],
  },
  {
    label: 'PROCUREMENT',
    items: [
      {
        label: 'Pengadaan Aset',
        href: '/dashboard/procurement',
        icon: ShoppingCart,
      },
    ],
  },
  {
    label: 'TRANSACTIONS',
    items: [
      {
        label: 'Assignment',
        href: '/dashboard/assignment',
        icon: ClipboardCheck,
      },
      {
        label: 'Mutasi',
        href: '/dashboard/mutasi',
        icon: ArrowRightLeft,
      },
      {
        label: 'Peminjaman',
        href: '/dashboard/peminjaman',
        icon: Handshake,
      },
    ],
  },
  {
    label: 'MAINTENANCE & DISPOSAL',
    items: [
      {
        label: 'Perawatan',
        href: '/dashboard/perawatan',
        icon: Wrench,
      },
      {
        label: 'Inventarisasi',
        href: '/dashboard/inventarisasi',
        icon: ClipboardList,
      },
      {
        label: 'Penghapusan',
        href: '/dashboard/penghapusan',
        icon: Trash2,
      },
      {
        label: 'Laporan Kehilangan',
        href: '/dashboard/laporan-kehilangan',
        icon: TriangleAlert,
      },
    ],
  },
  {
    label: 'SYSTEM & REPORTS',
    items: [
      {
        label: 'Laporan',
        href: '/dashboard/reports',
        icon: FileText,
      },
      {
        label: 'Audit Log',
        href: '/dashboard/audit-log',
        icon: ShieldCheck,
      },
      {
        label: 'Approval Workflow',
        href: '/dashboard/approval-workflow',
        icon: CheckSquare,
      },
      {
        label: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
      }
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const { handleLogout, isLoggingOut } = useAppLogout()
  const { isSidebarOpen, setSidebarOpen } = useLayoutStore()

  // Close sidebar on route change (mobile only)
  React.useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }, [pathname, setSidebarOpen])

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Container */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-screen flex flex-col z-50 transition-all duration-300 ease-in-out bg-card border-r border-border",
          isSidebarOpen 
            ? "w-72 translate-x-0" 
            : "w-72 -translate-x-full lg:w-0 lg:opacity-0 lg:pointer-events-none overflow-hidden"
        )}
      >
        <div className="flex flex-col h-full w-72">
          {/* Brand Area */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground leading-tight">
                  BPSDM PERTAHANAN
                </h1>
                <p className="text-[10px] font-medium text-muted-foreground tracking-widest uppercase">
                  Aset Management
                </p>
              </div>
            </div>
            
            {/* Close button for mobile */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Card Area */}
          <div className="px-4 mb-6">
            <div className="p-3 rounded-2xl border border-border bg-muted/30 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                <span className="text-xs font-bold text-primary">
                  {user?.nama_lengkap?.substring(0, 2).toUpperCase() || 'AD'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user?.nama_lengkap || 'Admin Sistem'}
                </p>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  {user?.roles?.[0]?.nama_role || 'USER UMUM'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Area */}
          <nav className="flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar">
            <div className="space-y-6">
              {NAV_GROUPS.map((group) => (
                <div key={group.label} className="space-y-2">
                  {group.label && (
                    <h3 className="px-3 text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase">
                      {group.label}
                    </h3>
                  )}
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href
                      const Icon = item.icon

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 rounded-xl group',
                            isActive 
                              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          )}
                        >
                          <Icon className={cn(
                            'h-4 w-4 shrink-0',
                            isActive ? 'text-primary-foreground' : 'group-hover:text-foreground'
                          )} />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          {/* Footer / Logout */}
          <div className="p-4 border-t border-border">
            <button
              onClick={() => handleLogout()}
              disabled={isLoggingOut}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 w-full text-sm font-medium text-destructive transition-colors rounded-xl hover:bg-destructive/10",
                isLoggingOut && "opacity-50 cursor-not-allowed"
              )}
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              <span>{isLoggingOut ? 'Logging out...' : 'Logout System'}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}