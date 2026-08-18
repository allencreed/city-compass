---
name: City Passport
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf1'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fa'
  on-surface: '#111c2c'
  on-surface-variant: '#44474d'
  inverse-surface: '#263142'
  inverse-on-surface: '#ebf1ff'
  outline: '#75777e'
  outline-variant: '#c5c6ce'
  surface-tint: '#4e5f7e'
  primary: '#031632'
  on-primary: '#ffffff'
  primary-container: '#1a2b48'
  on-primary-container: '#8293b5'
  inverse-primary: '#b6c7eb'
  secondary: '#ab3500'
  on-secondary: '#ffffff'
  secondary-container: '#fe6a34'
  on-secondary-container: '#5d1900'
  tertiary: '#141719'
  on-tertiary: '#ffffff'
  tertiary-container: '#282c2e'
  on-tertiary-container: '#909395'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e2ff'
  primary-fixed-dim: '#b6c7eb'
  on-primary-fixed: '#081b38'
  on-primary-fixed-variant: '#374765'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59d'
  on-secondary-fixed: '#390c00'
  on-secondary-fixed-variant: '#832600'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f9f9ff'
  on-background: '#111c2c'
  surface-variant: '#d8e3fa'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-bold:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-padding: 20px
  gutter: 16px
---

## Brand & Style

The design system is built on an **Adventurous Modernist** aesthetic. It blends the reliability of traditional travel documents with the high-energy pulse of urban exploration. The UI should evoke a sense of "digital curation"—making the user feel like an explorer collecting memories rather than a tourist following a script.

The style utilizes **Minimalism** with **Tactile** accents. We use heavy whitespace and a restricted color palette to ensure clarity while navigating complex city environments, but inject personality through "Stamp" motifs and subtle paper-like textures. The goal is a high-utility interface that feels premium, energetic, and celebratory.

## Colors

The palette is anchored by **Passport Blue** (#1A2B48), a deep navy that provides a foundation of trust and authority. This is used for navigation bars, primary headings, and active states.

**Stamp Orange** (#FF6B35) serves as the high-energy accent. It is reserved exclusively for primary calls-to-action (CTAs), progress indicators, and the "collected" stamp visual motifs. 

The background uses a "Paper White" (#F7F9FB) to reduce eye strain during outdoor use and provide a subtle contrast against white card elements. Functional grays are used for secondary text and borders to maintain a clean, professional hierarchy.

## Typography

This design system utilizes **Plus Jakarta Sans** for headings to provide a friendly, optimistic, and bold personality. The heavy weights (Bold/ExtraBold) are essential for creating the "Passport" feel—authoritative yet modern.

For body copy and functional labels, **Work Sans** provides a grounded, highly legible experience. Its neutral character balances the expressive nature of the headings. 

On mobile devices, use `headline-xl` sparingly for empty states or major section starts. For standard page headers, use `headline-lg`. Ensure all interactive labels use `label-bold` with increased letter spacing to differentiate them from static metadata.

## Layout & Spacing

The layout follows a **Fluid Grid** model optimized for handheld use. The standard horizontal margin is 20px, providing a spacious, "editorial" feel that prevents content from feeling cramped.

A 4px baseline grid governs all vertical rhythm. Use 16px (md) for standard padding within cards and 24px (lg) for vertical spacing between distinct content sections. 

For the "City View" map integration, the interface should transition to a "No Grid" layout where floating action buttons (FABs) and card carousels sit over the map with a 16px safety margin from all screen edges.

## Elevation & Depth

This design system uses **Tonal Layers** combined with **Ambient Shadows** to create a sense of organized stacking. 

1.  **Level 0 (Base):** The off-white background (#F7F9FB).
2.  **Level 1 (Cards):** Pure white surfaces (#FFFFFF) with a very soft, diffused shadow (12% opacity, Passport Blue tint). This creates a "paper on desk" feel.
3.  **Level 2 (Overlays/FABs):** Elevated components like floating buttons or active stamps use a slightly tighter shadow with 20% opacity to suggest they are "pinned" or "stamped" onto the surface.

Avoid heavy blurs; depth should feel crisp and intentional, mirroring the physical nature of a passport or map.

## Shapes

The shape language is defined by **Rounded** geometry. 

-   **Standard Elements:** Cards, input fields, and buttons use a 0.5rem (8px) radius. This balances the professional "Passport Blue" with a modern, approachable softness.
-   **Large Elements:** Feature banners and map overlays use `rounded-lg` (16px) or `rounded-xl` (24px) to create a distinct visual container.
-   **Stamp Motifs:** Stamps should be treated as circular or "scalloped-edge" shapes to contrast against the rectangular grid of the rest of the app.

## Components

### Cards
Cards are the primary vehicle for landmarks and locations. They feature a pure white background, 8px rounded corners, and a 1px soft gray stroke (#E2E8F0) to ensure they pop against the off-white background. Imagery should be full-bleed at the top of the card.

### Buttons
- **Primary:** Solid Passport Blue with white text. High contrast, 8px radius.
- **Action:** Solid Stamp Orange. Used for "Check-in" or "Claim Stamp" actions.
- **Ghost:** Passport Blue outline with transparent background for secondary navigation.

### Stamps & Progress
- **The Stamp:** When a user completes a visit, a Stamp Orange badge appears. It should have a slightly rotated (3-5 degree) transform to mimic a manual ink stamp.
- **Progress Bars:** Use a thick (8px) track in light gray with the fill in Stamp Orange. Segmented progress bars are preferred to show specific "milestones" in a city’s passport.

### Map Integration
The map should use a custom "Silver" or "Muted Blue" style to prevent the standard Google/Apple map colors from clashing with the brand. Points of Interest (POIs) should use Stamp Orange pins when unvisited and Passport Blue pins when completed.

### Input Fields
Inputs use a subtle light gray fill with a bottom-only border in Passport Blue when focused, creating a sophisticated, "form-like" appearance.