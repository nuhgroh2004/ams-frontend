'use client'

import * as React from 'react'
import { FormProvider, UseFormReturn } from 'react-hook-form'
import { cn } from '@/lib/utils'

/**
 * FormWrapper Pattern Component
 * Provider wrapper for React Hook Form + Zod validation
 * Uses primitives for consistent styling
 */

interface FormWrapperProps<T extends Record<string, any>>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: UseFormReturn<T>
  onSubmit: (data: T) => void | Promise<void>
  children: React.ReactNode
  isLoading?: boolean
  error?: string
}

const FormWrapper = React.forwardRef<
  HTMLFormElement,
  FormWrapperProps<any>
>(({ form, onSubmit, children, isLoading, error, className, ...props }, ref) => {
  const handleSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      await form.handleSubmit(onSubmit)(e)
    },
    [form, onSubmit]
  )

  return (
    <FormProvider {...form}>
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={cn('space-y-6', className)}
        {...props}
      >
        {error && (
          <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-600 border border-red-500/30 dark:text-red-400 dark:border-red-500/20">
            {error}
          </div>
        )}
        <fieldset disabled={isLoading} className={isLoading ? 'opacity-50' : ''}>
          {children}
        </fieldset>
      </form>
    </FormProvider>
  )
})

FormWrapper.displayName = 'FormWrapper'

export { FormWrapper }
export type { FormWrapperProps }
