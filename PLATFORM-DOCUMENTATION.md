# 🏗️ BUILDERLY - Vollständige Plattform-Dokumentation

> **Version:** 1.0.0  
> **Letzte Aktualisierung:** Februar 2026  
> **Typ:** Monorepo Website Builder mit E-Commerce  
> **Umfang:** ~10.000 Zeilen Code-Dokumentation

---

# 📚 TEIL I: GRUNDLAGEN & KONZEPTE

---

## 📑 INHALTSVERZEICHNIS

### Teil I: Grundlagen & Konzepte
1. [Was ist Builderly?](#was-ist-builderly)
2. [Architektur-Übersicht](#architektur-übersicht)
3. [Wie funktioniert das System?](#wie-funktioniert-das-system)
4. [Der Builder Tree](#der-builder-tree)
5. [Datenflüsse verstehen](#datenflüsse-verstehen)

### Teil II: Monorepo & Struktur
6. [Monorepo-Struktur](#monorepo-struktur)
7. [Apps im Detail](#apps)
8. [Packages im Detail](#packages)

### Teil III: Datenbank
9. [Datenbank-Schema](#datenbank-schema)
10. [Beziehungen & Verknüpfungen](#beziehungen--verknüpfungen)
11. [CRUD-Operationen](#crud-operationen)

### Teil IV: API & Backend
12. [API-Routen](#api-routen)
13. [Authentifizierung](#auth-system)
14. [Berechtigungen](#berechtigungssystem)

### Teil V: Frontend & Editor
15. [Komponenten-Registry](#komponenten-registry)
16. [Editor-Store](#editor-store)
17. [Canvas & Rendering](#canvas--rendering)
18. [Style-System](#style-system)

### Teil VI: Features
19. [Shop-Funktionen](#shop-funktionen)
20. [CMS-System](#cms-system)
21. [Template-System](#template-system)
22. [Site-Settings](#site-settings)

### Teil VII: Entwicklung
23. [Befehle & Scripts](#befehle--scripts)
24. [Debugging & Troubleshooting](#debugging--troubleshooting)
25. [Best Practices](#best-practices)

---

## 🎯 WAS IST BUILDERLY?

### Vision

Builderly ist ein **No-Code Website Builder** mit vollständigem E-Commerce, der es Nutzern ermöglicht, professionelle Websites und Online-Shops zu erstellen - ohne eine einzige Zeile Code zu schreiben.

### Kernkonzepte

**1. Drag & Drop Editor:**
Der Benutzer zieht Komponenten (Buttons, Texte, Bilder, Produkte) aus einer Palette auf eine Zeichenfläche (Canvas). Jede Komponente kann visuell bearbeitet werden.

**2. Multi-Tenant Architektur:**
Ein Benutzer kann mehrere Workspaces haben. Jeder Workspace ist eine eigenständige Website oder ein Shop mit eigenen Seiten, Produkten, Einstellungen.

**3. Builder Tree:**
Jede Seite wird als JSON-Baum gespeichert. Dieser Baum beschreibt die Struktur, Eigenschaften und Styles aller Elemente.

**4. Zwei Renderer:**
- **Canvas (Editor):** Zeigt den Tree im Editor mit Drag & Drop, Selektion, Hover-Effekten
- **Runtime (Published Site):** Rendert den Tree als echte Website für Besucher

### Zielgruppen

| Zielgruppe | Nutzung |
|------------|---------|
| **Einsteiger** | Website mit Templates erstellen |
| **Designer** | Custom Designs ohne Code |
| **Shops** | Online-Shop mit Produkten, Checkout, Zahlungen |
| **Agenturen** | Websites für Kunden erstellen |
| **Entwickler** | Erweiterungen über Templates |

---

## 🏛️ ARCHITEKTUR-ÜBERSICHT

### Tech-Stack

| Bereich | Technologie | Warum? |
|---------|-------------|--------|
| **Monorepo** | pnpm + Turborepo | Geteilter Code, schnelle Builds, Dependencies |
| **Web App** | Next.js 14 (App Router) | Server Components, API Routes, ISR |
| **Editor App** | Vite + React | Schnelle Dev-Umgebung, kein SSR nötig |
| **Datenbank** | PostgreSQL + Prisma | Relationale Daten, Type-Safety |
| **Styling** | Tailwind CSS | Utility-First, Token-System |
| **UI-Komponenten** | shadcn/ui + Radix | Accessible, customizable |
| **State Management** | Zustand | Einfach, performant, kein Boilerplate |
| **Validierung** | Zod | Runtime-Validierung mit TypeScript |
| **Auth (Dashboard)** | NextAuth.js | OAuth + Email/Password |
| **Auth (Site Visitors)** | Custom JWT | Leichtgewichtig für Website-Benutzer |
| **Payments** | Stripe | Industrie-Standard für E-Commerce |

### Warum diese Technologien?

**Next.js 14 mit App Router:**
- Server Components für schnellere Ladezeiten
- API Routes im gleichen Projekt wie das Frontend
- Middleware für Auth & Redirect-Logik
- Optimierte Bilder, Fonts, Caching

**Vite für den Editor:**
- Der Editor braucht kein SSR (lädt immer gleich)
- Vite ist 10x schneller als Next.js für Dev-Builds
- Hot Module Replacement für sofortige Updates

**Prisma als ORM:**
- Typsichere Queries (keine SQL-Injection möglich)
- Auto-generierte TypeScript-Types
- Migrations für Schema-Änderungen
- Studio für visuelle DB-Bearbeitung

**Zustand statt Redux:**
- Kein Boilerplate (keine Actions, Reducers)
- Direkte Mutations mit Immer
- Selective Re-Renders automatisch
- DevTools für Debugging

### Datenfluss - Wie alles zusammenhängt

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BENUTZER                                        │
│                                                                              │
│  👤 Admin (Dashboard)     👨‍💻 Editor (Canvas)     👥 Besucher (Site)         │
└─────────────────────────────────────────────────────────────────────────────┘
                    │                    │                    │
                    ▼                    ▼                    ▼
┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐
│      DASHBOARD          │  │        EDITOR           │  │    PUBLISHED SITE       │
│      (apps/web)         │  │      (apps/editor)      │  │      (apps/web)         │
│                         │  │                         │  │                         │
│  • Login/Register       │  │  • Canvas (Drag&Drop)   │  │  • /s/[slug]            │
│  • Workspace verwalten  │  │  • Inspector (Props)    │  │  • Produkte anzeigen    │
│  • Produkte anlegen     │  │  • Palette (Components) │  │  • Checkout             │
│  • Bestellungen sehen   │  │  • Tree bearbeiten      │  │  • Formulare            │
│  • Einstellungen        │  │  • Speichern            │  │  • User Auth            │
│                         │  │                         │  │                         │
│  Port: 3000             │  │  Port: 5173             │  │  Port: 3000             │
└────────────┬────────────┘  └────────────┬────────────┘  └────────────┬────────────┘
             │                            │                            │
             │         ┌──────────────────┴──────────────────┐         │
             │         │                                      │         │
             ▼         ▼                                      ▼         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API ROUTES                                      │
│                         (apps/web/src/app/api)                              │
│                                                                              │
│  /api/workspaces/[id]/pages      → Page CRUD                                │
│  /api/workspaces/[id]/products   → Product CRUD                             │
│  /api/workspaces/[id]/orders     → Order CRUD                               │
│  /api/workspaces/[id]/settings   → Settings CRUD                            │
│  /api/runtime/[slug]             → Published Site Data                      │
│  /api/auth/[...nextauth]         → Dashboard Auth                           │
│  /api/site-auth/login            → Site User Auth                           │
│                                                                              │
│  Jede Route:                                                                 │
│  1. Prüft Auth (NextAuth Session oder JWT)                                  │
│  2. Prüft Berechtigungen (Ist User Member des Workspace?)                   │
│  3. Validiert Input (Zod Schema)                                            │
│  4. Führt Prisma Query aus                                                  │
│  5. Gibt JSON zurück                                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PRISMA CLIENT                                   │
│                         (packages/db/src/index.ts)                          │
│                                                                              │
│  import { prisma } from '@builderly/db';                                    │
│                                                                              │
│  • Typsichere Queries:  prisma.product.findMany({ where: {...} })          │
│  • Relations:           prisma.order.findFirst({ include: { items: true }}) │
│  • Transactions:        prisma.$transaction([...])                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              POSTGRESQL                                      │
│                         (docker-compose.yml)                                │
│                                                                              │
│  • 47 Tables (Users, Workspaces, Pages, Products, Orders, ...)             │
│  • 35 Enums (OrderStatus, PaymentProvider, ...)                            │
│  • Relations (1:N, N:M)                                                     │
│  • JSON-Felder für flexible Daten (builderTree, settings, ...)             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 WIE FUNKTIONIERT DAS SYSTEM?

### Szenario 1: Benutzer erstellt eine Seite

```
1. Benutzer klickt "Neue Seite" im Dashboard
   │
   ▼
2. Dashboard sendet POST /api/workspaces/[id]/pages
   Body: { name: "Über uns", slug: "ueber-uns" }
   │
   ▼
3. API Route prüft:
   • Ist User eingeloggt? (NextAuth Session)
   • Ist User Member des Workspace? (WorkspaceMember Table)
   • Hat User Schreibrechte? (Role: OWNER, ADMIN, EDITOR)
   │
   ▼
4. Prisma erstellt Page in DB:
   prisma.page.create({
     data: {
       workspaceId,
       name: "Über uns",
       slug: "ueber-uns",
       builderTree: { builderVersion: 1, root: { id: 'root', type: 'Section', ... } }
     }
   })
   │
   ▼
5. API gibt neue Page zurück
   │
   ▼
6. Dashboard navigiert zum Editor: /editor?workspaceId=...&pageId=...
```

### Szenario 2: Benutzer fügt einen Button hinzu

```
1. Im Editor: Benutzer zieht "Button" aus Palette auf Canvas
   │
   ▼
2. DndProvider erkennt Drop-Event
   • Source: Palette Item (type: 'Button')
   • Target: Container Node (id: 'abc123')
   │
   ▼
3. Editor Store Action wird aufgerufen:
   useEditorStore.getState().addNode('abc123', 'Button')
   │
   ▼
4. addNode Funktion im Store:
   a) Holt Component Definition aus Registry
   b) Erstellt neuen Node mit defaultProps
   c) Fügt Node als Kind von 'abc123' ein
   d) Pusht neuen Tree in History (für Undo)
   e) Setzt isDirty: true
   │
   ▼
5. React re-rendert Canvas
   • CanvasNode für neuen Button wird erstellt
   • Button erscheint auf der Zeichenfläche
   │
   ▼
6. Auto-Save (nach 2 Sekunden Inaktivität):
   PUT /api/workspaces/[id]/pages/[pageId]
   Body: { builderTree: { ... } }
```

### Szenario 3: Besucher kauft ein Produkt

```
1. Besucher öffnet Shop: https://shop.example.com/produkte/sneaker-pro
   │
   ▼
2. Next.js rendert /s/[slug]/produkte/[productSlug]
   • Holt Workspace via slug aus DB
   • Holt Page "Produktdetail" aus DB
   • Holt Produkt "sneaker-pro" aus DB
   │
   ▼
3. Safe-Renderer rendert den builderTree
   • ProductDetail Komponente zeigt Produktdaten
   • AddToCartButton ist bereit
   │
   ▼
4. Besucher klickt "In den Warenkorb"
   • AddToCartButton hat Action: { type: 'addToCart', productIdBinding: 'product.id' }
   │
   ▼
5. Runtime führt Action aus:
   • Liest productId aus Context
   • Speichert in LocalStorage (oder Cart API für eingeloggte User)
   • Zeigt Toast "Produkt hinzugefügt"
   │
   ▼
6. Besucher geht zur Kasse
   • CheckoutForm sammelt Adresse, Zahlungsmethode
   • Bei Submit: POST /api/runtime/[slug]/checkout
   │
   ▼
7. Checkout API:
   a) Validiert Cart Items (Produkte existieren, Bestand vorhanden)
   b) Berechnet Totals (Subtotal + Tax + Shipping - Discount)
   c) Erstellt Stripe Payment Intent
   d) Erstellt Order mit Status: PENDING
   e) Gibt Client Secret an Frontend
   │
   ▼
8. Frontend zeigt Stripe Payment Element
   • Besucher gibt Kreditkarte ein
   • Stripe verarbeitet Zahlung
   │
   ▼
9. Stripe Webhook: POST /api/webhooks/stripe
   • Event: payment_intent.succeeded
   • Order Status wird auf PAID gesetzt
   • E-Mail "Bestellbestätigung" wird gesendet
   • Inventory wird reduziert
   │
   ▼
10. Besucher sieht "Bestellung erfolgreich!"
```

---

## 🌳 DER BUILDER TREE

### Was ist der Builder Tree?

Der Builder Tree ist das **Herzstück von Builderly**. Er beschreibt die komplette Struktur einer Seite als JSON-Objekt.

### Struktur

```typescript
interface BuilderTree {
  builderVersion: number;  // Schema-Version für Migrations
  root: BuilderNode;       // Wurzel-Node (immer "Section")
}

interface BuilderNode {
  id: string;              // Unique ID (z.B. "node_abc123")
  type: string;            // Komponenten-Typ (z.B. "Button", "Heading")
  props: Record<string, any>;  // Komponenten-spezifische Props
  style?: BuilderStyle;    // Responsive Styles (base, tablet, mobile)
  actions?: BuilderActionBinding[];  // Event-Handler
  animation?: BuilderAnimation;      // Animationen
  meta?: {
    name?: string;         // Anzeigename in Layer-Panel
    locked?: boolean;      // Sperrt Bearbeitung
    hidden?: boolean;      // Versteckt Element
  };
  children?: BuilderNode[];  // Kind-Elemente
}
```

### Beispiel: Einfache Seite

```json
{
  "builderVersion": 1,
  "root": {
    "id": "root",
    "type": "Section",
    "props": { "minHeight": "100vh" },
    "style": {
      "base": { "backgroundColor": "#ffffff", "padding": "xl" }
    },
    "meta": { "name": "Hauptbereich" },
    "children": [
      {
        "id": "container_1",
        "type": "Container",
        "props": { "maxWidth": "7xl", "centered": true },
        "children": [
          {
            "id": "heading_1",
            "type": "Heading",
            "props": { "level": 1, "text": "Willkommen!" },
            "style": {
              "base": { "fontSize": "4xl", "fontWeight": "bold" },
              "mobile": { "fontSize": "2xl" }
            }
          },
          {
            "id": "text_1",
            "type": "Text",
            "props": { "text": "Dies ist meine Website." }
          },
          {
            "id": "button_1",
            "type": "Button",
            "props": { "text": "Mehr erfahren", "variant": "primary" },
            "actions": [
              {
                "event": "onClick",
                "action": { "type": "navigate", "to": "/about" }
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### Wie wird der Tree gerendert?

**Im Editor (CanvasNode.tsx):**
```typescript
function CanvasNode({ node, depth }: { node: BuilderNode; depth: number }) {
  const { selectedNodeId, selectNode, hoverNode } = useEditorStore();
  const componentDef = componentRegistry.get(node.type);
  
  // Berechne Style-Klassen basierend auf aktuellen Breakpoint
  const styleClasses = computeStyleClasses(node.style, breakpoint);
  
  // Rendere die Komponente
  const Component = componentDef.render;
  
  return (
    <div
      className={cn(styleClasses, {
        'ring-2 ring-blue-500': selectedNodeId === node.id,
        'ring-1 ring-blue-300': hoveredNodeId === node.id,
      })}
      onClick={(e) => { e.stopPropagation(); selectNode(node.id); }}
      onMouseEnter={() => hoverNode(node.id)}
    >
      <Component {...node.props}>
        {node.children?.map(child => (
          <CanvasNode key={child.id} node={child} depth={depth + 1} />
        ))}
      </Component>
    </div>
  );
}
```

**Im Runtime (safe-renderer.tsx):**
```typescript
function SafeRenderer({ node, context }: { node: BuilderNode; context: RuntimeContext }) {
  const componentDef = componentRegistry.get(node.type);
  
  // Führe Actions aus wenn Events feuern
  const handleAction = (action: BuilderAction) => {
    switch (action.type) {
      case 'navigate':
        router.push(action.to);
        break;
      case 'addToCart':
        addToCart(resolveBinding(action.productIdBinding, context));
        break;
      // ... mehr Actions
    }
  };
  
  // Binde Events
  const eventHandlers = {};
  node.actions?.forEach(binding => {
    eventHandlers[binding.event] = () => handleAction(binding.action);
  });
  
  const Component = componentDef.render;
  
  return (
    <Component {...node.props} {...eventHandlers}>
      {node.children?.map(child => (
        <SafeRenderer key={child.id} node={child} context={context} />
      ))}
    </Component>
  );
}
```

### Node-Operationen im Store

```typescript
// Node hinzufügen
addNode: (parentId: string, nodeType: string, index?: number) => {
  const componentDef = componentRegistry.get(nodeType);
  const newNode: BuilderNode = {
    id: generateNodeId(),
    type: nodeType,
    props: { ...componentDef.defaultProps },
    children: componentDef.canHaveChildren ? [] : undefined,
  };
  
  set(state => {
    const newTree = insertNodeAt(state.tree, parentId, newNode, index);
    return {
      tree: newTree,
      history: [...state.history.slice(0, state.historyIndex + 1), newTree],
      historyIndex: state.historyIndex + 1,
      isDirty: true,
    };
  });
}

// Node löschen
deleteNode: (nodeId: string) => {
  if (nodeId === 'root') return; // Root kann nicht gelöscht werden
  
  set(state => {
    const newTree = removeNodeFromTree(state.tree, nodeId);
    return {
      tree: newTree,
      selectedNodeId: null,
      history: [...state.history.slice(0, state.historyIndex + 1), newTree],
      historyIndex: state.historyIndex + 1,
      isDirty: true,
    };
  });
}

// Node verschieben (Drag & Drop)
moveNode: (nodeId: string, newParentId: string, newIndex: number) => {
  set(state => {
    const node = findNodeById(state.tree, nodeId);
    const treeWithoutNode = removeNodeFromTree(state.tree, nodeId);
    const newTree = insertNodeAt(treeWithoutNode, newParentId, node, newIndex);
    return {
      tree: newTree,
      history: [...state.history.slice(0, state.historyIndex + 1), newTree],
      historyIndex: state.historyIndex + 1,
      isDirty: true,
    };
  });
}
```

---

# 📚 TEIL II: MONOREPO & STRUKTUR

--- - Wie alles zusammenhängt

```
┌─────────────────────────────────────────────────────────────────┐
│                         BENUTZER                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Dashboard     │  │     Editor      │  │  Published Site │
│  (apps/web)     │  │  (apps/editor)  │  │   (apps/web)    │
│   Port 3000     │  │   Port 5173     │  │   /s/[slug]     │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                    │                     │
         └────────────────────┼─────────────────────┘
                              ▼
                    ┌─────────────────┐
                    │   API Routes    │
                    │  /api/...       │
                    └────────┬────────┘
                             ▼
                    ┌─────────────────┐
                    │    Prisma       │
                    │   (packages/db) │
                    └────────┬────────┘
                             ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    └─────────────────┘
```

---

## 📁 MONOREPO-STRUKTUR

### Warum ein Monorepo?

Ein Monorepo vereint alle Projekte in einem Repository. Vorteile:

| Vorteil | Erklärung |
|---------|-----------|
| **Geteilter Code** | `@builderly/core` wird von web UND editor genutzt |
| **Atomic Commits** | Eine Änderung betrifft alle abhängigen Packages |
| **Einfache Abhängigkeiten** | `workspace:*` statt npm-Versionen |
| **Konsistente Tooling** | Ein ESLint, ein TypeScript, ein Tailwind für alle |
| **Schnelle Builds** | Turborepo cached unveränderte Packages |

### Dateistruktur erklärt

```
builderly/
├── apps/
│   ├── web/                    # Next.js Dashboard + Runtime
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/     # Auth-Seiten (Login, Register)
│   │   │   │   ├── (dashboard)/# Dashboard-Seiten
│   │   │   │   ├── api/        # API-Routen
│   │   │   │   ├── s/          # Published Sites Runtime
│   │   │   │   ├── datenschutz/# Datenschutz-Seite
│   │   │   │   └── impressum/  # Impressum-Seite
│   │   │   ├── components/     # React-Komponenten
│   │   │   ├── hooks/          # Custom React Hooks
│   │   │   └── lib/            # Utilities, Auth, Permissions
│   │   └── ...
│   │
│   └── editor/                 # Vite + React Editor
│       ├── src/
│       │   ├── components/     # Editor-Komponenten
│       │   │   ├── Canvas.tsx
│       │   │   ├── CanvasNode.tsx
│       │   │   ├── Inspector.tsx
│       │   │   ├── Palette.tsx
│       │   │   ├── LayerPanel.tsx
│       │   │   └── ...
│       │   ├── store/          # Zustand Store
│       │   │   └── editor-store.ts
│       │   └── hooks/          # Custom Hooks
│       └── ...
│
├── packages/
│   ├── core/                   # Shared Business Logic
│   │   ├── src/
│   │   │   ├── schemas/        # Zod Schemas
│   │   │   ├── registry/       # Component Registry
│   │   │   ├── templates/      # Section/Page Templates
│   │   │   ├── actions/        # Action Definitions
│   │   │   └── plugins/        # Plugin System
│   │   └── ...
│   │
│   ├── db/                     # Database Layer
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Prisma Schema (2048 Zeilen!)
│   │   │   ├── migrations/     # DB Migrations
│   │   │   └── *.ts            # Seed-Scripts
│   │   └── src/
│   │       └── index.ts        # Prisma Client Export
│   │
│   ├── sdk/                    # API Types & Validation
│   │   └── src/
│   │       ├── types/          # TypeScript Types
│   │       └── client/         # API Client
│   │
│   ├── ui/                     # Shared UI Components
│   │   └── src/
│   │       ├── components/     # shadcn/ui Komponenten
│   │       └── lib/            # cn() Utility
│   │
│   └── config/                 # Shared Configs
│       ├── eslint.config.js
│       ├── tailwind.config.js
│       ├── tsconfig.base.json
│       ├── tsconfig.nextjs.json
│       └── tsconfig.react.json
│
├── docker-compose.yml          # PostgreSQL Container
├── turbo.json                  # Turborepo Config
├── pnpm-workspace.yaml         # pnpm Workspace Config
└── package.json                # Root Package
```

---

## 🌐 APPS

### Übersicht: Zwei Apps, verschiedene Zwecke

| App | Zweck | Port | Technologie |
|-----|-------|------|-------------|
| **web** | Dashboard + Published Site + API | 3000 | Next.js 14 |
| **editor** | Visueller Page Builder | 5173 | Vite + React |

**Warum getrennte Apps?**

1. **Unterschiedliche Build-Anforderungen:**
   - Web braucht SSR für SEO (Published Sites)
   - Editor braucht nur CSR (Client-Side Rendering)

2. **Performance:**
   - Vite ist 10x schneller für Development
   - Editor-Bundle muss nicht Next.js-Overhead haben

3. **Deployment:**
   - Web kann auf Vercel/Railway mit Edge Functions
   - Editor kann auf statischem CDN (Cloudflare Pages)

### Web App (Dashboard)

**Pfad:** `apps/web`  
**Port:** 3000  
**Framework:** Next.js 14 mit App Router

#### Wie Next.js App Router funktioniert

```
apps/web/src/app/
│
├── (auth)/                    ← Route Group (kein URL-Segment)
│   ├── login/page.tsx         → /login
│   └── register/page.tsx      → /register
│
├── (dashboard)/               ← Route Group mit Layout
│   ├── layout.tsx             → Sidebar + Header für alle Dashboard-Seiten
│   ├── dashboard/page.tsx     → /dashboard
│   └── workspaces/
│       ├── page.tsx           → /workspaces
│       └── [id]/              ← Dynamic Segment
│           ├── page.tsx       → /workspaces/abc123
│           └── products/
│               └── page.tsx   → /workspaces/abc123/products
│
├── s/                         ← Published Sites
│   └── [slug]/                ← Workspace Slug
│       ├── page.tsx           → /s/mein-shop (Homepage)
│       └── [...path]/page.tsx → /s/mein-shop/produkte/sneaker (Catch-All)
│
└── api/                       ← API Routes
    └── workspaces/
        └── [workspaceId]/
            └── products/
                └── route.ts   → GET/POST /api/workspaces/[id]/products
```

#### Route Groups erklärt

`(auth)` und `(dashboard)` sind **Route Groups**. Sie:
- Werden NICHT zur URL hinzugefügt
- Ermöglichen verschiedene Layouts für verschiedene Bereiche
- Beispiel: Auth-Seiten haben kein Sidebar, Dashboard hat Sidebar

#### Dynamic Segments erklärt

`[id]` ist ein **Dynamic Segment**. Es:
- Matched jeden Wert an dieser Position
- Übergibt den Wert an die Page als `params`:

```typescript
// apps/web/src/app/(dashboard)/workspaces/[id]/page.tsx
export default function WorkspacePage({ params }: { params: { id: string } }) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: params.id }
  });
  // ...
}
```

#### Catch-All Routes erklärt

`[...path]` ist eine **Catch-All Route**. Sie:
- Matched alles nach diesem Punkt
- Gibt ein Array zurück:

```typescript
// URL: /s/mein-shop/produkte/sneaker/rot
// params.path = ['produkte', 'sneaker', 'rot']
```

#### Seiten-Struktur

| Route | Beschreibung |
|-------|-------------|
| `/` | Landing Page |
| `/login` | Anmeldung |
| `/register` | Registrierung |
| `/dashboard` | Dashboard-Übersicht |
| `/dashboard/workspaces` | Workspace-Liste |
| `/dashboard/workspaces/[id]` | Workspace-Detail |
| `/dashboard/settings` | Benutzer-Einstellungen |
| `/dashboard/billing` | Abrechnung & Plan |
| `/dashboard/admin` | Admin-Bereich |
| `/s/[slug]` | Published Site Runtime |
| `/s/[slug]/[...path]` | Published Site Unterseiten |
| `/datenschutz` | Datenschutz (statisch) |
| `/impressum` | Impressum (statisch) |

#### Wie die Published Site Runtime funktioniert

Die Route `/s/[slug]/[...path]` ist der **Renderer für veröffentlichte Websites**:

```typescript
// apps/web/src/app/s/[slug]/[...path]/page.tsx

export default async function PublishedPage({ 
  params 
}: { 
  params: { slug: string; path?: string[] } 
}) {
  // 1. Workspace anhand des Slugs laden
  const workspace = await prisma.workspace.findUnique({
    where: { slug: params.slug, isPublished: true },
    include: { shopSettings: true }
  });
  
  if (!workspace) notFound();
  
  // 2. Seiten-Slug aus Path extrahieren
  const pageSlug = params.path?.join('/') || 'home';
  
  // 3. Page aus DB laden
  const page = await prisma.page.findFirst({
    where: { workspaceId: workspace.id, slug: pageSlug },
    include: { publishedRevision: true }
  });
  
  if (!page) notFound();
  
  // 4. Builder Tree aus veröffentlichter Revision holen
  const tree = page.publishedRevision?.builderTree || page.builderTree;
  
  // 5. Context für Datenbindungen vorbereiten
  const context: RuntimeContext = {
    workspace,
    page,
    products: await loadProducts(workspace.id),
    user: await getCurrentSiteUser(),
    cart: await getCart(),
  };
  
  // 6. Tree rendern
  return <SafeRenderer tree={tree} context={context} />;
}
```

#### Dashboard-Bereiche

```
/dashboard/
├── page.tsx                     # Übersicht
├── activity/                    # Letzte Aktivitäten
├── admin/                       # Admin-Panel
├── billing/                     # Stripe Billing
├── settings/                    # Account Settings
└── workspaces/                  # Workspace Management
    ├── page.tsx                 # Workspace-Liste
    └── [id]/                    # Workspace-Detail
        ├── pages/               # Seiten-Verwaltung
        ├── settings/            # Workspace Settings
        ├── members/             # Team-Mitglieder
        ├── domains/             # Custom Domains
        ├── forms/               # Formulare
        ├── collections/         # CMS Collections
        ├── assets/              # Medienbibliothek
        │
        │ --- SHOP FEATURES ---
        ├── products/            # Produktverwaltung
        ├── orders/              # Bestellungen
        ├── categories/          # Kategorien
        ├── coupons/             # Rabattcodes
        ├── shipping-methods/    # Versandarten
        ├── payment-methods/     # Zahlungsarten
        ├── shop-settings/       # Shop-Einstellungen
        ├── invoices/            # Rechnungen
        ├── credit-notes/        # Gutschriften
        ├── debit-notes/         # Lastschriften
        ├── quotes/              # Angebote
        ├── reviews/             # Bewertungen
        ├── inventory/           # Lagerbestand
        ├── tax-zones/           # Steuerzonen
        ├── vouchers/            # Gutscheine
        ├── carts/               # Warenkörbe
        ├── claims/              # Reklamationen
        ├── bookings/            # Buchungen
        ├── subscriptions/       # Abonnements
        ├── subscription-plans/  # Abo-Pläne
        ├── email-templates/     # E-Mail-Vorlagen
        ├── automations/         # Automatisierungen
        ├── invoice-settings/    # Rechnungs-Settings
        │
        │ --- USERS ---
        ├── users/               # Site Benutzer
        │
        │ --- FORUM ---
        └── forum/               # Forum-Verwaltung
```

---

### Editor App (Canvas)

**Pfad:** `apps/editor`  
**Port:** 5173  
**Framework:** Vite + React

#### Wie der Editor aufgebaut ist

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            TOOLBAR                                       │
│  [← Back]  [Undo] [Redo]  |  [Desktop] [Tablet] [Mobile]  |  [Save]     │
├──────────────────┬──────────────────────────────┬───────────────────────┤
│   LEFT SIDEBAR   │          CANVAS              │    RIGHT SIDEBAR      │
│                  │                              │                       │
│  ┌────────────┐  │  ┌────────────────────────┐  │  ┌─────────────────┐  │
│  │ PALETTE    │  │  │                        │  │  │ INSPECTOR       │  │
│  │            │  │  │    [Section]           │  │  │                 │  │
│  │ □ Section  │  │  │      │                 │  │  │ Props:          │  │
│  │ □ Container│  │  │    [Container]         │  │  │ • text: "..."   │  │
│  │ □ Heading  │  │  │        │               │  │  │ • variant: ...  │  │
│  │ □ Text     │  │  │    [Heading]           │  │  │                 │  │
│  │ □ Button   │  │  │    "Willkommen"        │  │  │ Style:          │  │
│  │ □ Image    │  │  │        │               │  │  │ • fontSize: 4xl │  │
│  │ ...        │  │  │    [▼ Button ▼]        │  │  │ • color: #fff   │  │
│  └────────────┘  │  │    "Mehr erfahren"     │  │  │                 │  │
│                  │  │                        │  │  │ Actions:        │  │
│  ┌────────────┐  │  │                        │  │  │ • onClick →     │  │
│  │ LAYERS     │  │  │                        │  │  │   navigate      │  │
│  │            │  │  │                        │  │  └─────────────────┘  │
│  │ ▶ Section  │  │  └────────────────────────┘  │                       │
│  │   ▶ Contain│  │                              │  ┌─────────────────┐  │
│  │     • Head │  │       [+ Add Section]        │  │ PAGES           │  │
│  │     • Butt │  │                              │  │ • Home          │  │
│  └────────────┘  │                              │  │ • Über uns ←    │  │
│                  │                              │  │ • Kontakt       │  │
└──────────────────┴──────────────────────────────┴───────────────────────┘
```

#### Komponenten des Editors erklärt

| Komponente | Datei | Funktion |
|------------|-------|----------|
| **App** | `App.tsx` | Lädt Page vom API, initialisiert Store, rendert Layout |
| **Canvas** | `Canvas.tsx` | Die Hauptzeichenfläche. Rendert den Tree rekursiv als CanvasNode |
| **CanvasNode** | `CanvasNode.tsx` | Einzelner Node. Hat Selection-Ring, Hover-Effekt, Drop-Targets |
| **Inspector** | `Inspector.tsx` | Zeigt Props, Styles, Actions des selektierten Nodes |
| **Palette** | `Palette.tsx` | Liste aller verfügbaren Komponenten zum Hinzufügen |
| **LayerPanel** | `LayerPanel.tsx` | Baumansicht aller Nodes (wie Photoshop Layers) |
| **PagesPanel** | `PagesPanel.tsx` | Liste aller Seiten des Workspace |
| **SiteSettingsPanel** | `SiteSettingsPanel.tsx` | Header, Footer, Theme, SEO Settings |
| **Toolbar** | `Toolbar.tsx` | Undo/Redo, Breakpoint-Switcher, Zoom, Save |
| **DndProvider** | `DndProvider.tsx` | React DnD Context für Drag & Drop |
| **AssetPicker** | `AssetPicker.tsx` | Modal zum Auswählen von Bildern aus Medienbibliothek |

#### Der Editor Lifecycle

```typescript
// 1. App startet
function App() {
  const { workspaceId, pageId } = useSearchParams();
  
  // 2. Page vom API laden
  useEffect(() => {
    fetch(`/api/workspaces/${workspaceId}/pages/${pageId}`)
      .then(res => res.json())
      .then(page => {
        // 3. Store initialisieren
        useEditorStore.getState().setTree(page.builderTree);
        useEditorStore.getState().setPageContext(workspaceId, pageId);
        useEditorStore.getState().setPageName(page.name);
      });
  }, [workspaceId, pageId]);
  
  // 4. Auto-Save einrichten
  useAutoSave();
  
  // 5. Keyboard Shortcuts einrichten
  useKeyboardShortcuts();
  
  return (
    <DndProvider>
      <Toolbar />
      <div className="flex">
        <LeftSidebar />
        <Canvas />
        <RightSidebar />
      </div>
    </DndProvider>
  );
}

// Auto-Save Hook
function useAutoSave() {
  const { tree, isDirty, workspaceId, pageId } = useEditorStore();
  
  useEffect(() => {
    if (!isDirty) return;
    
    const timer = setTimeout(async () => {
      await fetch(`/api/workspaces/${workspaceId}/pages/${pageId}`, {
        method: 'PUT',
        body: JSON.stringify({ builderTree: tree }),
      });
      useEditorStore.getState().setDirty(false);
      useEditorStore.getState().setLastSaved(new Date());
    }, 2000); // 2 Sekunden nach letzter Änderung
    
    return () => clearTimeout(timer);
  }, [tree, isDirty]);
}
```

#### Tastenkürzel

| Kürzel | Aktion |
|--------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` / `Ctrl+Shift+Z` | Redo |
| `Ctrl+S` | Speichern |
| `Ctrl+C` | Kopieren |
| `Ctrl+V` | Einfügen |
| `Ctrl+D` | Duplizieren |
| `Delete` / `Backspace` | Löschen |
| `Escape` | Auswahl aufheben |
| `1` | Desktop Breakpoint |
| `2` | Tablet Breakpoint |
| `3` | Mobile Breakpoint |

#### Wie Tastenkürzel implementiert sind

```typescript
// apps/editor/src/hooks/useKeyboardShortcuts.ts
function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { selectedNodeId, undo, redo, deleteNode, duplicateNode } = useEditorStore.getState();
      
      // Ctrl+Z → Undo
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      
      // Ctrl+Y oder Ctrl+Shift+Z → Redo
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        redo();
      }
      
      // Delete/Backspace → Node löschen
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        if (document.activeElement?.tagName !== 'INPUT') {
          e.preventDefault();
          deleteNode(selectedNodeId);
        }
      }
      
      // Ctrl+D → Duplizieren
      if (e.ctrlKey && e.key === 'd' && selectedNodeId) {
        e.preventDefault();
        duplicateNode(selectedNodeId);
      }
      
      // Escape → Deselect
      if (e.key === 'Escape') {
        useEditorStore.getState().selectNode(null);
      }
      
      // 1, 2, 3 → Breakpoints
      if (e.key === '1') useEditorStore.getState().setBreakpoint('desktop');
      if (e.key === '2') useEditorStore.getState().setBreakpoint('tablet');
      if (e.key === '3') useEditorStore.getState().setBreakpoint('mobile');
    };
    
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
```

---

## 📦 PACKAGES

### Übersicht: Wer nutzt was?

```
                    ┌─────────────┐
                    │   config    │  ← ESLint, TypeScript, Tailwind Configs
                    └──────┬──────┘
                           │ extends
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
     ┌───────────┐  ┌───────────┐  ┌───────────┐
     │    ui     │  │   core    │  │    db     │
     │ (shadcn)  │  │ (schemas) │  │ (prisma)  │
     └─────┬─────┘  └─────┬─────┘  └─────┬─────┘
           │              │              │
           │       ┌──────┴───────┐      │
           │       │              │      │
           ▼       ▼              ▼      ▼
     ┌───────────────┐      ┌───────────────┐
     │    editor     │      │      web      │
     │   (Vite)      │      │  (Next.js)    │
     └───────────────┘      └───────────────┘
```

### Package: Core

**Pfad:** `packages/core`  
**Zweck:** Shared Business Logic, Schemas, Registry

#### Was Core macht

Core ist das **Herzstück** der Business Logic. Es definiert:
- **Schemas:** Was ist ein gültiger Node? Was ist ein gültiger Style?
- **Registry:** Welche Komponenten gibt es? Was sind ihre Props?
- **Templates:** Vorgefertigte Sektionen und Seiten
- **Utilities:** Hilfsfunktionen für Node-Operationen

#### Struktur

```
packages/core/src/
├── index.ts              # Re-exports
├── schemas/              # Zod Validation Schemas
│   ├── node.ts           # BuilderNode, BuilderTree
│   ├── style.ts          # Style Properties
│   ├── actions.ts        # Action Types
│   ├── animation.ts      # Animation Types
│   ├── site-settings.ts  # Site Configuration
│   ├── collection.ts     # CMS Collections
│   └── symbol.ts         # Global Symbols
├── registry/             # Component Registry
│   ├── component-registry.ts  # Registry Class
│   └── builtin-components.ts  # 75+ Built-in Components
├── templates/            # Pre-built Templates
│   ├── sections/         # Section Templates
│   └── pages/            # Full Page Templates
├── actions/              # Action Handlers
└── plugins/              # Plugin System
```

#### Exports

```typescript
// Schemas - Zod Validierung
export { BuilderNode, BuilderTree, BuilderNodeSchema, BuilderTreeSchema }
export { BuilderStyle, StylePropertiesSchema }
export { BuilderAction, BuilderActionBinding }
export { SiteSettings, SiteSettingsSchema }

// Node Operations - Arbeiten mit dem Tree
export { createNode, generateNodeId, findNodeById, findNodePath }
export { findParentNode, cloneNode, updateNodeInTree }
export { removeNodeFromTree, insertNodeAt, moveNode }

// Registry - Alle Komponenten
export { componentRegistry, ComponentDefinition }

// Templates - Vorgefertigte Sections
export { sectionTemplates, pageTemplates }

// Settings - Default Werte
export { getDefaultSiteSettings }
```

#### Die Schemas erklärt

**BuilderNodeSchema:**
```typescript
// packages/core/src/schemas/node.ts
export const BuilderNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.any()).default({}),
  style: BuilderStyleSchema.optional(),
  actions: z.array(BuilderActionBindingSchema).optional(),
  animation: BuilderAnimationSchema.optional(),
  meta: z.object({
    name: z.string().optional(),
    locked: z.boolean().optional(),
    hidden: z.boolean().optional(),
  }).optional(),
  children: z.lazy(() => z.array(BuilderNodeSchema)).optional(),
});

// Warum z.lazy()? 
// → Kinder können selbst Nodes sein (rekursive Struktur)
// → z.lazy() ermöglicht diese Selbstreferenz
```

**StylePropertiesSchema:**
```typescript
// packages/core/src/schemas/style.ts
export const StylePropertiesSchema = z.object({
  // Layout
  display: z.enum(['block', 'flex', 'grid', 'none', ...]).optional(),
  position: z.enum(['static', 'relative', 'absolute', 'fixed', 'sticky']).optional(),
  
  // Spacing mit Tokens
  padding: SpacingTokenSchema.optional(),    // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | ...
  margin: SpacingTokenSchema.optional(),
  gap: SpacingTokenSchema.optional(),
  
  // Colors mit Tokens oder HEX
  backgroundColor: z.union([ColorTokenSchema, z.string()]).optional(),
  color: z.union([ColorTokenSchema, z.string()]).optional(),
  
  // ... 60+ weitere Properties
});

// Responsive Styles
export const BuilderStyleSchema = z.object({
  base: StylePropertiesSchema,          // Desktop (immer vorhanden)
  tablet: StylePropertiesSchema.optional(),  // Tablet Overrides
  mobile: StylePropertiesSchema.optional(),  // Mobile Overrides
});
```

#### Die Component Registry erklärt

```typescript
// packages/core/src/registry/component-registry.ts

interface ComponentDefinition {
  type: string;           // Unique Identifier (z.B. 'Button')
  displayName: string;    // Anzeigename (z.B. 'Button')
  category: string;       // Kategorie (z.B. 'ui')
  icon: string;           // Lucide Icon Name
  defaultProps: Record<string, any>;     // Standard-Props
  propSchema?: z.ZodObject<any>;         // Zod Schema für Props
  canHaveChildren: boolean;  // Kann Kinder haben?
  allowedParents?: string[];  // Erlaubte Eltern (z.B. ['Form'])
  allowedChildren?: string[]; // Erlaubte Kinder
}

class ComponentRegistry {
  private components: Map<string, ComponentDefinition> = new Map();
  
  register(definition: ComponentDefinition) {
    this.components.set(definition.type, definition);
  }
  
  get(type: string): ComponentDefinition | undefined {
    return this.components.get(type);
  }
  
  getByCategory(category: string): ComponentDefinition[] {
    return Array.from(this.components.values())
      .filter(c => c.category === category);
  }
  
  getAllCategories(): string[] {
    return [...new Set(Array.from(this.components.values()).map(c => c.category))];
  }
}

export const componentRegistry = new ComponentRegistry();
```

#### Komponente registrieren

```typescript
// packages/core/src/registry/builtin-components.ts

componentRegistry.register({
  type: 'Button',
  displayName: 'Button',
  category: 'ui',
  icon: 'MousePointerClick',
  canHaveChildren: false,
  defaultProps: {
    text: 'Button',
    variant: 'primary',
    size: 'md',
    disabled: false,
    fullWidth: false,
  },
  propSchema: z.object({
    text: z.string(),
    variant: z.enum(['primary', 'secondary', 'outline', 'ghost', 'link', 'destructive']),
    size: z.enum(['sm', 'md', 'lg']),
    disabled: z.boolean(),
    fullWidth: z.boolean(),
    icon: z.string().optional(),
    iconPosition: z.enum(['left', 'right']).optional(),
  }),
});
```

---

### Package: DB

**Pfad:** `packages/db`  
**Zweck:** Prisma ORM, Database Client

#### Wie Prisma funktioniert

```
┌─────────────────────────────────────────────────────────────────┐
│                      schema.prisma                               │
│                                                                  │
│  model Product {                                                 │
│    id          String   @id @default(cuid())                    │
│    name        String                                            │
│    price       Int                                               │
│    workspace   Workspace @relation(fields: [workspaceId], ...)  │
│    workspaceId String                                            │
│  }                                                               │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                     prisma generate
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Prisma Client                                │
│                                                                  │
│  // TypeScript Types werden generiert!                          │
│  interface Product {                                             │
│    id: string;                                                   │
│    name: string;                                                 │
│    price: number;                                                │
│    workspaceId: string;                                          │
│  }                                                               │
│                                                                  │
│  // Typsichere Queries                                          │
│  prisma.product.findMany({ where: { price: { gt: 1000 } } })   │
│  //                          ^^^^^ TypeScript weiß: price ist Int│
└─────────────────────────────────────────────────────────────────┘
```

#### Struktur

```
packages/db/
├── prisma/
│   ├── schema.prisma         # Haupt-Schema (2048 Zeilen!)
│   ├── migrations/           # DB Migrations
│   │   ├── 20240101_init/
│   │   │   └── migration.sql
│   │   └── 20240215_add_products/
│   │       └── migration.sql
│   ├── seed.ts               # Basis-Seeding
│   ├── seed-plan-configs.ts  # Plan-Konfigurationen
│   ├── add-nexus-template.ts # Shop Template Script
│   ├── add-shop-template.ts  # Neues Shop Template
│   ├── add-header-templates.ts # Header Templates
│   └── ...                   # Diverse Utility-Scripts
└── src/
    └── index.ts              # Prisma Client Export
```

#### Der Prisma Client Export

```typescript
// packages/db/src/index.ts
import { PrismaClient } from '@prisma/client';

// Singleton Pattern für den Client
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Re-export aller generierten Types
export * from '@prisma/client';
```

**Warum Singleton?**
- Next.js hat Hot Module Replacement
- Bei jedem HMR würde neuer PrismaClient erstellt
- Singleton verhindert Connection Pool Overflow

#### Migrations erklärt

```bash
# Neue Migration erstellen
cd packages/db
pnpm exec prisma migrate dev --name add_product_variants

# Was passiert?
# 1. Prisma vergleicht schema.prisma mit DB
# 2. Generiert SQL für die Änderungen
# 3. Erstellt migration.sql in migrations/
# 4. Führt Migration aus
# 5. Regeneriert Prisma Client

# Migration in Produktion
pnpm exec prisma migrate deploy
```

---

### Package: SDK

**Pfad:** `packages/sdk`  
**Zweck:** API Types, Validation Schemas für Frontend

#### Was SDK macht

SDK ist die **Brücke zwischen Frontend und Backend**:

```typescript
// packages/sdk/src/types/workspace.ts
export interface Workspace {
  id: string;
  name: string;
  slug: string;
  type: WorkspaceType;
  // ... alle Felder
}

// Validation Schemas für API Requests
export const CreateWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/).min(3).max(50),
  type: z.enum(['WEBSITE', 'SHOP', 'BLOG', ...]),
});

export const UpdateWorkspaceSchema = CreateWorkspaceSchema.partial();
```

#### Verwendung im Frontend

```typescript
// apps/editor/src/lib/api.ts
import { Workspace, CreateWorkspaceSchema } from '@builderly/sdk';

async function createWorkspace(data: z.infer<typeof CreateWorkspaceSchema>): Promise<Workspace> {
  // Client-seitige Validierung
  const validated = CreateWorkspaceSchema.parse(data);
  
  const response = await fetch('/api/workspaces', {
    method: 'POST',
    body: JSON.stringify(validated),
  });
  
  return response.json();
}
```

---

### Package: UI

**Pfad:** `packages/ui`  
**Zweck:** Shared UI Components (shadcn/ui Pattern)

#### Wie shadcn/ui funktioniert

shadcn/ui ist **keine Component Library** im klassischen Sinne. Die Komponenten werden **kopiert**, nicht als Dependency installiert:

```
packages/ui/
└── src/
    ├── components/
    │   ├── button.tsx      ← Kopierte shadcn Komponente
    │   ├── input.tsx       ← Angepasst an unsere Needs
    │   ├── dialog.tsx      ← Verwendet Radix Dialog
    │   └── ...
    ├── lib/
    │   └── utils.ts        ← cn() Utility
    └── index.ts            ← Re-exports alles
```

#### Die cn() Utility

```typescript
// packages/ui/src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Verwendung:
cn('px-4 py-2', isActive && 'bg-blue-500', 'hover:bg-blue-600')
// → 'px-4 py-2 bg-blue-500 hover:bg-blue-600' (bei isActive = true)

// twMerge löst Konflikte:
cn('text-red-500', 'text-blue-500')
// → 'text-blue-500' (nicht beide!)
```

#### Komponenten

| Komponente | Datei |
|------------|-------|
| AlertDialog | `alert-dialog.tsx` |
| Alert | `alert.tsx` |
| Avatar | `avatar.tsx` |
| Badge | `badge.tsx` |
| Button | `button.tsx` |
| Card | `card.tsx` |
| Checkbox | `checkbox.tsx` |
| Collapsible | `collapsible.tsx` |
| Dialog | `dialog.tsx` |
| DropdownMenu | `dropdown-menu.tsx` |
| Input | `input.tsx` |
| Label | `label.tsx` |
| Progress | `progress.tsx` |
| ScrollArea | `scroll-area.tsx` |
| Select | `select.tsx` |
| Separator | `separator.tsx` |
| Sheet | `sheet.tsx` |
| Skeleton | `skeleton.tsx` |
| Slider | `slider.tsx` |
| Switch | `switch.tsx` |
| Table | `table.tsx` |
| Tabs | `tabs.tsx` |
| Textarea | `textarea.tsx` |
| Toast | `toast.tsx` |
| Tooltip | `tooltip.tsx` |

#### Export

```typescript
export { Button } from './components/button';
export { Input } from './components/input';
export { cn } from './lib/utils';
// ... alle Komponenten
```

#### Warum UI-Komponenten in packages/ui UND apps/editor?

**Problem: React Duplicate Instance**

```
Wenn eine Radix-Komponente in packages/ui ist,
aber apps/editor hat eigene React-Version:

apps/editor                packages/ui
    │                          │
    └── react@18.2.0           └── radix-dialog (peerDep: react)
                                        │
                                        └── nutzt react aus packages/ui

→ Zwei verschiedene React-Instanzen!
→ "Invalid hook call" Error
```

**Lösung:**
```json
// apps/editor/package.json
{
  "dependencies": {
    "@radix-ui/react-dialog": "^1.0.0",  // ← Hier auch!
    "@builderly/ui": "workspace:*"
  }
}
```

---

### Package: Config

**Pfad:** `packages/config`  
**Zweck:** Shared Configurations

#### Warum zentrale Configs?

| Problem | Lösung |
|---------|--------|
| Verschiedene ESLint Rules in Apps | Ein `eslint.config.js` für alle |
| Verschiedene tsconfig Settings | `tsconfig.base.json` als Basis |
| Verschiedene Tailwind Themes | Ein `tailwind.config.js` mit Presets |

#### Dateien erklärt

```typescript
// packages/config/tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Design System Colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... 20+ Farben
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

// apps/web/tailwind.config.js
const baseConfig = require('@builderly/config/tailwind.config');
module.exports = {
  ...baseConfig,
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
};
```

---

# 📚 TEIL III: DATENBANK

---

## 🗄️ DATENBANK-SCHEMA

### Übersicht (2048 Zeilen!)

Das Prisma Schema definiert **47 Models** und **35 Enums**. Hier ist die Struktur:

### Model-Hierarchie

```
User (Dashboard-Benutzer)
  │
  └── WorkspaceMember (N:M Verknüpfung)
        │
        └── Workspace (Website/Shop)
              │
              ├── Page (Seite mit builderTree)
              │     └── PageRevision (Versionshistorie)
              │
              ├── Product (Shop-Produkt)
              │     ├── ProductCategory
              │     ├── Review
              │     └── InventoryMovement
              │
              ├── Order (Bestellung)
              │     ├── OrderItem
              │     ├── Invoice
              │     ├── CreditNote
              │     └── Claim
              │
              ├── SiteUser (Website-Besucher)
              │     ├── SiteUserSession
              │     └── Cart
              │
              ├── Form → FormSubmission
              ├── Collection → Record
              ├── Asset (Bilder, Dateien)
              ├── Symbol (Wiederverwendbare Komponenten)
              ├── CustomDomain
              │
              └── ... (30+ weitere)
```

### Auth & Users - Wie Authentifizierung funktioniert

```prisma
model User {
  id                    String
  email                 String    @unique
  passwordHash          String?
  name                  String?
  image                 String?
  emailVerified         DateTime?
  createdAt             DateTime
  updatedAt             DateTime
  
  // GDPR Consent - Für Datenschutz-Konformität
  privacyConsentAt      DateTime?   // Wann hat User zugestimmt?
  privacyConsentVersion String?     // Welche Version der AGB?
  marketingConsent      Boolean     // Darf E-Mail-Marketing bekommen?
  marketingConsentAt    DateTime?
  
  // Status
  isActive              Boolean     // Account aktiv?
  deletedAt             DateTime?   // Soft delete - User bleibt in DB
  anonymizedAt          DateTime?   // Für GDPR: Wann anonymisiert?
  
  // Relations
  accounts              Account[]   // OAuth Accounts (Google, etc.)
  sessions              Session[]   // Aktive Sessions
  memberships           WorkspaceMember[]  // In welchen Workspaces?
  createdPages          Page[]      // Welche Pages erstellt?
  revisions             PageRevision[]
  records               Record[]
  assets                Asset[]
  auditLogs             AuditLog[]  // GDPR Audit Trail
  dataExports           DataExportRequest[]  // GDPR Export Requests
  passwordResets        PasswordResetToken[]
}
```

**Warum diese Felder?**

| Feld | Grund |
|------|-------|
| `passwordHash` | Optional weil OAuth User kein Passwort haben |
| `emailVerified` | Spam-Schutz, manche Features erst nach Verify |
| `privacyConsentAt` | GDPR verlangt Nachweis der Zustimmung |
| `deletedAt` | Soft Delete: User kann restored werden |
| `anonymizedAt` | GDPR "Recht auf Vergessenwerden" |

**Die anderen Auth-Models:**

```prisma
model Account {
  // OAuth Provider Accounts (NextAuth Pattern)
  id                String
  userId            String
  type              String    // "oauth" | "email" | "credentials"
  provider          String    // "google" | "github" | ...
  providerAccountId String
  access_token      String?
  refresh_token     String?
  expires_at        Int?
  
  @@unique([provider, providerAccountId])
}

model Session {
  // Aktive Login-Sessions
  id           String
  sessionToken String   @unique
  userId       String
  expires      DateTime
}

model AuditLog {
  // GDPR Audit Trail - wer hat was wann gemacht?
  id        String
  userId    String
  action    String    // "LOGIN", "UPDATE_PROFILE", "DELETE_DATA", ...
  details   Json?
  ipAddress String?
  userAgent String?
  createdAt DateTime
}

model DataExportRequest {
  // GDPR Datenexport - User kann Kopie seiner Daten anfordern
  id          String
  userId      String
  status      DataExportStatus  // PENDING, PROCESSING, COMPLETED, EXPIRED
  downloadUrl String?
  expiresAt   DateTime?
  createdAt   DateTime
  completedAt DateTime?
}
```

### Workspace & Membership - Das Multi-Tenant System

**Wie Multi-Tenancy funktioniert:**

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER                                    │
│                      (Dashboard-Benutzer)                        │
│                                                                  │
│  Max Mustermann <max@beispiel.de>                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                     WorkspaceMember (N:M)
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  WORKSPACE 1  │    │  WORKSPACE 2  │    │  WORKSPACE 3  │
│  Rolle: OWNER │    │  Rolle: ADMIN │    │  Rolle: VIEWER│
│               │    │               │    │               │
│  "Mein Shop"  │    │  "Agentur"    │    │  "Kunde XY"   │
│  Type: SHOP   │    │  Type: WEBSITE│    │  Type: SHOP   │
│               │    │               │    │               │
│  → 5 Pages    │    │  → 12 Pages   │    │  → 3 Pages    │
│  → 50 Products│    │  → 0 Products │    │  → 20 Products│
│  → 100 Orders │    │  → 0 Orders   │    │  (nur lesen)  │
└───────────────┘    └───────────────┘    └───────────────┘
```

```prisma
model Workspace {
  id                    String
  name                  String
  slug                  String    @unique
  description           String?
  logoUrl               String?
  faviconUrl            String?
  type                  WorkspaceType  // WEBSITE, SHOP, BLOG, FORUM, WIKI, PORTFOLIO, LANDING
  
  // Company Info
  companyName           String?
  companyEmail          String?
  companyPhone          String?
  companyAddress        String?
  companyVatId          String?
  companyWebsite        String?
  socialLinks           Json?
  
  // Features
  enableUserAuth        Boolean
  userAuthEnabledAt     DateTime?
  settings              Json
  customDomain          String?
  
  // Publishing
  isPublished           Boolean
  publishedAt           DateTime?
  
  // Billing
  stripeCustomerId      String?
  stripeSubscriptionId  String?
  plan                  Plan  // FREE, PRO, BUSINESS, ENTERPRISE
  planExpiresAt         DateTime?
  
  // Relations (40+ Relations!)
  members               WorkspaceMember[]
  pages                 Page[]
  collections           Collection[]
  assets                Asset[]
  forms                 Form[]
  symbols               Symbol[]
  customDomains         CustomDomain[]
  siteUsers             SiteUser[]
  products              Product[]
  orders                Order[]
  coupons               Coupon[]
  productCategories     ProductCategory[]
  paymentMethods        PaymentMethod[]
  shippingMethods       ShippingMethod[]
  shopSettings          ShopSettings?
  forumCategories       ForumCategory[]
  pageViews             PageView[]
  taxZones              TaxZone[]
  vouchers              Voucher[]
  carts                 Cart[]
  invoices              Invoice[]
  creditNotes           CreditNote[]
  debitNotes            DebitNote[]
  quotes                Quote[]
  reviews               Review[]
  emailTemplates        EmailTemplate[]
  inventoryMovements    InventoryMovement[]
  subscriptionPlans     SubscriptionPlan[]
  subscriptions         ShopSubscription[]
  bookings              Booking[]
  claims                Claim[]
  invoiceSettings       InvoiceSettings?
  automationRules       AutomationRule[]
}

model WorkspaceMember {
  workspaceId  String
  userId       String
  role         Role  // OWNER, ADMIN, EDITOR, VIEWER
}

enum WorkspaceType {
  WEBSITE
  SHOP
  BLOG
  FORUM
  WIKI
  PORTFOLIO
  LANDING
}

enum Plan {
  FREE        // 0€ - 3 Pages, 100MB Storage
  PRO         // 9€/Monat - 10 Pages, 1GB, Custom Domain
  BUSINESS    // 29€/Monat - Unlimited Pages, 10GB, E-Commerce
  ENTERPRISE  // Custom - Alles + Support + SLA
}
```

**Warum diese Felder?**

| Feld | Grund |
|------|-------|
| `slug` | URL-freundliche ID: `mein-shop` statt `cm3abc123` |
| `type` | Bestimmt verfügbare Features (Shop hat Produkte) |
| `enableUserAuth` | Site-Besucher können sich registrieren |
| `stripeCustomerId` | Für Billing - wird beim ersten Checkout erstellt |
| `settings` | JSON für flexible Einstellungen |

---

### Plan Configuration - Feature Gating

```prisma
model PlanConfig {
  plan                        Plan @unique   // FREE, PRO, BUSINESS, ENTERPRISE
  displayName                 String         // "Starter", "Pro", ...
  description                 String
  
  // Limits - Harte Grenzen
  maxPages                    Int            // 3, 10, -1 (unlimited)
  maxStorage                  BigInt         // bytes: 100MB, 1GB, 10GB
  maxCustomDomains            Int
  maxTeamMembers              Int
  maxFormSubmissionsPerMonth  Int
  
  // Features - Boolean Flags
  customDomains               Boolean        // Kann Custom Domain nutzen?
  removeWatermark             Boolean        // "Made with Builderly" weg?
  prioritySupport             Boolean
  dedicatedSupport            Boolean
  ecommerce                   Boolean        // Shop-Features?
  passwordProtection          Boolean        // Seiten passwort-schützen?
  ssoSaml                     Boolean        // Enterprise SSO?
  whiteLabel                  Boolean        // Komplett ohne Branding?
  auditLog                    Boolean        // GDPR Audit Log?
  slaGuarantee                Boolean        // 99.9% Uptime Garantie?
  integrations                Json           // ["zapier", "slack", ...]
}
```

**Feature Gating implementieren:**

```typescript
// apps/web/src/lib/permissions.ts
async function checkFeature(workspaceId: string, feature: keyof PlanConfig): Promise<boolean> {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });
  
  if (!workspace) return false;
  
  const planConfig = await prisma.planConfig.findUnique({
    where: { plan: workspace.plan },
  });
  
  return planConfig?.[feature] ?? false;
}

// Verwendung in API Route:
export async function POST(req: Request) {
  // Prüfe ob User Shop-Features nutzen darf
  const canUseEcommerce = await checkFeature(workspaceId, 'ecommerce');
  if (!canUseEcommerce) {
    return new Response('Upgrade to Business plan for Shop features', { status: 403 });
  }
  // ...
}
```

---

### Pages & Revisions - Versionierung verstehen

```prisma
model Page {
  id                    String
  workspaceId           String
  name                  String      // "Startseite", "Über uns"
  slug                  String      // "home", "ueber-uns"
  description           String?
  
  // Builder Tree (Draft) - Das ist der aktuelle Entwurf
  builderTree           Json        // { builderVersion: 1, root: {...} }
  
  // SEO
  metaTitle             String?     // <title> Tag
  metaDescription       String?     // Meta Description
  ogImage               String?     // Social Media Preview
  
  // Status
  isHomepage            Boolean     // Ist das die Startseite?
  isDraft               Boolean     // Noch nicht veröffentlicht?
  
  // Publishing - Getrennte Entwurf/Live Version
  publishedRevisionId   String?     // Welche Revision ist live?
  scheduledPublishAt    DateTime?   // Geplante Veröffentlichung
  
  // Relations
  revisions             PageRevision[]
  publishedRevision     PageRevision?  @relation("PublishedRevision")
  pageViews             PageView[]
}

model PageRevision {
  id          String
  pageId      String
  builderTree Json    // Snapshot des Trees zu diesem Zeitpunkt
  version     Int     // 1, 2, 3, ...
  comment     String? // "Header hinzugefügt", "Bugfix"
  createdAt   DateTime
  createdBy   User    @relation
}
```

**Wie Publishing funktioniert:**

```
┌─────────────────────────────────────────────────────────────────┐
│                        PAGE                                      │
│                                                                  │
│  builderTree: { ... }  ← DRAFT (was Editor bearbeitet)          │
│                                                                  │
│  publishedRevisionId: "rev_xyz"                                  │
│                    │                                             │
│                    ▼                                             │
│  ┌─────────────────────────────────────────────────────┐        │
│  │             REVISION "rev_xyz"                       │        │
│  │                                                      │        │
│  │  builderTree: { ... }  ← LIVE (was Besucher sehen)  │        │
│  │  version: 3                                          │        │
│  │  comment: "Neue Produktsektion"                      │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                  │
│  REVISION HISTORY:                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                       │
│  │ v1       │  │ v2       │  │ v3 ✓     │ ← aktuell live        │
│  │ Initial  │  │ Bugfix   │  │ New Hero │                       │
│  └──────────┘  └──────────┘  └──────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

**Publish Flow:**

```typescript
// apps/web/src/app/api/workspaces/[id]/pages/[pageId]/publish/route.ts
export async function POST(req: Request) {
  const page = await prisma.page.findUnique({ where: { id: pageId } });
  
  // 1. Nächste Versionsnummer berechnen
  const lastRevision = await prisma.pageRevision.findFirst({
    where: { pageId },
    orderBy: { version: 'desc' },
  });
  const nextVersion = (lastRevision?.version ?? 0) + 1;
  
  // 2. Neue Revision erstellen (Snapshot des aktuellen Drafts)
  const revision = await prisma.pageRevision.create({
    data: {
      pageId,
      builderTree: page.builderTree,  // Kopie!
      version: nextVersion,
      comment: req.body.comment,
      createdById: userId,
    },
  });
  
  // 3. Page auf neue Revision zeigen lassen
  await prisma.page.update({
    where: { id: pageId },
    data: {
      publishedRevisionId: revision.id,
      isDraft: false,
    },
  });
  
  return Response.json({ success: true, version: nextVersion });
}
```

---

### Symbols (Reusable Components) - DRY für Designer

**Was sind Symbols?**

Symbols sind **wiederverwendbare Komponenten**, die an mehreren Stellen verwendet werden können. Änderung am Symbol → Änderung überall.

```
┌─────────────────────────────────────────────────────────────────┐
│                     SYMBOL: "CTA Banner"                         │
│                                                                  │
│  tree: {                                                         │
│    type: 'Section',                                             │
│    children: [                                                   │
│      { type: 'Heading', props: { text: 'Jetzt kaufen!' } },    │
│      { type: 'Button', props: { text: 'Shop →' } }             │
│    ]                                                             │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
              Verwendet als SymbolInstance
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   ┌──────────┐         ┌──────────┐         ┌──────────┐
   │ Homepage │         │ Produkte │         │ Kontakt  │
   │          │         │          │         │          │
   │ [Symbol] │         │ [Symbol] │         │ [Symbol] │
   └──────────┘         └──────────┘         └──────────┘
```

```prisma
model Symbol {
  id            String
  workspaceId   String
  name          String      // "CTA Banner", "Newsletter Box"
  description   String?
  category      String?     // "Marketing", "Navigation"
  tree          Json        // BuilderNode (kein BuilderTree!)
  thumbnailUrl  String?     // Preview-Bild
}
```

**SymbolInstance im Builder Tree:**

```json
{
  "id": "node_123",
  "type": "SymbolInstance",
  "props": {
    "symbolId": "sym_abc",
    "isDetached": false,
    "overrides": {
      "heading_1": {
        "props": { "text": "Spezialangebot!" }
      }
    }
  }
}
```

**Overrides erklärt:**
- `isDetached: false` → Änderungen am Symbol wirken sich aus
- `isDetached: true` → Symbol wurde "abgekoppelt", ist jetzt unabhängig
- `overrides` → Einzelne Props können überschrieben werden

---

### CMS - Collections & Records - Dynamische Inhalte

**Was ist das CMS?**

Das Content Management System ermöglicht dynamische Inhalte wie Blog-Posts, Team-Mitglieder, Testimonials - alles was sich wiederholt.

```
┌─────────────────────────────────────────────────────────────────┐
│                     COLLECTION: "Blog Posts"                     │
│                                                                  │
│  schema: {                                                       │
│    fields: [                                                     │
│      { name: 'title', type: 'text', required: true },           │
│      { name: 'content', type: 'richtext' },                     │
│      { name: 'author', type: 'text' },                           │
│      { name: 'image', type: 'image' },                           │
│      { name: 'publishedAt', type: 'date' }                       │
│    ]                                                             │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                          RECORDS
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   ┌──────────┐         ┌──────────┐         ┌──────────┐
   │ Record 1 │         │ Record 2 │         │ Record 3 │
   │          │         │          │         │          │
   │ title:   │         │ title:   │         │ title:   │
   │ "Neuer   │         │ "Update  │         │ "Tipps"  │
   │  Launch" │         │  2024"   │         │          │
   │          │         │          │         │          │
   │ status:  │         │ status:  │         │ status:  │
   │ PUBLISHED│         │ DRAFT    │         │ PUBLISHED│
   └──────────┘         └──────────┘         └──────────┘
```

```prisma
model Collection {
  id          String
  workspaceId String
  name        String         // "Blog Posts"
  slug        String         // "blog-posts"
  description String?
  schema      Json           // Feld-Definitionen
  isSystem    Boolean        // System-Collections (z.B. für Shop)
  records     Record[]
}

model Record {
  id            String
  collectionId  String
  data          Json           // Die eigentlichen Daten
  slug          String?        // URL-Slug für einzelnen Record
  status        RecordStatus   // DRAFT, PUBLISHED, ARCHIVED
  publishedAt   DateTime?
  createdAt     DateTime
  updatedAt     DateTime
  createdBy     User?
}

enum RecordStatus {
  DRAFT       // Nur im Dashboard sichtbar
  PUBLISHED   // Öffentlich
  ARCHIVED    // Versteckt, aber nicht gelöscht
}
```

**Verwendung im Builder:**

```json
{
  "type": "CollectionList",
  "props": {
    "collection": "blog-posts",
    "limit": 10,
    "orderBy": "publishedAt",
    "orderDirection": "desc"
  },
  "children": [
    {
      "type": "Card",
      "children": [
        {
          "type": "RecordFieldText",
          "props": { "field": "title" }
        },
        {
          "type": "Image",
          "props": { "src": "{{record.image}}" }
        }
      ]
    }
  ]
}
```

**Der Renderer resolvet `{{record.field}}` automatisch!**

---

### Assets

```prisma
model Asset {
  id            String
  workspaceId   String
  name          String
  fileName      String
  mimeType      String
  size          Int
  url           String
  thumbnailUrl  String?
  folder        String?
  tags          String[]
  width         Int?
  height        Int?
  alt           String?
  caption       String?
}
```

### Site Users (Website Visitors)

```prisma
model SiteUser {
  id            String
  workspaceId   String
  email         String
  passwordHash  String?
  name          String?
  avatar        String?
  bio           String?
  profileData   Json
  role          SiteUserRole  // ADMIN, MODERATOR, MEMBER, VIP
  isActive      Boolean
  isBanned      Boolean
  banReason     String?
  emailVerified DateTime?
  provider      String?
  providerId    String?
  lastLoginAt   DateTime?
  loginCount    Int
  sessions      SiteUserSession[]
  orders        Order[]
  carts         Cart[]
}

model SiteUserSession { }
model SiteUserPasswordReset { }

enum SiteUserRole {
  ADMIN
  MODERATOR
  MEMBER
  VIP
}
```

### Custom Domains

```prisma
model CustomDomain {
  id                  String
  workspaceId         String
  domain              String @unique
  status              DomainStatus  // PENDING, VERIFYING, VERIFIED, FAILED
  verificationToken   String?
  verifiedAt          DateTime?
  sslStatus           SslStatus     // PENDING, PROVISIONING, ACTIVE, EXPIRED, FAILED
  sslIssuedAt         DateTime?
  sslExpiresAt        DateTime?
  dnsConfigured       Boolean
  lastCheckedAt       DateTime?
  isPrimary           Boolean
}
```

### Products - Die E-Commerce Engine

```prisma
model Product {
  id                  String
  workspaceId         String
  categoryId          String?
  name                String        // "Nike Air Max 90"
  slug                String        // "nike-air-max-90"
  shortDescription    String?       // Für Listen
  description         String?       // Ausführlich (Markdown)
  
  // === SPEZIFIKATIONEN ===
  specifications      Json?         // [{ label: "Material", value: "Leder" }]
  manufacturer        String?       // "Nike"
  manufacturerSku     String?       // Hersteller-Artikelnummer
  manufacturerUrl     String?       // Link zum Hersteller
  
  // === PREISGESTALTUNG ===
  price               Int           // In CENTS: 9999 = 99,99€
  compareAtPrice      Int?          // Durchgestrichen: "war 129,99€"
  costPrice           Int?          // Einkaufspreis (für Marge)
  currency            String        // "EUR", "USD"
  taxRate             Float?        // Überschreibt Standard
  
  // === LAGERVERWALTUNG ===
  sku                 String?       // Stock Keeping Unit: "NAM90-BLK-42"
  barcode             String?       // EAN/UPC/GTIN für Scanner
  inventory           Int           // Aktueller Bestand
  lowStockThreshold   Int?          // Warnung bei < X
  trackInventory      Boolean       // Bestand verfolgen?
  
  // === MEDIEN ===
  images              Json          // ["url1", "url2", ...]
  
  // === VARIANTEN ===
  options             Json?         // [{ name: "Größe", values: ["40", "41", "42"] }]
  
  // === VERSAND ===
  weight              Float?        // kg
  length              Float?        // cm
  width               Float?        // cm
  height              Float?        // cm
  requiresShipping    Boolean       // false für digitale Produkte
  
  // === SEO ===
  metaTitle           String?
  metaDescription     String?
  
  // === ORGANISATION ===
  tags                Json          // ["sale", "neu", "bestseller"]
  vendor              String?       // "Nike Store Berlin"
  
  // === STATUS ===
  isActive            Boolean       // Im Shop sichtbar?
  isFeatured          Boolean       // Auf Startseite zeigen?
  isDigital           Boolean       // Download-Produkt?
  
  // === RELATIONS ===
  category            ProductCategory?
  orderItems          OrderItem[]
  reviews             Review[]
  inventoryMovements  InventoryMovement[]
}
```

**Warum Preise in Cents?**

```typescript
// FALSCH: Floating-Point-Fehler
const price = 19.99;
const quantity = 3;
console.log(price * quantity); // 59.97000000000001 😱

// RICHTIG: Integer-Arithmetik
const priceInCents = 1999;
const quantity = 3;
console.log(priceInCents * quantity); // 5997 ✓
// Bei Anzeige: (5997 / 100).toFixed(2) = "59.97"
```

**Varianten-System:**

```json
{
  "options": [
    { "name": "Größe", "values": ["40", "41", "42", "43", "44"] },
    { "name": "Farbe", "values": ["Schwarz", "Weiß", "Rot"] }
  ]
}
```

Die Varianten werden **kombinatorisch** im Frontend angezeigt:
- Größe 40 + Schwarz
- Größe 40 + Weiß
- ...

**Hinweis:** Aktuell wird Inventory auf Produkt-Ebene verfolgt, nicht pro Variante. Für Varianten-Inventory wäre ein `ProductVariant` Model nötig.

---

### Orders - Der Bestellprozess

```prisma
model Order {
  id          String
  workspaceId String
  couponId    String?
  
  // === KUNDE ===
  email       String          // Pflicht - für Bestätigung
  name        String?
  siteUserId  String?         // Falls eingeloggt
  
  // === BETRÄGE (alle in Cents!) ===
  subtotal    Int             // Summe aller Items
  tax         Int             // Steuer
  shipping    Int             // Versandkosten
  discount    Int             // Rabatt (Coupon)
  total       Int             // subtotal + tax + shipping - discount
  currency    String          // "EUR"
  
  // === STATUS ===
  status      OrderStatus     // PENDING → PAID → PROCESSING → SHIPPED → DELIVERED
  
  // === STRIPE ===
  stripePaymentIntentId  String?  // pi_abc123...
  
  // === LIEFERUNG ===
  shippingAddress  Json?      // { street, city, zip, country, ... }
  
  // === RELATIONS ===
  items        OrderItem[]
  siteUser     SiteUser?
  coupon       Coupon?
  invoices     Invoice[]
  creditNotes  CreditNote[]
  debitNotes   DebitNote[]
  claims       Claim[]
  
  createdAt    DateTime
  updatedAt    DateTime
}

model OrderItem {
  id         String
  orderId    String
  productId  String
  quantity   Int
  price      Int      // Preis ZUM ZEITPUNKT der Bestellung (wichtig!)
  
  // Snapshot der Produkt-Info falls Produkt gelöscht wird
  productName String
  productSku  String?
}

enum OrderStatus {
  PENDING     // Bezahlung ausstehend
  PAID        // Bezahlt - warte auf Bearbeitung
  PROCESSING  // Wird bearbeitet/verpackt
  SHIPPED     // Versendet
  DELIVERED   // Zugestellt
  CANCELLED   // Storniert (vor Versand)
  REFUNDED    // Erstattet (nach Versand)
}
```

**Order Status Flow:**

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ PENDING  │───▶│   PAID   │───▶│PROCESSING│───▶│ SHIPPED  │───▶│DELIVERED │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │               │
     │               │               │
     ▼               ▼               ▼
┌──────────┐    ┌──────────┐    ┌──────────┐
│CANCELLED │    │ REFUNDED │    │ REFUNDED │
│(Timeout) │    │(vor Ship)│    │(nach Ship│
└──────────┘    └──────────┘    └──────────┘
```

**Warum `price` im OrderItem speichern?**

```
Problem:
1. Kunde bestellt Produkt für 99€
2. Admin ändert Preis auf 79€
3. Rechnung würde 79€ zeigen statt 99€ 😱

Lösung:
OrderItem.price = Snapshot zum Zeitpunkt der Bestellung
→ Ändert sich nie, egal was mit dem Produkt passiert
```

---

### Coupons & Discounts - Rabattsystem verstehen

**Wie Coupons funktionieren:**

```
┌─────────────────────────────────────────────────────────────────┐
│                      COUPON: "SUMMER20"                          │
│                                                                  │
│  type: PERCENTAGE                                                │
│  value: 20                                                       │
│  minOrderAmount: 5000  (= 50€)                                  │
│  maxUses: 100                                                    │
│  usedCount: 34                                                   │
│  expiresAt: 2024-09-01                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                         Checkout
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BERECHNUNG                                │
│                                                                  │
│  Warenkorb:       159,97€ (15997 cents)                         │
│  - 20% Rabatt:    -31,99€ (-3199 cents)                         │
│  ─────────────────────────────                                   │
│  Subtotal:        127,98€                                        │
│  + Versand:        +5,99€                                        │
│  ─────────────────────────────                                   │
│  TOTAL:           133,97€                                        │
└─────────────────────────────────────────────────────────────────┘
```

```prisma
model Coupon {
  id          String
  workspaceId String
  
  // === IDENTIFIKATION ===
  code        String        // "SUMMER20", "NEUKUNDE10", "GRATIS"
  description String?       // Admin-Notiz
  
  // === RABATT-ART ===
  type        DiscountType  // Was für ein Rabatt?
  value       Int           // Wert (% oder Cents)
  
  // === BEDINGUNGEN ===
  minOrderAmount  Int?      // Mindestbestellwert in Cents
  maxUses         Int?      // Maximale Verwendungen gesamt
  maxUsesPerUser  Int?      // Pro Kunde max. X mal
  usedCount       Int       // Bereits verwendet
  
  // === ZEITRAUM ===
  startsAt        DateTime  // Ab wann gültig
  expiresAt       DateTime? // Bis wann (null = unbegrenzt)
  isActive        Boolean   // Admin kann deaktivieren
  
  // === TRACKING ===
  orders          Order[]   // Welche Bestellungen haben ihn genutzt?
}

enum DiscountType {
  PERCENTAGE      // value = 20 → 20% Rabatt
  FIXED_AMOUNT    // value = 1000 → 10€ Rabatt
  FREE_SHIPPING   // value ignoriert → Versandkosten auf 0
}
```

**Coupon-Validierung im Checkout:**

```typescript
// apps/web/src/app/api/workspaces/[id]/checkout/validate-coupon/route.ts
export async function POST(req: Request) {
  const { code, cartTotal } = await req.json();
  
  const coupon = await prisma.coupon.findFirst({
    where: {
      workspaceId,
      code: code.toUpperCase(),
      isActive: true,
    },
  });
  
  // 1. Existiert?
  if (!coupon) {
    return Response.json({ valid: false, error: 'Ungültiger Code' });
  }
  
  // 2. Noch nicht abgelaufen?
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return Response.json({ valid: false, error: 'Code abgelaufen' });
  }
  
  // 3. Noch nicht gestartet?
  if (coupon.startsAt > new Date()) {
    return Response.json({ valid: false, error: 'Code noch nicht aktiv' });
  }
  
  // 4. Mindestbestellwert erreicht?
  if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
    const min = (coupon.minOrderAmount / 100).toFixed(2);
    return Response.json({ 
      valid: false, 
      error: `Mindestbestellwert: ${min}€` 
    });
  }
  
  // 5. Noch Verwendungen übrig?
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return Response.json({ valid: false, error: 'Code ausgeschöpft' });
  }
  
  // 6. Rabatt berechnen
  let discount = 0;
  switch (coupon.type) {
    case 'PERCENTAGE':
      discount = Math.floor(cartTotal * (coupon.value / 100));
      break;
    case 'FIXED_AMOUNT':
      discount = Math.min(coupon.value, cartTotal); // Max = Warenkorb
      break;
    case 'FREE_SHIPPING':
      discount = 0; // Wird separat bei shipping abgezogen
      break;
  }
  
  return Response.json({ 
    valid: true, 
    discount,
    type: coupon.type,
    freeShipping: coupon.type === 'FREE_SHIPPING',
  });
}
```

---

### Payment & Shipping Methods - Zahlungs- und Versandarten

**Payment Flow:**

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Checkout  │───▶│  Bezahlung  │───▶│    Order    │
│             │    │   wählen    │    │   anlegen   │
└─────────────┘    └─────────────┘    └─────────────┘
                          │
           ┌──────────────┼──────────────┐
           ▼              ▼              ▼
    ┌────────────┐ ┌────────────┐ ┌────────────┐
    │   STRIPE   │ │   PAYPAL   │ │  RECHNUNG  │
    │            │ │            │ │            │
    │ Redirect → │ │ Redirect → │ │ Order →    │
    │ Stripe.com │ │ PayPal.com │ │ PENDING    │
    │            │ │            │ │            │
    │ Webhook ←  │ │ Webhook ←  │ │ Admin setzt│
    │ order.paid │ │ order.paid │ │ auf PAID   │
    └────────────┘ └────────────┘ └────────────┘
```

```prisma
model PaymentMethod {
  id          String
  workspaceId String
  
  // === ANZEIGE ===
  name        String          // "Kreditkarte", "PayPal", "Rechnung"
  description String?         // "Visa, Mastercard, American Express"
  icon        String?         // "credit-card", "paypal"
  
  // === KONFIGURATION ===
  provider    PaymentProvider // Welcher Dienst?
  config      Json            // Provider-spezifische Einstellungen
  
  // === SORTIERUNG ===
  sortOrder   Int             // Reihenfolge im Checkout
  isActive    Boolean         // Anzeigen?
}

enum PaymentProvider {
  STRIPE            // Kreditkarte, Apple Pay, Google Pay
  PAYPAL            // PayPal Checkout
  BANK_TRANSFER     // Vorkasse
  CASH_ON_DELIVERY  // Nachnahme
  INVOICE           // Kauf auf Rechnung
  MANUAL            // Barzahlung bei Abholung etc.
}
```

**config Beispiele:**

```json
// Stripe
{
  "secretKey": "sk_live_...",
  "publishableKey": "pk_live_...",
  "webhookSecret": "whsec_...",
  "enableApplePay": true,
  "enableGooglePay": true
}

// PayPal
{
  "clientId": "AZDxj...",
  "clientSecret": "EGnH...",
  "mode": "live"  // oder "sandbox"
}

// Rechnung
{
  "paymentTermsDays": 14,
  "minOrderAmount": 5000,  // Erst ab 50€
  "requireVerifiedEmail": true
}
```

**Shipping Methods:**

```prisma
model ShippingMethod {
  id               String
  workspaceId      String
  
  // === ANZEIGE ===
  name             String    // "Standardversand", "Express"
  description      String?   // "3-5 Werktage"
  
  // === KOSTEN ===
  price            Int       // Cents: 599 = 5,99€
  freeAbove        Int?      // Gratis ab X Cents (z.B. ab 50€)
  
  // === LIEFERZEIT ===
  estimatedDaysMin Int?      // Mindestens X Tage
  estimatedDaysMax Int?      // Höchstens X Tage
  
  // === EINSCHRÄNKUNGEN ===
  countries        String[]  // ["DE", "AT", "CH"]
  maxWeight        Float?    // Maximales Gewicht in kg
  
  // === SORTIERUNG ===
  sortOrder        Int
  isActive         Boolean
}
```

**Versandkosten-Berechnung:**

```typescript
// Versandkosten ermitteln
function calculateShipping(
  method: ShippingMethod, 
  cartSubtotal: number
): number {
  // Gratis ab bestimmtem Wert?
  if (method.freeAbove && cartSubtotal >= method.freeAbove) {
    return 0;
  }
  return method.price;
}

// Beispiel:
// Standardversand: 5,99€, gratis ab 50€
// Warenkorb: 65€ → Versand: 0€
// Warenkorb: 35€ → Versand: 5,99€
```

---

### Shop Settings - Shop-Konfiguration

```prisma
model ShopSettings {
  id                  String
  workspaceId         String @unique
  
  // === GRUNDEINSTELLUNGEN ===
  shopName            String?   // Anzeigename
  shopLogo            String?   // Logo-URL
  currency            String    // "EUR", "USD", "CHF"
  
  // === STEUERN ===
  taxRate             Float     // Standard-Mehrwertsteuersatz (19.0)
  taxIncluded         Boolean   // Preise inkl. MwSt.?
  
  // === CHECKOUT ===
  requireAccount      Boolean   // Muss User eingeloggt sein?
  enableGuestCheckout Boolean   // Gast-Checkout erlaubt?
  
  // === BENACHRICHTIGUNGEN ===
  orderNotifyEmail    String?   // Bestellbenachrichtigungen an
  
  // === RECHTLICHES (URLs zu Seiten) ===
  termsUrl            String?   // AGB
  privacyUrl          String?   // Datenschutz
  returnPolicyUrl     String?   // Widerrufsbelehrung
  imprintUrl          String?   // Impressum
}
```

**Warum separate ShopSettings?**

```
Workspace                     ShopSettings
────────────────────         ────────────────────
name: "Mein Shop"            shopName: "MegaStore"
slug: "mein-shop"            currency: "EUR"
type: SHOP                   taxRate: 19.0
settings: { ... }            enableGuestCheckout: true
                             termsUrl: "/agb"
                             ...

→ Klare Trennung zwischen:
  - Workspace = Technische Konfiguration
  - ShopSettings = Business/Shop-Logik
```

---

### Forms - Formularsystem

**Form-System Übersicht:**

```
┌─────────────────────────────────────────────────────────────────┐
│                       FORM: "Kontaktformular"                    │
│                                                                  │
│  schema: {                                                       │
│    fields: [                                                     │
│      { name: 'name', type: 'text', label: 'Name', required: true },
│      { name: 'email', type: 'email', label: 'E-Mail', required: true },
│      { name: 'message', type: 'textarea', label: 'Nachricht' },
│      { name: 'privacy', type: 'checkbox', label: 'Datenschutz akzeptiert', required: true }
│    ]                                                             │
│  }                                                               │
│                                                                  │
│  submitLabel: "Absenden"                                         │
│  successMessage: "Danke für Ihre Nachricht!"                     │
│  redirectUrl: "/danke"                                           │
│  notifyEmails: ["info@shop.de", "kontakt@shop.de"]              │
│  enableRecaptcha: true                                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                         Besucher füllt aus
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FORM_SUBMISSION                              │
│                                                                  │
│  data: {                                                         │
│    name: "Max Mustermann",                                       │
│    email: "max@beispiel.de",                                     │
│    message: "Ich habe eine Frage...",                           │
│    privacy: true                                                 │
│  }                                                               │
│                                                                  │
│  ipAddress: "192.168.1.1"                                        │
│  userAgent: "Mozilla/5.0..."                                     │
│  status: NEW                                                     │
│  isSpam: false                                                   │
└─────────────────────────────────────────────────────────────────┘
```

```prisma
model Form {
  id          String
  workspaceId String
  
  // === IDENTIFIKATION ===
  name        String    // Admin-Name
  slug        String    // URL-Teil: /forms/kontakt
  description String?   // Admin-Notiz
  
  // === FELDER ===
  schema      Json      // Feld-Definitionen (siehe oben)
  
  // === VERHALTEN ===
  submitLabel    String    // Button-Text
  successMessage String    // Nach Absenden
  redirectUrl    String?   // Weiterleitung nach Absenden
  
  // === BENACHRICHTIGUNG ===
  notifyEmails   String[]  // E-Mail an diese Adressen
  
  // === SPAM-SCHUTZ ===
  enableRecaptcha Boolean
  
  // === STATUS ===
  isActive       Boolean
  
  // === EINGABEN ===
  submissions    FormSubmission[]
}

model FormSubmission {
  id          String
  formId      String
  
  // === DATEN ===
  data        Json      // Die eigentlichen Formular-Daten
  
  // === KONTEXT ===
  ipAddress   String?   // Für Spam-Erkennung
  userAgent   String?   // Browser-Info
  referrer    String?   // Woher kam der Besucher?
  
  // === STATUS ===
  status      SubmissionStatus
  readAt      DateTime? // Wann gelesen?
  
  // === SPAM ===
  isSpam      Boolean
  spamScore   Float?    // 0.0 - 1.0 (höher = mehr Spam-Verdacht)
  
  createdAt   DateTime
}

enum SubmissionStatus {
  NEW         // Ungelesen
  READ        // Gelesen
  REPLIED     // Beantwortet
  SPAM        // Als Spam markiert
  ARCHIVED    // Archiviert
}
```

**Form Field Types:**

| Type | Beschreibung | Validierung |
|------|--------------|-------------|
| `text` | Einzeiliger Text | minLength, maxLength, pattern |
| `textarea` | Mehrzeiliger Text | minLength, maxLength |
| `email` | E-Mail-Adresse | E-Mail-Format |
| `phone` | Telefonnummer | Telefon-Pattern |
| `number` | Zahl | min, max |
| `date` | Datum | min, max |
| `select` | Dropdown | options[] |
| `radio` | Radio-Buttons | options[] |
| `checkbox` | Checkbox | - |
| `file` | Datei-Upload | accept, maxSize |
| `hidden` | Verstecktes Feld | - |

---

### Forum - Community-System

**Forum-Hierarchie:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    FORUM CATEGORIES                              │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Allgemein    │  │ Support      │  │ Off-Topic    │          │
│  │ order: 1     │  │ order: 2     │  │ order: 3     │          │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘          │
│         │                 │                                      │
│    THREADS           THREADS                                     │
│    ┌────┴────┐      ┌────┴────┐                                 │
│    │         │      │         │                                 │
│    ▼         ▼      ▼         ▼                                 │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                            │
│ │Thread│ │Thread│ │Thread│ │Thread│                            │
│ │"Will-│ │"Neuer│ │"Bug  │ │"Frage│                            │
│ │kommen│ │Release│ │#123"│ │zu..."│                            │
│ │      │ │      │ │      │ │      │                            │
│ │📌    │ │      │ │🔒    │ │      │                            │
│ └──┬───┘ └──┬───┘ └──┬───┘ └──────┘                            │
│    │        │        │                                          │
│  POSTS    POSTS    POSTS                                        │
│  ┌─┴─┐   ┌─┴─┐    ┌─┴─┐                                        │
│  │   │   │   │    │   │                                        │
│  ▼   ▼   ▼   ▼    ▼   ▼                                        │
│ [P1][P2][P1][P2] [P1][P2]                                       │
└─────────────────────────────────────────────────────────────────┘

📌 = isPinned (angepinnt)
🔒 = isLocked (geschlossen)
```

```prisma
model ForumCategory {
  id          String
  workspaceId String
  
  // === IDENTIFIKATION ===
  name        String    // "Allgemein", "Support"
  slug        String    // "allgemein", "support"
  description String?   // Kategorie-Beschreibung
  
  // === SORTIERUNG ===
  order       Int       // Reihenfolge
  
  // === THREADS ===
  threads     ForumThread[]
}

model ForumThread {
  id          String
  categoryId  String
  
  // === AUTOR ===
  authorEmail String    // E-Mail des Erstellers
  
  // === INHALT ===
  title       String    // Thread-Titel
  slug        String    // URL-Teil
  
  // === STATUS ===
  isPinned    Boolean   // Oben angepinnt?
  isLocked    Boolean   // Keine neuen Posts?
  
  // === POSTS ===
  posts       ForumPost[]
  
  createdAt   DateTime
  updatedAt   DateTime  // Letzter Post
}

model ForumPost {
  id          String
  threadId    String
  
  // === AUTOR ===
  authorEmail String
  
  // === INHALT ===
  content     String    // Markdown/HTML
  
  createdAt   DateTime
  updatedAt   DateTime
}
```

---

### Templates - Vorlagen-System

**Template-Kategorien:**

```
┌─────────────────────────────────────────────────────────────────┐
│                      TEMPLATE SYSTEM                             │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    FULL_PAGE Templates                   │    │
│  │                                                          │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │
│  │  │ Modern   │ │ Classic  │ │ E-Shop   │ │ Portfolio│   │    │
│  │  │ Landing  │ │ Business │ │ Starter  │ │ Creative │   │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    SECTION Templates                     │    │
│  │                                                          │    │
│  │  HERO     FEATURES  PRICING   CTA    FOOTER   HEADER    │    │
│  │  ┌───┐    ┌───┐     ┌───┐    ┌───┐   ┌───┐    ┌───┐     │    │
│  │  │ █ │    │▢▢▢│     │$$$│    │ → │   │═══│    │≡≡≡│     │    │
│  │  │   │    │▢▢▢│     │   │    │   │   │   │    │   │     │    │
│  │  └───┘    └───┘     └───┘    └───┘   └───┘    └───┘     │    │
│  │                                                          │    │
│  │  TESTIMONIALS  FAQ  GALLERY  TEAM  CONTACT  E-COMMERCE  │    │
│  │  ┌───┐    ┌───┐   ┌───┐   ┌───┐   ┌───┐    ┌───┐       │    │
│  │  │"..."│  │?A │   │▣▣▣│   │☺☺☺│   │@→ │    │🛒 │       │    │
│  │  └───┘    └───┘   └───┘   └───┘   └───┘    └───┘       │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

```prisma
model Template {
  id          String
  
  // === IDENTIFIKATION ===
  name        String        // "Modern Dark Hero"
  slug        String @unique
  description String?       // Beschreibung für Vorschau
  thumbnail   String?       // Screenshot-URL
  
  // === KATEGORISIERUNG ===
  category    TemplateCategory  // HERO, FEATURES, FULL_PAGE, ...
  style       String?           // "modern", "classic", "bold"
  websiteType String?           // "shop", "portfolio", "blog"
  tags        String[]          // ["dark", "minimal", "animated"]
  
  // === DER EIGENTLICHE INHALT ===
  tree        Json              // BuilderTree oder BuilderNode
  
  // === STATUS ===
  isPro       Boolean       // Nur für Pro-User?
  isPublished Boolean       // Öffentlich sichtbar?
  isSystem    Boolean       // Kann nicht gelöscht werden
}

enum TemplateCategory {
  // === SEKTIONEN ===
  HERO          // Hero-Banner mit CTA
  FEATURES      // Feature-Grid/Liste
  PRICING       // Preistabellen
  TESTIMONIALS  // Kundenstimmen
  CTA           // Call-to-Action Banner
  CONTACT       // Kontaktformular
  TEAM          // Team-Übersicht
  FAQ           // Häufige Fragen
  FOOTER        // Fußzeile
  HEADER        // Kopfzeile/Navigation
  GALLERY       // Bildergalerie
  STATS         // Statistiken/Zahlen
  BLOG          // Blog-Vorschau
  ECOMMERCE     // Shop-Sektionen (Produkte, etc.)
  CONTENT       // Allgemeiner Content
  
  // === VOLLSTÄNDIGE SEITEN ===
  FULL_PAGE     // Komplette Seite mit mehreren Sektionen
}
```

**Template im Editor verwenden:**

```typescript
// Template als neue Sektion einfügen
async function insertTemplate(templateId: string, insertIndex: number) {
  const template = await fetch(`/api/templates/${templateId}`).then(r => r.json());
  
  // IDs neu generieren (damit keine Duplikate)
  const clonedTree = cloneWithNewIds(template.tree);
  
  // In den Tree einfügen
  useEditorStore.getState().insertNodeAt(
    clonedTree,
    'root',
    insertIndex
  );
}
```

---

### Analytics - Besucherstatistiken

```prisma
model PageView {
  id          String
  workspaceId String
  pageId      String?   // Welche Page (null = 404 etc.)
  
  // === URL ===
  path        String    // "/produkte/schuhe"
  referrer    String?   // "https://google.com"
  
  // === KONTEXT ===
  userAgent   String?   // Browser User-Agent
  country     String?   // GeoIP → "DE", "AT"
  device      String?   // "desktop", "mobile", "tablet"
  browser     String?   // "Chrome", "Safari", "Firefox"
  os          String?   // "Windows", "macOS", "iOS"
  
  // === SESSION ===
  sessionId   String?   // Für Session-Tracking
  
  createdAt   DateTime
}
```

**Analytics Aggregation:**

```typescript
// Tägliche Besucher der letzten 30 Tage
const dailyVisits = await prisma.pageView.groupBy({
  by: ['createdAt'],
  where: {
    workspaceId,
    createdAt: { gte: thirtyDaysAgo },
  },
  _count: true,
});

// Top-Seiten
const topPages = await prisma.pageView.groupBy({
  by: ['path'],
  where: { workspaceId },
  _count: true,
  orderBy: { _count: { path: 'desc' } },
  take: 10,
});

// Traffic-Quellen
const sources = await prisma.pageView.groupBy({
  by: ['referrer'],
  where: { workspaceId, referrer: { not: null } },
  _count: true,
  orderBy: { _count: { referrer: 'desc' } },
  take: 10,
});
```

---

### Tax Zones - Steuerzonen

```prisma
model TaxZone {
  id          String
  workspaceId String
  
  // === IDENTIFIKATION ===
  name        String    // "Deutschland", "EU", "Drittländer"
  countries   String[]  // ISO-Codes: ["DE"], ["AT", "CH"], ["*"]
  
  // === STEUERSÄTZE ===
  defaultRate Float     // Standard-MwSt: 19.0, 7.7, etc.
  reducedRate Float?    // Ermäßigter Satz: 7.0 (DE)
  
  // === STEUERKLASSEN ===
  taxClasses  Json      // [{ name: "Lebensmittel", rate: 7.0 }]
  
  // === KONFIGURATION ===
  taxIncluded Boolean   // Preise inkl. MwSt.?
  isDefault   Boolean   // Standard-Zone?
  
  // === SORTIERUNG ===
  sortOrder   Int
  isActive    Boolean
}
```

**Steuer-Berechnung:**

```
Kunde aus Deutschland kauft:
├── Schuhe (Standardsatz) → 19% MwSt.
├── Buch (ermäßigt)       → 7% MwSt.
└── E-Book (Digital)      → 19% MwSt.

1. TaxZone für "DE" finden
2. Produkt-Steuerklasse prüfen
3. Entsprechenden Satz anwenden
```

---

### Vouchers / Gift Cards - Gutscheine

```prisma
model Voucher {
  id              String
  workspaceId     String
  
  // === CODE ===
  code            String    // "GIFT-XXXX-XXXX"
  
  // === TYP ===
  type            VoucherType
  
  // === WERT ===
  initialValue    Int       // Ursprünglicher Wert in Cents
  balance         Int       // Aktuelles Guthaben
  currency        String    // "EUR"
  
  // === KÄUFER ===
  purchaserEmail  String?
  purchaserName   String?
  
  // === EMPFÄNGER ===
  recipientEmail  String?
  recipientName   String?
  personalMessage String?   // "Alles Gute zum Geburtstag!"
  
  // === STATUS ===
  expiresAt       DateTime?
  isActive        Boolean
  redeemedAt      DateTime? // Erste Verwendung
}

enum VoucherType {
  GIFT_CARD       // Geschenkkarte - kann gekauft werden
  STORE_CREDIT    // Guthaben - vom Admin vergeben
  LOYALTY_REWARD  // Belohnung - automatisch bei Treue
}
```

**Voucher Flow:**

```
1. KAUF
   ┌─────────────┐
   │ Kunde kauft │────▶ Voucher wird erstellt
   │ Geschenkkarte│     initialValue: 5000 (50€)
   │ für 50€     │     balance: 5000
   └─────────────┘

2. VERSAND (optional)
   ┌─────────────┐
   │ E-Mail an   │────▶ Code: GIFT-ABCD-1234
   │ Empfänger   │     "Max hat dir 50€ geschenkt!"
   └─────────────┘

3. EINLÖSUNG
   ┌─────────────┐
   │ Empfänger   │────▶ Checkout: Warenkorb 35€
   │ löst ein    │     - Voucher: -35€
   │             │     = Gesamt: 0€
   │             │     balance jetzt: 1500 (15€)
   └─────────────┘
```

---

### Abandoned Carts - Warenkorbabbrecher

```prisma
model Cart {
  id          String
  workspaceId String
  
  // === KUNDE ===
  email       String?   // Falls bekannt
  siteUserId  String?   // Falls eingeloggt
  sessionId   String?   // Für Gäste
  
  // === INHALT ===
  items       Json      // [{ productId, quantity, price }]
  subtotal    Int
  currency    String
  
  // === STATUS ===
  status      CartStatus
  
  // === RECOVERY ===
  recoveryEmailSentAt  DateTime?  // Wann Reminder gesendet
  recoveryEmailCount   Int        // Wie oft gesendet (max 3)
  recoveredAt          DateTime?  // Wann wiederhergestellt
  
  createdAt   DateTime
  updatedAt   DateTime  // Letzte Änderung
}

enum CartStatus {
  ACTIVE      // Kunde ist noch da, Cart wird aktualisiert
  ABANDONED   // 1h+ keine Aktivität
  RECOVERED   // Kunde kam zurück (ohne Kauf)
  CONVERTED   // Kunde hat gekauft
}
```

**Cart Recovery Flow:**

```
┌──────────────────────────────────────────────────────────────────┐
│                    ABANDONED CART RECOVERY                        │
│                                                                   │
│  TIMELINE:                                                        │
│                                                                   │
│  0h        1h           24h          48h           72h           │
│  │         │            │            │             │             │
│  │ Cart    │ Status →   │ E-Mail 1   │ E-Mail 2   │ E-Mail 3    │
│  │ created │ ABANDONED  │ "Vergessen │ "Noch da?" │ "10% Rabatt"│
│  │         │            │ etwas?"    │            │             │
│  ▼         ▼            ▼            ▼            ▼             │
│                                                                   │
│  Falls Kunde zurückkommt → status = RECOVERED                    │
│  Falls Kunde kauft → status = CONVERTED, Order wird erstellt     │
└──────────────────────────────────────────────────────────────────┘
```

---

### Invoices - Rechnungssystem

**Rechnungs-Status-Flow:**

```
┌─────────┐    ┌─────────┐    ┌─────────┐
│  DRAFT  │───▶│  SENT   │───▶│  PAID   │
│         │    │         │    │         │
│ Entwurf │    │ E-Mail  │    │ Bezahlt │
└─────────┘    └─────────┘    └─────────┘
     │              │
     │              └───────────▶┌─────────┐
     │                           │ OVERDUE │
     │                           │         │
     │                           │ Überfäll│
     │                           └─────────┘
     │
     └───────────▶┌─────────┐    ┌─────────┐
                  │CANCELLED│    │REFUNDED │
                  │         │    │         │
                  │Storniert│    │Erstattet│
                  └─────────┘    └─────────┘
```

```prisma
model Invoice {
  id              String
  workspaceId     String
  orderId         String?       // Verknüpfte Bestellung
  
  // === NUMMERIERUNG ===
  invoiceNumber   String        // "RE-2024-001"
  
  // === KUNDENINFORMATIONEN ===
  customerName    String
  customerEmail   String
  customerAddress Json?         // { street, city, zip, country }
  
  // === VERKÄUFERINFORMATIONEN ===
  sellerName      String?
  sellerAddress   Json?
  sellerVatId     String?       // USt-IdNr.
  
  // === POSITIONEN ===
  items           Json          // [{ description, quantity, unitPrice, total }]
  
  // === BETRÄGE (in Cents) ===
  subtotal        Int           // Nettosumme
  taxAmount       Int           // Steuerbetrag
  discount        Int           // Rabatte
  shipping        Int           // Versandkosten
  total           Int           // Gesamtsumme
  currency        String        // "EUR"
  
  // === STEUER-DETAILS ===
  taxBreakdown    Json?         // [{ rate: 19, amount: 1900, label: "MwSt." }]
  
  // === STATUS ===
  status          InvoiceStatus
  
  // === DATEN ===
  issueDate       DateTime      // Rechnungsdatum
  dueDate         DateTime?     // Fälligkeitsdatum
  paidAt          DateTime?     // Bezahlt am
  
  // === ZUSATZ ===
  notes           String?       // Bemerkungen
  footerText      String?       // Fußtext
  
  // === PDF ===
  pdfUrl          String?       // Generiertes PDF
}

enum InvoiceStatus {
  DRAFT       // Entwurf - noch nicht versendet
  SENT        // Per E-Mail versendet
  PAID        // Bezahlt
  OVERDUE     // Überfällig (dueDate < today && !paid)
  CANCELLED   // Storniert
  REFUNDED    // Erstattet
}
```

**Automatische Rechnungsnummer:**

```typescript
// apps/web/src/app/api/workspaces/[id]/invoices/route.ts
async function generateInvoiceNumber(workspaceId: string): Promise<string> {
  const settings = await prisma.invoiceSettings.findUnique({
    where: { workspaceId },
  });
  
  const prefix = settings?.invoicePrefix ?? 'RE';
  const nextNumber = settings?.nextInvoiceNumber ?? 1;
  const year = new Date().getFullYear();
  
  // Format: RE-2024-0001
  const invoiceNumber = `${prefix}-${year}-${String(nextNumber).padStart(4, '0')}`;
  
  // Counter erhöhen
  await prisma.invoiceSettings.update({
    where: { workspaceId },
    data: { nextInvoiceNumber: nextNumber + 1 },
  });
  
  return invoiceNumber;
}
```

---

### Credit Notes - Gutschriften

**Wann wird eine Gutschrift erstellt?**

```
Order #123: Kunde kauft 3 Artikel für 150€
            ↓
Problem: 1 Artikel defekt
            ↓
Lösung: Teilrückerstattung für 1 Artikel (50€)
            ↓
┌────────────────────────────────────────┐
│           CREDIT NOTE                   │
│                                         │
│  Gutschrift zu Rechnung RE-2024-001    │
│                                         │
│  1x Defekter Artikel         50,00€    │
│  ─────────────────────────────────     │
│  Gutschriftsbetrag:          50,00€    │
│                                         │
│  Grund: Defekte Ware                    │
│  Status: ISSUED                         │
└────────────────────────────────────────┘
```

```prisma
model CreditNote {
  id                String
  workspaceId       String
  orderId           String?       // Zugehörige Bestellung
  
  // === NUMMERIERUNG ===
  creditNoteNumber  String        // "GS-2024-001"
  
  // === KUNDE ===
  customerName      String
  customerEmail     String
  
  // === POSITIONEN ===
  items             Json          // Was wird erstattet?
  
  // === BETRÄGE ===
  subtotal          Int
  taxAmount         Int
  total             Int
  currency          String
  
  // === GRUND ===
  reason            String?       // "Defekte Ware", "Stornierung"
  
  // === STATUS ===
  status            CreditNoteStatus
  
  // === DATUM ===
  issueDate         DateTime
  
  // === PDF ===
  pdfUrl            String?
}

enum CreditNoteStatus {
  DRAFT       // Entwurf
  ISSUED      // Ausgestellt
  VOIDED      // Ungültig gemacht
}
```

---

### Debit Notes - Lastschriften/Belastungsanzeigen

**Wann wird eine Belastungsanzeige erstellt?**

```
Szenario: Rechnung war zu niedrig
          (z.B. Versandkosten falsch berechnet)
          ↓
Lösung: Nachberechnung per Debit Note
          ↓
┌────────────────────────────────────────┐
│            DEBIT NOTE                   │
│                                         │
│  Belastungsanzeige zu RE-2024-001      │
│                                         │
│  Versandkosten-Korrektur     5,00€     │
│  ─────────────────────────────────     │
│  Belastungsbetrag:           5,00€     │
│                                         │
│  Grund: Versandkosten nachberechnet     │
└────────────────────────────────────────┘
```

```prisma
model DebitNote {
  id               String
  workspaceId      String
  orderId          String?
  
  debitNoteNumber  String        // "LA-2024-001"
  customerName     String
  customerEmail    String
  items            Json
  subtotal         Int
  taxAmount        Int
  total            Int
  currency         String
  reason           String?
  status           DebitNoteStatus  // DRAFT, ISSUED, VOIDED
  issueDate        DateTime
  pdfUrl           String?
}
```

---

### Quotes / Angebote

**Angebots-Workflow:**

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  DRAFT  │───▶│  SENT   │───▶│ACCEPTED │───▶│CONVERTED│
│         │    │         │    │         │    │         │
│ Erstellt│    │Per Email│    │ Kunde   │    │ → Rechn.│
└─────────┘    └─────────┘    └─────────┘    └─────────┘
                    │              │
                    │              │
                    ▼              ▼
              ┌─────────┐    ┌─────────┐
              │ EXPIRED │    │DECLINED │
              │         │    │         │
              │validUntil│   │ Kunde   │
              │abgelaufen│   │ lehnt ab│
              └─────────┘    └─────────┘
```

```prisma
model Quote {
  id                  String
  workspaceId         String
  
  // === NUMMERIERUNG ===
  quoteNumber         String        // "AN-2024-001"
  
  // === KUNDE ===
  customerName        String
  customerEmail       String
  customerAddress     Json?
  
  // === POSITIONEN ===
  items               Json
  
  // === BETRÄGE ===
  subtotal            Int
  taxAmount           Int
  discount            Int
  total               Int
  currency            String
  
  // === STATUS ===
  status              QuoteStatus
  
  // === DATEN ===
  issueDate           DateTime
  validUntil          DateTime?     // Gültig bis
  acceptedAt          DateTime?     // Wann angenommen
  
  // === NOTIZEN ===
  notes               String?
  
  // === KONVERTIERUNG ===
  convertedInvoiceId  String?       // Falls in Rechnung umgewandelt
  
  // === PDF ===
  pdfUrl              String?
}

enum QuoteStatus {
  DRAFT       // Entwurf
  SENT        // Versendet
  ACCEPTED    // Angenommen
  DECLINED    // Abgelehnt
  EXPIRED     // Abgelaufen
  CONVERTED   // In Rechnung umgewandelt
}
```

---

### Reviews - Produktbewertungen

```prisma
model Review {
  id              String
  workspaceId     String
  productId       String
  
  // === AUTOR ===
  authorName      String
  authorEmail     String
  siteUserId      String?       // Falls eingeloggt
  
  // === BEWERTUNG ===
  rating          Int           // 1-5 Sterne
  title           String?       // "Tolles Produkt!"
  comment         String?       // Ausführlicher Text
  
  // === MODERATION ===
  status          ReviewStatus
  
  // === FEEDBACK ===
  helpfulCount    Int           // "War hilfreich" Klicks
  notHelpfulCount Int           // "Nicht hilfreich" Klicks
  
  // === ADMIN-ANTWORT ===
  adminResponse       String?
  adminRespondedAt    DateTime?
  
  createdAt       DateTime
  updatedAt       DateTime
}

enum ReviewStatus {
  PENDING     // Wartet auf Freigabe
  APPROVED    // Freigegeben & sichtbar
  REJECTED    // Abgelehnt (unpassend)
  FLAGGED     // Zur Prüfung markiert
}
```

**Review-Moderation:**

```
Neues Review eingereicht
         │
         ▼
┌─────────────────┐
│    PENDING      │
│                 │
│ Wartet auf      │
│ Admin-Prüfung   │
└────────┬────────┘
         │
    ┌────┴────┐
    │ Auto?   │──────────────────┐
    └────┬────┘                  │
    auto │               manual  │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Spam-Check    │    │  Admin prüft    │
│                 │    │                 │
│ - Schlechte     │    │ - Inhalt OK?    │
│   Wörter?       │    │ - Kein Spam?    │
│ - Spam-Pattern? │    │ - Legitimer     │
│ - Bot?          │    │   Kauf?         │
└────────┬────────┘    └────────┬────────┘
         │                      │
         ▼                      ▼
┌─────────────────┐    ┌─────────────────┐
│    APPROVED     │    │    REJECTED     │
│  oder FLAGGED   │    │                 │
└─────────────────┘    └─────────────────┘
```

---

### Email Templates - E-Mail-Vorlagen

```prisma
model EmailTemplate {
  id          String
  workspaceId String
  
  // === TYP ===
  type        EmailTemplateType   // Welche Art von E-Mail?
  
  // === INHALT ===
  name        String              // Admin-Name
  subject     String              // Betreff (mit Variablen)
  bodyHtml    String              // HTML-Inhalt
  bodyText    String?             // Plain-Text-Alternative
  
  // === STATUS ===
  isActive    Boolean             // Verwenden?
}

enum EmailTemplateType {
  // === BESTELLUNGEN ===
  ORDER_CONFIRMATION    // "Ihre Bestellung ist eingegangen"
  ORDER_SHIPPED         // "Ihre Bestellung wurde versendet"
  ORDER_DELIVERED       // "Ihre Bestellung wurde zugestellt"
  ORDER_CANCELLED       // "Ihre Bestellung wurde storniert"
  ORDER_REFUNDED        // "Ihre Erstattung wurde bearbeitet"
  PAYMENT_RECEIVED      // "Zahlung erhalten"
  
  // === DOKUMENTE ===
  INVOICE_SENT          // "Ihre Rechnung"
  
  // === MARKETING ===
  ABANDONED_CART        // "Haben Sie etwas vergessen?"
  REVIEW_REQUEST        // "Wie war Ihr Einkauf?"
  
  // === ACCOUNT ===
  WELCOME               // "Willkommen bei [Shop]"
  ACCOUNT_ACTIVATED     // "Ihr Account wurde aktiviert"
  PASSWORD_RESET        // "Passwort zurücksetzen"
  
  // === ABONNEMENTS ===
  SUBSCRIPTION_CREATED  // "Ihr Abo wurde gestartet"
  SUBSCRIPTION_CANCELLED// "Ihr Abo wurde gekündigt"
  SUBSCRIPTION_RENEWED  // "Ihr Abo wurde verlängert"
  
  // === SONSTIGE ===
  CUSTOM                // Benutzerdefiniert
}
```

**Template-Variablen:**

```html
<!-- Bestellbestätigung Template -->
<h1>Danke für Ihre Bestellung, {{customer.name}}!</h1>

<p>Ihre Bestellung <strong>#{{order.number}}</strong> wurde erfolgreich aufgegeben.</p>

<table>
  {{#each order.items}}
  <tr>
    <td>{{this.name}}</td>
    <td>{{this.quantity}}x</td>
    <td>{{formatPrice this.total}}</td>
  </tr>
  {{/each}}
</table>

<p><strong>Gesamtsumme: {{formatPrice order.total}}</strong></p>

<p>Lieferadresse:</p>
<address>
  {{shipping.name}}<br>
  {{shipping.street}}<br>
  {{shipping.zip}} {{shipping.city}}<br>
  {{shipping.country}}
</address>
```

---

### Inventory Movements - Lagerbewegungen

```prisma
model InventoryMovement {
  id            String
  workspaceId   String
  productId     String
  
  // === BEWEGUNG ===
  type          InventoryMovementType  // Art der Bewegung
  quantity      Int                    // Menge (positiv oder negativ)
  
  // === KONTEXT ===
  reason        String?                // Freitext-Grund
  reference     String?                // Referenz (z.B. Bestellnr.)
  
  // === BESTAND ===
  previousStock Int                    // Bestand vorher
  newStock      Int                    // Bestand nachher
  
  createdAt     DateTime
}

enum InventoryMovementType {
  PURCHASE      // Einkauf/Wareneingang (+)
  SALE          // Verkauf (-)
  RETURN        // Rückgabe (+)
  ADJUSTMENT    // Inventur-Korrektur (+/-)
  TRANSFER      // Umlagerung (+/-)
  DAMAGED       // Beschädigt/Verlust (-)
  INITIAL       // Anfangsbestand (+)
}
```

**Inventory-Tracking:**

```
┌─────────────────────────────────────────────────────────────────┐
│            Produkt: Nike Air Max 90                              │
│            SKU: NAM90-BLK-42                                     │
│            Aktueller Bestand: 45                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
   MOVEMENT HISTORY           │
   ─────────────────         │
                              │
   ┌───────────────────────────────────────────────────────────┐
   │ 01.06.2024  PURCHASE    +50   0 → 50   "Wareneingang"    │
   │ 05.06.2024  SALE         -2  50 → 48   "Order #1234"     │
   │ 06.06.2024  SALE         -1  48 → 47   "Order #1235"     │
   │ 10.06.2024  RETURN       +1  47 → 48   "Rückgabe #1234"  │
   │ 15.06.2024  ADJUSTMENT   -3  48 → 45   "Inventur"        │
   └───────────────────────────────────────────────────────────┘
```

**Automatische Bestandsführung:**

```typescript
// Bei Order.status = PAID
async function deductInventory(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  
  for (const item of order.items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });
    
    const newStock = product.inventory - item.quantity;
    
    // Bestand aktualisieren
    await prisma.product.update({
      where: { id: item.productId },
      data: { inventory: newStock },
    });
    
    // Bewegung protokollieren
    await prisma.inventoryMovement.create({
      data: {
        workspaceId: order.workspaceId,
        productId: item.productId,
        type: 'SALE',
        quantity: -item.quantity,
        reference: `Order #${order.id}`,
        previousStock: product.inventory,
        newStock: newStock,
      },
    });
    
    // Low-Stock-Warnung prüfen
    if (newStock <= (product.lowStockThreshold ?? 5)) {
      await sendLowStockAlert(product);
    }
  }
}
```

---

### Subscriptions - Abo-System

**Subscription Lifecycle:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    SUBSCRIPTION LIFECYCLE                        │
│                                                                  │
│  ┌──────────┐                                                   │
│  │ Plan:    │                                                   │
│  │ Premium  │                                                   │
│  │ 9,99€/Mo │                                                   │
│  └────┬─────┘                                                   │
│       │ Kunde abonniert                                         │
│       ▼                                                         │
│  ┌──────────┐    30 Tage    ┌──────────┐                       │
│  │ TRIALING │──────────────▶│  ACTIVE  │◀─────────┐            │
│  │          │               │          │          │             │
│  │ 14 Tage  │               │ Bezahlt  │     Bezahlung         │
│  │ Testphase│               │ monatlich│     erfolgreich       │
│  └──────────┘               └────┬─────┘          │             │
│                                  │                │             │
│                    ┌─────────────┼─────────────┐  │             │
│                    │             │             │  │             │
│                    ▼             ▼             ▼  │             │
│              ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│              │  PAUSED  │ │PAST_DUE  │ │CANCELLED │            │
│              │          │ │          │ │          │            │
│              │ Pausiert │ │ Zahlung  │ │ Gekündigt│            │
│              │          │ │ fehlgesch│ │          │            │
│              └──────────┘ └────┬─────┘ └──────────┘            │
│                                │                                │
│                                │ Nach X Tagen                   │
│                                ▼                                │
│                          ┌──────────┐                          │
│                          │ EXPIRED  │                          │
│                          │          │                          │
│                          │Abgelaufen│                          │
│                          └──────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

```prisma
model SubscriptionPlan {
  id          String
  workspaceId String
  
  // === IDENTIFIKATION ===
  name        String        // "Premium", "Pro", "Business"
  slug        String        // "premium"
  description String?       // Beschreibung
  
  // === PREISGESTALTUNG ===
  price       Int           // Cents: 999 = 9,99€
  currency    String        // "EUR"
  interval    SubscriptionInterval  // Abrechnungszyklus
  
  // === TESTPHASE ===
  trialDays   Int           // 14 Tage Test
  
  // === FEATURES ===
  features    Json          // ["Feature 1", "Feature 2", ...]
  
  // === SORTIERUNG ===
  sortOrder   Int
  isActive    Boolean
  
  // === ABONNEMENTS ===
  subscriptions  ShopSubscription[]
}

enum SubscriptionInterval {
  WEEKLY      // Wöchentlich
  MONTHLY     // Monatlich
  QUARTERLY   // Vierteljährlich
  YEARLY      // Jährlich
}

model ShopSubscription {
  id                    String
  workspaceId           String
  planId                String
  
  // === KUNDE ===
  email                 String
  name                  String?
  siteUserId            String?
  
  // === STATUS ===
  status                ShopSubscriptionStatus
  
  // === ZEITRAUM ===
  startedAt             DateTime        // Beginn
  currentPeriodEnd      DateTime?       // Ende der aktuellen Periode
  cancelledAt           DateTime?       // Wann gekündigt
  
  // === STRIPE ===
  stripeSubscriptionId  String?         // sub_xxx
}

enum ShopSubscriptionStatus {
  TRIALING    // In Testphase
  ACTIVE      // Aktiv & bezahlt
  PAUSED      // Pausiert
  CANCELLED   // Gekündigt (läuft noch bis Periodenende)
  EXPIRED     // Komplett abgelaufen
  PAST_DUE    // Zahlung fehlgeschlagen
}
```

---

### Bookings - Terminbuchungen

**Buchungs-System:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    BOOKING CALENDAR                              │
│                                                                  │
│  Mo    Di    Mi    Do    Fr    Sa    So                         │
│  ─────────────────────────────────────────                      │
│  │     │     │     │     │     │     │                          │
│  │09:00│     │10:00│     │     │     │                          │
│  │─────│     │─────│     │     │     │                          │
│  │Max M│     │Lisa │     │     │     │                          │
│  │Berat│     │Style│     │     │     │                          │
│  │─────│     │─────│     │     │     │                          │
│  │     │     │     │     │     │     │                          │
│  │     │14:00│     │15:00│     │     │                          │
│  │     │─────│     │─────│     │     │                          │
│  │     │Tom  │     │Anna │     │     │                          │
│  │     │Haarsc     │Mass.│     │     │                          │
│  └─────┴─────┴─────┴─────┴─────┴─────┴──────                    │
└─────────────────────────────────────────────────────────────────┘
```

```prisma
model Booking {
  id            String
  workspaceId   String
  
  // === KUNDE ===
  customerName  String
  customerEmail String
  customerPhone String?
  siteUserId    String?       // Falls eingeloggt
  
  // === TERMIN ===
  title         String        // "Haarschnitt", "Beratung"
  description   String?       // Details
  startTime     DateTime
  endTime       DateTime
  timezone      String        // "Europe/Berlin"
  isAllDay      Boolean       // Ganztägig?
  
  // === BEZAHLUNG ===
  price         Int?          // Falls kostenpflichtig
  currency      String
  isPaid        Boolean       // Schon bezahlt?
  
  // === STATUS ===
  status        BookingStatus
  
  // === NOTIZEN ===
  notes         String?       // Kundennotizen
  adminNotes    String?       // Interne Notizen
  
  // === ERINNERUNG ===
  reminderSentAt DateTime?    // Wann Erinnerung gesendet
  
  createdAt     DateTime
  updatedAt     DateTime
}

enum BookingStatus {
  PENDING     // Anfrage - wartet auf Bestätigung
  CONFIRMED   // Bestätigt
  CANCELLED   // Storniert
  COMPLETED   // Durchgeführt
  NO_SHOW     // Nicht erschienen
}
```

**Buchungs-Flow:**

```
1. KUNDE BUCHT
   ┌─────────────────┐
   │ Terminauswahl   │────▶ Booking.status = PENDING
   │ 15.06. 14:00    │
   │ Haarschnitt     │
   └─────────────────┘

2. ADMIN BESTÄTIGT (optional)
   ┌─────────────────┐
   │ Bestätigung     │────▶ Booking.status = CONFIRMED
   │ E-Mail an Kunde │      + Bestätigungs-E-Mail
   └─────────────────┘

3. ERINNERUNG
   ┌─────────────────┐
   │ 24h vorher      │────▶ Erinnerungs-E-Mail
   │ automatisch     │      reminderSentAt = now()
   └─────────────────┘

4. NACH TERMIN
   ┌─────────────────┐
   │ Status-Update   │────▶ COMPLETED oder NO_SHOW
   │ durch Admin     │
   └─────────────────┘
```

---

### Claims / Returns - Reklamationen & Rückgaben

```prisma
model Claim {
  id            String
  workspaceId   String
  orderId       String        // Zugehörige Bestellung
  
  // === NUMMERIERUNG ===
  claimNumber   String        // "RK-2024-001"
  
  // === KUNDE ===
  customerName  String
  customerEmail String
  
  // === DETAILS ===
  type          ClaimType     // Art der Reklamation
  reason        String        // Grund des Kunden
  items         Json          // Betroffene Artikel
  
  // === STATUS ===
  status        ClaimStatus
  
  // === LÖSUNG ===
  resolution    String?       // Wie wurde es gelöst?
  refundAmount  Int?          // Falls Erstattung
  
  // === ANHÄNGE ===
  attachments   Json          // Fotos etc.
  
  // === ABSCHLUSS ===
  resolvedAt    DateTime?
  
  createdAt     DateTime
  updatedAt     DateTime
}

enum ClaimType {
  RETURN        // Rückgabe (Widerruf)
  REFUND        // Erstattung
  EXCHANGE      // Umtausch
  WARRANTY      // Garantiefall
  DAMAGE        // Transportschaden
  MISSING_ITEM  // Fehlende Artikel
  WRONG_ITEM    // Falscher Artikel
}

enum ClaimStatus {
  OPEN          // Neu eingegangen
  IN_REVIEW     // Wird geprüft
  APPROVED      // Genehmigt
  REJECTED      // Abgelehnt
  RESOLVED      // Abgeschlossen
  CLOSED        // Archiviert
}
```

**Claim-Workflow:**

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLAIM WORKFLOW                            │
│                                                                  │
│  Kunde                      System                Admin          │
│  ──────                     ──────                ─────          │
│                                                                  │
│  ┌───────────┐                                                  │
│  │ Reklamat. │                                                  │
│  │ einreichen│─────────────▶ OPEN                               │
│  │ + Fotos   │              │                                   │
│  └───────────┘              │                                   │
│                             ▼                                   │
│                         E-Mail ───────────────▶ Benachrichtigung │
│                             │                                   │
│                             │          ┌───────────┐            │
│                             └─────────▶│ IN_REVIEW │            │
│                                        │           │            │
│                                        │ Prüfung   │            │
│                                        └─────┬─────┘            │
│                                              │                   │
│                                    ┌─────────┴─────────┐        │
│                                    │                   │        │
│                                    ▼                   ▼        │
│                              ┌──────────┐        ┌──────────┐   │
│                              │ APPROVED │        │ REJECTED │   │
│                              │          │        │          │   │
│                              │ Lösung:  │        │ Grund:   │   │
│                              │ Erstattg.│        │ Keine    │   │
│                              │ Umtausch │        │ Grundlage│   │
│                              └────┬─────┘        └──────────┘   │
│                                   │                              │
│                                   ▼                              │
│  ┌───────────┐             ┌──────────┐                         │
│  │ Erhält    │◀────────────│ RESOLVED │                         │
│  │ Erstattung│             │          │                         │
│  │ / Umtausch│             │ Abgeschl.│                         │
│  └───────────┘             └──────────┘                         │
└─────────────────────────────────────────────────────────────────┘
```

---

### Invoice Settings - Rechnungseinstellungen

```prisma
model InvoiceSettings {
  id                      String
  workspaceId             String @unique
  
  // === NUMMERNKREISE ===
  invoicePrefix           String    // "RE"
  creditNotePrefix        String    // "GS"
  debitNotePrefix         String    // "LA"
  quotePrefix             String    // "AN"
  nextInvoiceNumber       Int       // Nächste Nummer
  nextCreditNoteNumber    Int
  nextDebitNoteNumber     Int
  nextQuoteNumber         Int
  
  // === FIRMENDATEN ===
  companyName             String?
  companyAddress          String?
  companyVatId            String?   // USt-IdNr.
  companyEmail            String?
  companyPhone            String?
  companyLogo             String?
  companyWebsite          String?
  
  // === BANKVERBINDUNG ===
  bankName                String?
  bankIban                String?
  bankBic                 String?
  bankAccountHolder       String?
  
  // === STEUERN ===
  defaultTaxRate          Float     // Standard-MwSt.
  showTaxBreakdown        Boolean   // MwSt. aufschlüsseln?
  
  // === TEXTE ===
  footerText              String?   // Standard-Fußtext
  headerText              String?   // Kopftext
  termsText               String?   // AGB-Text
  
  // === ZAHLUNGSZIEL ===
  defaultPaymentTermsDays Int       // Standard: 14 Tage
  
  // === FORMATIERUNG ===
  locale                  String    // "de-DE"
  dateFormat              String    // "DD.MM.YYYY"
}
```

---

### Automation Rules - Automatisierung

```prisma
model AutomationRule {
  id            String
  workspaceId   String
  
  // === IDENTIFIKATION ===
  name          String        // "Bestellbestätigung senden"
  description   String?
  
  // === TRIGGER ===
  trigger       AutomationTrigger   // WANN wird ausgelöst?
  triggerConfig Json                // Zusätzliche Bedingungen
  
  // === AKTION ===
  action        AutomationAction    // WAS soll passieren?
  actionConfig  Json                // Aktions-Parameter
  
  // === STATUS ===
  isActive      Boolean
  
  // === STATISTIK ===
  lastRunAt     DateTime?     // Letzte Ausführung
  runCount      Int           // Wie oft ausgeführt
}

enum AutomationTrigger {
  // === BESTELLUNGEN ===
  ORDER_CREATED       // Neue Bestellung
  ORDER_PAID          // Bezahlt
  ORDER_SHIPPED       // Versendet
  ORDER_DELIVERED     // Zugestellt
  ORDER_CANCELLED     // Storniert
  
  // === KUNDEN ===
  CART_ABANDONED      // Warenkorb abgebrochen (1h+)
  NEW_CUSTOMER        // Neuer Kunde
  
  // === FEEDBACK ===
  REVIEW_SUBMITTED    // Neue Bewertung
  
  // === ABONNEMENTS ===
  SUBSCRIPTION_CREATED    // Neues Abo
  SUBSCRIPTION_CANCELLED  // Abo gekündigt
  
  // === FORMULARE ===
  FORM_SUBMITTED      // Formular abgesendet
  
  // === LAGER ===
  LOW_STOCK           // Niedriger Bestand
  
  // === TERMINE ===
  BOOKING_CREATED     // Neue Buchung
  BOOKING_CONFIRMED   // Buchung bestätigt
  
  // === REKLAMATIONEN ===
  CLAIM_CREATED       // Neue Reklamation
}

enum AutomationAction {
  // === KOMMUNIKATION ===
  SEND_EMAIL          // E-Mail senden
  SEND_WEBHOOK        // Webhook aufrufen
  SEND_SLACK          // Slack-Nachricht
  
  // === DATEN ===
  UPDATE_ORDER_STATUS // Bestellstatus ändern
  ADD_TAG             // Tag hinzufügen
  
  // === BENACHRICHTIGUNG ===
  CREATE_TASK         // Aufgabe erstellen
  NOTIFY_ADMIN        // Admin benachrichtigen
}
```

**Automation Beispiel:**

```json
// Regel: "Abandoned Cart E-Mail nach 1 Stunde"
{
  "name": "Abandoned Cart Reminder",
  "trigger": "CART_ABANDONED",
  "triggerConfig": {
    "minAbandonedMinutes": 60,
    "minCartValue": 2000  // Mindestens 20€
  },
  "action": "SEND_EMAIL",
  "actionConfig": {
    "templateType": "ABANDONED_CART",
    "sendAfterMinutes": 60
  }
}

// Regel: "Low Stock Alert"
{
  "name": "Low Stock Notification",
  "trigger": "LOW_STOCK",
  "triggerConfig": {
    "threshold": 5  // Unter 5 Stück
  },
  "action": "NOTIFY_ADMIN",
  "actionConfig": {
    "notifyEmails": ["lager@shop.de"],
    "includeProductDetails": true
  }
}
```

---

---

## 🔌 API-ROUTEN

### Architektur-Übersicht

**Wie API-Routen in Next.js 14 funktionieren:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    apps/web/src/app/api/                         │
│                                                                  │
│  DATEI-BASIERTES ROUTING:                                       │
│                                                                  │
│  /workspaces/[workspaceId]/products/route.ts                    │
│       │            │           │       │                        │
│       │            │           │       └── HTTP Handler          │
│       │            │           └── Endpoint                      │
│       │            └── Dynamischer Parameter                     │
│       └── Basis-Pfad                                            │
│                                                                  │
│  → GET /api/workspaces/abc123/products                          │
└─────────────────────────────────────────────────────────────────┘
```

**Standard API-Route Struktur:**

```typescript
// apps/web/src/app/api/workspaces/[workspaceId]/products/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { requireWorkspacePermission } from '@/lib/permissions';
import { ProductCreateSchema } from '@builderly/sdk';

// GET /api/workspaces/:id/products
export async function GET(
  req: Request,
  { params }: { params: { workspaceId: string } }
) {
  try {
    // 1. Session prüfen
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // 2. Workspace-Berechtigung prüfen
    await requireWorkspacePermission(
      session.user.id,
      params.workspaceId,
      ['OWNER', 'ADMIN', 'EDITOR', 'VIEWER']  // Welche Rollen dürfen?
    );
    
    // 3. Daten holen
    const products = await prisma.product.findMany({
      where: { workspaceId: params.workspaceId },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/workspaces/:id/products
export async function POST(
  req: Request,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Nur OWNER, ADMIN, EDITOR dürfen erstellen
    await requireWorkspacePermission(
      session.user.id,
      params.workspaceId,
      ['OWNER', 'ADMIN', 'EDITOR']  // VIEWER kann nicht erstellen!
    );
    
    // Body validieren mit Zod
    const body = await req.json();
    const validated = ProductCreateSchema.parse(body);
    
    // Produkt erstellen
    const product = await prisma.product.create({
      data: {
        ...validated,
        workspaceId: params.workspaceId,
      },
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation Error', details: error.errors },
        { status: 400 }
      );
    }
    // ...
  }
}
```

### Permission-System

```typescript
// apps/web/src/lib/permissions.ts

export async function requireWorkspacePermission(
  userId: string,
  workspaceId: string,
  allowedRoles: Role[]
): Promise<WorkspaceMember> {
  const member = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: { workspaceId, userId },
    },
  });
  
  if (!member) {
    throw new ApiError('Not a member of this workspace', 403);
  }
  
  if (!allowedRoles.includes(member.role)) {
    throw new ApiError('Insufficient permissions', 403);
  }
  
  return member;
}

// Berechtigungs-Matrix:
//
// Aktion              OWNER  ADMIN  EDITOR  VIEWER
// ──────────────────────────────────────────────────
// Workspace löschen   ✓      ✗      ✗       ✗
// Mitglieder verwalten ✓     ✓      ✗       ✗
// Pages erstellen     ✓      ✓      ✓       ✗
// Pages bearbeiten    ✓      ✓      ✓       ✗
// Pages ansehen       ✓      ✓      ✓       ✓
// Produkte verwalten  ✓      ✓      ✓       ✗
// Bestellungen sehen  ✓      ✓      ✓       ✓
// Settings ändern     ✓      ✓      ✗       ✗
```

### Vollständige Route-Tabelle

**Basis-Pfad:** `apps/web/src/app/api/`

#### Public Routes (Ohne Auth)

| Route | Methode | Beschreibung | Body |
|-------|---------|--------------|------|
| `/auth/[...nextauth]` | * | NextAuth.js Handler | - |
| `/public/forms/[formId]/submit` | POST | Formular absenden | `{ data: {...} }` |

#### User Routes

| Route | Methode | Beschreibung | Body/Response |
|-------|---------|--------------|---------------|
| `/user` | GET | Aktueller User | `→ User` |
| `/user` | PUT | User aktualisieren | `{ name, image }` |
| `/user/password` | PUT | Passwort ändern | `{ currentPassword, newPassword }` |

#### Templates Routes

| Route | Methode | Beschreibung | Response |
|-------|---------|--------------|----------|
| `/templates` | GET | Alle Templates | `Template[]` |
| `/templates/[id]` | GET | Template Details | `Template` |

#### Webhook Routes

| Route | Methode | Beschreibung | Notes |
|-------|---------|--------------|-------|
| `/webhooks/stripe` | POST | Stripe Webhooks | Signatur-Verifizierung |

---

#### Workspace Routes (Auth required)

**Basis:** `/api/workspaces/[workspaceId]/`

##### Core CRUD

| Route | Methode | Beschreibung | Rollen |
|-------|---------|--------------|--------|
| `/workspaces` | GET | Liste Workspaces | (eigene) |
| `/workspaces` | POST | Workspace erstellen | (alle) |
| `/workspaces/[id]` | GET | Workspace Details | OWNER, ADMIN, EDITOR, VIEWER |
| `/workspaces/[id]` | PUT | Workspace update | OWNER, ADMIN |
| `/workspaces/[id]` | DELETE | Workspace löschen | OWNER |

##### Pages (Content)

| Route | Methode | Beschreibung | Rollen |
|-------|---------|--------------|--------|
| `/pages` | GET | Alle Seiten | alle |
| `/pages` | POST | Seite erstellen | OWNER, ADMIN, EDITOR |
| `/pages/[id]` | GET | Seite abrufen | alle |
| `/pages/[id]` | PUT | Seite speichern | OWNER, ADMIN, EDITOR |
| `/pages/[id]` | DELETE | Seite löschen | OWNER, ADMIN |
| `/pages/[id]/duplicate` | POST | Seite duplizieren | OWNER, ADMIN, EDITOR |
| `/pages/[id]/publish` | POST | Seite veröffentlichen | OWNER, ADMIN |
| `/pages/[id]/revisions` | GET | Revisionshistorie | alle |

##### Products (E-Commerce)

| Route | Methode | Beschreibung | Rollen |
|-------|---------|--------------|--------|
| `/products` | GET | Alle Produkte | alle |
| `/products` | POST | Produkt erstellen | OWNER, ADMIN, EDITOR |
| `/products/[id]` | GET | Produkt abrufen | alle |
| `/products/[id]` | PUT | Produkt update | OWNER, ADMIN, EDITOR |
| `/products/[id]` | DELETE | Produkt löschen | OWNER, ADMIN |
| `/products/[id]/inventory` | PUT | Bestand ändern | OWNER, ADMIN, EDITOR |

##### Orders

| Route | Methode | Beschreibung | Rollen |
|-------|---------|--------------|--------|
| `/orders` | GET | Alle Bestellungen | alle |
| `/orders` | POST | Bestellung anlegen | (intern/checkout) |
| `/orders/[id]` | GET | Bestellung abrufen | alle |
| `/orders/[id]` | PUT | Status ändern | OWNER, ADMIN |
| `/orders/[id]/refund` | POST | Erstattung | OWNER, ADMIN |

##### (Weitere Routes siehe vollständige Tabelle oben)

### Beispiel: Page Publish API

```typescript
// apps/web/src/app/api/workspaces/[workspaceId]/pages/[pageId]/publish/route.ts

export async function POST(
  req: Request,
  { params }: { params: { workspaceId: string; pageId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Nur OWNER und ADMIN dürfen publishen
  await requireWorkspacePermission(
    session.user.id,
    params.workspaceId,
    ['OWNER', 'ADMIN']
  );
  
  const { comment } = await req.json();
  
  // Transaction: Alles oder nichts
  const result = await prisma.$transaction(async (tx) => {
    // 1. Aktuelle Page holen
    const page = await tx.page.findUnique({
      where: { id: params.pageId },
    });
    
    if (!page) throw new Error('Page not found');
    
    // 2. Höchste Versionsnummer finden
    const lastRevision = await tx.pageRevision.findFirst({
      where: { pageId: params.pageId },
      orderBy: { version: 'desc' },
    });
    
    // 3. Neue Revision erstellen
    const revision = await tx.pageRevision.create({
      data: {
        pageId: params.pageId,
        builderTree: page.builderTree,  // Snapshot!
        version: (lastRevision?.version ?? 0) + 1,
        comment: comment ?? `Version ${(lastRevision?.version ?? 0) + 1}`,
        createdById: session.user.id,
      },
    });
    
    // 4. Page auf neue Revision zeigen lassen
    await tx.page.update({
      where: { id: params.pageId },
      data: {
        publishedRevisionId: revision.id,
        isDraft: false,
      },
    });
    
    return revision;
  });
  
  return NextResponse.json({
    success: true,
    version: result.version,
    revisionId: result.id,
  });
}
```

---

## 🧩 KOMPONENTEN-REGISTRY

### Das Registry-System verstehen

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT REGISTRY                            │
│                                                                  │
│  ┌─────────────────┐                                            │
│  │ ComponentDef 1  │ → { type: 'Button', category: 'ui', ... }  │
│  ├─────────────────┤                                            │
│  │ ComponentDef 2  │ → { type: 'Heading', category: 'content' } │
│  ├─────────────────┤                                            │
│  │ ComponentDef 3  │ → { type: 'Grid', category: 'layout', ... }│
│  ├─────────────────┤                                            │
│  │ ...             │                                            │
│  │ 75+ Components  │                                            │
│  └─────────────────┘                                            │
│                                                                  │
│  VERWENDUNG:                                                     │
│                                                                  │
│  1. Editor Palette:                                              │
│     componentRegistry.getByCategory('ui')                        │
│     → [Button, Input, Checkbox, ...]                            │
│                                                                  │
│  2. Inspector Props:                                             │
│     componentRegistry.get('Button').propSchema                   │
│     → z.object({ text: z.string(), variant: z.enum([...]) })    │
│                                                                  │
│  3. Canvas Rendering:                                            │
│     componentRegistry.get(node.type).defaultProps                │
│     → Für fehlende Props                                        │
└─────────────────────────────────────────────────────────────────┘
```

### Kategorien

| Kategorie | Beschreibung | Anzahl |
|-----------|--------------|--------|
| **layout** | Layout-Komponenten | 14 |
| **content** | Inhalt-Komponenten | 12 |
| **ui** | UI-Elemente | 10 |
| **forms** | Formular-Elemente | 6 |
| **navigation** | Navigation | 5 |
| **media** | Medien | 2 |
| **data** | Daten-Komponenten | 4 |
| **gates** | Bedingte Anzeige | 1 |
| **auth** | Auth-Komponenten | 8 |
| **commerce** | Shop-Komponenten | 18 |
| **advanced** | Erweitert | 1 |

### Layout-Komponenten

| Typ | Display Name | Props |
|-----|-------------|-------|
| `Section` | Bereich | fullWidth, minHeight, verticalAlign, backgroundImage, backgroundSize, backgroundPosition, backgroundRepeat, backgroundOverlay, backgroundOverlayOpacity |
| `Container` | Container | maxWidth, centered, minHeight |
| `Stack` | Stapel | direction, gap, align, justify, wrap, reverse |
| `Grid` | Raster | columns, gap, columnsMobile, columnsTablet, rowGap, alignItems |
| `Divider` | Trennlinie | orientation |
| `Spacer` | Abstand | size |
| `Accordion` | Akkordeon | type, collapsible |
| `AccordionItem` | Akkordeon-Element | title, value |
| `Tabs` | Tabs | defaultValue |
| `Tab` | Tab | label, value |
| `Carousel` | Karussell | autoplay, interval, showArrows, showDots |
| `Timeline` | Zeitleiste | variant |
| `TimelineItem` | Zeitleisten-Eintrag | date, title, icon |
| `CTA` | Handlungsaufruf | variant |

### Content-Komponenten

| Typ | Display Name | Props |
|-----|-------------|-------|
| `Text` | Text | text |
| `Heading` | Überschrift | level, text |
| `Image` | Bild | src, alt, objectFit, width, height |
| `Icon` | Symbol | name, size |
| `Avatar` | Profilbild | src, fallback, size |
| `Progress` | Fortschrittsbalken | value, max, showLabel |
| `Rating` | Bewertung | value, max, size, color |
| `Counter` | Zähler | value, prefix, suffix, duration |
| `Quote` | Zitat | text, author, role |
| `CodeBlock` | Code-Block | code, language, showLineNumbers |
| `Countdown` | Countdown | targetDate, showDays, showHours, showMinutes, showSeconds |
| `Marquee` | Lauftext | speed, pauseOnHover, direction |

### UI-Komponenten

| Typ | Display Name | Props |
|-----|-------------|-------|
| `Button` | Button | text, variant, size, disabled, fullWidth, icon, iconPosition |
| `Card` | Karte | title, description, image, imagePosition |
| `Badge` | Abzeichen | text, variant |
| `Alert` | Hinweis | title, description, variant, dismissible |
| `PricingCard` | Preis-Karte | title, price, currency, period, featured, description |
| `FeatureCard` | Feature-Karte | icon, title, description |
| `TestimonialCard` | Kundenstimme | quote, author, role, avatar, rating |
| `TeamMember` | Teammitglied | name, role, image, bio, linkedin, twitter |
| `LogoCloud` | Logo-Sammlung | columns, grayscale |
| `SearchBox` | Suchfeld | placeholder, variant, size, searchType, showIcon, showButton, buttonText, instantSearch, minChars, resultsLimit |

### Form-Komponenten

| Typ | Display Name | Props |
|-----|-------------|-------|
| `Form` | Formular | collection, successMessage, redirectTo |
| `Input` | Eingabefeld | name, label, type, placeholder, required, disabled, helpText |
| `Textarea` | Textbereich | name, label, placeholder, rows, required, disabled |
| `Select` | Auswahl | name, label, options, placeholder, required, disabled |
| `Checkbox` | Kontrollkästchen | name, label, required, disabled |
| `SubmitButton` | Absenden Button | text, variant, fullWidth, loadingText |

### Navigation-Komponenten

| Typ | Display Name | Props |
|-----|-------------|-------|
| `Navbar` | Navigationsleiste | logo, logoText, sticky |
| `Footer` | Fußzeile | showPoweredBy, copyrightText |
| `Link` | Link | text, href, target, underline |
| `SocialLinks` | Social Media Links | facebook, instagram, twitter, linkedin, youtube, tiktok, size |
| `Breadcrumb` | Navigationspfad | separator, items |

### Media-Komponenten

| Typ | Display Name | Props |
|-----|-------------|-------|
| `Video` | Video | src, aspectRatio, autoplay, controls, loop, muted |
| `Map` | Karte | address, zoom, height |

### Data-Komponenten

| Typ | Display Name | Props |
|-----|-------------|-------|
| `CollectionList` | Sammlungs-Liste | collection, limit, orderBy, orderDirection, emptyText |
| `RecordFieldText` | Datensatz-Feld | field, fallback |
| `Pagination` | Seitennavigation | pageSize, showPageNumbers, maxPageButtons |
| `Table` | Tabelle | striped, hoverable, bordered |

### Auth-Komponenten

| Typ | Display Name | Props |
|-----|-------------|-------|
| `LoginForm` | Anmeldeformular | title, subtitle, showRemember, showForgotPassword, showRegisterLink, registerUrl, forgotPasswordUrl, redirectAfterLogin, buttonText, variant, showSocialLogin, emailLabel, passwordLabel, successMessage, errorMessage |
| `RegisterForm` | Registrierungsformular | title, subtitle, showName, showLoginLink, loginUrl, redirectAfterRegister, buttonText, variant, requireEmailVerification, showTerms, termsUrl, privacyUrl, nameLabel, emailLabel, passwordLabel, confirmPasswordLabel, showPasswordStrength, minPasswordLength, successMessage, errorMessage |
| `PasswordResetForm` | Passwort zurücksetzen | title, subtitle, buttonText, variant, loginUrl, showLoginLink, emailLabel, successMessage, errorMessage |
| `UserProfile` | Benutzerprofil | variant, showAvatar, showName, showEmail, showBio, editable, showChangePassword, showDeleteAccount, title, saveButtonText, avatarSize, showJoinDate, showRole |
| `UserAvatar` | Benutzer-Avatar | size, showName, showRole, fallbackIcon, namePosition, showDropdown, profileUrl, logoutRedirect, showLoginButton, loginUrl, loginButtonText |
| `LogoutButton` | Abmelde-Button | text, variant, size, redirectTo, confirmLogout, confirmMessage, icon, showIcon, fullWidth |
| `MemberList` | Mitglieder-Liste | layout, columns, columnsMobile, showAvatar, showName, showRole, showBio, showJoinDate, pageSize, showSearch, filterByRole, title, showPagination, avatarSize, linkToProfile, profileUrlPattern |
| `ProtectedContent` | Geschützter Inhalt | requiredRole, showFallback, fallbackMessage, showLoginButton, loginUrl, loginButtonText, hideCompletely |

### Commerce/Shop-Komponenten

| Typ | Display Name | Props |
|-----|-------------|-------|
| `ProductList` | Produktliste | layout, columns, limit, sortBy, sortOrder, categoryFilter |
| `ProductCard` | Produktkarte | showPrice, showAddToCart, showDescription, showBadge, imageAspect, productName, productPrice, productComparePrice, productImage, productDescription, productBadge, productSlug, productId |
| `ProductDetail` | Produktdetail | showGallery, showDescription, showSku, showInventory, showAddToCart, showTax, productName, productPrice, productComparePrice, productDescription, productImages, productSku, productInventory, productId |
| `AddToCartButton` | Warenkorb-Button | text, variant, fullWidth, productId |
| `CartSummary` | Warenkorb-Zusammenfassung | showTax, showShipping, showCheckoutButton, checkoutUrl |
| `CartItems` | Warenkorb-Artikel | showQuantityControls, showRemoveButton, showImage |
| `CheckoutButton` | Kasse-Button | text, variant, fullWidth |
| `PriceDisplay` | Preisanzeige | showCurrency, showOriginalPrice, size, price, comparePrice, currency, productId |
| `WishlistButton` | Wunschliste-Button | variant, showCount, addText, removeText, productId, size |
| `WishlistDisplay` | Wunschliste-Anzeige | layout, columns, showRemoveButton, showAddToCart, emptyText |
| `ProductReviews` | Produktbewertungen | showSummary, showWriteReview, showAvatar, sortBy, limit, productId, emptyText, writeReviewText |
| `ReviewForm` | Bewertungsformular | showRating, showTitle, showContent, showImages, submitText, titlePlaceholder, contentPlaceholder, successMessage, productId, requirePurchase |
| `CategoryFilter` | Kategorie-Filter | layout, showCount, showAllOption, allText, showIcons, collapsible, multiSelect |
| `CheckoutForm` | Checkout-Formular | showBillingAddress, showShippingAddress, showPaymentMethods, showOrderSummary, showCouponField, showTermsCheckbox, submitText, termsText, termsLinkUrl, successRedirect, guestCheckout |
| `AddressForm` | Adressformular | type, showCompanyField, showPhoneField, countries, defaultCountry, required |
| `ProductVariantSelector` | Varianten-Auswahl | layout, showLabel, showStock, showPrice, outOfStockBehavior, optionType, productId |
| `ColorSwatch` | Farbauswahl | size, shape, showLabel, showSelected, colors, productId |
| `SizeSelector` | Größenauswahl | layout, showSizeGuide, sizeGuideText, sizeGuideUrl, showStock, sizes, productId |
| `StockIndicator` | Lagerbestand-Anzeige | showExactCount, lowStockThreshold, inStockText, lowStockText, outOfStockText, showIcon, productId |
| `SearchResults` | Suchergebnisse | layout, columns, showNoResults, noResultsText, showFilters, showSortOptions, showPagination, pageSize |
| `CookieBanner` | Cookie-Banner | position, variant, title, description, acceptAllText, acceptNecessaryText, settingsText, privacyLinkText, privacyLinkUrl, showCategories, categories |

### Advanced-Komponenten

| Typ | Display Name | Props |
|-----|-------------|-------|
| `AuthGate` | Anmeldesperre | showWhen, redirectTo |
| `SymbolInstance` | Komponente | symbolId, isDetached, overrides |

---

## ⚡ AKTIONEN & EVENTS

### Was sind Actions?

Actions definieren, **was passiert**, wenn ein Benutzer mit einer Komponente interagiert.

```
┌─────────────────────────────────────────────────────────────────┐
│                      ACTION SYSTEM                               │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     BUTTON                               │    │
│  │                                                          │    │
│  │  actions: [                                              │    │
│  │    {                                                     │    │
│  │      event: "onClick",     ← WANN wird getriggert?      │    │
│  │      action: {                                           │    │
│  │        type: "navigate",   ← WAS soll passieren?        │    │
│  │        to: "/shop"          ← WOHIN?                    │    │
│  │      }                                                   │    │
│  │    }                                                     │    │
│  │  ]                                                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                     Benutzer klickt                              │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   ACTION HANDLER                         │    │
│  │                                                          │    │
│  │  switch (action.type) {                                  │    │
│  │    case 'navigate':                                      │    │
│  │      router.push(action.to);                            │    │
│  │      break;                                              │    │
│  │    case 'addToCart':                                     │    │
│  │      cart.addItem(action.productId, action.quantity);   │    │
│  │      break;                                              │    │
│  │    // ...                                                │    │
│  │  }                                                       │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Action Types (alle mit Erklärung)

#### Navigation Actions

| Action Type | Parameter | Beschreibung |
|-------------|-----------|--------------|
| `navigate` | `to: string, target?: '_blank'` | URL öffnen (intern oder extern) |
| `navigatePage` | `pageSlug: string` | Zu einer Page des Workspaces navigieren |
| `scrollTo` | `targetId: string, behavior?: 'smooth'` | Zu Element mit ID scrollen |

**Beispiel:**
```json
{
  "event": "onClick",
  "action": {
    "type": "navigate",
    "to": "https://example.com",
    "target": "_blank"
  }
}
```

#### Modal Actions

| Action Type | Parameter | Beschreibung |
|-------------|-----------|--------------|
| `openModal` | `modalId: string` | Modal mit ID öffnen |
| `closeModal` | `modalId?: string` | Modal schließen (aktiv oder mit ID) |

**Beispiel:**
```json
{
  "event": "onClick",
  "action": {
    "type": "openModal",
    "modalId": "contact-modal"
  }
}
```

#### Form Actions

| Action Type | Parameter | Beschreibung |
|-------------|-----------|--------------|
| `submitForm` | `collection, redirectTo, successMessage, errorMessage` | Formular an Collection absenden |

**Wie FormSubmit funktioniert:**
```
1. User füllt Form aus
2. Klickt Submit
3. Action { type: 'submitForm', collection: 'contact-requests' }
4. System:
   a) Validiert Felder
   b) Erstellt Record in Collection
   c) Zeigt successMessage
   d) Optional: Redirect zu redirectTo
```

#### Record Actions (CMS)

| Action Type | Parameter | Beschreibung |
|-------------|-----------|--------------|
| `createRecord` | `collection, dataBindingMap, redirectTo` | Neuen Record erstellen |
| `updateRecord` | `collection, recordIdBinding, dataBindingMap, redirectTo` | Record aktualisieren |
| `deleteRecord` | `collection, recordIdBinding, redirectTo, confirmMessage` | Record löschen |

**dataBindingMap erklärt:**
```json
{
  "dataBindingMap": {
    "title": "{{input.title.value}}",
    "content": "{{textarea.content.value}}",
    "author": "{{currentUser.name}}"
  }
}
```

#### E-Commerce Actions

| Action Type | Parameter | Beschreibung |
|-------------|-----------|--------------|
| `addToCart` | `productIdBinding, quantityBinding` | Produkt in Warenkorb |
| `removeFromCart` | `productIdBinding` | Produkt aus Warenkorb entfernen |
| `checkout` | `successUrl, cancelUrl` | Stripe Checkout starten |
| `openCart` | - | Warenkorb-Sidebar öffnen |

**addToCart Binding:**
```json
{
  "event": "onClick",
  "action": {
    "type": "addToCart",
    "productIdBinding": "{{record.id}}",  // Aus CollectionList
    "quantityBinding": "{{input.quantity.value}}"  // Oder "1"
  }
}
```

#### Auth Actions

| Action Type | Parameter | Beschreibung |
|-------------|-----------|--------------|
| `login` | `redirectTo` | Login-Formular Submit |
| `logout` | `redirectTo` | Ausloggen |
| `signup` | `collection, redirectTo` | Registrierung |
| `openAuthModal` | - | Auth-Modal öffnen |

#### UI State Actions

| Action Type | Parameter | Beschreibung |
|-------------|-----------|--------------|
| `setState` | `key, value` | State-Variable setzen |
| `toggleState` | `key` | State-Variable togglen (bool) |
| `toggleClass` | `targetId, className` | CSS-Klasse an Element togglen |
| `setVariable` | `name, value` | Variable setzen |
| `toggleMobileSidebar` | - | Mobile Navigation togglen |

**State-Beispiel:**
```json
// Button toggelt Akkordeon
{
  "event": "onClick",
  "action": {
    "type": "toggleState",
    "key": "accordion-1-open"
  }
}

// Container zeigt/versteckt basierend auf State
{
  "type": "Container",
  "style": {
    "base": {
      "display": "{{state.accordion-1-open ? 'block' : 'none'}}"
    }
  }
}
```

#### Advanced Actions

| Action Type | Parameter | Beschreibung |
|-------------|-----------|--------------|
| `customCode` | `code: string` | JavaScript ausführen (sandboxed) |
| `webhook` | `url, method, dataBindingMap` | HTTP Request senden |

**Webhook-Beispiel:**
```json
{
  "event": "onClick",
  "action": {
    "type": "webhook",
    "url": "https://hooks.zapier.com/...",
    "method": "POST",
    "dataBindingMap": {
      "email": "{{input.email.value}}",
      "action": "newsletter_signup"
    }
  }
}
```

### Event Types (vollständig)

| Event | Wann wird getriggert? | Typische Verwendung |
|-------|----------------------|---------------------|
| `onClick` | Klick auf Element | Buttons, Links, Cards |
| `onDoubleClick` | Doppelklick | Spezialaktionen |
| `onSubmit` | Formular absenden | Form-Element |
| `onLoad` | Element erscheint im DOM | Container, Images |
| `onHover` | Mouse-Over | Tooltips, Previews |
| `onFocus` | Element erhält Fokus | Inputs |
| `onBlur` | Element verliert Fokus | Inputs (Validierung) |
| `onChange` | Wert ändert sich | Inputs, Selects |
| `mouseenter` | Mouse fährt über Element | Hover-Effekte |
| `mouseleave` | Mouse verlässt Element | Hover-Ende |

### Action im Code implementieren

```typescript
// apps/editor/src/components/Canvas/ActionHandler.tsx
function executeAction(action: BuilderAction, context: ActionContext) {
  switch (action.type) {
    case 'navigate':
      if (action.target === '_blank') {
        window.open(action.to, '_blank');
      } else {
        router.push(action.to);
      }
      break;
      
    case 'addToCart':
      const productId = resolveBinding(action.productIdBinding, context);
      const quantity = parseInt(resolveBinding(action.quantityBinding, context)) || 1;
      
      cart.addItem(productId, quantity);
      toast.success('Zum Warenkorb hinzugefügt');
      break;
      
    case 'submitForm':
      const formData = collectFormData(context.formId);
      await fetch(`/api/collections/${action.collection}/records`, {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      
      if (action.redirectTo) {
        router.push(action.redirectTo);
      } else {
        toast.success(action.successMessage || 'Erfolgreich gesendet');
      }
      break;
      
    // ... weitere Actions
  }
}
```

---

## 🎨 STYLE-SYSTEM

### Wie Styles funktionieren

```
┌─────────────────────────────────────────────────────────────────┐
│                     STYLE PIPELINE                               │
│                                                                  │
│  1. NODE DEFINITION                                              │
│  ┌─────────────────────────────────────────────────────┐        │
│  │  {                                                   │        │
│  │    type: 'Container',                               │        │
│  │    style: {                                          │        │
│  │      base: {                                         │        │
│  │        backgroundColor: 'primary',   ← TOKEN        │        │
│  │        padding: 'xl',                 ← TOKEN       │        │
│  │        display: 'flex',               ← DIREKT      │        │
│  │      },                                              │        │
│  │      mobile: {                                       │        │
│  │        padding: 'md',                ← OVERRIDE     │        │
│  │        flexDirection: 'column',                      │        │
│  │      }                                               │        │
│  │    }                                                 │        │
│  │  }                                                   │        │
│  └─────────────────────────────────────────────────────┘        │
│                              │                                   │
│                              ▼                                   │
│  2. STYLE CONVERTER                                              │
│  ┌─────────────────────────────────────────────────────┐        │
│  │  convertToTailwind(style.base) →                    │        │
│  │    "bg-primary p-8 flex"                            │        │
│  │                                                      │        │
│  │  convertToTailwind(style.mobile) →                  │        │
│  │    "max-sm:p-4 max-sm:flex-col"                     │        │
│  └─────────────────────────────────────────────────────┘        │
│                              │                                   │
│                              ▼                                   │
│  3. RENDERED OUTPUT                                              │
│  ┌─────────────────────────────────────────────────────┐        │
│  │  <div class="bg-primary p-8 flex                    │        │
│  │              max-sm:p-4 max-sm:flex-col">           │        │
│  │    ...                                              │        │
│  │  </div>                                              │        │
│  └─────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

### Token-System im Detail

#### Spacing Tokens (mit Kontext)

| Token | Tailwind | Pixel | Verwendung |
|-------|----------|-------|------------|
| `none` | 0 | 0px | Kein Abstand |
| `xs` | 1 | 4px | Minimaler Abstand (Icons) |
| `sm` | 2 | 8px | Kleiner Abstand (Input-Padding) |
| `md` | 4 | 16px | Standard (Button-Padding) |
| `lg` | 6 | 24px | Sektions-Gap |
| `xl` | 8 | 32px | Große Bereiche |
| `2xl` | 12 | 48px | Hero-Padding |
| `3xl` | 16 | 64px | Sektions-Abstände |
| `4xl` | 24 | 96px | Sehr große Abstände |

**Verwendungsbeispiele:**
```typescript
// Button
style: { base: { paddingX: 'md', paddingY: 'sm' } }  // px-4 py-2

// Card
style: { base: { padding: 'lg', gap: 'md' } }  // p-6 gap-4

// Section
style: { base: { paddingY: '3xl' } }  // py-16

// Hero
style: { base: { paddingY: '4xl' }, mobile: { paddingY: '2xl' } }
// py-24 max-sm:py-12
```

#### Color Tokens (Theme-basiert)

| Token | CSS Variable | Typische Verwendung |
|-------|--------------|---------------------|
| `background` | `--background` | Seiten-Hintergrund |
| `foreground` | `--foreground` | Haupttext |
| `primary` | `--primary` | Buttons, Links, CTAs |
| `primary-foreground` | `--primary-foreground` | Text auf Primary |
| `secondary` | `--secondary` | Sekundäre Aktionen |
| `muted` | `--muted` | Gedämpfte Bereiche |
| `accent` | `--accent` | Highlights |
| `destructive` | `--destructive` | Fehler, Löschen |
| `card` | `--card` | Card-Hintergrund |
| `border` | `--border` | Rahmen |

**Wie Themes funktionieren:**
```css
/* In :root definiert (apps/web/src/app/globals.css) */
:root {
  --background: 0 0% 100%;      /* weiß */
  --foreground: 222.2 84% 4.9%;  /* fast-schwarz */
  --primary: 221.2 83.2% 53.3%;  /* blau */
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;  /* fast-schwarz */
  --foreground: 210 40% 98%;     /* fast-weiß */
  --primary: 217.2 91.2% 59.8%;  /* helleres blau */
  /* ... */
}
```

#### Container maxWidth (WICHTIG!)

| Token | Breite | Empfohlene Verwendung |
|-------|--------|----------------------|
| `sm` | 384px | Modale, schmale Formulare |
| `md` | 448px | Formulare |
| `lg` | 512px | Kleine Inhalte |
| `xl` | 576px | ⚠️ ZU SCHMAL für Content! |
| `2xl` | 672px | Blog-Artikel |
| `3xl` | 768px | Mittlere Inhalte |
| `4xl` | 896px | Breite Inhalte |
| `5xl` | 1024px | Standard Content |
| `6xl` | 1152px | Breiter Content |
| `7xl` | 1280px | ✅ EMPFOHLEN für Shops |
| `full` | 100% | Volle Breite |

**Warum 7xl für Shops?**
```
Desktop 1920px:
┌─────────────────────────────────────────────────────────────────┐
│  ← margin →  ┌──────────────────────────────┐  ← margin →      │
│              │     maxWidth: '7xl'          │                   │
│              │     = 1280px Content         │                   │
│              │                              │                   │
│              │  Produkt-Grid 4 Spalten:     │                   │
│              │  ┌────┐ ┌────┐ ┌────┐ ┌────┐│                   │
│              │  │    │ │    │ │    │ │    ││                   │
│              │  └────┘ └────┘ └────┘ └────┘│                   │
│              └──────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘

Mit maxWidth: 'xl' (576px):
┌─────────────────────────────────────────────────────────────────┐
│           ← VIEL margin →  ┌───────┐  ← VIEL margin →          │
│                            │ 576px │  ← ZU SCHMAL!             │
│                            │       │                            │
│                            │ Nur 2 │                            │
│                            │Spalten│                            │
│                            │passen │                            │
│                            └───────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

### Responsive Styles Pattern

```typescript
// Desktop-First mit Mobile-Overrides
const sectionStyle: BuilderStyle = {
  base: {
    // Desktop (Standard)
    padding: '3xl',
    display: 'grid',
    gridColumns: 3,
    gap: 'xl',
  },
  tablet: {
    // Tablet (max-md)
    gridColumns: 2,
    padding: '2xl',
    gap: 'lg',
  },
  mobile: {
    // Mobile (max-sm)
    gridColumns: 1,
    padding: 'lg',
    gap: 'md',
  },
};

// Wird zu:
// "p-16 grid grid-cols-3 gap-8
//  max-md:grid-cols-2 max-md:p-12 max-md:gap-6
//  max-sm:grid-cols-1 max-sm:p-6 max-sm:gap-4"
```

### Style-Konverter (Intern)

```typescript
// packages/core/src/utils/style-converter.ts

export function stylesToTailwind(
  style: BuilderStyle,
  breakpoint: 'desktop' | 'tablet' | 'mobile'
): string {
  const classes: string[] = [];
  
  // Basis-Styles
  if (style.base) {
    classes.push(...convertProperties(style.base, ''));
  }
  
  // Tablet Overrides
  if (style.tablet) {
    classes.push(...convertProperties(style.tablet, 'max-md:'));
  }
  
  // Mobile Overrides
  if (style.mobile) {
    classes.push(...convertProperties(style.mobile, 'max-sm:'));
  }
  
  return classes.join(' ');
}

function convertProperties(props: StyleProperties, prefix: string): string[] {
  const classes: string[] = [];
  
  // Spacing
  if (props.padding) classes.push(`${prefix}p-${spacingMap[props.padding]}`);
  if (props.paddingX) classes.push(`${prefix}px-${spacingMap[props.paddingX]}`);
  if (props.paddingY) classes.push(`${prefix}py-${spacingMap[props.paddingY]}`);
  if (props.margin) classes.push(`${prefix}m-${spacingMap[props.margin]}`);
  if (props.gap) classes.push(`${prefix}gap-${spacingMap[props.gap]}`);
  
  // Layout
  if (props.display) classes.push(`${prefix}${props.display}`);
  if (props.flexDirection) classes.push(`${prefix}flex-${props.flexDirection}`);
  if (props.gridColumns) classes.push(`${prefix}grid-cols-${props.gridColumns}`);
  
  // Colors
  if (props.backgroundColor) {
    if (isColorToken(props.backgroundColor)) {
      classes.push(`${prefix}bg-${props.backgroundColor}`);
    } else {
      // Custom Color → Inline Style
    }
  }
  
  // ... weitere Properties
  
  return classes;
}
```

---

## 🏪 EDITOR-STORE

### Zustand-basierter State

**Warum Zustand?**
- Kein Redux Boilerplate
- React-unabhängig (für Tests)
- Einfaches API
- Devtools-Unterstützung

```
┌─────────────────────────────────────────────────────────────────┐
│                     EDITOR STATE                                 │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   PAGE CONTEXT  │  │    BUILDER      │  │    UI STATE     │ │
│  │                 │  │     TREE        │  │                 │ │
│  │ workspaceId     │  │                 │  │ selectedNodeId  │ │
│  │ pageId          │  │ { root: {...} } │  │ hoveredNodeId   │ │
│  │ pageName        │  │                 │  │ breakpoint      │ │
│  │ workspaceType   │  │ ← IMPORTANT     │  │ zoom            │ │
│  └─────────────────┘  └─────────────────┘  │ isPaletteOpen   │ │
│                                             │ isPreviewMode   │ │
│  ┌─────────────────┐  ┌─────────────────┐  │ isDirty         │ │
│  │    HISTORY      │  │   SITE DATA     │  └─────────────────┘ │
│  │                 │  │                 │                       │
│  │ history[]       │  │ siteName        │                       │
│  │ historyIndex    │  │ siteSettings    │                       │
│  │                 │  │                 │                       │
│  │ → Undo/Redo     │  │ → Header/Footer │                       │
│  └─────────────────┘  └─────────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

### Wichtigste Actions mit Erklärung

#### Tree-Manipulation

```typescript
// Tree initial setzen (keine History)
setTree(tree: BuilderTree)
// Verwendung: Beim ersten Laden der Page
// isDirty bleibt false

// Tree ersetzen (mit History)
replaceTree(tree: BuilderTree)
// Verwendung: Nach User-Änderungen
// isDirty = true, fügt zu History hinzu
```

#### Node-Operationen

```typescript
// Node hinzufügen
addNode(parentId: string, nodeType: string, index?: number)
// 1. Holt Default-Props aus Registry
// 2. Generiert eindeutige ID
// 3. Fügt Node an Position ein
// 4. Selektiert neuen Node
// 5. Fügt zu History hinzu

// Node aktualisieren
updateNode(nodeId: string, updates: Partial<BuilderNode>)
// Merged updates in existierenden Node

// Props separat updaten (häufigster Fall)
updateNodeProps(nodeId: string, props: Record<string, any>)
// Merged nur Props, nicht ganzen Node

// Style updaten
updateNodeStyle(nodeId: string, style: BuilderStyle)
// Merged Style mit existierendem
// Wichtig: base, tablet, mobile werden separat gemerged
```

#### History (Undo/Redo)

```typescript
// Aufbau:
// history = [tree1, tree2, tree3, tree4]
// historyIndex = 3 (aktuell bei tree4)

undo()
// historyIndex--
// tree = history[historyIndex]

redo()
// historyIndex++
// tree = history[historyIndex]

// Wenn User änderung macht nach undo:
// history wird ab historyIndex abgeschnitten
// Neue Version wird angehängt
```

### Store-Definition (vereinfacht)

```typescript
// apps/editor/src/store/editor-store.ts
import { create } from 'zustand';

interface EditorStore extends EditorState {
  // Actions...
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  // Initial State
  tree: { builderVersion: 1, root: null },
  selectedNodeId: null,
  history: [],
  historyIndex: -1,
  isDirty: false,
  
  // Tree setzen (initial load - no history)
  setTree: (tree) => set({ 
    tree, 
    isDirty: false,
    history: [tree],
    historyIndex: 0,
  }),
  
  // Tree ersetzen (user change - with history)
  replaceTree: (tree) => set((state) => {
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(tree);
    
    // Max 50 History-Einträge
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    return {
      tree,
      isDirty: true,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    };
  }),
  
  // Node hinzufügen
  addNode: (parentId, nodeType, index) => {
    const { tree } = get();
    const definition = componentRegistry.get(nodeType);
    
    const newNode: BuilderNode = {
      id: generateNodeId(),
      type: nodeType,
      props: { ...definition.defaultProps },
      children: definition.canHaveChildren ? [] : undefined,
      meta: { name: definition.displayName },
    };
    
    const newTree = insertNodeAt(tree, parentId, newNode, index);
    get().replaceTree(newTree);
    set({ selectedNodeId: newNode.id });
  },
  
  // Undo
  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      return {
        tree: state.history[newIndex],
        historyIndex: newIndex,
        isDirty: true,
      };
    }
    return state;
  }),
  
  // Redo
  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      return {
        tree: state.history[newIndex],
        historyIndex: newIndex,
        isDirty: true,
      };
    }
    return state;
  }),
  
  // Helpers
  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
}));
```

### Store in Komponenten verwenden

```typescript
// In React-Komponente
function Inspector() {
  // Nur die benötigten Werte subscriben
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);
  const updateNodeProps = useEditorStore((s) => s.updateNodeProps);
  
  // Optimiert: Nur selectedNode holen
  const selectedNode = useEditorStore((s) => {
    if (!s.selectedNodeId) return null;
    return findNodeById(s.tree, s.selectedNodeId);
  });
  
  // Props ändern
  const handlePropChange = (propName: string, value: any) => {
    if (selectedNodeId) {
      updateNodeProps(selectedNodeId, { [propName]: value });
    }
  };
  
  return (
    <div>
      {selectedNode && (
        <input
          value={selectedNode.props.text}
          onChange={(e) => handlePropChange('text', e.target.value)}
        />
      )}
    </div>
  );
}
```

---

## 📋 TEMPLATE-SYSTEM

### Style-Tokens

#### Spacing

| Token | Tailwind | Pixel |
|-------|----------|-------|
| `none` | 0 | 0px |
| `xs` | 1 | 4px |
| `sm` | 2 | 8px |
| `md` | 4 | 16px |
| `lg` | 6 | 24px |
| `xl` | 8 | 32px |
| `2xl` | 12 | 48px |
| `3xl` | 16 | 64px |
| `4xl` | 24 | 96px |

#### Colors

| Token | Beschreibung |
|-------|--------------|
| `transparent` | Transparent |
| `background` | Hintergrund |
| `foreground` | Vordergrund |
| `primary` | Primärfarbe |
| `primary-foreground` | Primär-Vordergrund |
| `secondary` | Sekundärfarbe |
| `secondary-foreground` | Sekundär-Vordergrund |
| `muted` | Gedämpft |
| `muted-foreground` | Gedämpft-Vordergrund |
| `accent` | Akzent |
| `accent-foreground` | Akzent-Vordergrund |
| `destructive` | Destruktiv |
| `destructive-foreground` | Destruktiv-Vordergrund |
| `border` | Rahmen |
| `input` | Input |
| `ring` | Ring |
| `card` | Card |
| `card-foreground` | Card-Vordergrund |
| `popover` | Popover |
| `popover-foreground` | Popover-Vordergrund |
| `white` | Weiß |
| `black` | Schwarz |

#### Font Size

| Token | Tailwind | Größe |
|-------|----------|-------|
| `xs` | text-xs | 12px |
| `sm` | text-sm | 14px |
| `base` | text-base | 16px |
| `lg` | text-lg | 18px |
| `xl` | text-xl | 20px |
| `2xl` | text-2xl | 24px |
| `3xl` | text-3xl | 30px |
| `4xl` | text-4xl | 36px |
| `5xl` | text-5xl | 48px |
| `6xl` | text-6xl | 60px |

#### Font Weight

| Token | Wert |
|-------|------|
| `thin` | 100 |
| `light` | 300 |
| `normal` | 400 |
| `medium` | 500 |
| `semibold` | 600 |
| `bold` | 700 |
| `extrabold` | 800 |

#### Border Radius

| Token | Tailwind |
|-------|----------|
| `none` | rounded-none |
| `sm` | rounded-sm |
| `md` | rounded-md |
| `lg` | rounded-lg |
| `xl` | rounded-xl |
| `2xl` | rounded-2xl |
| `full` | rounded-full |

#### Shadow

| Token | Tailwind |
|-------|----------|
| `none` | shadow-none |
| `sm` | shadow-sm |
| `md` | shadow-md |
| `lg` | shadow-lg |
| `xl` | shadow-xl |
| `2xl` | shadow-2xl |

#### Max Width

| Token | Breite |
|-------|--------|
| `sm` | 384px |
| `md` | 448px |
| `lg` | 512px |
| `xl` | 576px |
| `2xl` | 672px |
| `3xl` | 768px |
| `4xl` | 896px |
| `5xl` | 1024px |
| `6xl` | 1152px |
| `7xl` | 1280px |
| `full` | 100% |

### Style Properties Schema

```typescript
interface StyleProperties {
  // Layout
  display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'none';
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  zIndex?: number;
  
