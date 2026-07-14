---
name: Periscope Enterprise Design System
colors:
  surface: '#f8f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#edeef0'
  surface-container-high: '#e7e8ea'
  surface-container-highest: '#e1e2e4'
  on-surface: '#191c1e'
  on-surface-variant: '#464555'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f3'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fc'
  on-secondary-container: '#57657a'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#d5e3fc'
  secondary-fixed-dim: '#b9c7df'
  on-secondary-fixed: '#0d1c2e'
  on-secondary-fixed-variant: '#3a485b'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e1e2e4'
typography:
  page-title:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  section-heading:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-tabular:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  button-text:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  sidebar-width: 240px
  topbar-height: 56px
  container-padding: 32px
  gutter: 24px
---

## Brand & Style
The design system is engineered for high-density internal operations, prioritizing clarity, precision, and speed of cognition. It draws heavily from **Modern Corporate** aesthetics, utilizing a "system-first" approach that balances utilitarian efficiency with a refined, premium feel.

The visual narrative is built on:
- **Trustworthy Precision:** Tight alignments, consistent stroke weights, and a rigorous 8px grid.
- **Subtle Layering:** Using soft shadows and neutral borders rather than heavy colors to define hierarchy.
- **Data Clarity:** Specialized focus on tabular numerals and high-contrast text to reduce eye strain during prolonged use.
- **Intentional Focus:** Neutral backgrounds allow the primary indigo and semantic status colors to provide immediate orientation.

## Colors
The palette is dominated by a clean, neutral foundation to support data-heavy interfaces.

- **Primary Indigo:** Used exclusively for primary actions, active navigation states, and progress indicators.
- **Surface Strategy:** The global background is #F7F8FA. Interactive surfaces (cards, modals, inputs) utilize pure white (#FFFFFF) to create a clear "raised" relationship.
- **Semantic Logic:** Success, Warning, Danger, and Info roles use a high-contrast pair (dark text on light background) to ensure accessibility and immediate recognition without overwhelming the interface.
- **Typography Tinting:** Use Secondary text for labels and metadata, and Muted text only for non-critical placeholders or disabled states.

## Typography
Inter is used across the entire system for its exceptional legibility and comprehensive OpenType features.

- **Tabular Numerals:** For any data display, especially in tables and KPI cards, `font-variant-numeric: tabular-nums` must be enabled to ensure columns of numbers align vertically.
- **Hierarchy:** Page titles use a tight tracking (-0.02em) to maintain a modern, "locked-in" look.
- **Scale:** The system adheres to a 14px base to maximize information density while remaining accessible.

## Layout & Spacing
The layout uses a rigorous **8px grid system**. All margins, paddings, and component heights should be multiples of 8.

- **App Shell:** A fixed 240px sidebar provides primary navigation. The 56px top bar handles global actions and breadcrumbs.
- **Grid:** Use a 12-column fluid grid for dashboard layouts. 
- **Density:** In data-dense views (like tables), vertical padding may be reduced to 4px or 12px increments to keep more information "above the fold."

## Elevation & Depth
Depth is communicated through a combination of subtle borders and soft, large-radius shadows.

- **Level 0 (Background):** #F7F8FA. No shadow.
- **Level 1 (Cards/Tables):** White background, 1px border (#E5E7EB), and a subtle shadow: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)`.
- **Level 2 (Dropdowns/Popovers):** White background, 1px border (#E5E7EB), and a medium shadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1)`.
- **Level 3 (Modals):** White background, no border, and a heavy ambient shadow to focus attention.

## Shapes
The shape language balances modern approachability with professional structure.

- **Cards:** 12px radius creates a distinct containerized feel for major modules.
- **Controls:** Inputs, buttons, and segmented controls use an 8px radius.
- **Badges:** Status indicators always use a "pill" shape (9999px) to differentiate them from interactive buttons or cards.

## Components

### Buttons
- **Solid Indigo:** Primary action. White text. Hover: #4338CA.
- **White/Border:** Secondary action. White background, #E5E7EB border, #0F172A text.
- **Ghost:** Tertiary action. No background or border. Indigo text for interaction, Secondary text for neutral.
- **Destructive:** Solid #DC2626 or White with Red border/text for secondary destructive actions.

### KPI Stat Card
- **Label:** 12px Medium, Secondary text color.
- **Value:** 24px Bold, Tabular numerals, Primary text color.
- **Delta:** Small pill badge. Positive (Green bg/text), Negative (Red bg/text), Neutral (Gray bg/text). Include up/down chevron.

### Data Tables
- **Row Height:** Strictly 44px.
- **Header:** 12px Bold, uppercase with 0.05em tracking, Secondary text color. #F1F5F9 background.
- **Alignment:** Text is left-aligned; all numeric and monetary data must be right-aligned.
- **Dividers:** 1px horizontal border (#E5E7EB) only. No zebra stripes.

### Form Inputs & Segmented Controls
- **Inputs:** 8px radius, 1px #E5E7EB border. Focus state: 1px Indigo border with 2px Indigo wash (20% opacity).
- **Segmented Controls:** A light gray track (#F1F5F9) with a white "floating" card for the active segment. 2px internal padding.

### Tags & Status Badges
- **Status Badges:** Small pill-shaped, using the Semantic color palette.
- **Application Tags:** White background, 1px border, with a 6px solid color dot (product-specific) preceding the label.