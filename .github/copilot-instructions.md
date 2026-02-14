# Builderly - Copilot Instructions

## Architecture Overview

This is a **monorepo website builder** (pnpm + Turborepo) with two main apps:
- **`apps/web`** (Next.js 14 App Router, port 3000): Dashboard, API routes, runtime site rendering
- **`apps/editor`** (Vite + React, port 5173): Visual drag-and-drop page builder

Shared packages in `packages/`:
- **`core`**: Component registry, schemas (Zod), templates, actions, plugins
- **`db`**: Prisma schema + client (PostgreSQL)
- **`sdk`**: API types and validation schemas
- **`ui`**: Shared UI components (shadcn/ui pattern with Radix primitives)
- **`config`**: Shared ESLint, TypeScript, Tailwind configs

## Data Model

Multi-tenant hierarchy: `User → WorkspaceMember → Workspace → Site → Page`

Pages store their content in `builderTree` (JSON) following the `BuilderTree` schema defined in `packages/core/src/schemas/node.ts`.

## Critical Patterns

### Component Registry
Components must be registered in `packages/core/src/registry/builtin-components.ts`. Each has:
- `type`: Unique identifier (e.g., `'Heading'`, `'Button'`)
- `defaultProps`: Initial property values
- `propSchema`: Zod schema for validation

### Editor State (Zustand)
State management in `apps/editor/src/store/editor-store.ts`:
- `setTree()`: For initial load (sets `isDirty: false`)
- `replaceTree()`: For user changes (sets `isDirty: true`, adds to history)
- `updateNode()`, `addNode()`, `deleteNode()`: Use these for individual changes

### API Routes Pattern
All API routes at `apps/web/src/app/api/` follow this pattern:
```typescript
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { SomeSchema } from '@builderly/sdk';
```

### UI Components
Import from `@builderly/ui`:
```typescript
import { Button, Input, Dialog, AlertDialog, cn } from '@builderly/ui';
```
If adding new Radix components, add them to both `packages/ui` AND `apps/editor` to prevent duplicate React instances.

## Development Commands

```bash
pnpm dev                    # Start all apps
pnpm build                  # Build all packages
pnpm db:generate            # Regenerate Prisma client
pnpm db:migrate             # Run migrations
```

### Common Fixes

**Prisma/Next.js cache errors** (`Cannot find module './vendor-chunks/@prisma+client'`):
```bash
# Stop all processes, regenerate Prisma, delete .next cache
Get-Process -Name "node" | Stop-Process -Force
cd packages/db && pnpm exec prisma generate
Remove-Item -Recurse -Force apps/web/.next
pnpm dev
```

**React hooks errors** (`dispatcher is null`):
Ensure Radix dependencies are in `apps/editor/package.json`, not just in `packages/ui`.

## Key Files

- `packages/core/src/schemas/node.ts`: BuilderNode, BuilderTree schemas
- `packages/core/src/registry/component-registry.ts`: Component registration
- `apps/editor/src/store/editor-store.ts`: Editor state management
- `apps/web/src/lib/permissions.ts`: Auth/permission helpers
- `packages/db/prisma/schema.prisma`: Database schema

## Conventions

- German UI text for user-facing strings in dashboard
- All API validation via Zod schemas from `@builderly/sdk`
- Component styles use Tailwind CSS with `cn()` utility for conditional classes
- Dark mode support via `next-themes` (class-based)

---

## 🎨 Template-Entwicklung

### Template-Kategorien

| Kategorie | Beschreibung | Typische Sektionen |
|-----------|--------------|-------------------|
| **E-Commerce** | Online-Shops | Hero, Produkte, Kategorien, Trust, Newsletter, Footer |
| **Portfolio** | Kreative/Freelancer | Hero, Projekte, Über mich, Skills, Kontakt |
| **Landing Page** | Conversion-fokussiert | Hero, Features, Testimonials, Pricing, CTA |
| **Blog/Magazin** | Content-fokussiert | Header, Featured, Artikel-Grid, Sidebar, Newsletter |
| **Corporate** | Unternehmen | Hero, Services, Team, Referenzen, Kontakt |
| **Restaurant** | Gastronomie | Hero, Menü, Reservierung, Galerie, Öffnungszeiten |
| **SaaS** | Software/Apps | Hero, Features, Pricing, FAQ, CTA |

### 📱 Mobile-First Regeln

