/**
 * EcoSphere Design System - Color Tokens
 * Premium, high-contrast palette optimized for Dark and Light modes.
 * Uses CSS variable mapping for dynamic theme switching.
 */

export const colors = {
  // Brand Primitives
  brand: {
    primary: {
      light: '#09090b', // Zinc 950
      dark: '#fafafa',  // Zinc 50
    },
    secondary: {
      light: '#71717a', // Zinc 500
      dark: '#a1a1aa',  // Zinc 400
    },
    accent: {
      light: '#6366f1', // Indigo 500
      dark: '#818cf8',  // Indigo 400
    }
  },

  // Semantic ESG Indicators
  esg: {
    environmental: {
      DEFAULT: '#10b981', // Emerald 500
      light: '#10b981',
      dark: '#34d399',  // Emerald 400
      bg: {
        light: '#ecfdf5',
        dark: 'rgba(16, 185, 129, 0.1)',
      }
    },
    social: {
      DEFAULT: '#8b5cf6', // Violet 500
      light: '#8b5cf6',
      dark: '#a78bfa',  // Violet 400
      bg: {
        light: '#f5f3ff',
        dark: 'rgba(139, 92, 246, 0.1)',
      }
    },
    governance: {
      DEFAULT: '#f59e0b', // Amber 500
      light: '#f59e0b',
      dark: '#fbbf24',  // Amber 400
      bg: {
        light: '#fffbeb',
        dark: 'rgba(245, 158, 11, 0.1)',
      }
    }
  },

  // Status Colors
  status: {
    success: {
      light: '#10b981',
      dark: '#34d399',
    },
    error: {
      light: '#ef4444', // Red 500
      dark: '#f87171',  // Red 400
    },
    warning: {
      light: '#f59e0b',
      dark: '#fbbf24',
    },
    info: {
      light: '#3b82f6', // Blue 500
      dark: '#60a5fa',  // Blue 400
    }
  },

  // Surfaces & Backgrounds
  ui: {
    background: {
      light: '#ffffff',
      dark: '#030303',
    },
    surface: {
      light: '#f4f4f5', // Zinc 100
      dark: '#09090b',  // Zinc 950
    },
    card: {
      light: '#ffffff',
      dark: '#0c0c0e',  // Slate / Zinc hybrid dark card
    },
    cardHover: {
      light: '#fafafa',
      dark: '#141416',
    },
    border: {
      light: '#e4e4e7', // Zinc 200
      dark: '#1f1f23',  // Zinc 800-like custom border
    },
    text: {
      primary: {
        light: '#09090b',
        dark: '#fafafa',
      },
      secondary: {
        light: '#71717a',
        dark: '#a1a1aa',
      },
      muted: {
        light: '#a1a1aa',
        dark: '#52525b',
      }
    },
    sidebar: {
      bg: {
        light: '#f8f8f9',
        dark: '#060608',
      },
      border: {
        light: '#f1f1f2',
        dark: '#0e0e11',
      }
    }
  },

  // Recharts Chart Colors (hex values for direct pass-in to Recharts components)
  charts: {
    emerald: '#10b981',
    violet: '#8b5cf6',
    amber: '#f59e0b',
    indigo: '#6366f1',
    blue: '#3b82f6',
    rose: '#f43f5e',
    grid: {
      light: '#e4e4e7',
      dark: '#1f1f23',
    },
    tooltip: {
      bg: {
        light: '#ffffff',
        dark: '#09090b',
      },
      border: {
        light: '#e4e4e7',
        dark: '#1f1f23',
      }
    }
  }
};
export type ColorTheme = typeof colors;
