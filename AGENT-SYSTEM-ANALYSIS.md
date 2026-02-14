# 🤖 BUILDERLY SYSTEM-ANALYSE PROMPT

> **Zweck:** Agent-Prompt zur Analyse und Verbesserung des Builderly Website-Builder Systems
> **Ziel:** Identifiziere Verbesserungspotenziale, fehlende Verknüpfungen, und Optimierungsmöglichkeiten

---

## 📋 DEINE AUFGABE

Du bist ein erfahrener Software-Architekt. Analysiere das Builderly-System und identifiziere:

1. **Fehlende Verknüpfungen** zwischen Komponenten/Features
2. **Redundante Strukturen** die vereinfacht werden können
3. **Lücken in der Architektur** die gefüllt werden sollten
4. **Performance-Optimierungen** die möglich sind
5. **Bessere Datenflüsse** die implementiert werden könnten
6. **Fehlende Features** die für ein vollständiges System nötig wären

---

## 🏗️ SYSTEM-ÜBERBLICK

### Technologie-Stack

| Bereich | Technologie |
|---------|-------------|
| Monorepo | pnpm + Turborepo |
| Web App | Next.js 14 (App Router) |
| Editor App | Vite + React |
| Datenbank | PostgreSQL + Prisma (47 Models, 35 Enums) |
| Styling | Tailwind CSS |
| UI | shadcn/ui + Radix Primitives |
| State | Zustand |
| Validierung | Zod |
| Auth (Dashboard) | NextAuth.js |
| Auth (Site Users) | Custom JWT |
| Payments | Stripe |

### Architektur

```
┌─────────────────────────────────────────────────────────────────┐
│                         MONOREPO                                │
├─────────────────────────────────────────────────────────────────┤
│  apps/                                                          │
│  ├── web/          Next.js 14 (Dashboard + Published Sites)    │
│  └── editor/       Vite + React (Visual Page Builder)          │
│                                                                 │
│  packages/                                                      │
│  ├── core/         Component Registry, Schemas, Templates      │
│  ├── db/           Prisma Schema + Client                      │
│  ├── sdk/          API Types + Validation Schemas              │
│  ├── ui/           Shared UI Components (shadcn/ui)            │
│  └── config/       ESLint, TypeScript, Tailwind configs        │
└─────────────────────────────────────────────────────────────────┘
```

### Daten-Hierarchie

```
User
 └── WorkspaceMember (Rolle: OWNER | ADMIN | EDITOR | VIEWER)
      └── Workspace
           ├── Site
           │    ├── Page (builderTree: JSON)
           │    ├── CustomDomain
           │    └── SiteSettings
           │
           ├── Products
           │    ├── ProductVariant
           │    ├── ProductCategory
           │    └── InventoryMovement
           │
           ├── Orders
           │    ├── OrderItem
           │    ├── Invoice
           │    └── Shipment
           │
           ├── CmsCollection
           │    └── CmsRecord
           │
           ├── Form
           │    └── FormSubmission
           │
           ├── SiteUser (Website-Besucher)
           │    ├── SiteUserSession
           │    ├── ShoppingCart → CartItem
           │    └── Review
           │
           ├── Asset (Medienbibliothek)
           ├── Symbol (Wiederverwendbare Komponenten)
           └── Settings (Shop, SEO, Analytics, etc.)
```

---

## 🔍 ANALYSE-BEREICHE

### 1️⃣ DATENBANK-BEZIEHUNGEN

**Aktuelle Models:** 47 Prisma Models

**Zu prüfen:**
- [ ] Sind alle Beziehungen korrekt definiert (1:N, N:M)?
- [ ] Fehlen wichtige Foreign Keys?
- [ ] Gibt es redundante Daten die normalisiert werden könnten?
- [ ] Sind JSON-Felder (builderTree, settings) optimal strukturiert?
- [ ] Fehlen Indizes für häufige Queries?

**Kritische Models:**
```
Page.builderTree      → JSON (Builder-Baum mit allen Nodes)
Product.properties    → JSON (Dynamische Eigenschaften)
*Settings             → JSON (Verschiedene Einstellungen)
AutomationRule.config → JSON (Trigger + Actions)
```