  // Sizing
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: MaxWidthToken | string;
  maxHeight?: string;
  
  // Spacing
  padding?: SpacingToken;
  paddingX?: SpacingToken;
  paddingY?: SpacingToken;
  paddingTop?: SpacingToken;
  paddingRight?: SpacingToken;
  paddingBottom?: SpacingToken;
  paddingLeft?: SpacingToken;
  
  margin?: SpacingToken | 'auto';
  marginX?: SpacingToken | 'auto';
  marginY?: SpacingToken | 'auto';
  marginTop?: SpacingToken | 'auto';
  marginRight?: SpacingToken | 'auto';
  marginBottom?: SpacingToken | 'auto';
  marginLeft?: SpacingToken | 'auto';
  
  gap?: SpacingToken;
  gapX?: SpacingToken;
  gapY?: SpacingToken;
  
  // Flexbox
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  flex?: string;
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  
  // Grid
  gridColumns?: number;
  gridRows?: number;
  gridColumn?: string;
  gridRow?: string;
  
  // Typography
  fontSize?: FontSizeToken | string;
  fontWeight?: FontWeightToken;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: string;
  letterSpacing?: string;
  textDecoration?: string;
  textTransform?: string;
  
  // Colors
  color?: ColorToken | string;
  backgroundColor?: ColorToken | string;
  
