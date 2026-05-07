'use client'

import * as React from 'react'
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form'
import { cn } from '@/lib/utils'

/**
 * FormField Pattern Component
 * Generic form field wrapper using primitives
 * Works with AppInput, AppSelect, AppTextarea
 */

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  return {
    ...fieldState,
    ...itemContext,
  }
}

interface FormItemContextValue {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<ControllerProps<TFieldValues, TName>, 'render'> {
  render?: ControllerProps<TFieldValues, TName>['render']
  label?: React.ReactNode
  description?: React.ReactNode
  required?: boolean
  children?: React.ReactNode
}

const FormField = React.forwardRef<
  HTMLDivElement,
  FormFieldProps<any, any>
>(
  (
    {
      control,
      name,
      render,
      label,
      description,
      required,
      children,
      ...props
    },
    ref
  ) => {
    const id = React.useId()

    return (
      <FormFieldContext.Provider value={{ name }}>
        <Controller
          {...props}
          control={control}
          name={name}
          render={({ field, fieldState, formState }) => (
            <FormItemContext.Provider value={{ id }}>
              <div ref={ref} className="space-y-2">
                {label && (
                  <label
                    htmlFor={id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {label}
                    {required && (
                      <span className="ml-1 text-destructive" aria-label="required">
                        *
                      </span>
                    )}
                  </label>
                )}
                {children ? (
                  React.cloneElement(children as React.ReactElement<{ id?: string, 'aria-invalid'?: boolean, 'aria-describedby'?: string }>, {
                    ...field,
                    id,
                    'aria-invalid': fieldState.invalid,
                    'aria-describedby': description ? `${id}-description` : undefined,
                  })
                ) : render ? (
                  render({ field, fieldState, formState })
                ) : null}
                {fieldState.error && (
                  <p className="text-xs font-medium text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
                {description && !fieldState.error && (
                  <p
                    id={`${id}-description`}
                    className="text-xs text-muted-foreground"
                  >
                    {description}
                  </p>
                )}
              </div>
            </FormItemContext.Provider>
          )}
        />
      </FormFieldContext.Provider>
    )
  }
) as (<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: FormFieldProps<TFieldValues, TName> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement) & { displayName?: string }


FormField.displayName = 'FormField'

export { FormField, useFormField, FormFieldContext, FormItemContext }
export type { FormFieldProps }
