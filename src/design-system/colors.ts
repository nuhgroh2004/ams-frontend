/**
 * Design System - Color Tokens
 * Tactical Intelligence - Strategic Asset Management Framework
 * 
 * Dark, tactical, military-grade interface with high contrast & readability
 * Enterprise/government style emphasis on clarity and hierarchy
 */

/**
 * PRIMARY PALETTE
 * Core brand colors for primary actions and brand identity
 */
export const PRIMARY = {
  // Corporate Navy - Primary brand color, used for headers, primary actions
  50: '#F0F4F8',  // Lightest (for hover states in dark mode)
  100: '#D9E2F0',
  200: '#B3C5E1',
  300: '#8DA8D2',
  400: '#678BC3',
  500: '#416EB4', // Mid-tone
  600: '#2B5A9E', // Standard
  700: '#1A4078', // Dark
  800: '#0F2A52',
  900: '#0F172A', // Darkest - Main Corporate Navy
} as const;

/**
 * SECONDARY PALETTE
 * Accessible Blue - Secondary actions, interactive elements
 * High contrast, WCAG AA compliant
 */
export const SECONDARY = {
  50: '#EFF6FF',
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#3B82F6', // Mid-tone
  600: '#2563EB', // Standard - Accessible Blue
  700: '#1D4ED8',
  800: '#1E40AF',
  900: '#1E3A8A',
} as const;

/**
 * STATUS COLORS
 * Semantic colors for status indication and user feedback
 */
export const SUCCESS = {
  50: '#F0FDF4',
  100: '#DCFCE7',
  200: '#BBF7D0',
  300: '#86EFAC',
  400: '#4ADE80',
  500: '#22C55E', // Mid-tone
  600: '#16A34A', // Standard - Success Green
  700: '#15803D',
  800: '#166534',
  900: '#145231',
} as const;

export const WARNING = {
  50: '#FFFBEB',
  100: '#FEF3C7',
  200: '#FDE68A',
  300: '#FCD34D',
  400: '#FBBF24',
  500: '#F59E0B', // Mid-tone & Standard - Warning Yellow
  600: '#D97706',
  700: '#B45309',
  800: '#92400E',
  900: '#78350F',
} as const;

export const DANGER = {
  50: '#FEF2F2',
  100: '#FEE2E2',
  200: '#FECACA',
  300: '#FCA5A5',
  400: '#F87171',
  500: '#EF4444', // Mid-tone & Standard - Danger Red
  600: '#DC2626',
  700: '#B91C1C',
  800: '#991B1B',
  900: '#7F1D1D',
} as const;

/**
 * NEUTRAL PALETTE
 * Grayscale for backgrounds, borders, text
 */
export const NEUTRAL = {
  0: '#FFFFFF',
  50: '#F9FAFB',
  100: '#F3F4F6',
  150: '#E8EAED', // Not in Tailwind, custom for AMS
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563', // Not in standard Tailwind
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
  950: '#030712',
} as const;

/**
 * SEMANTIC COLORS - Dark Mode (Primary Theme)
 * Surface hierarchy and content colors for dark mode
 */
export const SEMANTIC = {
  // Backgrounds
  background: '#0F172A', // Darkest - Page background
  backgroundSecondary: '#1A2A3D', // Slightly lighter
  surface: '#1E2E42', // Card/panel background
  surfaceHover: '#2A3D52', // Hover state for cards
  surfaceActive: '#354B62', // Active state for cards

  // Text
  textPrimary: '#F8FAFB', // Primary text
  textSecondary: '#CBD5E1', // Secondary text
  textTertiary: '#94A3B8', // Tertiary/muted text
  textDisabled: '#64748B', // Disabled text

  // Interactive
  textLink: '#60A5FA', // Link color (Accessible Blue)
  textLinkHover: '#93C5FD', // Link hover
  textLinkActive: '#3B82F6', // Link active

  // Borders & Dividers
  border: '#293548', // Primary border
  borderSubtle: '#1E2E42', // Subtle border
  borderStrong: '#475569', // Strong border

  // Interaction states
  focusRing: '#60A5FA', // Focus ring (blue)
  focusRingOffset: '#0F172A', // Focus ring offset background

  // Overlays
  overlayBase: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark
  overlayDark: 'rgba(0, 0, 0, 0.8)', // Very dark overlay

  // Accessibility
  disabled: '#4B5563',
  placeholder: '#64748B',
} as const;

/**
 * FUNCTIONAL COLORS
 * Purpose-driven colors for specific UI patterns
 */
export const FUNCTIONAL = {
  // Status indicators
  statusSuccess: '#10B981', // Baik (Good)
  statusWarning: '#F59E0B', // Rusak Ringan (Light Damage)
  statusDanger: '#EF4444', // Rusak Berat (Heavy Damage)
  statusInfo: '#3B82F6', // Information
  statusPending: '#F59E0B', // Pending actions
  statusError: '#DC2626', // Errors

  // Data visualization
  chartAccent1: '#06B6D4', // Cyan
  chartAccent2: '#10B981', // Green
  chartAccent3: '#F59E0B', // Yellow
  chartAccent4: '#EF4444', // Red
  chartAccent5: '#8B5CF6', // Purple

  // Actions
  actionPrimary: SECONDARY[600], // Primary action button
  actionSecondary: SEMANTIC.surface, // Secondary action button
  actionDanger: DANGER[600], // Destructive actions
  actionDisabled: SEMANTIC.textDisabled, // Disabled action

  // Feedback
  feedbackSuccess: SUCCESS[600],
  feedbackWarning: WARNING[600],
  feedbackError: DANGER[600],
  feedbackInfo: SECONDARY[600],
} as const;

/**
 * COLOR ALIASES - Tailwind CSS Integration
 * Direct mapping to CSS custom properties in globals.css
 */
export const TAILWIND_COLORS = {
  // Maintained for backward compatibility
  primary: PRIMARY[900],
  'primary-light': PRIMARY[600],
  secondary: SECONDARY[600],
  'secondary-light': SECONDARY[400],
  success: SUCCESS[600],
  warning: WARNING[500],
  danger: DANGER[500],
  info: SECONDARY[600],
  muted: NEUTRAL[500],
  border: SEMANTIC.border,
  background: SEMANTIC.background,
  foreground: SEMANTIC.textPrimary,
} as const;

/**
 * EXPORT ORGANIZED BY USE CASE
 */
export default {
  primary: PRIMARY,
  secondary: SECONDARY,
  success: SUCCESS,
  warning: WARNING,
  danger: DANGER,
  neutral: NEUTRAL,
  semantic: SEMANTIC,
  functional: FUNCTIONAL,
  tailwind: TAILWIND_COLORS,
};
