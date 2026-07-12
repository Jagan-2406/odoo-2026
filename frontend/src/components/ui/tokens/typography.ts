/**
 * EcoSphere Design System - Typography Tokens
 * Standardizes typography across the platform.
 */

export const typography = {
  fontFamilies: {
    // Primary font family for UI layout and data tables
    sans: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    // Accent font family for brand headings, titles, and metrics
    display: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    // Monospace font family for logs, values, and calculations
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },

  fontSizes: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    kpi: '3.5rem',     // 56px (dashboard big metrics)
  },

  fontWeights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  lineHeights: {
    none: '1',
    tight: '1.2',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.02em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
  },

  // Compound Preset Styles
  presets: {
    h1: {
      fontFamily: 'display',
      fontSize: '4xl',
      fontWeight: 'bold',
      lineHeight: 'tight',
      letterSpacing: 'tight',
    },
    h2: {
      fontFamily: 'display',
      fontSize: '2xl',
      fontWeight: 'semibold',
      lineHeight: 'snug',
      letterSpacing: 'tight',
    },
    h3: {
      fontFamily: 'display',
      fontSize: 'xl',
      fontWeight: 'medium',
      lineHeight: 'snug',
      letterSpacing: 'tight',
    },
    bodyLarge: {
      fontFamily: 'sans',
      fontSize: 'lg',
      fontWeight: 'regular',
      lineHeight: 'relaxed',
    },
    bodyDefault: {
      fontFamily: 'sans',
      fontSize: 'base',
      fontWeight: 'regular',
      lineHeight: 'normal',
    },
    bodySmall: {
      fontFamily: 'sans',
      fontSize: 'sm',
      fontWeight: 'regular',
      lineHeight: 'normal',
    },
    caption: {
      fontFamily: 'sans',
      fontSize: 'xs',
      fontWeight: 'medium',
      lineHeight: 'none',
      letterSpacing: 'wide',
    },
    kpiValue: {
      fontFamily: 'display',
      fontSize: 'kpi',
      fontWeight: 'bold',
      lineHeight: 'none',
      letterSpacing: 'tighter',
    },
    tableHeader: {
      fontFamily: 'sans',
      fontSize: 'xs',
      fontWeight: 'semibold',
      letterSpacing: 'wide',
      textTransform: 'uppercase' as const,
    },
  }
};
