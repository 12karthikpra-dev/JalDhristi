---
name: JalDrishti
colors:
  surface: '#f9faf7'
  surface-dim: '#d9dad7'
  surface-bright: '#f9faf7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f1'
  surface-container: '#edeeeb'
  surface-container-high: '#e7e8e6'
  surface-container-highest: '#e2e3e0'
  on-surface: '#191c1b'
  on-surface-variant: '#414944'
  inverse-surface: '#2e312f'
  inverse-on-surface: '#f0f1ee'
  outline: '#717974'
  outline-variant: '#c0c8c3'
  surface-tint: '#3b6756'
  primary: '#00261a'
  on-primary: '#ffffff'
  primary-container: '#0f3d2e'
  on-primary-container: '#7ba894'
  inverse-primary: '#a2d1bb'
  secondary: '#006495'
  on-secondary: '#ffffff'
  secondary-container: '#70c0fd'
  on-secondary-container: '#004e75'
  tertiary: '#002712'
  on-tertiary: '#ffffff'
  tertiary-container: '#003f21'
  on-tertiary-container: '#61ae7c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#beedd7'
  primary-fixed-dim: '#a2d1bb'
  on-primary-fixed: '#002116'
  on-primary-fixed-variant: '#234f3f'
  secondary-fixed: '#cbe6ff'
  secondary-fixed-dim: '#90cdff'
  on-secondary-fixed: '#001e30'
  on-secondary-fixed-variant: '#004b72'
  tertiary-fixed: '#a4f4bc'
  tertiary-fixed-dim: '#89d7a1'
  on-tertiary-fixed: '#00210e'
  on-tertiary-fixed-variant: '#00522c'
  background: '#f9faf7'
  on-background: '#191c1b'
  surface-variant: '#e2e3e0'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a high-performance, authoritative digital environment for JalDrishti, a government-tech and geospatial intelligence platform. The brand personality is rooted in absolute reliability, clarity, and analytical precision. It bridges ecological stewardship with cutting-edge cartography and environmental monitoring. 

The aesthetic is built upon a **Corporate / Modern** design style, infused with functional minimalism to handle dense geographical data without cognitive overload. The interface evokes trust, institutional gravity, and forward-looking technological capability—restrained, objective, and meticulously organized. 

### Emotional Response & Principles
- **Clarity Above All:** Information density must never compromise readability. Critical telemetry and geospatial data take immediate visual precedence.
- **Ecological Integration:** The palette directly mirrors earth, forest, and water, signaling environmental and resource intelligence.
- **Unflinching Precision:** Strict alignment, structured grids, and monospace indicators convey operational readiness for government and enterprise stakeholders.

## Colors

The color system derives its core authority from deep botanical greens and hydrological blues, anchored by earth tones and crisp neutral foundations. This palette distinguishes operational tiers, cartographic overlays, and analytical alerts with strict semantic clarity.

### Palette Architecture
- **Primary (`#0F3D2E`):** Deep forest green. Used for primary navigation, major structural headers, and core brand anchoring.
- **Secondary (`#1F7FB8`):** Water blue. Dedicated to active states, interactive data links, and primary hydrological indicators.
- **Tertiary (`#2F7D4F`):** Moss green. Applied to positive status indicators, ecological health metrics, and secondary analytical accents.
- **Supportive Accents:** 
  - **Light Aqua (`#7CC4E0`):** Secondary water telemetry and hover states.
  - **Earth Clay (`#B0763F`):** Terrain anomalies, topographical markers, and cautionary highlights.
  - **Sand (`#E9DFC9`):** Surface containers, card backgrounds, and subtle spatial segmentation.
- **Neutrals:**
  - **Background (`#F6F7F4`):** The foundational canvas for all operational views.
  - **Ink (`#14201A`):** High-contrast primary text and icons.
  - **Muted Text (`#5B6B62`):** Secondary metadata, inactive states, and supporting labels.

## Typography

