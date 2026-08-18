/**
 * City Passport design system — tokens from stitch_city_explorer_passport/DESIGN.md.
 * "Adventurous Modernist": Passport Blue + Stamp Orange on Paper White.
 */
export const colors = {
  // Brand anchors
  primary: '#1A2B48', // Passport Blue — nav, headings, active states
  primaryDark: '#031632', // deep navy — primary buttons
  onPrimary: '#FFFFFF',
  accent: '#FF6B35', // Stamp Orange — CTAs, progress, stamps
  accentContainer: '#FE6A34', // secondary-container — filled action buttons
  onAccentContainer: '#5D1900',
  accentDark: '#AB3500',

  // Surfaces (Paper White base)
  background: '#F7F9FB',
  surface: '#FFFFFF',
  surfaceDim: '#CFDAF1',
  surfaceVariant: '#D8E3FA',
  surfaceContainerLow: '#F0F3FF',
  surfaceContainer: '#E7EEFF',
  surfaceContainerHigh: '#DEE8FF',
  surfaceContainerHighest: '#D8E3FA',

  // Text
  onSurface: '#111C2C',
  onSurfaceVariant: '#44474D',
  onPrimaryContainer: '#8293B5',

  // Lines & extras
  outline: '#75777E',
  outlineVariant: '#C5C6CE',
  cardStroke: '#E2E8F0',
  error: '#BA1A1A',
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
} as const;

export const fonts = {
  headline: 'PlusJakartaSans_800ExtraBold',
  headlineBold: 'PlusJakartaSans_700Bold',
  body: 'WorkSans_400Regular',
  bodyMedium: 'WorkSans_500Medium',
  bodySemi: 'WorkSans_600SemiBold',
  label: 'WorkSans_700Bold',
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  container: 20,
} as const;

/** Level 1 card shadow — soft diffused, Passport Blue tint. */
export const shadowCard = {
  shadowColor: '#031632',
  shadowOpacity: 0.12,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
} as const;

/** Level 2 elevated/FAB shadow — tighter, 20% opacity. */
export const shadowElevated = {
  shadowColor: '#031632',
  shadowOpacity: 0.2,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 8 },
  elevation: 6,
} as const;
