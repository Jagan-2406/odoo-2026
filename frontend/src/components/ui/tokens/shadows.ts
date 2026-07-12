/**
 * EcoSphere Design System - Shadow Tokens
 * Configures drop-shadow and shadow-depth systems, supporting ambient overlays for dark and light modes.
 */

export const shadows = {
  // Ambient Elevation levels
  none: 'none',
  
  // Smallelevation (subtle borders, small buttons)
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  
  // Standard card elevation
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  
  // Hover card elevation
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  
  // Dropdown list, active buttons
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  
  // Dialog overlay panel / drawer
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.15)',
  
  // Critical overlays / notification toasts
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Special Glows (for badges, highlight metrics in dark mode)
  glow: {
    environmental: '0 0 15px rgba(16, 185, 129, 0.15)',
    social: '0 0 15px rgba(139, 92, 246, 0.15)',
    governance: '0 0 15px rgba(245, 158, 11, 0.15)',
    primary: '0 0 15px rgba(99, 102, 241, 0.15)',
  },

  // Semantic
  component: {
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
    cardHover: '0 10px 20px -10px rgba(0, 0, 0, 0.15)',
    dropdown: '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
    dialog: '0 24px 48px -12px rgba(0, 0, 0, 0.25)',
    tooltip: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
    navbar: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
    sidebar: 'none',
  }
};
export type Shadows = typeof shadows;