  // Borders
  borderRadius?: BorderRadiusToken;
  borderWidth?: string;
  borderColor?: ColorToken | string;
  borderStyle?: string;
  border?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  
  // Effects
  boxShadow?: ShadowToken | string;
  opacity?: number;
  cursor?: string;
  
  // Transforms
  transform?: string;
  transition?: string;
  
  // Misc
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  whiteSpace?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}
```

### Responsive Styles

```typescript
interface BuilderStyle {
  base: StyleProperties;      // Desktop (default)
  tablet?: StyleProperties;   // Tablet breakpoint
  mobile?: StyleProperties;   // Mobile breakpoint
}
```

---

## ⚙️ SITE-SETTINGS

### Header Settings

```typescript
interface HeaderSettings {
  enabled: boolean;
  type: 'classic' | 'modern' | 'transparent' | 'minimal' | 'centered' | 'mega';
  layout: 'full-width' | 'contained' | 'boxed';
  height: string;
  position: 'static' | 'sticky' | 'fixed';
  hideOnScroll: boolean;
  shrinkOnScroll: boolean;
  
  logo: {
    position: 'left' | 'center' | 'right';
    maxHeight: string;
    showText: boolean;
    text: string;
    textStyle: 'normal' | 'bold' | 'italic';
  };
  