**Fragen:**
- Sollte `builderTree` in separate Nodes-Tabelle extrahiert werden für bessere Queries?
- Wie werden referenzierte Assets in builderTree getrackt?
- Was passiert bei gelöschten Produkten, die noch im builderTree referenziert sind?

---

### 2️⃣ KOMPONENTEN-SYSTEM

**Aktuelle Komponenten:** 75+ Built-in Components

**Kategorien:**
| Kategorie | Beispiele |
|-----------|-----------|
| Layout | Section, Container, Grid, Columns, Divider |
| Text | Heading, Text, RichText, Quote |
| Media | Image, Video, Gallery, Icon |
| Navigation | Navbar, Footer, Menu, Breadcrumb |
| Forms | Form, Input, Button, Checkbox |
| Shop | ProductCard, ProductGrid, CartButton, CheckoutForm |
| CMS | CollectionList, CollectionItem |
| Auth | LoginForm, RegisterForm, ProtectedContent |

**Zu prüfen:**
- [ ] Sind alle Komponenten in der Registry korrekt registriert?
- [ ] Haben alle Komponenten vollständige propSchemas (Zod)?
- [ ] Gibt es Komponenten mit überlappender Funktionalität?
- [ ] Fehlen wichtige Komponenten für gängige Use-Cases?
- [ ] Sind die defaultProps sinnvoll?

**Fehlende Komponenten?**
```
- [ ] Pricing Table
- [ ] Comparison Table
- [ ] Progress Bar / Steps
- [ ] Countdown Timer
- [ ] Social Share Buttons
- [ ] Cookie Banner
- [ ] Live Chat Widget
- [ ] Search Autocomplete
- [ ] Infinite Scroll
- [ ] Pagination
- [ ] Data Table
- [ ] Chart/Graph
- [ ] Map Integration
- [ ] Calendar/Date Picker
- [ ] File Upload
- [ ] Rating Stars
- [ ] Badge/Chip
- [ ] Avatar
- [ ] Timeline
- [ ] FAQ Accordion
```

---

### 3️⃣ AKTIONEN & EVENTS

**19 Action Types:**
| Action | Parameter | Beschreibung |
|--------|-----------|--------------|
| navigate | url, target | Seite öffnen |
| scrollTo | elementId, behavior | Zu Element scrollen |
| openModal | modalId | Modal öffnen |
| closeModal | modalId | Modal schließen |
| toggleElement | elementId | Element ein/ausblenden |
| addClass | elementId, className | CSS-Klasse hinzufügen |
| removeClass | elementId, className | CSS-Klasse entfernen |
| submitForm | formId | Formular absenden |
| addToCart | productId, variantId, quantity | In Warenkorb |
| removeFromCart | cartItemId | Aus Warenkorb entfernen |
| updateCartQuantity | cartItemId, quantity | Anzahl ändern |
| applyDiscount | code | Rabattcode anwenden |
| startCheckout | - | Checkout starten |
| login | - | Login-Modal öffnen |
| logout | - | Ausloggen |
| signup | - | Registrierung öffnen |
| playMedia | mediaId | Video/Audio abspielen |
| pauseMedia | mediaId | Video/Audio pausieren |
| copyToClipboard | text | In Zwischenablage kopieren |

**Zu prüfen:**
- [ ] Sind alle Actions vollständig implementiert?
- [ ] Fehlen wichtige Actions?
- [ ] Wie werden Action-Chains gehandelt?
- [ ] Gibt es Fehlerbehandlung bei Actions?
- [ ] Wie werden Actions bei SSR gehandelt?

**Fehlende Actions?**
```
- [ ] track (Analytics Event)
- [ ] showNotification (Toast)
- [ ] setVariable (Store Variable)
- [ ] incrementVariable
- [ ] fetchData (API Call)
- [ ] setFilter (Collection Filter)
- [ ] sortBy (Collection Sort)
- [ ] paginate (Collection Page)
- [ ] download (Datei herunterladen)
- [ ] print (Seite drucken)
- [ ] share (Native Share API)
- [ ] bookmark
- [ ] delay (Aktion verzögern)
- [ ] condition (if/else)
- [ ] loop (für Listen)
```

