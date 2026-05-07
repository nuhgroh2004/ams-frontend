'use client'

import React from 'react'
import { 
  AlertTriangle, 
  Trash2, 
  Info, 
  HelpCircle 
} from 'lucide-react'
import { AppModal, AppButton } from '@/components/primitives'
import { cn } from '@/lib/utils'

type ModalType = 'danger' | 'warning' | 'info'

interface ConfirmActionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  type?: ModalType
  isLoading?: boolean
  confirmText?: string
}

const typeConfig = {
  danger: {
    icon: Trash2,
    iconClass: 'bg-destructive/10 text-destructive',
    buttonVariant: 'danger' as const,
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'bg-amber-500/10 text-amber-500',
    buttonVariant: 'primary' as const, // We use primary for non-destructive confirmations
  },
  info: {
    icon: Info,
    iconClass: 'bg-primary/10 text-primary',
    buttonVariant: 'primary' as const,
  },
}

/**
 * ConfirmActionModal
 * Modal standar untuk konfirmasi aksi sensitif (Hapus, Aktifkan/Nonaktifkan).
 */
export function ConfirmActionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type = 'info',
  isLoading = false,
  confirmText = 'Konfirmasi'
}: ConfirmActionModalProps) {
  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      showCloseButton={!isLoading}
    >
      <div className="flex flex-col items-center text-center py-2">
        <div className={cn("p-4 rounded-full mb-4", config.iconClass)}>
          <Icon className="h-8 w-8" />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <AppButton 
          variant="outline" 
          fullWidth 
          onClick={onClose}
          disabled={isLoading}
        >
          Batal
        </AppButton>
        <AppButton 
          variant={config.buttonVariant} 
          fullWidth 
          onClick={onConfirm}
          loading={isLoading}
        >
          {confirmText}
        </AppButton>
      </div>
    </AppModal>
  )
}