  navigation: {
    position: 'left' | 'center' | 'right';
    style: 'horizontal' | 'minimal' | 'underline' | 'pills' | 'bordered';
    spacing: 'compact' | 'normal' | 'wide';
    dropdownStyle: 'simple' | 'mega' | 'cards';
  };
  
  cta: {
    enabled: boolean;
    text: string;
    url: string;
    style: 'primary' | 'secondary' | 'outline' | 'ghost';
    icon?: string;
  };
  
  search: {
    enabled: boolean;
    position: 'nav' | 'cta-area' | 'fullscreen';
    placeholder: string;
  };
  
  mobile: {
    breakpoint: 'sm' | 'md' | 'lg';
    style: 'slide-left' | 'slide-right' | 'slide-down' | 'fullscreen' | 'overlay';
    showLogo: boolean;
    showCta: boolean;
  };
  
  style: {
    backgroundColor: string;
    backgroundOpacity: number;
    backdropBlur: boolean;
    textColor: string;
    borderBottom: boolean;
    borderColor: string;
    shadow: 'none' | 'sm' | 'md' | 'lg';
  };
  
  topbar: {
    enabled: boolean;
    text: string;
    backgroundColor: string;
    textColor: string;
    showSocialLinks: boolean;
    showContactInfo: boolean;
    dismissible: boolean;
  };
}
```

### Footer Settings

```typescript
interface FooterSettings {
  enabled: boolean;
  type: 'simple' | 'multi-column' | 'mega' | 'minimal' | 'centered';
  layout: 'full-width' | 'contained' | 'boxed';
  columns: number;
  
