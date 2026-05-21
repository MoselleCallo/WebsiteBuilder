export const colorPalettes = {
  Professional: {
    // Monotone / Professional
    main: '#F8FAFC', // Main page background
    surface: '#FFFFFF', // Card / Section background
    border: '#E2E8F0', // Subtle dividers
    primary: '#0F172A', // Main buttons / Headings
    secondary: '#64748B', // Subheaders / Icons
    accent: '#000000', // High-contrast action
    // Text pairing
    textMain: '#0F172A', // On canvas/surface
    textMuted: '#64748B', // On canvas/surface
    textOnPrimary: '#FFFFFF',
  },
  Warm: {
    // Warm / Natural tones
    main: '#FDF8F2', // Sand
    surface: '#F5E6D3', // Warm Clay
    border: '#DBC1AC', // Earthy divider
    primary: '#7C2D12', // Terracotta
    secondary: '#44403C', // Stone
    accent: '#166534', // Forest Green
    // Text pairing
    textMain: '#292524',
    textMuted: '#57534E',
    textOnPrimary: '#FFEDD5',
  },
  Cool: {
    // Dark / Deep Sea tones
    main: '#020617', // Midnight
    surface: '#0F172A', // Deep Navy
    border: '#1E293B', // Cool Slate divider
    primary: '#38BDF8', // Sky Blue
    secondary: '#94A3B8', // Muted Blue
    accent: '#22D3EE', // Cyan
    // Text pairing
    textMain: '#F8FAFC',
    textMuted: '#94A3B8',
    textOnPrimary: '#082F49', // Dark contrast text
  },
} as const;