---

### 4️⃣ STYLE-SYSTEM

**Pipeline:**
```
Props (Tailwind Tokens) → StyleConverter → CSS Strings → React style={}
```

**Token-Kategorien:**
| Kategorie | Beispiele |
|-----------|-----------|
| Spacing | xs, sm, md, lg, xl, 2xl, 3xl, 4xl |
| Colors | Tailwind-Farben + Custom |
| Typography | xs, sm, base, lg, xl, 2xl, 3xl, 4xl |
| Shadows | sm, md, lg, xl, 2xl, none |
| Borders | Radius, Width, Style |

**Zu prüfen:**
- [ ] Decken die Tokens alle Design-Anforderungen ab?
- [ ] Ist das responsive System (mobile, tablet, desktop) vollständig?
- [ ] Wie werden Custom Fonts gehandelt?
- [ ] Wie werden CSS Variables für Themes genutzt?
- [ ] Gibt es Performance-Probleme mit Inline-Styles?

**Mögliche Verbesserungen:**
```
- [ ] CSS-in-JS zu Class-basiertem Ansatz?
- [ ] Design Tokens als JSON/YAML?
- [ ] Theme-System mit Light/Dark Mode?
- [ ] Brand-Colors automatisch generieren?
- [ ] Spacing-Scale konfigurierbar machen?
- [ ] Media Query Breakpoints anpassbar?
```

---

### 5️⃣ EDITOR-STORE (Zustand)

**State-Bereiche:**
```typescript
interface EditorState {
  // Baum
  tree: BuilderTree | null;
  
  // Selektion
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  
  // History
  history: BuilderTree[];
  historyIndex: number;
  
  // UI
  viewport: 'desktop' | 'tablet' | 'mobile';
  leftPanel: 'palette' | 'layers' | 'pages' | null;
  rightPanel: 'inspector' | null;
  
  // Status
  isDirty: boolean;
  isSaving: boolean;
  
  // Actions
  setTree, replaceTree, updateNode, addNode, deleteNode,
  moveNode, duplicateNode, wrapNode, unwrapNode,
  undo, redo, save...
}
```

**Zu prüfen:**
- [ ] Ist der State minimal und performant?
- [ ] Gibt es Memory Leaks bei großen Trees?
- [ ] Wie groß kann die History werden?
- [ ] Ist die Undo/Redo Performance gut bei großen Trees?
- [ ] Werden unbenutzte Nodes in der History bereinigt?

**Mögliche Verbesserungen:**
```
- [ ] History-Limit (z.B. max 100 Schritte)
- [ ] History-Komprimierung (nur Diffs speichern?)
- [ ] Lazy-Loading für große Trees?
- [ ] Optimistic Updates für bessere UX?
- [ ] Persistence Layer (localStorage Backup?)
- [ ] Collaboration-Ready (Conflict Resolution?)
```

---

### 6️⃣ API-ROUTEN

**Struktur:**
```
apps/web/src/app/api/
├── auth/                     → NextAuth
├── workspaces/
│   └── [workspaceId]/
│       ├── pages/            → CRUD Pages
│       ├── products/         → CRUD Products
│       ├── orders/           → CRUD Orders
│       ├── settings/         → CRUD Settings
│       └── ...
├── runtime/
│   └── [slug]/               → Published Site Data
└── site-auth/                → Site User Auth
```

**Zu prüfen:**
- [ ] Sind alle Routen konsistent strukturiert?
- [ ] Gibt es Rate-Limiting?
- [ ] Gibt es Input-Validierung überall?
- [ ] Wie werden Fehler gehandelt (Error Responses)?
- [ ] Gibt es API-Versioning?
- [ ] Sind sensible Daten in Responses gefiltert?

**Mögliche Verbesserungen:**
```
- [ ] OpenAPI/Swagger Dokumentation automatisch generieren
- [ ] GraphQL als Alternative zu REST?
- [ ] Webhook-System für externe Integrationen
- [ ] API-Keys für externe Zugriffe
- [ ] Rate-Limiting pro Endpoint
- [ ] Response-Caching mit Redis?
- [ ] Batch-Endpoints (mehrere Operationen)
```

