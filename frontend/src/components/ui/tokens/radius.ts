/**
 * EcoSphere Design System - Border Radius Tokens
 * Standardizes rounded corners across components, cards, and modal dialogs.
 */

export const radius = {
  // Primitives
  none: '0px',
  sm: '0.25rem',   // 4px (inputs, badges, small buttons)
  md: '0.375rem',  // 6px (standard buttons, dropdown triggers)
  lg: '0.5rem',    // 8px (default cards, dashboard blocks, controls)
  xl: '0.75rem',   // 12px (nested inner cards, layouts)
  '2xl': '1rem',   // 16px (main page cards, settings blocks)
  '3xl': '1.5rem', // 24px (dialogs, drawers, overlay dialog panels)
  pill: '9999px',  // Pill badge indicators
  full: '50%',     // Fully circular containers (avatars)

  // Semantic
  component: {
    button: '0.375rem', // md
    input: '0.375rem',  // md
    card: '0.75rem',    // xl
    dialog: '1rem',     // 2xl
    badge: '9999px',    // pill
  }
};
export type Radius = typeof radius;
