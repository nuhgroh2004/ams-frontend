'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApolloClient } from '@apollo/client'
// Pastikan path import di bawah ini sesuai dengan lokasi file useAuth kamu
import { useAuth } from './useAuth' 
import { toast } from '@/lib/toast'

/**
 * useAppLogout
 * Custom hook untuk menangani alur logout secara aman dan menyeluruh.
 * Menggunakan useAuth sebagai single source of truth.
 */
export function useAppLogout() {
  const router = useRouter()
  const client = useApolloClient()
  
  // Ambil fungsi logout dari useAuth wrapper kamu
  const { logout: clearAuthState } = useAuth()
  
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)

      // 1. Bersihkan Apollo Client Cache DULU
      await client.clearStore()

      // 2. Bersihkan Global State & Cookies melalui useAuth
      clearAuthState()

      // 3. Notifikasi Berhasil
      toast.success('Berhasil Keluar', 'Sesi Anda telah diakhiri dengan aman.')

      // 4. Redirect ke Halaman Login menggunakan replace (hapus history)
      router.replace('/login')
      
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Gagal memproses logout', 'Terjadi kesalahan sistem saat mencoba keluar.')
      
      // Matikan loading hanya jika gagal
      setIsLoggingOut(false)
    }
  }

  return {
    handleLogout,
    isLoggingOut
  }
}