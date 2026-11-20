---
name: "Soneya Delivery — Ultra-Premium Conakry"
description: "Editorial luxury-meets-utility design system for Soneya Delivery Conakry across mobile and 4K web."
---

## Overview

Soneya Delivery Conakry is an all-in-one urban commerce and delivery platform connecting residents of Conakry with curated restaurants, supermarkets, boutiques, pharmacies, and express parcel couriers, powered by Orange Money and MTN MoMo in Guinean Francs (GNF).

The visual direction pairs **editorial hospitality warmth** with **high-precision logistics clarity**. Deep pine greens, sage-tinted alabaster surfaces, and champagne gold accents establish a calm, trustworthy luxury aesthetic that feels equally at home on a 390px smartphone screen in Kipé and a 4K desktop command center in Kaloum.

## Colors

The palette anchors on Soneya Emerald (`#176B4A`) and Deep Pine (`#102D22`), softened by sage-tinted off-white surfaces (`#F5F7F5`) and elevated pure white cards (`#FFFFFF`). Champagne Gold (`#C9A45C`) is reserved for verified partner badges, loyalty tiers, and high-value highlights.

- **Primary:** Soneya Emerald (`#176B4A` in light mode, `#10B981` in dark mode) for primary actions, active navigation states, and brand anchors.
- **Accent:** Champagne Gold (`#C9A45C`) for Soneya Tout badges, ratings, and featured promotions.
- **Role Accents:** Courier (`#2563A6`) and Partner (`#8A6A2D`) distinguish multi-space portals without breaking surface harmony.

```yaml
colors:
  accent: "#C9A45C"
  on-accent: "#102D22"
  success: "#176B4A"
  on-success: "#FFFFFF"
  warning: "#B45309"
  on-warning: "#FFFFFF"
  error: "#B91C1C"
  on-error: "#FFFFFF"
  courier: "#2563A6"
  on-courier: "#FFFFFF"
  partner: "#8A6A2D"
  on-partner: "#FFFFFF"
  light:
    primary: "#176B4A"
    on-primary: "#FFFFFF"
    primary-container: "#EAF3EE"
    on-primary-container: "#102D22"
    surface: "#F5F7F5"
    on-surface: "#17231C"
    surface-container-low: "#FFFFFF"
    surface-container: "#EDF2EE"
    surface-variant: "#E4EAE5"
    on-surface-variant: "#4A5850"
    outline: "#C5D1C8"
  dark:
    primary: "#10B981"
    on-primary: "#06281C"
    primary-container: "#102D22"
    on-primary-container: "#D1FAE5"
    surface: "#08120D"
    on-surface: "#F2F7F4"
    surface-container-low: "#0D1B14"
    surface-container: "#12261C"
    surface-variant: "#1A3326"
    on-surface-variant: "#A7C4B5"
    outline: "#264234"
```

## Typography

A three-family typographic hierarchy pairs **Playfair** for editorial hero headlines, **Plus Jakarta Sans** for crisp geometric UI and French body copy, and **Spline Sans Mono** for GNF pricing, order IDs, and live ETA telemetry (`tabular-nums`).

```yaml
typography:
  display-lg:
    fontFamily: "Playfair"
    fontSize: 48px
    fontWeight: 700
    lineHeight: 54px
    letterSpacing: -0.75px
  display-lg-mobile:
    fontFamily: "Playfair"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 38px
    letterSpacing: -0.5px
  display-md:
    fontFamily: "Playfair"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 42px
    letterSpacing: -0.5px
  display-md-mobile:
    fontFamily: "Playfair"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 34px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 26px
    fontWeight: 700
    lineHeight: 32px
    letterSpacing: -0.4px
  headline-md:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 26px
    letterSpacing: -0.25px
  title-lg:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: -0.15px
  title-md:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 22px
    letterSpacing: 0px
  body-lg:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0px
  body-md:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
  body-sm:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0.1px
  label-lg:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: 0.1px
  label-md:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0.2px
  label-sm:
    fontFamily: "Plus Jakarta Sans"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 14px
    letterSpacing: 0.3px
  mono-md:
    fontFamily: "Spline Sans Mono"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: 0px
  mono-sm:
    fontFamily: "Spline Sans Mono"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0.1px
```

## Layout & Spacing

The system uses a **12-column Fluid Grid** on desktop and 4K viewports (centered container up to `1360px` for Client/Partner, `1500px` for Admin, with generous outer breathing room) collapsing cleanly to a **single-column 4-track grid** on `390px` mobile. A strict `4px` / `8px` spacing scale governs all internal padding and grid gutters.

```yaml
spacing:
  gutter-xs: 4px
  gutter-sm: 8px
  gutter-md: 16px
  gutter-lg: 24px
  gutter-xl: 32px
  section: 48px
  page-margin: 24px
```

## Elevation & Depth

Hierarchy relies on **tonal surface layering** (`surface` -> `surface-container-low` -> `surface-container`) paired with whisper-soft sage-tinted ambient shadows (`0 2px 12px rgba(16, 45, 34, 0.05)`) and crisp `1px` hairline borders (`outline`). Sticky headers and mobile bottom docks use translucent frosted surfaces with subtle bottom/top borders.

## Shapes

Generous, tactile curvature defines the Soneya feel: `18px` (`lg`) for merchant cards and bento panels, `12px` (`md`) for buttons and inputs, and `9999px` (`full`) for category pills, quartier selectors, and status badges.

```yaml
rounded:
  sm: 6px
  DEFAULT: 10px
  md: 12px
  lg: 18px
  xl: 24px
  full: 9999px
```

## Motion & Micro-interaction

Interactions feel immediate and composed. Button presses and chip selections resolve in `120ms`, while drawers and modals decelerate smoothly over `240ms`. Only `transform`, `opacity`, and color properties animate.

```yaml
motion:
  state-change:
    duration: 120ms
    delay: 0ms
    timingFunction: ease-out
  surface-enter:
    duration: 240ms
    delay: 0ms
    timingFunction: cubic-bezier(0.2, 0, 0, 1)
  surface-exit:
    duration: 160ms
    delay: 0ms
    timingFunction: cubic-bezier(0.3, 0, 1, 1)
```

## Voice & Content Strategy

- **Tone of voice:** Warm, local, and reassuringly precise in French ("Livraison express à Kipé en 25 min", "Payer via Orange Money"). Avoid generic corporate jargon.
- **Capitalisation:** Sentence case for all headings, navigation items, and buttons; uppercase only for compact micro-labels (`11px` or smaller) where needed.
- **Numbers & Currency:** Always format Guinean Francs with space thousand separators and `GNF` suffix (`45 000 GNF`) using `tabular-nums`.
- **Action Labels:** Verb-first outcomes (`Commander maintenant`, `Suivre le livreur`, `Valider le panier`).

## Components

Component implementations live as individual HTML sticker sheet files in
`components/`. Each file contains the canonical, styled HTML components with
`<!-- COMPONENT: name -->` comment markers. Read each file before use.

- **Button** → `@components/button.html`: `button-primary`, `button-icon`, `button-with-icon`
- **Card** → `@components/card.html`: `card-elevated`, `card-action`, `card-interactive`, `card-interactive-2`
- **Chip** → `@components/chip.html`: `chip-action`, `chip-input`, `chip-with-icon`
- **Searchbar** → `@components/searchbar.html`: `searchbar-standard`, `searchbar-with-suggestions`
- **Typography** → `@components/typography.html`: `typography-display`, `typography-body`, `typography-label`
