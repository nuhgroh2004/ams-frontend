/**
 * Design System - Typography Tokens
 * Font scales, weights, and line heights for consistent hierarchy
 * 
 * Font Family: Inter (system UI-optimized sans-serif)
 * Emphasis on clarity, readability, and accessibility
 */

/**
 * FONT FAMILIES
 * Primary typography stack for AMS
 */
export const FONT_FAMILY = {
  // Default sans-serif for UI
  sans: 'var(--font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  
  // Monospace for data, code, technical content
  mono: '"Fira Code", "Courier New", monospace',
  
  // Fallback for specific contexts
  heading: 'var(--font-sans, "Inter"), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
} as const;

/**
 * FONT WEIGHTS
 * Semantic weight system for hierarchy
 */
export const FONT_WEIGHT = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

/**
 * HEADING STYLES
 * H1-H6 semantic headings with size, weight, and line height
 */
export const HEADING = {
  h1: {
    fontSize: '2rem', // 32px
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: '2.5rem', // 40px
    letterSpacing: '-0.02em',
    description: 'Page title, hero text',
  } as const,
  
  h2: {
    fontSize: '1.5rem', // 24px
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: '2rem', // 32px
    letterSpacing: '-0.01em',
    description: 'Section heading, major divisions',
  } as const,
  
  h3: {
    fontSize: '1.25rem', // 20px
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: '1.75rem', // 28px
    letterSpacing: '-0.005em',
    description: 'Subsection heading, card titles',
  } as const,
  
  h4: {
    fontSize: '1.125rem', // 18px
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: '1.5rem', // 24px
    letterSpacing: '0em',
    description: 'Component heading, form labels',
  } as const,
  
  h5: {
    fontSize: '1rem', // 16px
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: '1.5rem', // 24px
    letterSpacing: '0em',
    description: 'Strong emphasis, important labels',
  } as const,
  
  h6: {
    fontSize: '0.875rem', // 14px
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: '1.25rem', // 20px
    letterSpacing: '0.02em',
    description: 'Metadata, category labels',
  } as const,
} as const;

/**
 * BODY TEXT STYLES
 * Regular content typography
 */
export const BODY = {
  lg: {
    fontSize: '1.125rem', // 18px
    fontWeight: FONT_WEIGHT.normal,
    lineHeight: '1.75rem', // 28px
    description: 'Large body text, introductions',
  } as const,
  
  base: {
    fontSize: '1rem', // 16px
    fontWeight: FONT_WEIGHT.normal,
    lineHeight: '1.5rem', // 24px
    description: 'Default body text, paragraphs',
  } as const,
  
  sm: {
    fontSize: '0.875rem', // 14px
    fontWeight: FONT_WEIGHT.normal,
    lineHeight: '1.25rem', // 20px
    description: 'Small body text, secondary content',
  } as const,
  
  xs: {
    fontSize: '0.75rem', // 12px
    fontWeight: FONT_WEIGHT.normal,
    lineHeight: '1rem', // 16px
    description: 'Extra small text, metadata, captions',
  } as const,
} as const;

/**
 * SPECIALIZED TEXT STYLES
 * Purpose-built typography for specific use cases
 */
export const TEXT_STYLE = {
  // Button text
  button: {
    fontSize: '1rem', // 16px
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: '1.5rem', // 24px
    textTransform: 'none',
    description: 'Button labels',
  } as const,
  
  // Form labels
  label: {
    fontSize: '0.875rem', // 14px
    fontWeight: FONT_WEIGHT.medium,
    lineHeight: '1.25rem', // 20px
    description: 'Form field labels, required indicators',
  } as const,
  
  // Form hints and help text
  hint: {
    fontSize: '0.75rem', // 12px
    fontWeight: FONT_WEIGHT.normal,
    lineHeight: '1rem', // 16px
    description: 'Helper text, validation messages',
  } as const,
  
  // Table headers
  tableHeader: {
    fontSize: '0.75rem', // 12px
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: '1rem', // 16px
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    description: 'Column headers, data tables',
  } as const,
  
  // Table body
  tableBody: {
    fontSize: '0.875rem', // 14px
    fontWeight: FONT_WEIGHT.normal,
    lineHeight: '1.25rem', // 20px
    description: 'Table cell content',
  } as const,
  
  // Code/monospace
  code: {
    fontSize: '0.875rem', // 14px
    fontWeight: FONT_WEIGHT.normal,
    lineHeight: '1.5rem', // 24px
    fontFamily: FONT_FAMILY.mono,
    description: 'Code blocks, identifiers',
  } as const,
  
  // Captions and fine print
  caption: {
    fontSize: '0.75rem', // 12px
    fontWeight: FONT_WEIGHT.normal,
    lineHeight: '1rem', // 16px
    color: 'var(--text-secondary)',
    description: 'Image captions, footnotes, legal text',
  } as const,
  
  // Overline (above text, like small titles)
  overline: {
    fontSize: '0.75rem', // 12px
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: '1rem', // 16px
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    description: 'Category tags, section labels',
  } as const,
} as const;

/**
 * TYPOGRAPHY COMBINATIONS
 * Pre-made typography utilities for common patterns
 */
export const TYPOGRAPHY_PRESET = {
  // Page headings
  pageTitle: {
    ...HEADING.h1,
    className: 'text-3xl font-bold tracking-tight',
  } as const,
  
  // Section headings
  sectionTitle: {
    ...HEADING.h2,
    className: 'text-2xl font-bold tracking-tight',
  } as const,
  
  // Card titles
  cardTitle: {
    ...HEADING.h3,
    className: 'text-lg font-semibold',
  } as const,
  
  // Default body
  bodyText: {
    ...BODY.base,
    className: 'text-base',
  } as const,
  
  // Secondary body
  bodySecondary: {
    ...BODY.sm,
    className: 'text-sm text-muted-foreground',
  } as const,
} as const;

/**
 * LINE HEIGHT SCALE
 * Consistent vertical rhythm
 */
export const LINE_HEIGHT = {
  tight: 1.2,      // 120% - Headings
  snug: 1.375,     // 137.5% - Subheadings
  normal: 1.5,     // 150% - Body text (default)
  relaxed: 1.625,  // 162.5% - Readable content
  loose: 2,        // 200% - Spacing
} as const;

/**
 * LETTER SPACING
 * Fine-tuned character spacing for hierarchy
 */
export const LETTER_SPACING = {
  tight: '-0.02em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

/**
 * EXPORT UTILITIES
 */
export default {
  family: FONT_FAMILY,
  weight: FONT_WEIGHT,
  heading: HEADING,
  body: BODY,
  text: TEXT_STYLE,
  preset: TYPOGRAPHY_PRESET,
  lineHeight: LINE_HEIGHT,
  letterSpacing: LETTER_SPACING,
};