**Jedes Element MUSS `mobile: {}` Styles haben!**

```typescript
// Grid → Stack auf Mobile
style: { 
  base: { display: 'grid', gridColumns: 3, gap: 'lg' }, 
  mobile: { gridColumns: 1, gap: 'md' } 
}

// Row → Column auf Mobile  
style: { 
  base: { display: 'flex', flexDirection: 'row' }, 
  mobile: { flexDirection: 'column' } 
}

// Verstecken auf Mobile
style: { base: { display: 'flex' }, mobile: { display: 'none' } }

// Nur auf Mobile zeigen
style: { base: { display: 'none' }, mobile: { display: 'flex' } }
```

**Typography Scaling**
| Element | Desktop | Mobile |
|---------|---------|--------|
| H1 | 48px / 4xl | 28px / 2xl |
| H2 | 36px / 3xl | 24px / xl |
| H3 | 24px / 2xl | 20px / lg |
| Body | 16px / base | 14px / sm |

**Spacing Scaling**
| Desktop | Mobile |
|---------|--------|
| padding: '2xl' | padding: 'lg' |
| gap: 'xl' | gap: 'md' |
| margin: 'lg' | margin: 'md' |

### 📦 Container maxWidth

**WICHTIG:** Container verwenden `maxWidth` für die maximale Breite. Diese gilt für alle Bildschirmgrößen - auf Mobile begrenzt der Viewport die Breite automatisch.

**Tailwind maxWidth Werte:**
| Token | Breite | Verwendung |
|-------|--------|------------|
| `sm` | 384px | Sehr schmale Inhalte (Formulare) |
| `md` | 448px | Schmale Inhalte |
| `lg` | 512px | Kompakte Inhalte |
| `xl` | 576px | ⚠️ ZU SCHMAL für Content! |
| `2xl` | 672px | Artikel, Blogposts |
| `3xl` | 768px | Mittlere Inhalte |
| `4xl` | 896px | Breite Inhalte |
| `5xl` | 1024px | Standard Content |
| `6xl` | 1152px | Breiter Content |
| `7xl` | 1280px | ✅ EMPFOHLEN für Shop/Landing Pages |
| `full` | 100% | Volle Breite |

**Container Best Practices:**
```typescript
// ✅ RICHTIG - Breiter Container für Content
{ type: 'Container', props: { maxWidth: '7xl', centered: true } }

// ✅ RICHTIG - Volle Breite für Hero-Banner
{ type: 'Container', props: { maxWidth: 'full' } }

// ❌ FALSCH - 'xl' ist nur 576px, zu schmal für Desktop!
{ type: 'Container', props: { maxWidth: 'xl', centered: true } }
```

**Standard-Empfehlungen:**
- Shop/E-Commerce: `maxWidth: '7xl'` (1280px)
- Landing Pages: `maxWidth: '6xl'` oder `'7xl'`
- Blog/Artikel: `maxWidth: '3xl'` oder `'4xl'`
- Hero-Banner: `maxWidth: 'full'`
- Footer: `maxWidth: '7xl'`

### 🎨 Farbschemata

**Modern Dark**
```typescript
{ background: '#0a0a0a', foreground: '#fafafa', primary: '#6366f1', secondary: '#22d3ee', accent: '#f43f5e', muted: '#27272a' }
```

**Clean Light**
```typescript
{ background: '#ffffff', foreground: '#1a1a1a', primary: '#2563eb', secondary: '#64748b', accent: '#f59e0b', muted: '#f4f4f5' }
```

**Nature/Organic**
```typescript
{ background: '#fefce8', foreground: '#1c1917', primary: '#16a34a', secondary: '#84cc16', accent: '#ea580c', muted: '#ecfccb' }
```

**Luxury/Premium**
```typescript
{ background: '#18181b', foreground: '#fafafa', primary: '#d4af37', secondary: '#a78bfa', accent: '#f472b6', muted: '#27272a' }
```

**Tech/Cyber**
```typescript
{ background: '#020617', foreground: '#e2e8f0', primary: '#22d3ee', secondary: '#a855f7', accent: '#10b981', muted: '#1e293b' }
```

**Warm Minimal**
```typescript
{ background: '#faf5f0', foreground: '#292524', primary: '#dc2626', secondary: '#78716c', accent: '#0891b2', muted: '#f5f5f4' }
```

