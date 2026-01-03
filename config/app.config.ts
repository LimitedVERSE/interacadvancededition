/**
 * Application configuration
 * Centralized settings for the Interac Money Transfer Interface
 */

export const appConfig = {
  // Application metadata
  name: "Interac Money Transfer Demo",
  description: "Secure money transfer interface for Interac Developer Network",
  version: "1.0.0",

  // API simulation settings
  api: {
    simulatedDelay: 300, // milliseconds
    enableMockData: true,
  },

  // UI settings
  ui: {
    itemsPerPage: 16,
    searchDebounceMs: 300,
    colors: {
      primary: "#FDB913", // Interac yellow
      secondary: "#000000", // Black
      background: "#FFFFFF", // White
    },
  },

  // Feature flags
  features: {
    enableSearch: true,
    enableDropdowns: true,
    enableKeyboardNavigation: true,
  },

  // Accessibility settings
  accessibility: {
    announceLoadingStates: true,
    focusVisibleRings: true,
  },
} as const

export type AppConfig = typeof appConfig
