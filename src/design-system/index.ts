/**
 * Design System - Token Registry
 * Central export for all design tokens
 * 
 * Use these tokens to maintain design consistency across the entire application
 */

export { default as colors, PRIMARY, SECONDARY, SUCCESS, WARNING, DANGER, NEUTRAL, SEMANTIC, FUNCTIONAL } from './colors';
export type { } from './colors';

export { default as typography, HEADING, BODY, FONT_FAMILY, FONT_WEIGHT, TEXT_STYLE } from './typography';
export type { } from './typography';

export { default as spacing, SPACING, COMPONENT_SPACING, LAYOUT, SIZE } from './spacing';
export type { } from './spacing';

export { default as effects, SHADOW, ELEVATION, TRANSITION_PRESET, BORDER_RADIUS } from './effects';
export type { } from './effects';

/**
 * MASTER TOKEN OBJECT
 * Access all tokens from a single import
 */
import colors from './colors';
import typography from './typography';
import spacing from './spacing';
import effects from './effects';

export const designTokens = {
  colors,
  typography,
  spacing,
  effects,
} as const;

export default designTokens;