  sections: {
    about: {
      enabled: boolean;
      title: string;
      text: string;
      showLogo: boolean;
    };
    
    links: Array<{
      title: string;
      items: Array<{
        label: string;
        url: string;
        newTab: boolean;
      }>;
    }>;
    
    newsletter: {
      enabled: boolean;
      title: string;
      text: string;
      placeholder: string;
      buttonText: string;
      successMessage: string;
    };
    
    contact: {
      enabled: boolean;
      title: string;
      showEmail: boolean;
      showPhone: boolean;
      showAddress: boolean;
      showSocialLinks: boolean;
    };
  };
  
  bottomBar: {
    enabled: boolean;
    showCopyright: boolean;
    copyrightText: string;
    showPaymentIcons: boolean;
    showSocialLinks: boolean;
  };
  
  style: {
    backgroundColor: string;
    textColor: string;
    linkColor: string;
    borderTop: boolean;
    borderColor: string;
  };
}
```

---

## 🏪 EDITOR-STORE

### State

```typescript
interface EditorState {
  // Page Context
  workspaceId: string | null;
  pageId: string | null;
  pageName: string;
  workspaceType: WorkspaceType;
  
  // Site Data
  siteName: string;
  siteSettings: SiteSettings;
  
  // Builder Tree
  tree: BuilderTree;
  
