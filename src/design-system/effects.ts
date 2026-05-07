/**
 * Design System - Shadow & Effects Tokens
 * Elevation levels, shadows, blur effects for depth and hierarchy
 * 
 * Material Design inspired elevation system adapted for dark tactical theme
 */

/**
 * SHADOW SYSTEM
 * Elevation-based shadows for depth perception
 */
export const SHADOW = {
  // No shadow - base layer
  none: 'none',
  
  // Elevation 1: Subtle elevation (cards, input focus)
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  
  // Elevation 2: Standard elevation (cards, popovers)
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  
  // Elevation 3: Medium elevation (dropdown, modals)
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  
  // Elevation 4: High elevation (tooltips, floating elements)
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  
  // Elevation 5: Very high elevation (modals, overlays)
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  
  // Elevation 6: Maximum elevation (full-screen dialogs)
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Tactical/focused shadow - dark theme optimized
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  
  // Harsh shadow - strong depth (danger actions, critical elements)
  harsh: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
} as const;

/**
 * ELEVATION SYSTEM
 * Semantic elevation levels for component hierarchy
 */
export const ELEVATION = {
  // Surface: Base level (page background)
  surface: {
    shadow: SHADOW.none,
    zIndex: 0,
    description: 'Base page background',
  } as const,
  
  // Raised: Slightly elevated (cards, panels)
  raised: {
    shadow: SHADOW.base,
    zIndex: 1,
    description: 'Cards, panels, surfaces above background',
  } as const,
  
  // Floating: Clearly floating above (dropdowns, menus)
  floating: {
    shadow: SHADOW.md,
    zIndex: 100,
    description: 'Floating elements, dropdowns, tooltips',
  } as const,
  
  // Overlay: Above content layer (modals, dialogs)
  overlay: {
    shadow: SHADOW.lg,
    zIndex: 200,
    description: 'Modals, dialogs, overlays',
  } as const,
  
  // Top: Maximum elevation (notifications, toasts)
  top: {
    shadow: SHADOW.xl,
    zIndex: 300,
    description: 'Notifications, toasts, alerts',
  } as const,
} as const;

/**
 * BLUR EFFECTS
 * Backdrop and element blur for depth and focus
 */
export const BLUR = {
  // No blur
  none: '0',
  
  // Subtle blur - for soft backgrounds
  sm: '4px',
  
  // Standard blur - for modal backdrops
  md: '8px',
  
  // Strong blur - for heavy focus
  lg: '12px',
  
  // Very strong blur - for extreme focus
  xl: '16px',
} as const;

/**
 * BACKDROP FILTERS
 * Glassmorphism effects with blur + opacity
 */
export const BACKDROP = {
  none: 'none',
  
  // Subtle glass effect
  subtle: `backdrop-blur(4px) brightness(0.95)`,
  
  // Standard glass effect
  default: `backdrop-blur(8px) brightness(0.92)`,
  
  // Strong glass effect
  strong: `backdrop-blur(12px) brightness(0.88)`,
  
  // Very strong glass effect
  heavy: `backdrop-blur(16px) brightness(0.85)`,
} as const;

/**
 * TRANSITION DURATIONS
 * Timing for motion and animations
 */
export const TRANSITION = {
  // Fast transitions - micro interactions
  fast: '100ms',
  
  // Standard transitions - hover, focus
  base: '150ms',
  
  // Slow transitions - modals, major changes
  slow: '200ms',
  
  // Very slow transitions - page transitions
  slower: '300ms',
} as const;

/**
 * EASING FUNCTIONS
 * Timing curves for natural motion
 */
export const EASING = {
  // Linear (no easing)
  linear: 'linear',
  
  // Standard easing curves
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // iOS-like easing
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  
  // Spring-like easing
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.17, 0.67, 0.83, 0.67)',
} as const;

/**
 * PRESET TRANSITIONS
 * Ready-to-use transition combinations
 */
export const TRANSITION_PRESET = {
  // Default transition for interactive elements
  default: `all ${TRANSITION.base} ${EASING.inOut}`,
  
  // Fast response transitions
  fast: `all ${TRANSITION.fast} ${EASING.out}`,
  
  // Smooth transitions
  smooth: `all ${TRANSITION.slow} ${EASING.inOut}`,
  
  // Transform-only (for performance)
  transform: `transform ${TRANSITION.base} ${EASING.inOut}`,
  
  // Opacity-only transitions
  opacity: `opacity ${TRANSITION.base} ${EASING.inOut}`,
  
  // Shadow transitions
  shadow: `box-shadow ${TRANSITION.base} ${EASING.inOut}`,
  
  // Color transitions
  color: `color ${TRANSITION.base} ${EASING.inOut}`,
} as const;

/**
 * BORDER RADIUS SYSTEM
 * Rounded corners for visual consistency
 */
export const BORDER_RADIUS = {
  // No rounding
  none: '0',
  
  // Subtle rounding (icons, tight components)
  sm: '0.25rem',    // 4px
  
  // Standard rounding (inputs, buttons)
  md: '0.5rem',     // 8px
  
  // Generous rounding (cards, modals)
  lg: '0.75rem',    // 12px
  
  // Very rounded (large cards, panels)
  xl: '1rem',       // 16px
  
  // Pill-shaped (badges, large buttons)
  full: '9999px',
} as const;

/**
 * BORDER STYLES
 * Border widths and patterns
 */
export const BORDER = {
  // Border widths
  width: {
    none: '0',
    sm: '1px',
    md: '2px',
    lg: '3px',
    xl: '4px',
  } as const,
  
  // Border color intensities
  color: {
    subtle: 'rgba(100, 116, 139, 0.2)',     // Very light
    default: 'rgba(100, 116, 139, 0.5)',    // Standard
    strong: 'rgba(100, 116, 139, 0.8)',     // Strong
  } as const,
} as const;

/**
 * FOCUS STATES
 * Keyboard navigation focus indicators
 */
export const FOCUS = {
  // Standard focus ring (blue)
  ring: {
    offset: '2px',
    width: '2px',
    color: 'rgb(96, 165, 250)', // Blue
  } as const,
  
  // Alternative focus (for high contrast)
  ringAlt: {
    offset: '2px',
    width: '3px',
    color: 'rgb(34, 197, 94)', // Green
  } as const,
  
  // No visible focus (for mouse users)
  ringNone: {
    offset: '0',
    width: '0',
    color: 'transparent',
  } as const,
} as const;

/**
 * OPACITY SCALE
 * Transparency levels for visual hierarchy
 */
export const OPACITY = {
  none: '0',
  xs: '0.05',
  sm: '0.1',
  md: '0.25',
  lg: '0.5',
  xl: '0.75',
  full: '1',
} as const;

/**
 * EXPORT
 */
export default {
  shadow: SHADOW,
  elevation: ELEVATION,
  blur: BLUR,
  backdrop: BACKDROP,
  transition: TRANSITION,
  easing: EASING,
  transitionPreset: TRANSITION_PRESET,
  borderRadius: BORDER_RADIUS,
  border: BORDER,
  focus: FOCUS,
  opacity: OPACITY,
};
