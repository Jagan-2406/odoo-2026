/**
 * EcoSphere Design System - Spacing Tokens
 * Implements a strict 8-point system for margin, padding, grid-gaps, and layout sizes.
 */

export const spacing = {
  // Primitives
  px: '1px',
  0: '0px',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px

  // Semantic mappings
  layout: {
    padding: {
      mobile: '1rem',      // 16px
      tablet: '1.5rem',    // 24px
      desktop: '2rem',     // 32px
    },
    gap: {
      grid: '1.5rem',      // 24px
      row: '1rem',         // 16px
      stack: '0.75rem',    // 12px
    }
  },

  component: {
    padding: {
      compact: '0.5rem 0.75rem', // 8px x 12px
      normal: '0.75rem 1.25rem', // 12px x 20px
      spacious: '1.25rem 2rem',  // 20px x 32px
    }
  }
};
export type Spacing = typeof spacing;