  // Selection
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  
  // Viewport
  breakpoint: 'desktop' | 'tablet' | 'mobile';
  zoom: number;  // 25-200%
  
  // History
  history: BuilderTree[];
  historyIndex: number;
  
  // UI State
  isPaletteOpen: boolean;
  isInspectorOpen: boolean;
  isLayerPanelOpen: boolean;
  isLeftSidebarOpen: boolean;
  isSiteSettingsOpen: boolean;
  isPreviewMode: boolean;
  isMobileSidebarOpen: boolean;
  isSaving: boolean;
  isDirty: boolean;
  lastSaved: Date | null;
  isLoadingPage: boolean;
  
  // Products (für Canvas)
  workspaceProducts: WorkspaceProduct[];
  isLoadingProducts: boolean;
}
```

### Actions

| Action | Parameter | Beschreibung |
|--------|-----------|--------------|
| **Context** | | |
| `setPageContext` | workspaceId, pageId | Page-Kontext setzen |
| `setWorkspaceType` | type | Workspace-Typ setzen |
| `setTree` | tree | Tree setzen (initial load) |
| `replaceTree` | tree | Tree ersetzen (mit History) |
| `setPageName` | name | Seitenname setzen |
| **Site Data** | | |
| `setSiteData` | name, settings | Site-Daten setzen |
| `updateSiteSettings` | settings | Settings aktualisieren |
| `toggleSiteSettings` | - | Settings-Panel togglen |
| **Selection** | | |
| `selectNode` | nodeId | Node auswählen |
| `hoverNode` | nodeId | Node hovern |
| **Node Operations** | | |
| `addNode` | parentId, nodeType, index? | Node hinzufügen |
| `updateNode` | nodeId, updates | Node aktualisieren |
| `updateNodeProps` | nodeId, props | Props aktualisieren |
| `updateNodeStyle` | nodeId, style | Style aktualisieren |
| `updateNodeActions` | nodeId, actions | Actions aktualisieren |
| `updateNodeAnimation` | nodeId, animation | Animation aktualisieren |
| `deleteNode` | nodeId | Node löschen |
| `duplicateNode` | nodeId | Node duplizieren |
| `insertNodeTree` | parentId, node, index? | Node-Tree einfügen |
| `replaceNodeType` | nodeId, newType | Node-Typ ändern |
| `moveNode` | nodeId, newParentId, newIndex | Node verschieben |
| **Viewport** | | |
| `setBreakpoint` | breakpoint | Breakpoint setzen |
| `setZoom` | zoom | Zoom setzen |
| **UI Toggles** | | |
| `togglePalette` | - | Palette togglen |
| `toggleInspector` | - | Inspector togglen |
| `toggleLayerPanel` | - | Layer-Panel togglen |
| `toggleLeftSidebar` | - | Sidebar togglen |
| `toggleMobileSidebar` | - | Mobile Sidebar togglen |
| `setMobileSidebarOpen` | isOpen | Mobile Sidebar setzen |
| `setPreviewMode` | isPreview | Preview-Modus |
| **History** | | |
| `undo` | - | Rückgängig |
| `redo` | - | Wiederholen |
| `canUndo` | - | Kann rückgängig? |
| `canRedo` | - | Kann wiederholen? |
| **Persistence** | | |
| `setSaving` | isSaving | Speichernd setzen |
| `setDirty` | isDirty | Dirty setzen |
| `setLastSaved` | date | Zuletzt gespeichert |
| **Page Navigation** | | |
| `loadPage` | workspaceId, pageId | Seite laden |
| **Products** | | |
| `fetchWorkspaceProducts` | - | Produkte laden |

---

## 📋 TEMPLATE-SYSTEM

### Was sind Templates?

Templates sind vorgefertigte Strukturen (JSON), die Benutzer per Klick in ihre Seite einfügen können.

```
┌─────────────────────────────────────────────────────────────────┐
│                     TEMPLATE SYSTEM                              │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   SECTION TEMPLATES                      │    │
│  │                                                          │    │
│  │  Einzelne Bereiche, die eingefügt werden können:         │    │
│  │                                                          │    │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │    │
│  │  │ HERO │ │FEAT- │ │ CTA  │ │TESTI-│ │FOOTER│         │    │
│  │  │      │ │URES  │ │      │ │MONIAL│ │      │         │    │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    PAGE TEMPLATES                        │    │
│  │                                                          │    │
│  │  Komplette Seiten mit mehreren Sections:                 │    │
│  │                                                          │    │
│  │  ┌───────────────────────────────────────────┐          │    │
│  │  │              HEADER                        │          │    │
│  │  ├───────────────────────────────────────────┤          │    │
│  │  │              HERO                          │          │    │
│  │  ├───────────────────────────────────────────┤          │    │
│  │  │            FEATURES                        │          │    │
│  │  ├───────────────────────────────────────────┤          │    │
│  │  │              CTA                           │          │    │
│  │  ├───────────────────────────────────────────┤          │    │
│  │  │             FOOTER                         │          │    │
│  │  └───────────────────────────────────────────┘          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                 DATABASE TEMPLATES                       │    │
│  │                                                          │    │
│  │  In Prisma gespeichert, per API abrufbar:                │    │
│  │                                                          │    │
│  │  Template Model → /api/templates                         │    │
│  │  → Können per Admin verwaltet werden                     │    │
│  │  → Können isPro (nur für zahlende User) sein             │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Section Templates erstellen

