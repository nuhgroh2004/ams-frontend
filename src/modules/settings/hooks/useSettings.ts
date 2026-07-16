import { useQuery, useMutation } from '@apollo/client'
import { useState, useEffect } from 'react'
import { GET_SETTINGS, UPDATE_SETTINGS } from '../services'
import { toast } from '@/lib/toast'

export function useSettings() {
  const { data, loading, refetch } = useQuery(GET_SETTINGS)
  const [updateSettingsMutation, { loading: isSaving }] = useMutation(UPDATE_SETTINGS)
  const [formState, setFormState] = useState<Record<string, { value: string; description: string }>>({})

  useEffect(() => {
    if (data?.settings) {
      const state: Record<string, { value: string; description: string }> = {}
      data.settings.forEach((s: any) => {
        state[s.key] = { value: s.value, description: s.description || '' }
      })
      setFormState(state)
    }
  }, [data])

  const handleInputChange = (key: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [key]: { ...prev[key], value },
    }))
  }

  const handleSave = async () => {
    const input = Object.entries(formState).map(([key, val]) => ({
      key,
      value: val.value,
      description: val.description,
    }))

    try {
      await updateSettingsMutation({ variables: { input } })
      toast.success('Pengaturan berhasil diperbarui')
      refetch()
    } catch (err: any) {
      toast.error('Gagal memperbarui pengaturan', err.message)
    }
  }

  return {
    formState,
    loading,
    isSaving,
    handleInputChange,
    handleSave,
  }
}
