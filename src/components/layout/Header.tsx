'use client'

import * as React from 'react'
import Link from 'next/link'
import { Search, Bell, Settings, User, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { useLayoutStore } from '@/lib/store/layout.store'
import { AppButton } from '@/components/primitives'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { gql, useQuery, useMutation } from '@apollo/client'
import dayjs from 'dayjs'

const GET_MY_NOTIFICATIONS = gql`
  query GetMyNotifications($page: Int, $limit: Int) {
    myNotifications(page: $page, limit: $limit) {
      id
      title
      message
      is_read
      created_at
    }
    unreadNotificationCount
  }
`

const MARK_READ = gql`
  mutation MarkAsRead($id: ID!) {
    markNotificationAsRead(id: $id) {
      id
      is_read
    }
  }
`

const MARK_ALL_READ = gql`
  mutation MarkAllAsRead {
    markAllNotificationsAsRead
  }
`

export function Header() {
  const { user } = useAuthStore()
  const { toggleSidebar } = useLayoutStore()
  
  const [isOpen, setIsOpen] = React.useState(false)
  const { data, refetch } = useQuery(GET_MY_NOTIFICATIONS, {
    pollInterval: 10000,
    fetchPolicy: 'network-only',
  })
  const [markAsRead] = useMutation(MARK_READ)
  const [markAllAsRead] = useMutation(MARK_ALL_READ)

  const notifications = data?.myNotifications || []
  const unreadCount = data?.unreadNotificationCount || 0

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await markAsRead({ variables: { id } })
      refetch()
    } catch (err) {
      console.error(err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
      refetch()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <header className="sticky top-0 right-0 h-20 bg-card border-b border-border flex items-center justify-between px-4 sm:px-8 z-40">
      <div className="flex items-center gap-4 flex-1">
        {/* Sidebar Toggle */}
        <AppButton 
          variant="ghost" 
          size="icon_sm" 
          onClick={toggleSidebar}
          className="text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </AppButton>

        {/* Search Area */}
        <div className="hidden md:block flex-1 max-w-md">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Cari aset, user, atau transaksi..."
              className={cn(
                "w-full bg-input border-border text-sm text-foreground rounded-full pl-11 pr-4 py-2.5",
                "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all",
                "placeholder:text-muted-foreground/60"
              )}
            />
          </div>
        </div>
      </div>

      {/* Right Area: Actions & User Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Search Button (Optional) */}
        <div className="md:hidden">
          <AppButton variant="ghost" size="icon_sm" className="text-muted-foreground">
            <Search className="h-5 w-5" />
          </AppButton>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative">
          <AppButton 
            variant="ghost" 
            size="icon_sm" 
            className="relative text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive border-2 border-card rounded-full animate-pulse" />
            )}
          </AppButton>

          {isOpen && (
            <>
              {/* Backdrop to close dropdown */}
              <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden text-sm animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
                  <span className="font-bold text-foreground">Notifikasi ({unreadCount})</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllAsRead} 
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Tandai semua dibaca
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-border/60">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                      <p className="text-xs">Tidak ada notifikasi baru</p>
                    </div>
                  ) : (
                    notifications.map((notif: any) => (
                      <div 
                        key={notif.id} 
                        className={cn(
                          "p-4 transition-colors relative flex flex-col gap-1",
                          notif.is_read ? "opacity-60 bg-card" : "bg-muted/10 hover:bg-muted/5"
                        )}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-semibold text-xs text-foreground leading-snug">{notif.title}</p>
                          {!notif.is_read && (
                            <button 
                              onClick={(e) => handleMarkAsRead(notif.id, e)}
                              className="text-[10px] font-bold text-primary hover:underline flex-shrink-0"
                            >
                              Baca
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-normal">{notif.message}</p>
                        <span className="text-[9px] text-muted-foreground/60 mt-1 block">
                          {dayjs(notif.created_at).format('YYYY-MM-DD HH:mm')}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-border mx-1 sm:mx-2 hidden sm:block" />

        {/* User Profile Mini */}
        <Link href="/dashboard/profile" className="flex items-center gap-3 pl-1 sm:pl-2 group cursor-pointer hover:opacity-80 transition-opacity">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-semibold text-foreground leading-none group-hover:text-primary transition-colors">
              {user?.nama_lengkap || 'Admin User'}
            </p>
            <p className="text-[10px] font-medium text-muted-foreground uppercase mt-1">
              {user?.roles?.[0]?.nama_role   || 'ADMIN SISTEM'}
            </p>
          </div>
          <div className="h-9 w-9 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden group-hover:border-primary transition-colors">
            <User className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
          </div>
        </Link>
      </div>
    </header>
  )
}