---

### 7️⃣ E-COMMERCE FLOW

**Aktueller Flow:**
```
Produkt ansehen → In Warenkorb → Checkout → Stripe → Webhook → Order erstellen
```

**Zu prüfen:**
- [ ] Wie werden Preise bei Währungsumrechnung gehandelt?
- [ ] Wie werden Steuern bei EU-Kunden berechnet?
- [ ] Was passiert bei Inventory-Konflikten (gleichzeitige Käufe)?
- [ ] Wie werden Abandoned Carts recovered?
- [ ] Gibt es Reservierung von Inventory während Checkout?

**Fehlende Features?**
```
- [ ] Multi-Währung Support
- [ ] Automatische Steuerberechnung (TaxJar?)
- [ ] Inventory Reservierung
- [ ] Backorder Support
- [ ] Pre-Order Support
- [ ] Subscription Billing (Stripe Subscriptions)
- [ ] Affiliate Tracking
- [ ] Wishlist
- [ ] Compare Products
- [ ] Recently Viewed
- [ ] Bundle Products
- [ ] Digital Products (Download nach Kauf)
- [ ] Gift Cards als Produkte
```

---

### 8️⃣ TEMPLATE-SYSTEM

**Template-Typen:**
| Typ | Speicherort | Verwendung |
|-----|-------------|------------|
| Section Templates | `packages/core/src/templates/sections/` | Einzelne Sektionen |
| Page Templates | `packages/core/src/templates/pages/` | Komplette Seiten |
| Database Templates | `prisma/add-*-template.ts` | Site-weite Templates |

**Zu prüfen:**
- [ ] Ist das Template-Format einheitlich?
- [ ] Wie werden Template-Updates an existierende Seiten propagiert?
- [ ] Können User eigene Templates erstellen und speichern?
- [ ] Gibt es Template-Marketplace?
- [ ] Wie werden Template-Abhängigkeiten (Fonts, Assets) gehandelt?

**Mögliche Verbesserungen:**
```
- [ ] User-Template-Speicherung (Save as Template)
- [ ] Template-Kategorien durchsuchbar
- [ ] Template-Preview vor Einfügung
- [ ] Template-Varianten (Farben, Layouts)
- [ ] Template-Import/Export
- [ ] Community Templates
```

---

### 9️⃣ FEHLENDE VERKNÜPFUNGEN

**Identifizierte Lücken:**

#### A) Asset-Tracking
```
Problem: Images in builderTree sind nur URLs, keine Referenzen
         → Gelöschte Assets werden nicht erkannt
         
Lösung:  Asset-References im Tree tracken
         → Beim Asset-Löschen: Warnung wenn noch verwendet
```

#### B) Product-Component Sync
```
Problem: ProductCard zeigt Produkt per ID
         → Gelöschtes Produkt = kaputte Komponente
         
Lösung:  Component-Dependencies tracken
         → Beim Produkt-Löschen: Liste betroffener Seiten
```

#### C) CMS-Component Sync
```
Problem: CollectionList bindet Collection per ID
         → Gelöschte Collection = keine Daten
         
Lösung:  Collection-Referenz validieren vor Publish
```

#### D) Symbol-Instanzen
```
Problem: Symbol-Update sollte alle Instanzen updaten
         → Aktuell: Manuelles Re-Publish nötig?
         
Lösung:  Symbol-Instanzen automatisch aktualisieren
```

#### E) Cross-Page Links
```
Problem: Interner Link auf gelöschte Seite = 404
         
Lösung:  Link-Validierung vor Publish
         → Warnung bei broken Links
```

#### F) Form-Submission → Automation
```
Problem: Formular-Einreichung kann Automation triggern?
         
Lösung:  FormSubmission als Automation-Trigger hinzufügen
         → "Wenn Formular X eingereicht, dann Email senden"
```

#### G) Order → Email Template
```
Problem: Order-Status-Änderung sollte Email senden
         
Lösung:  Prüfen ob Automation Rules mit Email-Action funktionieren
```

---

## ✅ VERBESSERUNGS-CHECKLISTE

