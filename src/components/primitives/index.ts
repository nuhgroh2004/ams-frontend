/**
 * PRIMITIVES LAYER
 * 
 * Design system controlled UI primitives
 * 
 *  CRITICAL RULE:
 * App code MUST import from this layer, NOT from ui/
 * 
 *  CORRECT:
 * import { AppButton } from '@/components/primitives'
 * 
 * WRONG:
 * import { Button } from '@/components/ui/button'
 * 
 * This layer enforces design system compliance across the entire app.
 */

// Form Primitives
export { AppButton } from './AppButton'
export type { AppButtonProps } from './AppButton'

export { AppInput } from './AppInput'
export type { AppInputProps } from './AppInput'

export { AppSelect } from './AppSelect'
export type { AppSelectProps, SelectOption, SelectGroupOption } from './AppSelect'

export { AppTextarea } from './AppTextarea'
export type { AppTextareaProps } from './AppTextarea'

export { AppCheckbox } from './AppCheckbox'
export type { AppCheckboxProps } from './AppCheckbox'

// Container Primitives
export {
  AppCard,
  AppCardHeader,
  AppCardTitle,
  AppCardDescription,
  AppCardContent,
  AppCardFooter,
} from './AppCard'
export type { AppCardProps } from './AppCard'

// Status Primitives
export { AppBadge } from './AppBadge'
export type { AppBadgeProps } from './AppBadge'

// Overlay Primitives
export { AppModal } from './AppModal'
export * from './AppDropdown'