The typographical hierarchy is engineered for high-density analytical dashboards. **Space Grotesk** provides a clean, geometric, and forward-looking voice for system headers and platform branding. **Inter** acts as the dependable workhorse for dense analytical reading, reports, and UI copy. **JetBrains Mono** is strictly reserved for geospatial coordinates, telemetry identifiers, timestamps, and system logs.

### Responsive Scaling
Headlines scale down gracefully on mobile viewports to prevent awkward wrapping of critical telemetry data. Monospace coordinate values must maintain fixed character spacing across all viewports to ensure vertical alignment in data tables.

## Layout & Spacing

The layout adheres to a rigid **12-column fluid grid system** designed for expansive desktop GIS workspaces, scaling down deterministically to tablet and mobile viewports. 

### Layout Behavior
- **Desktop:** Features a persistent sidebar navigation (64px collapsed, 240px expanded), an interactive central map canvas, and a collapsible right-hand inspector panel for telemetry data.
- **Tablet:** Collapses side panels into slide-over drawers; map controls float as contextual toolbars.
- **Mobile:** Single-column stacked reflow. Map view occupies a fixed height ratio (50% viewport) with scrollable telemetry cards below.
- **Spacing Rhythm:** Based on an 8px baseline grid, utilizing explicit structural margins (`2rem` desktop canvas padding) and tight component gaps (`0.5rem` to `1rem`) to maximize information architecture density.

## Elevation & Depth

Visual hierarchy is communicated primarily through structured tonal layering and low-contrast outlines rather than heavy drop shadows. This prevents interface clutter over complex map vectors.

### Depth Strategy
- **Surface Tiers:** Use distinct background variations (shifting from Neutral `#F6F7F4` to Sand `#E9DFC9` and pure white containers) to create clear z-index layering.
- **Low-Contrast Outlines:** Floating panels, toolbars, and modal dialogs are bound by crisp 1px borders in muted tones (`#5B6B62` at 20% opacity) to maintain a flat, highly technical aesthetic.
- **Ambient Indicators:** Active workspace elements utilize subtle, tinted ambient glows (using Water Blue `#1F7FB8` at low opacity) to denote focus without obscuring underlying geospatial data.

## Shapes

A strict **Soft** shape language (`roundedness: 1`) is enforced across the platform. UI elements feature a restrained `0.25rem` corner radius for standard containers, inputs, and buttons, scaling up to `0.5rem` (`rounded-lg`) for major structural cards and floating map controls. 

Pill shapes are strictly reserved for status badges, tags, and coordinate filters. Completely sharp corners (`0px`) are utilized only for precise crosshairs, map bounding boxes, and measurement overlays where geometric exactness is paramount.

## Components

Components are engineered for high-frequency operational use, ensuring rapid recognition, minimal latency, and zero ambiguity.

### Buttons
- **Primary:** Deep forest green (`#0F3D2E`) background with high-contrast text, featuring subtle hover states in lighter forest tints.
- **Secondary:** Outlined with a 1px border using the primary or neutral ink color, transparent fill.
- **Destructive/Critical:** Earth clay (`#B0763F`) or high-visibility alert fills for emergency actions.

### Chips & Badges
- Compact pill shapes utilizing JetBrains Mono for internal telemetry states (e.g., `STATUS: ACTIVE`, `LAT: 28.6139`). Color-coded backgrounds use light moss or aqua washes to indicate ecological health or water flow metrics.

### Input Fields & Controls
- Form inputs feature crisp 1px borders, soft `0.25rem` corners, and clear inline labeling. Focus states engage Water Blue (`#1F7FB8`) outlines with a subtle 2px ring. Checkboxes and radio buttons maintain precise, unrounded square geometries to match technical map markers.

### Cards & Panels
- Surface containers utilizing Sand (`#E9DFC9`) or white fills over the neutral background. Designed with header blocks that explicitly separate metadata IDs from primary content streams.

### Specialized Components
- **Coordinate Readouts:** Fixed-width monospace text blocks with copy-to-clipboard micro-interactions.
- **Layer Control Toggles:** Compact switch components with embedded status indicator lights for geospatial overlay management.
- **Telemetry Sliders:** Custom-styled range sliders for temporal playback of environmental sensor data.