### Kritisch (Muss)
- [ ] Asset-Referenzen im BuilderTree tracken
- [ ] Broken Link Detection vor Publish
- [ ] Inventory-Reservierung während Checkout
- [ ] Rate-Limiting für API-Routen
- [ ] History-Limit im Editor Store

### Wichtig (Sollte)
- [ ] Product/Collection Dependency Tracking
- [ ] Symbol-Auto-Update bei Änderungen
- [ ] FormSubmission → Automation Trigger
- [ ] OpenAPI Dokumentation generieren
- [ ] Template-Speicherung durch User

### Nice-to-Have
- [ ] GraphQL API
- [ ] Multi-Währung
- [ ] Template Marketplace
- [ ] Real-time Collaboration
- [ ] AI-Content Generation

---

## 📝 AUSGABE-FORMAT

Für jeden gefundenen Verbesserungsbereich, liefere:

```markdown
### [Bereich]: [Titel]

**Problem:**
[Beschreibung des aktuellen Zustands und warum er problematisch ist]

**Auswirkung:**
[Was passiert wenn nicht behoben]

**Lösung:**
[Konkrete technische Umsetzung]

**Code-Beispiel:**
[Wenn möglich, Code-Snippet der Lösung]

**Aufwand:** [Hoch/Mittel/Niedrig]
**Priorität:** [Kritisch/Wichtig/Nice-to-Have]
**Betroffene Dateien:**
- path/to/file1.ts
- path/to/file2.ts
```

---

## 🔗 KONTEXT-DATEIEN

Für die Analyse relevant:

**Schema:**
- `packages/db/prisma/schema.prisma` - Alle 47 Models

**Registry:**
- `packages/core/src/registry/builtin-components.ts` - Komponenten
- `packages/core/src/registry/component-registry.ts` - Registry-Logic

**Schemas:**
- `packages/core/src/schemas/node.ts` - BuilderNode, BuilderTree
- `packages/core/src/schemas/styles.ts` - Style-System
- `packages/core/src/schemas/actions.ts` - Action-Definitionen

**Store:**
- `apps/editor/src/store/editor-store.ts` - Zustand Store

**API-Beispiele:**
- `apps/web/src/app/api/workspaces/[workspaceId]/pages/route.ts`
- `apps/web/src/app/api/workspaces/[workspaceId]/products/route.ts`

**Templates:**
- `packages/core/src/templates/sections/` - Section Templates
- `packages/db/prisma/add-*.ts` - Database Seeds

---

## � ANALYSE-ERGEBNISSE (KONKRETE FINDINGS)

### 🔴 KRITISCH: History ohne Limit

**Problem:**
Der Editor-Store speichert jeden Tree-Zustand ohne Limit in `history[]`. Bei intensiver Nutzung wächst die History unbegrenzt und verursacht Memory Leaks.

**Betroffene Datei:** `apps/editor/src/store/editor-store.ts`

**Aktueller Code (Zeile 250-260):**
```typescript
const newHistory = history.slice(0, historyIndex + 1);
newHistory.push(newTree);  // ❌ Kein Limit!

set({
  tree: newTree,
  history: newHistory,
  historyIndex: newHistory.length - 1,
});
```

**Lösung:**
```typescript
const MAX_HISTORY_SIZE = 100;

const newHistory = history.slice(0, historyIndex + 1);
newHistory.push(newTree);

// History-Limit anwenden
if (newHistory.length > MAX_HISTORY_SIZE) {
  newHistory.shift(); // Ältesten Eintrag entfernen
}

set({
  tree: newTree,
  history: newHistory,
  historyIndex: Math.min(newHistory.length - 1, MAX_HISTORY_SIZE - 1),
});
```

**Aufwand:** Niedrig (10 Minuten)
**Priorität:** Kritisch

---

### 🔴 KRITISCH: Assets nur als URLs gespeichert

**Problem:**
Images in builderTree verwenden direkte URLs (`src: 'https://...'`) statt Asset-IDs. Wenn ein Asset gelöscht wird, gibt es keine Warnung und die Seite zeigt broken Images.

**Betroffene Dateien:**
- `packages/core/src/templates/sections/index.ts`
- `packages/core/src/registry/builtin-components.ts`

