# Project memory

## Product intent & audience

- Multi-service delivery app (inferred brand: Soneya) with four role-based spaces: Client, Livreur (Rider), Business (Partenaire), Admin.
- Client services span four categories: Repas (meals), Courses (shopping), Santé (health), Colis (packages).
- Design source was a delivered "dossier soigné" containing a CORRIGE (corrected) version; the project must match that corrected design exactly.

## Brand personality & voice

- Editorial, polished, service-oriented tone.
- French-language UI across all spaces.
- Role-coded identity rather than a single uniform palette.

## Visual design & UX direction

- Typography: Plus Jakarta Sans.
- Border radius: 18px; soft shadows throughout.
- Role accent colors: Client = green (Soneya green), Rider = blue, Partenaire = olive, Admin = graphite.
- Shared header and bottom navigation reused across spaces but adapted (accent + content) per role.
- Responsive layouts with distinct max-widths per space.
- Screens implemented per space:
  - Client: editorial hero, search, category grid, trend cards, product detail, cart, live GPS tracking, profile, orders, receipts.
  - Rider: missions, availability toggle, GPS navigation, earnings, KYC registration (signature + documents).
  - Business: dashboard, products, promotions, stock.
  - Admin: confidential internal console — piloting, finances, KYC verification.
  - Portal: entry screen selecting the four spaces.

## Decisions, constraints & rationale

- Replaced project source with CORRIGE design files so screens follow the delivered folder's logic and styling.
- Reverted CORRIGE package.json because its esbuild version triggered a rolldown/dependency issue; kept the working package.json + lockfile to preserve build stability.
- Build and type-check pass cleanly on the active project; remaining TS errors were confined to the extracted (non-built) folder and were ignored.
- Extracted zip folders were cleaned up after files were copied into the project.

## Open questions & assumptions

- Assuming the delivered CORRIGE folder is the single source of truth; no further design revisions expected unless provided.
- Backend/API integration status unknown — current implementation is design/screen-focused.
- Real content, assets, and copy may need to replace placeholder data from the design mockups.