**Pfad:** `packages/core/src/templates/sections/`

```typescript
// packages/core/src/templates/sections/shop-hero.ts

import { BuilderNode } from '../../schemas/node';

export const shopHero: BuilderNode = {
  id: 'shop-hero-section',
  type: 'Section',
  props: {
    minHeight: '70vh',
  },
  style: {
    base: {
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingY: '4xl',
    },
    mobile: {
      paddingY: '2xl',
      minHeight: 'auto',
    },
  },
  meta: { name: 'Shop Hero' },
  children: [
    {
      id: 'shop-hero-container',
      type: 'Container',
      props: { maxWidth: '7xl', centered: true },
      style: {
        base: {
          display: 'grid',
          gridColumns: 2,
          gap: '2xl',
          alignItems: 'center',
        },
        mobile: {
          gridColumns: 1,
          gap: 'xl',
        },
      },
      children: [
        // Linke Seite: Text
        {
          id: 'shop-hero-text',
          type: 'Container',
          style: { base: { display: 'flex', flexDirection: 'column', gap: 'lg' } },
          children: [
            {
              id: 'shop-hero-badge',
              type: 'Badge',
              props: { text: 'Neu eingetroffen', variant: 'primary' },
            },
            {
              id: 'shop-hero-heading',
              type: 'Heading',
              props: { 
                text: 'Die neue Kollektion ist da',
                level: 1,
              },
              style: {
                base: { fontSize: '5xl', fontWeight: 'bold' },
                mobile: { fontSize: '3xl' },
              },
            },
            {
              id: 'shop-hero-subtext',
              type: 'Text',
              props: { 
                text: 'Entdecke unsere neuesten Styles für die Saison.',
              },
              style: {
                base: { fontSize: 'xl', color: 'muted-foreground' },
                mobile: { fontSize: 'lg' },
              },
            },
            {
              id: 'shop-hero-cta',
              type: 'Button',
              props: {
                text: 'Jetzt shoppen',
                variant: 'primary',
                size: 'lg',
              },
              actions: [
                {
                  event: 'onClick',
                  action: { type: 'navigate', to: '/shop' },
                },
              ],
            },
          ],
        },
        // Rechte Seite: Bild
        {
          id: 'shop-hero-image',
          type: 'Image',
          props: {
            src: '/images/hero-product.jpg',
            alt: 'Neue Kollektion',
            objectFit: 'cover',
          },
          style: {
            base: { 
              borderRadius: 'lg',
              width: '100%',
              height: '500px',
            },
            mobile: {
              height: '300px',
            },
          },
        },
      ],
    },
  ],
};
```