**Aktueller Code:**
```typescript
{
  type: 'Image',
  props: { 
    src: 'https://placehold.co/600x600?text=Produkt',  // ❌ Direkte URL
    alt: 'Produkt' 
  }
}
```

**Lösung - Neues Asset-Referenz-System:**

```typescript
// 1. BuilderNode erweitern
interface BuilderNode {
  // ... existing
  assetRefs?: string[]; // Asset-IDs die dieser Node verwendet
}

// 2. Image-Komponente erweitern
{
  type: 'Image',
  props: { 
    assetId: 'asset_abc123',        // ✅ Asset-Referenz
    src: 'https://cdn.../image.jpg', // Fallback/Cached URL
    alt: 'Produkt' 
  },
  assetRefs: ['asset_abc123']
}

// 3. Vor Asset-Löschung prüfen
async function deleteAsset(assetId: string) {
  const usages = await prisma.page.findMany({
    where: {
      builderTree: {
        path: ['root'],
        string_contains: assetId
      }
    },
    select: { id: true, name: true }
  });
  
  if (usages.length > 0) {
    throw new Error(`Asset wird auf ${usages.length} Seiten verwendet`);
  }
}
```

**Aufwand:** Mittel (2-4 Stunden)
**Priorität:** Kritisch

---

### 🟡 WICHTIG: Rate-Limiting fehlt bei meisten API-Routes

**Problem:**
Rate-Limiting existiert nur für 3 Endpoints:
- `/api/auth/forgot-password`
- `/api/auth/resend-verification`
- `/api/user/data-export`

Alle anderen 113+ API-Routen haben KEIN Rate-Limiting.

**Lösung - Middleware:**
```typescript
// apps/web/src/middleware.ts
import { rateLimit } from '@/lib/rate-limit';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Rate-Limiting für alle API-Routen
  if (path.startsWith('/api/')) {
    const ip = request.ip ?? 'anonymous';
    const result = await rateLimit(`api:${ip}`, {
      max: 100,
      window: 60 * 1000, // 100 requests per minute
    });
    
    if (!result.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(result.retryAfter) } }
      );
    }
  }
}
```

**Aufwand:** Niedrig (30 Minuten)
**Priorität:** Wichtig (Security)

---

### 🟡 WICHTIG: Produkt-Referenzen im BuilderTree

**Problem:**
ProductCard/ProductGrid referenzieren Produkte per `productId`. Wenn ein Produkt gelöscht wird, zeigt die Komponente Fehler an.

**Aktueller Code:**
```typescript
{
  type: 'ProductCard',
  props: {
    productId: 'prod_123',  // ❌ Was wenn gelöscht?
    showPrice: true
  }
}
```

**Lösung:**
```typescript
// Vor Produkt-Löschung
async function deleteProduct(productId: string) {
  // Alle Seiten durchsuchen die Produkt referenzieren
  const pages = await prisma.$queryRaw`
    SELECT id, name 
    FROM "Page" 
    WHERE "builderTree"::text LIKE '%${productId}%'
  `;
  
  if (pages.length > 0) {
    // Option 1: Warnung
    throw new Error(`Produkt wird auf ${pages.length} Seiten verwendet`);
    
    // Option 2: Soft-Delete
    await prisma.product.update({
      where: { id: productId },
      data: { isDeleted: true }
    });
  }
}
```

**Aufwand:** Mittel (1-2 Stunden)
**Priorität:** Wichtig

---

### 🟡 WICHTIG: Symbol-Instanzen nicht synchronisiert

**Problem:**
Wenn ein Symbol bearbeitet wird, werden Seiten die das Symbol nutzen NICHT automatisch aktualisiert. User muss manuell re-publishen.

**Lösung:**
```typescript
// Nach Symbol-Update
async function updateSymbol(symbolId: string, newTree: BuilderTree) {
  // Symbol aktualisieren
  await prisma.symbol.update({
    where: { id: symbolId },
    data: { builderTree: newTree }
  });
  
  // Alle Seiten invalidieren die Symbol nutzen
  await prisma.page.updateMany({
    where: {
      builderTree: {
        path: ['root'],
        string_contains: `"symbolId":"${symbolId}"`
      }
    },
    data: {
      needsRepublish: true,
      lastSymbolUpdate: new Date()
    }
  });
  
  // Webhook/Notification an User
  await notifySymbolUpdate(symbolId);
}
```

