import { toast as sonnerToast } from "sonner"
import { getGraphQLErrorMessage } from "./core/apollo/error-handler"

interface ToastDescriptionOptions {
  description?: string
}

type ToastDescription = string | ToastDescriptionOptions

const normalizeDescription = (description?: ToastDescription) => {
  if (!description) return undefined
  if (typeof description === 'string') return description
  return description.description
}

/**
 * AMS Global Toast System
 * Wrapper around Sonner to provide consistent interface and AMS styling.
 */
export const toast = {
  success: (message: string, description?: ToastDescription) => {
    return sonnerToast.success(message, {
      description: normalizeDescription(description),
    })
  },
  error: (message: string, description?: ToastDescription) => {
    return sonnerToast.error(message, {
      description: normalizeDescription(description),
    })
  },
  warning: (message: string, description?: ToastDescription) => {
    return sonnerToast.warning(message, {
      description: normalizeDescription(description),
    })
  },
  info: (message: string, description?: ToastDescription) => {
    return sonnerToast.info(message, {
      description: normalizeDescription(description),
    })
  },
  loading: (message: string, description?: ToastDescription) => {
    return sonnerToast.loading(message, {
      description: normalizeDescription(description),
    })
  },
  /**
   * Promise wrapper for async operations
   */
  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
    })
  },
  /**
   * Helper specifically for GraphQL errors
   * Menampilkan pesan error dari backend sebagai judul toast
   */
  graphqlError: (error: unknown, fallbackMessage = "Terjadi kesalahan pada sistem") => {
    const message = getGraphQLErrorMessage(error)
    return sonnerToast.error(message || fallbackMessage)
  }
}