### Template in Registry registrieren

```typescript
// packages/core/src/templates/sections/index.ts

import { shopHero } from './shop-hero';
import { shopFeaturedProducts } from './shop-featured-products';
import { shopCategories } from './shop-categories';
// ... weitere imports

export const sectionTemplates = {
  // E-Commerce
  shopHero,
  shopFeaturedProducts,
  shopCategories,
  shopFlashDeals,
  shopPromoGrid,
  shopProductDetail,
  shopCategoryBanner,
  shopBestseller,
  shopHeader,
  
  // Allgemein
  heroSection,
  featuresSection,
  testimonialsSection,
  ctaSection,
  newsletterSection,
  contactSection,
  pricingSection,
  teamSection,
  faqSection,
};

export type SectionTemplateKey = keyof typeof sectionTemplates;
```

### Database Templates (Prisma)

**Scripts in `packages/db/prisma/`:**

```typescript
// packages/db/prisma/add-nexus-template.ts
import { prisma } from '../src';

async function main() {
  // Prüfen ob Template existiert
  const existing = await prisma.template.findUnique({
    where: { slug: 'nexus-dark-shop' },
  });
  
  if (existing) {
    console.log('Template exists, updating...');
    await prisma.template.update({
      where: { slug: 'nexus-dark-shop' },
      data: {
        name: 'NEXUS Dark Shop',
        description: 'Moderner Dark-Theme E-Commerce Shop',
        thumbnail: '/templates/nexus-preview.jpg',
        category: 'FULL_PAGE',
        style: 'modern',
        websiteType: 'shop',
        tags: ['dark', 'modern', 'shop', 'e-commerce'],
        tree: nexusPageTree,  // BuilderTree JSON
        isPro: false,
        isPublished: true,
        isSystem: true,
      },
    });
  } else {
    console.log('Creating new template...');
    await prisma.template.create({
      data: {
        name: 'NEXUS Dark Shop',
        slug: 'nexus-dark-shop',
        // ... rest
      },
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

**Template ausführen:**
```bash
cd packages/db && npx tsx prisma/add-nexus-template.ts
```

### Template im Editor verwenden

```typescript
// apps/editor/src/components/TemplatePanel.tsx

function TemplatePanel() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const insertNodeTree = useEditorStore((s) => s.insertNodeTree);
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);
  
  // Templates laden
  useEffect(() => {
    fetch('/api/templates')
      .then((r) => r.json())
      .then(setTemplates);
  }, []);
  
  // Template einfügen
  const insertTemplate = (template: Template) => {
    // IDs neu generieren (damit keine Duplikate)
    const clonedTree = cloneWithNewIds(template.tree);
    
    // Wo einfügen?
    const parentId = selectedNodeId || 'root';
    
    // Einfügen
    insertNodeTree(parentId, clonedTree);
    
    toast.success(`"${template.name}" eingefügt`);
  };
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => insertTemplate(template)}
          className="p-4 border rounded hover:border-primary"
        >
          <img src={template.thumbnail} alt={template.name} />
          <span>{template.name}</span>
        </button>
      ))}
    </div>
  );
}

// IDs rekursiv neu generieren
function cloneWithNewIds(node: BuilderNode): BuilderNode {
  return {
    ...node,
    id: generateNodeId(),
    children: node.children?.map(cloneWithNewIds),
  };
}
```

---

## 🛒 SHOP-FUNKTIONEN

### Checkout-Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     CHECKOUT FLOW                                │
│                                                                  │
│  1. WARENKORB                                                   │
│  ┌─────────────────────────────────────────────────────┐        │
│  │  ┌─────┐                                            │        │
│  │  │ 🛒  │  Warenkorb (3 Artikel)                     │        │
│  │  └─────┘                                            │        │
│  │                                                      │        │
│  │  ┌────────────────────────────────────────────┐     │        │
│  │  │ Produkt A            2x       39,98€      │     │        │
│  │  │ Produkt B            1x       29,99€      │     │        │
│  │  │ Produkt C            1x       19,99€      │     │        │
│  │  └────────────────────────────────────────────┘     │        │
│  │                                                      │        │
│  │  Zwischensumme:                      89,96€         │        │
│  │  Versand:                             5,99€         │        │
│  │  ─────────────────────────────────────────────      │        │
│  │  Gesamt:                             95,95€         │        │
│  │                                                      │        │
│  │  [ Zur Kasse ]                                       │        │
│  └─────────────────────────────────────────────────────┘        │
│                              │                                   │
│                              ▼                                   │
│  2. CHECKOUT-FORMULAR                                           │
│  ┌─────────────────────────────────────────────────────┐        │
│  │  Kontaktdaten:                                       │        │
│  │  ┌─────────────┐ ┌─────────────┐                    │        │
│  │  │ E-Mail      │ │ Name        │                    │        │
│  │  └─────────────┘ └─────────────┘                    │        │
│  │                                                      │        │
│  │  Lieferadresse:                                      │        │
│  │  ┌─────────────────────────────────────────────┐    │        │
│  │  │ Straße, Hausnummer                          │    │        │
│  │  │ PLZ, Stadt                                   │    │        │
│  │  │ Land                                         │    │        │
│  │  └─────────────────────────────────────────────┘    │        │
│  │                                                      │        │
│  │  Zahlungsart:                                        │        │
│  │  (●) Kreditkarte  ( ) PayPal  ( ) Rechnung          │        │
│  │                                                      │        │
│  │  [ Jetzt kostenpflichtig bestellen ]                 │        │
│  └─────────────────────────────────────────────────────┘        │
│                              │                                   │
│                              ▼                                   │
│  3. STRIPE CHECKOUT (Redirect)                                  │
│  ┌─────────────────────────────────────────────────────┐        │
│  │                                                      │        │
│  │  stripe.com/checkout/...                            │        │
│  │                                                      │        │
│  │  ┌─────────────────────────────────────────────┐    │        │
│  │  │  Kartennummer: ____________                  │    │        │
│  │  │  MM/YY: __/__     CVC: ___                  │    │        │
│  │  │                                              │    │        │
│  │  │  [ Bezahlen ]                                │    │        │
│  │  └─────────────────────────────────────────────┘    │        │
│  │                                                      │        │
│  └─────────────────────────────────────────────────────┘        │
│                              │                                   │
│                              ▼                                   │
│  4. WEBHOOK (Stripe → Server)                                   │
│  ┌─────────────────────────────────────────────────────┐        │
│  │                                                      │        │
│  │  POST /api/webhooks/stripe                          │        │
│  │  { type: "payment_intent.succeeded", ... }          │        │
│  │                                                      │        │
│  │  → Order.status = PAID                              │        │
│  │  → Inventory abziehen                               │        │
│  │  → Bestätigungs-E-Mail senden                       │        │
│  │                                                      │        │
│  └─────────────────────────────────────────────────────┘        │
│                              │                                   │
│                              ▼                                   │
│  5. BESTÄTIGUNG                                                 │
│  ┌─────────────────────────────────────────────────────┐        │
│  │                                                      │        │
│  │  ✓ Vielen Dank für Ihre Bestellung!                 │        │
│  │                                                      │        │
│  │  Bestellnummer: #ORD-2024-1234                      │        │
│  │                                                      │        │
│  │  Sie erhalten eine Bestätigung per E-Mail.          │        │
│  │                                                      │        │
│  │  [ Weiter einkaufen ]                                │        │
│  │                                                      │        │
│  └─────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

### Stripe Integration

```typescript
// apps/web/src/app/api/workspaces/[id]/checkout/route.ts

export async function POST(req: Request) {
  const { items, email, shippingAddress, couponCode } = await req.json();
  
  // 1. Workspace und ShopSettings laden
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: { shopSettings: true },
  });
  
  // 2. Produkte laden und Preise verifizieren
  const products = await prisma.product.findMany({
    where: { id: { in: items.map(i => i.productId) } },
  });
  
  let subtotal = 0;
  const lineItems = items.map((item) => {
    const product = products.find(p => p.id === item.productId);
    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;
    
    return {
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      quantity: item.quantity,
      price: product.price,  // Snapshot!
    };
  });
  
  // 3. Coupon prüfen
  let discount = 0;
  let coupon = null;
  if (couponCode) {
    coupon = await validateCoupon(couponCode, subtotal, workspaceId);
    discount = calculateDiscount(coupon, subtotal);
  }
  
  // 4. Versand berechnen
  const shipping = await calculateShipping(workspaceId, subtotal);
  
  // 5. Steuern berechnen
  const tax = calculateTax(subtotal - discount, workspace.shopSettings);
  
  // 6. Gesamt
  const total = subtotal + tax + shipping - discount;
  
  // 7. Order erstellen (PENDING)
  const order = await prisma.order.create({
    data: {
      workspaceId,
      email,
      status: 'PENDING',
      subtotal,
      tax,
      shipping,
      discount,
      total,
      currency: workspace.shopSettings.currency,
      shippingAddress,
      couponId: coupon?.id,
      items: {
        create: lineItems,
      },
    },
  });
  
  // 8. Stripe Checkout Session erstellen
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems.map((item) => ({
      price_data: {
        currency: workspace.shopSettings.currency.toLowerCase(),
        product_data: {
          name: item.productName,
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
    metadata: {
      orderId: order.id,
      workspaceId,
    },
  });
  
  // 9. PaymentIntent speichern
  await prisma.order.update({
    where: { id: order.id },
    data: { stripePaymentIntentId: session.payment_intent as string },
  });
  
  return NextResponse.json({ sessionUrl: session.url });
}
```

### Webhook Handler

```typescript
// apps/web/src/app/api/webhooks/stripe/route.ts

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;
  
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  
  // Signatur verifizieren
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response('Webhook signature verification failed', { status: 400 });
  }
  
  // Event verarbeiten
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const orderId = session.metadata.orderId;
      
      // Order auf PAID setzen
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PAID' },
      });
      
      // Inventory abziehen
      await deductInventory(orderId);
      
      // Coupon-Counter erhöhen
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { coupon: true },
      });
      
      if (order.couponId) {
        await prisma.coupon.update({
          where: { id: order.couponId },
          data: { usedCount: { increment: 1 } },
        });
      }
      
      // Bestätigungs-E-Mail senden
      await sendOrderConfirmationEmail(orderId);
      
      break;
    }
    
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      // Order auf CANCELLED setzen
      // E-Mail an Kunden
      break;
    }
  }
  
  return new Response('OK');
}
```

### Cart Context (Frontend)

```typescript
// apps/web/src/context/cart-context.tsx

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContext {
  items: CartItem[];
  addItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Aus localStorage laden
  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setItems(JSON.parse(saved));
  }, []);
  
  // In localStorage speichern
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  const addItem = async (productId: string, quantity: number) => {
    // Produkt-Info laden
    const product = await fetch(`/api/runtime/${workspaceSlug}/products/${productId}`)
      .then(r => r.json());
    
    setItems((prev) => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) {
        return prev.map(i => 
          i.productId === productId 
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, {
        productId,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images?.[0],
      }];
    });
  };
  
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );
  
  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount: items.length }}>
      {children}
    </CartContext.Provider>
  );
}
```

---
| `checkout` | Checkout starten |
| `openCart` | Warenkorb öffnen |

---

## 🔐 AUTH-SYSTEM

### Zwei Auth-Systeme

**Warum zwei verschiedene Auth-Systeme?**

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTH ARCHITECTURE                             │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │             DASHBOARD AUTH (NextAuth.js)                 │    │
│  │                                                          │    │
│  │  Wer:     Website-Betreiber, Designer, Admins           │    │
│  │  Zweck:   Dashboard, Editor, Workspace-Verwaltung       │    │
│  │  Session: Cookie-basiert (httpOnly, secure)              │    │
│  │  Dauer:   30 Tage                                        │    │
│  │                                                          │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │  getServerSession(authOptions)                  │    │    │
│  │  │  → { user: { id, email, name } }                │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │             SITE USER AUTH (Custom JWT)                  │    │
│  │                                                          │    │
│  │  Wer:     Website-Besucher, Shop-Kunden, Forum-User     │    │
│  │  Zweck:   Login auf der veröffentlichten Site           │    │
│  │  Session: JWT in Cookie                                  │    │
│  │  Dauer:   7 Tage                                         │    │
│  │                                                          │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │  verifyJWT(token)                               │    │    │
│  │  │  → { siteUserId, workspaceId, role }            │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Dashboard Auth (NextAuth.js)

```typescript
// apps/web/src/lib/auth.ts

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email und Passwort erforderlich');
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        
        if (!user || !user.passwordHash) {
          throw new Error('Ungültige Anmeldedaten');
        }
        
        const isValid = await bcrypt.compare(
          credentials.password//, 
          user.passwordHash
        );
        
        if (!isValid) {
          throw new Error('Ungültige Anmeldedaten');
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Weitere Provider...
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 Tage
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
```

### Site User Auth (Custom)

```typescript
// apps/web/src/lib/site-auth.ts

import jwt from 'jsonwebtoken';

interface SiteUserPayload {
  siteUserId: string;
  workspaceId: string;
  email: string;
  role: SiteUserRole;
}

// JWT erstellen (bei Login)
export function createSiteUserToken(payload: SiteUserPayload): string {
  return jwt.sign(payload, process.env.SITE_USER_JWT_SECRET!, {
    expiresIn: '7d',
  });
}

// JWT verifizieren (bei Requests)
export function verifySiteUserToken(token: string): SiteUserPayload | null {
  try {
    return jwt.verify(
      token, 
      process.env.SITE_USER_JWT_SECRET!
    ) as SiteUserPayload;
  } catch {
    return null;
  }
}

// Middleware für geschützte Routen
export async function requireSiteUser(
  req: Request,
  workspaceId: string
): Promise<SiteUserPayload> {
  const cookie = req.headers.get('cookie');
  const token = parseCookie(cookie, 'site-user-token');
  
  if (!token) {
    throw new AuthError('Nicht angemeldet');
  }
  
  const payload = verifySiteUserToken(token);
  
  if (!payload) {
    throw new AuthError('Session abgelaufen');
  }
  
  if (payload.workspaceId !== workspaceId) {
    throw new AuthError('Falscher Workspace');
  }
  
  // Session in DB aktualisieren
  await prisma.siteUserSession.update({
    where: { id: payload.sessionId },
    data: { lastActiveAt: new Date() },
  });
  
  return payload;
}
```

### Auth-Komponenten im Builder

**LoginForm:**
```json
{
  "type": "LoginForm",
  "props": {
    "title": "Anmelden",
    "subtitle": "Willkommen zurück!",
    "showRemember": true,
    "showForgotPassword": true,
    "forgotPasswordUrl": "/passwort-vergessen",
    "showRegisterLink": true,
    "registerUrl": "/registrieren",
    "redirectAfterLogin": "/mein-konto",
    "buttonText": "Anmelden",
    "variant": "card",
    "showSocialLogin": true
  }
}
```

**ProtectedContent:**
```json
{
  "type": "ProtectedContent",
  "props": {
    "requiredRole": "MEMBER",
    "showFallback": true,
    "fallbackMessage": "Dieser Bereich ist nur für angemeldete Mitglieder.",
    "showLoginButton": true,
    "loginUrl": "/login"
  },
  "children": [
    // Nur sichtbar wenn eingeloggt mit Rolle MEMBER+
    { "type": "Heading", "props": { "text": "Exklusiver Inhalt" } }
  ]
}
```

**AuthGate:**
```json
{
  "type": "AuthGate",
  "props": {
    "showWhen": "logged-in",  // oder "logged-out"
    "redirectTo": "/login"    // optional
  },
  "children": [
    // Nur sichtbar basierend auf Auth-Status
  ]
}
```

### SiteUser Rollen

| Rolle | Berechtigung |
|-------|--------------|
| `ADMIN` | Volle Kontrolle über die Site |
| `MODERATOR` | Forum-Moderation, User verwalten |
| `MEMBER` | Standard-Mitglied |
| `VIP` | Premium-Mitglied mit Zusatzfeatures |

```typescript
// Rollen-Hierarchie prüfen
function hasRole(userRole: SiteUserRole, requiredRole: SiteUserRole): boolean {
  const hierarchy = ['MEMBER', 'VIP', 'MODERATOR', 'ADMIN'];
  return hierarchy.indexOf(userRole) >= hierarchy.indexOf(requiredRole);
}
```

---

## 🔧 BEFEHLE & SCRIPTS

### Entwicklung

```bash
# Alles starten (alle Apps parallel)
pnpm dev

# Nur bestimmte Apps starten
pnpm dev --filter=web      # Nur Next.js (Port 3000)
pnpm dev --filter=editor   # Nur Editor (Port 5173)

# Build (für Production)
pnpm build                 # Alle packages + apps
pnpm build --filter=web    # Nur web app

# Code-Qualität
pnpm lint                  # ESLint auf alle Packages
pnpm typecheck             # TypeScript auf alle Packages
pnpm test                  # Vitest Tests
```

### Database

```bash
# Prisma Client generieren (nach Schema-Änderungen)
pnpm db:generate
# oder direkt:
cd packages/db && pnpm exec prisma generate

# Migrations erstellen und ausführen
pnpm db:migrate
# oder:
cd packages/db && pnpm exec prisma migrate dev --name "beschreibung"

# Nur Migration ausführen (ohne neue erstellen)
cd packages/db && pnpm exec prisma migrate deploy

# Database-Schema anschauen
cd packages/db && pnpm exec prisma studio

# Datenbank resetten (VORSICHT: löscht alles!)
cd packages/db && pnpm exec prisma migrate reset

# Seeding
cd packages/db && npx tsx prisma/seed.ts

# Plan-Configs seeden
cd packages/db && npx tsx prisma/seed-plan-configs.ts
```

### Templates

```bash
# Templates in DB einfügen
cd packages/db && npx tsx prisma/add-nexus-template.ts
cd packages/db && npx tsx prisma/add-shop-template.ts
cd packages/db && npx tsx prisma/add-header-templates.ts

# Template auf Workspace anwenden
cd packages/db && npx tsx prisma/apply-nexus-template.ts

# Template debuggen
cd packages/db && npx tsx prisma/check-templates.ts
cd packages/db && npx tsx prisma/check-nexus.ts
```

### Debugging

```bash
# Page-Daten anschauen
cd packages/db && npx tsx prisma/check-page.ts

# Node-Details debuggen
cd packages/db && npx tsx prisma/debug-node.ts

# Mobile-Styles reparieren
cd packages/db && npx tsx prisma/fix-tetete-mobile.ts

# maxWidth-Probleme fixen
cd packages/db && npx tsx prisma/fix-all-maxwidth.ts

# Workspaces auflisten
cd packages/db && npx tsx prisma/check-workspaces.ts

# Produkte prüfen
cd packages/db && npx tsx prisma/check-products.ts
```

### Häufige Probleme & Fixes

**Problem: Prisma Client Fehler nach Schema-Änderung**
```
Error: Cannot find module './vendor-chunks/@prisma+client'
```

**Lösung:**
```powershell
# 1. Alle Node-Prozesse stoppen
Get-Process -Name "node" | Stop-Process -Force

# 2. Prisma Client neu generieren
cd packages/db
pnpm exec prisma generate

# 3. Next.js Cache löschen
Remove-Item -Recurse -Force ..\..\.apps\web\.next

# 4. Neu starten
cd ..\..
pnpm dev
```

**Problem: React Hooks Fehler im Editor**
```
TypeError: dispatcher is null
```

**Ursache:** Doppelte React-Instanzen (ui package + editor app)

**Lösung:** Radix-Dependencies in `apps/editor/package.json` hinzufügen:
```json
{
  "dependencies": {
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^1.0.0",
    // ... alle verwendeten Radix-Packages
  }
}
```

**Problem: PNPM Install Fehler**
```
ERR_PNPM_PEER_DEP_ISSUES
```

**Lösung:**
```bash
pnpm install --no-strict-peer-dependencies
```

**Problem: Port bereits belegt**
```
Error: Port 3000 is already in use
```

**Lösung:**
```powershell
# Prozess finden
netstat -ano | findstr :3000

# Prozess beenden
taskkill /PID <PID> /F
```

---

## 📊 STATISTIKEN

| Bereich | Anzahl |
|---------|--------|
| **Prisma Models** | 47 |
| **Prisma Enums** | 35 |
| **API-Routen** | 100+ |
| **Built-in Components** | 75+ |
| **Action Types** | 19 |
| **Event Types** | 14 |
| **Style Tokens** | 50+ |
| **Editor Store Actions** | 30+ |
| **Template Categories** | 16 |
| **Schema-Zeilen** | 2048 |
| **Dokumentation** | 6000+ Zeilen |

---

## 🏆 ZUSAMMENFASSUNG

**Builderly** ist eine vollständige Website-Builder-Plattform mit:

### Core Features
- **Visueller Drag & Drop Editor** - Canvas mit Live-Preview
- **Multi-Tenant System** - User → Workspace → Site → Page
- **Responsive Design** - Desktop, Tablet, Mobile mit Live-Umschaltung
- **Component Registry** - 75+ Built-in Komponenten
- **Template System** - Sections, Pages, Database Templates

### E-Commerce
- **Produkte** - Mit Varianten, Kategorien, Inventar
- **Bestellungen** - Vollständiger Order-Flow
- **Stripe Integration** - Checkout, Webhooks
- **Coupons & Vouchers** - Rabattcodes, Geschenkkarten
- **Versand & Steuern** - Zonen, Methoden, Berechnungen
- **Rechnungen** - Automatische Nummerierung, PDF

### Content Management
- **CMS Collections** - Beliebige Datenstrukturen
- **Formulare** - Mit Validierung, Spam-Schutz
- **Assets** - Medienbibliothek
- **Symbols** - Wiederverwendbare Komponenten

### User Management
- **Dashboard Auth** - NextAuth.js (Betreiber)
- **Site User Auth** - Custom JWT (Besucher)
- **Rollen & Berechtigungen** - OWNER, ADMIN, EDITOR, VIEWER
- **GDPR-Konformität** - Audit Logs, Data Export

### Advanced Features
- **Custom Domains** - Mit SSL-Zertifikaten
- **Analytics** - PageViews, Traffic-Quellen
- **Forum** - Kategorien, Threads, Posts
- **Booking System** - Terminbuchungen
- **Subscriptions** - Abo-Pläne für Endkunden
- **Automation Rules** - Trigger → Action Workflows
- **Email Templates** - Transaktions-E-Mails

### Technologie-Stack
- **Frontend:** Next.js 14, Vite, React, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui, Radix Primitives
- **State:** Zustand
- **Database:** PostgreSQL, Prisma ORM
- **Auth:** NextAuth.js + Custom JWT
- **Payments:** Stripe
- **Monorepo:** pnpm + Turborepo

---

*Dokumentation generiert von GitHub Copilot*  
*Stand: Juni 2025*  
*Letzte Aktualisierung: Umfassende Erweiterung mit Code-Beispielen, Diagrammen und detaillierten Erklärungen*