**Aufwand:** Mittel (2-3 Stunden)
**Priorität:** Wichtig

---

### 🟢 NICE-TO-HAVE: Link-Validierung vor Publish

**Problem:**
Interne Links auf gelöschte Seiten führen zu 404-Fehlern.

**Lösung:**
```typescript
async function validatePageLinks(pageId: string) {
  const page = await prisma.page.findUnique({
    where: { id: pageId },
    include: { site: { include: { pages: { select: { slug: true } } } } }
  });
  
  const tree = page.builderTree as BuilderTree;
  const brokenLinks: string[] = [];
  const validSlugs = page.site.pages.map(p => p.slug);
  
  function checkNode(node: BuilderNode) {
    // Link/Button mit href prüfen
    if (node.props.href && node.props.href.startsWith('/')) {
      const slug = node.props.href.replace('/', '');
      if (!validSlugs.includes(slug)) {
        brokenLinks.push(node.props.href);
      }
    }
    
    // Navigate-Actions prüfen
    node.actions?.forEach(action => {
      if (action.action === 'navigate' && action.params.url?.startsWith('/')) {
        const slug = action.params.url.replace('/', '');
        if (!validSlugs.includes(slug)) {
          brokenLinks.push(action.params.url);
        }
      }
    });
    
    node.children.forEach(checkNode);
  }
  
  checkNode(tree.root);
  
  return brokenLinks;
}

// Vor Publish aufrufen
const brokenLinks = await validatePageLinks(pageId);
if (brokenLinks.length > 0) {
  throw new Error(`Broken Links gefunden: ${brokenLinks.join(', ')}`);
}
```

**Aufwand:** Mittel (1-2 Stunden)
**Priorität:** Nice-to-Have

---

## 📊 ZUSAMMENFASSUNG DER FINDINGS

| # | Problem | Priorität | Aufwand | Status |
|---|---------|-----------|---------|--------|
| 1 | History ohne Limit → Memory Leak | 🔴 Kritisch | 10 min | TODO |
| 2 | Assets nur URLs → Broken Images | 🔴 Kritisch | 2-4 h | TODO |
| 3 | Rate-Limiting fehlt bei 113 Routes | 🟡 Wichtig | 30 min | TODO |
| 4 | Produkt-Referenzen nicht validiert | 🟡 Wichtig | 1-2 h | TODO |
| 5 | Symbol-Updates nicht propagiert | 🟡 Wichtig | 2-3 h | TODO |
| 6 | Collection-Referenzen nicht validiert | 🟡 Wichtig | 1 h | TODO |
| 7 | Link-Validierung vor Publish | 🟢 Nice | 1-2 h | TODO |
| 8 | FormSubmission → Automation Trigger | 🟢 Nice | 2-3 h | TODO |

---

## 🚀 EMPFOHLENE REIHENFOLGE

### Phase 1: Quick Wins (30 min)
1. ✅ History-Limit einführen
2. ✅ Rate-Limiting Middleware

### Phase 2: Stabilität (4-6 Stunden)
3. ✅ Asset-Referenz-System
4. ✅ Produkt-Deletion Validierung
5. ✅ Symbol-Update Propagation

### Phase 3: Polish (4-6 Stunden)
6. ✅ Link-Validierung
7. ✅ FormSubmission Automation
8. ✅ Collection-Referenz Validierung

---

## 🚀 START

Beginne mit der Umsetzung. Priorisiere nach:

1. **Quick Wins** - History-Limit und Rate-Limiting (30 min Gesamtaufwand)
2. **Security** - Rate-Limiting für alle API-Routen
3. **Stabilität** - Asset/Produkt/Symbol-Referenzen
4. **UX** - Link-Validierung, bessere Fehlermeldungen

Liefere für jede Änderung:
- Konkrete Code-Änderungen
- Tests
- Migrations (falls DB-Änderungen nötig)
