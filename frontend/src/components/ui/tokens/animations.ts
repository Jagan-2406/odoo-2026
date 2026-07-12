/**
 * EcoSphere Design System - Animation Tokens
 * Standardizes transitions, easings, and Framer Motion presets.
 */

export const transitions = {
  // Easing presets
  easings: {
    default: [0.25, 0.1, 0.25, 1], // ease-in-out curve
    swift: [0.4, 0, 0.2, 1],       // material standard curve
    spring: { type: 'spring', stiffness: 300, damping: 30 },
    bouncy: { type: 'spring', stiffness: 400, damping: 15 },
  },

  // Duration presets
  durations: {
    instant: 0.05,
    fast: 0.15,
    normal: 0.25,
    slow: 0.35,
    deluxe: 0.5,
  }
};

// Reusable Framer Motion configurations
export const motionPresets = {
  // Fade-in transitions
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: transitions.durations.fast, ease: 'easeOut' },
  },

  // Fade-in slide up (used for listing animations or dialog entry)
  slideUp: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: transitions.durations.normal, ease: transitions.easings.swift },
  },

  // Dropdown list reveal
  dropdownReveal: {
    initial: { opacity: 0, scale: 0.95, y: -4 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -4 },
    transition: { duration: transitions.durations.fast, ease: 'easeOut' },
  },

  // Modal dialog enter scale-up
  modal: {
    initial: { opacity: 0, scale: 0.96, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.96, y: 8 },
    transition: { type: 'spring', stiffness: 350, damping: 28 },
  },

  // Drawer slide from right
  drawer: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    transition: { type: 'spring', stiffness: 300, damping: 32 },
  },

  // Smooth page transition layout wrappers
  page: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: transitions.durations.slow, ease: transitions.easings.default },
  },

  // Tap scale interactions for clickable items
  tapScale: {
    whileTap: { scale: 0.97 },
    whileHover: { scale: 1.01 },
  },

  // Hover cards highlights
  cardHover: {
    whileHover: { y: -4 },
  }
};