**Ocean/Fresh**
```typescript
{ background: '#f0fdfa', foreground: '#134e4a', primary: '#0d9488', secondary: '#06b6d4', accent: '#f97316', muted: '#ccfbf1' }
```

**Bold/Vibrant**
```typescript
{ background: '#fef2f2', foreground: '#1f2937', primary: '#dc2626', secondary: '#7c3aed', accent: '#fbbf24', muted: '#fee2e2' }
```

### 📐 Layout-Varianten

**Hero-Layouts**
```
1. Centered       [   TITLE   ]     Text zentriert, CTA darunter
                  [   Text    ]
                  [ Button ]

2. Split          TEXT    IMAGE    50/50 Split, Text links

3. Split Reverse  IMAGE    TEXT    50/50 Split, Text rechts

4. Full Image BG  ████████████     Vollbild-Hintergrund mit Overlay
                  █  TITLE    █

5. Asymmetric     TEXT ──────      2/3 + 1/3 Split
                       ───IMAGE
```

**Content-Grids**
```
1. Equal Grid     □ □ □     3er Grid, gleiche Größe
                  □ □ □

2. Feature Grid   □ □ □ □   4er Grid für Features

3. Bento          ▭▭ □      Mixed sizes (2+1)
                  □ ▭▭
```

### 🏗️ Template-Stile

**Modern/Minimal**
- Viel Whitespace, Sans-Serif (Inter), keine Rahmen, sanfte Schatten

**Bold/Brutalist**
- Enger Abstand, Display-Font (Bebas), 4px+ Rahmen, harte Schatten

**Classic/Elegant**
- Ausgewogen, Serif (Playfair), feine 1px Linien, keine Schatten

**Playful/Creative**
- Dynamisch, Mixed Fonts, große Border-Radius, farbige Schatten

### 🧩 Verfügbare Sektion-Templates

**E-Commerce** (`packages/core/src/templates/sections/`)
- `shopHero` - Hero mit Produktfokus
- `shopFeaturedProducts` - Produkt-Grid
- `shopCategories` - Kategorie-Kacheln
- `shopFlashDeals` - Countdown-Angebote
- `shopPromoGrid` - 2x2 Promo-Raster
- `shopProductDetail` - Produktdetail
- `shopCategoryBanner` - Kategorie-Banner
- `shopBestseller` - Bestseller-Sektion

**Allgemein**
- `heroSection` - Standard Hero
- `featuresSection` - Feature-Grid
- `testimonialsSection` - Kundenstimmen
- `ctaSection` - Call-to-Action
- `newsletterSection` - Newsletter
- `contactSection` - Kontaktformular

### 🏛️ Template-Struktur

```typescript
{
  builderVersion: 1,
  root: {
    id: 'root',
    type: 'Section',
    props: { minHeight: 'auto' },
    style: { base: { backgroundColor: '#ffffff', color: '#1a1a1a' } },
    actions: [],
    meta: { name: 'Seite' },
    children: [
      // 1. Header (sticky, mobile-optimiert)
      // 2. Hero (visueller Einstieg)
      // 3. Trust-Badges (Social Proof)
      // 4. Hauptinhalt (Produkte/Features)
      // 5. CTA-Banner (Conversion)
      // 6. Newsletter (Lead-Gen)
      // 7. Footer (Navigation/Legal)
    ]
  }
}
```

### 📋 Template-Checkliste

```
□ Template-Kategorie wählen
□ Farbschema definieren
□ Layout-Stil festlegen (Modern/Bold/Classic/Playful)
□ Hero-Layout wählen
□ Sektionen planen (5-8 Sektionen empfohlen)

□ Mobile-First implementieren:
  □ Alle Elemente mit mobile: {} Styles
  □ Grid → 1 Spalte auf Mobile
  □ Flex Row → Column auf Mobile
  □ Schriftgrößen reduziert
  □ Padding/Gap reduziert
  □ Touch-Targets min. 44px

□ Unique IDs für alle Nodes
□ meta: { name: '...' } für alle Elemente
□ alt-Text für Bilder
□ Script erstellen und ausführen
```

### 🎯 Template-Befehle

```bash
# Neues Template erstellen (kopiere existierendes als Basis)
cp packages/db/prisma/add-nexus-template.ts packages/db/prisma/add-[NAME]-template.ts

# Template bearbeiten, dann ausführen:
cd packages/db && npx tsx prisma/add-[NAME]-template.ts
```
