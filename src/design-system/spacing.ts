/**
 * Design System - Spacing & Layout Tokens
 * Consistent spacing scale, grid, and layout utilities
 * 
 * Based on 4px base unit for flexible, balanced spacing
 */

/**
 * SPACING SCALE
 * Base unit: 4px
 * Geometric progression: 4, 8, 12, 16, 24, 32, 40, 48, 56, 64
 */
export const SPACING = {
  // Micro spacing
  0: '0px',
  px: '1px',
  
  // Base unit increments (4px)
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  7: '1.75rem',   // 28px
  8: '2rem',      // 32px
  9: '2.25rem',   // 36px
  10: '2.5rem',   // 40px
  11: '2.75rem',  // 44px
  12: '3rem',     // 48px
  14: '3.5rem',   // 56px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  28: '7rem',     // 112px
  32: '8rem',     // 128px
  36: '9rem',     // 144px
  40: '10rem',    // 160px
  44: '11rem',    // 176px
  48: '12rem',    // 192px
  52: '13rem',    // 208px
  56: '14rem',    // 224px
  60: '15rem',    // 240px
  64: '16rem',    // 256px
} as const;

/**
 * SEMANTIC SPACING
 * Purpose-driven spacing values for common UI patterns
 */
export const SEMANTIC_SPACING = {
  // Micro interactions
  gap_xs: SPACING[1],      // 4px - Between icon + text
  gap_sm: SPACING[2],      // 8px - Compact spacing
  gap_md: SPACING[3],      // 12px - Standard spacing
  gap_lg: SPACING[4],      // 16px - Generous spacing
  gap_xl: SPACING[6],      // 24px - Large gaps
  gap_2xl: SPACING[8],     // 32px - Extra large gaps
  
  // Padding
  padding_xs: SPACING[2],  // 8px - Compact components
  padding_sm: SPACING[3],  // 12px - Standard padding
  padding_md: SPACING[4],  // 16px - Card padding
  padding_lg: SPACING[6],  // 24px - Large padding
  padding_xl: SPACING[8],  // 32px - Extra padding
  
  // Margins
  margin_xs: SPACING[2],   // 8px - Tight margins
  margin_sm: SPACING[3],   // 12px - Standard margins
  margin_md: SPACING[4],   // 16px - Default margins
  margin_lg: SPACING[6],   // 24px - Large margins
  margin_xl: SPACING[8],   // 32px - Extra margins
} as const;

/**
 * COMPONENT SPACING RULES
 * Predefined spacing for consistent component layouts
 */
export const COMPONENT_SPACING = {
  // Button spacing
  button: {
    paddingX: SPACING[4],   // 16px horizontal
    paddingY: SPACING[2],   // 8px vertical (32px total height with text)
    gap: SPACING[2],        // 8px between icon and text
  } as const,
  
  button_sm: {
    paddingX: SPACING[3],   // 12px horizontal
    paddingY: SPACING[1],   // 4px vertical
    gap: SPACING[2],        // 8px between icon and text
  } as const,
  
  button_lg: {
    paddingX: SPACING[6],   // 24px horizontal
    paddingY: SPACING[3],   // 12px vertical
    gap: SPACING[2],        // 8px between icon and text
  } as const,
  
  // Input spacing
  input: {
    paddingX: SPACING[3],   // 12px horizontal
    paddingY: SPACING[2],   // 8px vertical (36px total height)
    gap: SPACING[2],        // 8px between elements
  } as const,
  
  input_sm: {
    paddingX: SPACING[2],   // 8px horizontal
    paddingY: SPACING[1],   // 4px vertical
    gap: SPACING[1],        // 4px between elements
  } as const,
  
  input_lg: {
    paddingX: SPACING[4],   // 16px horizontal
    paddingY: SPACING[3],   // 12px vertical (44px total height)
    gap: SPACING[2],        // 8px between elements
  } as const,
  
  // Card spacing
  card: {
    padding: SPACING[6],    // 24px padding
    gap: SPACING[4],        // 16px between elements
    gap_sm: SPACING[2],     // 8px for compact content
  } as const,
  
  // Modal/Dialog spacing
  modal: {
    padding: SPACING[6],    // 24px padding
    gap: SPACING[4],        // 16px between sections
  } as const,
  
  // Table spacing
  table: {
    cellPaddingX: SPACING[4],   // 16px horizontal
    cellPaddingY: SPACING[3],   // 12px vertical (40px row height)
    headerPaddingY: SPACING[3], // 12px vertical
    gap: SPACING[2],            // 8px between elements
  } as const,
  
  // Form group spacing
  form: {
    fieldGap: SPACING[4],    // 16px between fields
    labelMarginBottom: SPACING[2], // 8px below label
    hintMarginTop: SPACING[1],    // 4px above hint
  } as const,
} as const;

/**
 * LAYOUT GRID
 * Container and grid sizing
 */
export const LAYOUT = {
  // Container sizes
  container: {
    xs: '20rem',    // 320px
    sm: '24rem',    // 384px
    md: '28rem',    // 448px
    lg: '32rem',    // 512px
    xl: '36rem',    // 576px
    '2xl': '42rem', // 672px
    '3xl': '48rem', // 768px
    '4xl': '56rem', // 896px
    '5xl': '64rem', // 1024px
    '6xl': '72rem', // 1152px
    '7xl': '80rem', // 1280px
    full: '100%',
  } as const,
  
  // Breakpoints (Tailwind defaults)
  breakpoint: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  } as const,
  
  // Grid columns
  grid: {
    cols_1: '1',
    cols_2: '2',
    cols_3: '3',
    cols_4: '4',
    cols_6: '6',
    cols_12: '12',
  } as const,
  
  // Sidebar layout
  sidebar: {
    collapsedWidth: '4rem',     // 64px
    expandedWidth: '16rem',     // 256px
  } as const,
} as const;

/**
 * DEPTH/LAYERING
 * z-index scale for stacking context
 */
export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
  notification: 1600,
  loader: 1700,
} as const;

/**
 * SIZE SCALES
 * Standard sizes for icons, avatars, etc.
 */
export const SIZE = {
  // Icon sizes
  icon_xs: '0.75rem',    // 12px
  icon_sm: '1rem',       // 16px
  icon_md: '1.5rem',     // 24px
  icon_lg: '2rem',       // 32px
  icon_xl: '2.5rem',     // 40px
  icon_2xl: '3rem',      // 48px
  
  // Avatar sizes
  avatar_xs: '1.5rem',   // 24px
  avatar_sm: '2rem',     // 32px
  avatar_md: '2.5rem',   // 40px
  avatar_lg: '3rem',     // 48px
  avatar_xl: '4rem',     // 64px
  
  // Badge sizes
  badge_sm: '0.375rem',  // 6px (dot)
  badge_md: '0.5rem',    // 8px
  badge_lg: '0.75rem',   // 12px
  
  // Touch target minimum (accessibility)
  minTouchTarget: '2.75rem', // 44px
} as const;

/**
 * EXPORT
 */
export default {
  spacing: SPACING,
  semantic: SEMANTIC_SPACING,
  component: COMPONENT_SPACING,
  layout: LAYOUT,
  zIndex: Z_INDEX,
  size: SIZE,
};
