'use client'

import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search 
} from 'lucide-react'
import { 
  AppButton, 
  AppInput, 
  AppSelect 
} from '@/components/primitives'
import { PageShell } from '@/components/patterns'
import { UsersTable } from '../UsersTable'
import { useQuery, useMutation } from '@apollo/client'
import { 
  GET_USERS_QUERY, 
  DELETE_USER_MUTATION, 
  ACTIVATE_USER_MUTATION, 
  DEACTIVATE_USER_MUTATION 
} from '@/modules/users/services/user.graphql'
import { toast } from '@/lib/toast'
import { getGraphQLErrorMessage } from '@/lib/core/apollo'

import { UserFormModal } from './modals/UserFormModal'
import { ConfirmActionModal } from './modals/ConfirmActionModal'

/**
 * UsersModule
 * Logical container for User Management feature.
 */
export function UsersModule() {
  // State for filters and pagination
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const limit = 10

  // State for Form Modal
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  // State for Confirm Modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string
    description: string
    type: 'danger' | 'warning' | 'info'
    onConfirm: () => void
    confirmText?: string
  } | null>(null)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset to first page on new search
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  // GraphQL Query
  const { data, loading, refetch } = useQuery(GET_USERS_QUERY, {
    variables: {
      page,
      limit,
      search: debouncedSearch || undefined,
      isActive: statusFilter === 'all' ? undefined : statusFilter === 'active'
    },
    fetchPolicy: 'network-only'
  })

  // GraphQL Mutations
  const [deleteUser, { loading: isDeleting }] = useMutation(DELETE_USER_MUTATION, {
    onCompleted: () => {
      toast.success('Pengguna berhasil dihapus')
      setIsConfirmOpen(false)
      refetch()
    },
    onError: (error) => {
      toast.error('Gagal menghapus pengguna', getGraphQLErrorMessage(error))
    }
  })

  const [activateUser, { loading: isActivating }] = useMutation(ACTIVATE_USER_MUTATION, {
    onCompleted: () => {
      toast.success('Pengguna berhasil diaktifkan')
      setIsConfirmOpen(false)
      refetch()
    },
    onError: (error) => {
      toast.error('Gagal mengaktifkan pengguna', getGraphQLErrorMessage(error))
    }
  })

  const [deactivateUser, { loading: isDeactivating }] = useMutation(DEACTIVATE_USER_MUTATION, {
    onCompleted: () => {
      toast.success('Pengguna berhasil dinonaktifkan')
      setIsConfirmOpen(false)
      refetch()
    },
    onError: (error) => {
      toast.error('Gagal menonaktifkan pengguna', getGraphQLErrorMessage(error))
    }
  })

  // Handlers
  const handleDelete = (id: string) => {
    setConfirmConfig({
      title: 'Hapus Pengguna',
      description: 'Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.',
      type: 'danger',
      confirmText: 'Hapus Sekarang',
      onConfirm: () => deleteUser({ variables: { id } })
    })
    setIsConfirmOpen(true)
  }

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    setConfirmConfig({
      title: currentStatus ? 'Nonaktifkan Pengguna' : 'Aktifkan Pengguna',
      description: `Apakah Anda yakin ingin ${currentStatus ? 'menonaktifkan' : 'mengaktifkan'} akses pengguna ini?`,
      type: currentStatus ? 'warning' : 'info',
      confirmText: currentStatus ? 'Nonaktifkan' : 'Aktifkan',
      onConfirm: () => {
        if (currentStatus) {
          deactivateUser({ variables: { id } })
        } else {
          activateUser({ variables: { id } })
        }
      }
    })
    setIsConfirmOpen(true)
  }

  const handleEdit = (user: any) => {
    setSelectedUser(user)
    setIsFormOpen(true)
  }

  const handleAdd = () => {
    setSelectedUser(null)
    setIsFormOpen(true)
  }

  const users = data?.users?.data || []
  const pagination = data?.users ? {
    total: data.users.total,
    page: data.users.page,
    limit: data.users.limit,
    totalPages: data.users.totalPages
  } : undefined

  return (
    <PageShell 
      title="Manajemen Pengguna" 
      description="Kelola data pengguna, perbarui role, dan pantau status akun sistem."
    >
      {/* Form Modal (Add/Edit) */}
      <UserFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={selectedUser}
        onSuccess={() => refetch()}
      />

      {/* Confirmation Modal (Delete/Status) */}
      {confirmConfig && (
        <ConfirmActionModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          title={confirmConfig.title}
          description={confirmConfig.description}
          type={confirmConfig.type}
          confirmText={confirmConfig.confirmText}
          onConfirm={confirmConfig.onConfirm}
          isLoading={isDeleting || isActivating || isDeactivating}
        />
      )}

      {/* Action Bar Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-card p-4 rounded-2xl border border-border">
        {/* Search Input */}
        <div className="md:col-span-5 lg:col-span-6">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-1.5 block">
            Pencarian
          </label>
          <AppInput 
            placeholder="Cari nama atau NRP..."
            icon={Search}
            className="bg-background/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Status */}
        <div className="md:col-span-4 lg:col-span-3">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-1.5 block">
            Filter Status
          </label>
          <AppSelect 
            value={statusFilter}
            onValueChange={setStatusFilter}
            placeholder="Semua Status"
            options={[
              { value: 'all', label: 'Semua Status' },
              { value: 'active', label: 'Aktif' },
              { value: 'inactive', label: 'Nonaktif' },
            ]}
          />
        </div>

        {/* Add User Button */}
        <div className="md:col-span-3 lg:col-span-3">
          <AppButton 
            fullWidth 
            icon={Plus} 
            variant="primary"
            onClick={handleAdd}
          >
            Tambah Pengguna
          </AppButton>
        </div>
      </div>

      {/* Table Section */}
      <UsersTable 
        users={users}
        loading={loading}
        pagination={pagination}
        onPageChange={setPage}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onEdit={handleEdit}
      />
    </PageShell>
  )
}
