/**
 * ============================================================================
 * UI COMPONENTS ARCHITECTURE
 * ============================================================================
 * 
 * This is a 3-LAYER SYSTEM. Import from the correct layer based on your needs.
 * 
 * 🚫 DO NOT import directly from 'ui/' - that's an anti-pattern
 * 
 * ============================================================================
 * LAYER 1: PRIMITIVES (Design System Control Entry Point)
 * ============================================================================
 * 
 * Wraps ShadCN UI components with design system enforcement
 * - Enforces colors, spacing, typography
 * - Ensures consistency across entire app
 * - Single source of truth for styling
 * 
 * ✅ IMPORT FROM HERE for all basic UI elements:
 * 
 *   import { 
 *     AppButton,          // replaces Button
 *     AppInput,           // replaces Input
 *     AppSelect,          // replaces Select
 *     AppTextarea,        // replaces Textarea
 *     AppCard,            // replaces Card
 *     AppBadge,           // replaces Badge
 *   } from '@/components/primitives'
 * 
 * ============================================================================
 * LAYER 2: PATTERNS (Feature-Level Composition)
 * ============================================================================
 * 
 * Complex, multi-part components built FROM PRIMITIVES
 * - Forms, tables, workflows, cards
 * - Feature-level UI patterns
 * - Always uses primitives, never uses ui/
 * 
 * ✅ IMPORT FROM HERE for complex UI compositions:
 * 
 *   import {
 *     FormWrapper,        // React Hook Form provider
 *     FormField,          // Generic form field
 *     FormFileUpload,     // Drag & drop upload
 *     DataTable,          // TanStack Table wrapper
 *     ApprovalTimeline,   // Workflow timeline
 *     ApprovalAction,     // Approval buttons
 *     MetricCard,         // Metric display
 *     Alert,              // Dismissible alerts
 *     Badge,              // Status badges
 *   } from '@/components/patterns'
 * 
 * ============================================================================
 * LAYER 3: UI (ShadCN Base - DO NOT USE DIRECTLY)
 * ============================================================================
 * 
 * Raw, unstyled ShadCN UI components
 * - ONLY used by primitives layer
 * - DO NOT import in application code
 * - DO NOT use in features
 * 
 * ❌ NEVER IMPORT FROM ui/:
 *   import { Button } from '@/components/ui/button'  // WRONG!
 * 
 * ============================================================================
 * QUICK USAGE GUIDE
 * ============================================================================
 * 
 * Simple Button:
 *   import { AppButton } from '@/components/primitives'
 *   <AppButton variant="primary">Click me</AppButton>
 * 
 * Form with Validation:
 *   import { FormWrapper, FormField, AppInput } from '@/components/patterns'
 *   import { useForm } from 'react-hook-form'
 * 
 *   const form = useForm()
 *   <FormWrapper form={form} onSubmit={handle}>
 *     <FormField control={form.control} name="email" label="Email">
 *       <AppInput type="email" />
 *     </FormField>
 *   </FormWrapper>
 * 
 * Data Table:
 *   import { DataTable } from '@/components/patterns'
 *   <DataTable columns={cols} data={rows} />
 * 
 * ============================================================================
 * KEY PRINCIPLES
 * ============================================================================
 * 
 * 1. Design System First
 *    - All colors from design tokens
 *    - All spacing from design tokens  
 *    - All typography from design tokens
 *    - NO hardcoded hex colors
 * 
 * 2. Single Responsibility
 *    - ui/ = unstyled base
 *    - primitives/ = styled + consistent
 *    - patterns/ = composed + reusable
 * 
 * 3. No Duplicates
 *    - If it exists in primitives, use primitives
 *    - If it exists in patterns, use patterns
 *    - Never create one-off components
 * 
 * 4. Accessibility First
 *    - All components WCAG 2.1 AA compliant
 *    - Focus management (focus-visible:ring-2)
 *    - Semantic HTML (h1-h6, labels, buttons)
 *    - ARIA attributes (aria-label, aria-invalid)
 * 
 * 5. Dark Mode Support
 *    - All colors use dark: prefix
 *    - Tested in light and dark themes
 *    - No forced light/dark theme
 * 
 * ============================================================================
 * FEATURE DEVELOPMENT WORKFLOW
 * ============================================================================
 * 
 * 1. Identify UI needs
 * 2. Check primitives/ (basic UI elements)
 * 3. Check patterns/ (complex compositions)
 * 4. If not found:
 *    a. Create in patterns/
 *    b. Build FROM primitives
 *    c. Use design tokens
 *    d. Test accessibility
 *    e. Add to exports
 * 5. Never use ui/ directly
 * 
 * ============================================================================
 * ANTI-PATTERNS (Things to AVOID)
 * ============================================================================
 * 
 * ❌ Importing from ui/:
 *    import { Button } from '@/components/ui'
 * 
 * ❌ Hardcoded colors:
 *    className="bg-#2563eb"
 * 
 * ❌ One-off components:
 *    function MyCustomButton() { ... }
 * 
 * ❌ Duplicating primitives:
 *    Creating another Button component
 * 
 * ❌ Mixing layers:
 *    Using ui/ inside patterns that should use primitives
 * 
 * ============================================================================
 * ENFORCEMENT
 * ============================================================================
 * 
 * This architecture is STRICT to ensure:
 * ✓ Consistency across entire product
 * ✓ Easy theme customization (primitives layer)
 * ✓ Accessibility compliance
 * ✓ Reduced component duplication
 * ✓ Scalability as team grows
 * 
 * If you find yourself breaking these rules, ask:
 * "Can I use an existing primitive or pattern?"
 * "Should I extend a primitive instead of creating new?"
 * 
 * ============================================================================
 */

/**
 * UI COMPONENTS ARCHITECTURE
 * 
 * This is a 3-LAYER SYSTEM. Import from specific layers:
 * - @/components/ui         (Base ShadCN)
 * - @/components/primitives (Design System)
 * - @/components/patterns   (Global Compositions)
 * - @/components/layout     (Layout items)
 * 
 * FEATURE-SPECIFIC UI belongs in modules/[feature]/components/
 */
export {}
