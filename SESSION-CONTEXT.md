# Builderly Session Context - Detaillierte Dokumentation

## Projekt-Übersicht

**Builderly** ist ein Monorepo Website-Builder (pnpm + Turborepo) mit zwei Haupt-Apps:
- **`apps/web`** (Next.js 14 App Router, Port 3000): Dashboard, API-Routes, Runtime-Site-Rendering
- **`apps/editor`** (Vite + React, Port 5173): Visueller Drag-and-Drop Page Builder

## Datenmodell

Multi-Tenant-Hierarchie: `User → WorkspaceMember → Workspace → Site → Page`

Pages speichern ihren Content in `builderTree` (JSON) nach dem `BuilderTree`-Schema.

---

## PACKAGES - Detaillierte Struktur

### packages/core

Zentrale Logik für Components, Schemas, Templates, Actions, Plugins.

---

#### `src/schemas/node.ts`
**Zweck:** Definiert die Kern-Datenstruktur für den Builder-Tree.

**Wichtige Types:**
```typescript
interface BuilderNode {
  id: string;              // Eindeutige ID (z.B. "node_1234567890_abc123")
  type: string;            // Komponenten-Typ (z.B. "Heading", "Button", "Section")
  props: Record<string, unknown>;  // Komponenten-spezifische Props
  style: BuilderStyle;     // CSS-Styles pro Breakpoint
  actions: BuilderActionBinding[];  // Event-Aktionen (onClick, etc.)
  children: BuilderNode[]; // Verschachtelte Kinder
  meta?: BuilderNodeMeta;  // Optional: name, locked, hidden, notes
}

interface BuilderTree {
  builderVersion: number;  // Schema-Version (aktuell: 1)
  root: BuilderNode;       // Root-Node (immer type: "Section")
}
```

**Exportierte Funktionen:**
- `generateNodeId()` - Erstellt unique ID: `node_${Date.now()}_${random}`
- `createNode(type, props, children)` - Erstellt neuen Node mit Defaults
- `findNodeById(root, id)` - Sucht Node rekursiv im Tree
- `findNodePath(root, id)` - Gibt Pfad zum Node als Array zurück
- `findParentNode(root, childId)` - Findet Parent eines Nodes
- `cloneNode(node, deep)` - Klont Node mit neuen IDs
- `updateNodeInTree(root, nodeId, updater)` - Immutabel Node updaten
- `removeNodeFromTree(root, nodeId)` - Node entfernen
- `insertNodeAt(root, parentId, node, index)` - Node an Position einfügen

---

#### `src/schemas/style.ts`
**Zweck:** CSS-Style Schema für Nodes.

**Struktur:**
```typescript
interface BuilderStyle {
  base: {    // Desktop-Styles (immer vorhanden)
    display?: 'block' | 'flex' | 'grid' | 'none' | ...;
    position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
    padding?: string;
    margin?: string;
    width?: string;
    height?: string;
    bgColor?: string;        // Hintergrundfarbe
    textColor?: string;      // Textfarbe
    borderColor?: string;
    borderRadius?: string;
    fontSize?: string;
    fontWeight?: string;
    // ... ~60 weitere CSS-Properties
  };
  tablet?: { ... };  // Tablet-Overrides (768px)
  mobile?: { ... };  // Mobile-Overrides (375px)
}
```

---

#### `src/schemas/site-settings.ts`
**Zweck:** Globale Site-Einstellungen (Theme, SEO, Header, Footer).

**Wichtige Schemas:**
```typescript
interface ThemeColors {
  primary: string;           // Hauptfarbe (Default: #7c3aed)
  primaryForeground: string; // Text auf Primary (Default: #ffffff)
  secondary: string;
  background: string;        // Seitenhintergrund
  foreground: string;        // Haupt-Textfarbe
  muted: string;
  mutedForeground: string;
  accent: string;
  card: string;
  border: string;
  destructive: string;       // Fehler/Löschen-Farbe
  success: string;           // Erfolg-Farbe
  warning: string;           // Warn-Farbe
}

interface SiteSettings {
  theme: {
    colors: ThemeColors;
    typography: { fontFamily, baseFontSize, ... };
    spacing: { borderRadius, containerMaxWidth };
    darkMode: boolean;
  };
  seo: { title, description, keywords, ... };
  header: HeaderSettings;
  footer: FooterSettings;
  social: { facebook, twitter, instagram, ... };
  analytics: { googleAnalyticsId, facebookPixelId, ... };
  customCode: { headCode, bodyStartCode, bodyEndCode };
}
```

---

#### `src/schemas/actions.ts`
**Zweck:** Definiert Aktionen die Nodes ausführen können.

**Struktur:**
```typescript
interface BuilderActionBinding {
  event: 'click' | 'hover' | 'submit' | 'change' | 'load';
  action: {
    type: 'navigate' | 'scroll' | 'openModal' | 'closeModal' | 
          'submitForm' | 'toggleClass' | 'customJs';
    params: Record<string, unknown>;
  };
}
```

---

#### `src/registry/component-registry.ts`
**Zweck:** Registriert alle verfügbaren Komponenten für den Builder.

**ComponentRegistry Klasse:**
```typescript
class ComponentRegistry {
  register(definition: ComponentDefinition): void;   // Komponente registrieren
  get(type: string): ComponentDefinition | undefined;  // Komponente abrufen
  getAll(): ComponentDefinition[];                   // Alle Komponenten
  getByCategory(category: string): ComponentDefinition[];  // Nach Kategorie filtern
  getCategories(): ComponentCategory[];              // Alle Kategorien
}

interface ComponentDefinition {
  type: string;              // Eindeutiger Typ (z.B. "Heading")
  displayName: string;       // Anzeigename
  description?: string;
  icon: string;              // Lucide Icon Name
  category: string;          // layout | content | ui | forms | ...
  canHaveChildren: boolean;  // Kann Kinder haben?
  allowedChildrenTypes?: string[];  // Erlaubte Kind-Typen
  defaultProps: Record<string, unknown>;  // Standard-Props
  propsSchema: ZodSchema;    // Validierung
}
```

---

#### `src/registry/builtin-components.ts`
**Zweck:** Registriert alle eingebauten Komponenten.

**Registrierte Komponenten (~50+):**

| Kategorie | Komponenten |
|-----------|-------------|
| **Layout** | Section, Container, Stack, Grid, Divider, Spacer, Accordion, Tabs, Carousel |
| **Content** | Heading, Text, Link, Icon, Badge, Quote, Counter, Progress, Rating, CodeBlock, Table, List |
| **UI** | Button, Card, Alert, Avatar, TrustBadge, PricingCard, FeatureCard, TestimonialCard |
| **Forms** | Input, Textarea, Select, Checkbox, FormButton |
| **Media** | Image, Video, Map, SocialEmbed |
| **Navigation** | Header, Footer, NavLink, Breadcrumbs |

---

#### `src/templates/template-registry.ts`
**Zweck:** Verwaltet Section- und Page-Templates.

**TemplateRegistry Klasse:**
```typescript
class TemplateRegistryClass {
  registerSection(template: TemplateDefinition): void;
  registerPage(template: FullPageTemplate): void;
  getSection(id: string): TemplateDefinition | undefined;
  getPage(id: string): FullPageTemplate | undefined;
  getAllSections(): TemplateDefinition[];
  getAllPages(): FullPageTemplate[];
  getSectionsByCategory(category): TemplateDefinition[];
  searchSections(query): TemplateDefinition[];
}

interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: 'hero' | 'features' | 'pricing' | 'cta' | 'contact' | ...;
  style: 'minimal' | 'modern' | 'bold' | ...;
  websiteTypes: ('landing' | 'business' | 'saas' | ...)[];
  tags: string[];
  node: BuilderNode;  // Das Template als Node
}

interface FullPageTemplate {
  id: string;
  name: string;
  tree: BuilderTree;  // Kompletter Page-Tree
}
```

---

#### `src/templates/theme-transformer.ts` (NEU)
**Zweck:** Wandelt hardcoded Template-Farben in Theme-Farben um.

**Exportierte Funktionen:**
```typescript
// Wandelt Farben in einem Node um
applyThemeToNode(node: BuilderNode, themeColors: ThemeColors): BuilderNode

// Wandelt Farben im gesamten Tree um
applyThemeToTree(tree: BuilderTree, themeColors: ThemeColors): BuilderTree
```

**Farb-Mapping (Template → Theme):**
| Template-Farben | Theme-Role |
|-----------------|------------|
| `#f59e0b`, `#d97706`, `#fbbf24` | `primary` |
| `#1a1a2e`, `#0a0a0f`, `#0f172a` | `foreground` |
| `#ffffff` | `background` |
| `#94a3b8`, `#64748b`, `#cbd5e1` | `mutedForeground` |
| `#f8fafc`, `#f1f5f9` | `secondary` |
| `#22c55e` | `success` |
| `#ef4444` | `destructive` |

---

#### `src/templates/sections/*.ts`
Template-Dateien für einzelne Sektionen:
- `hero-templates.ts` - Hero-Sections (Centered, Split, Gradient, etc.)
- `feature-templates.ts` - Feature-Grids und Listen
- `pricing-templates.ts` - Preistabellen
- `cta-templates.ts` - Call-to-Action Sections
- `contact-templates.ts` - Kontaktformulare
- `testimonial-templates.ts` - Kundenbewertungen
- `stats-templates.ts` - Statistik-Sections
- `faq-templates.ts` - FAQ-Akkordeons
- `footer-templates.ts` - Footer-Layouts

#### `src/templates/pages/*.ts`
Vollständige Seiten-Templates:
- `craftsman-templates.ts` - Handwerker-Website (deutsch, dark theme)
- `landing-page-templates.ts` - SaaS Landing Pages

---

### packages/db

Prisma-Client und Datenbank-Schema.

#### `prisma/schema.prisma`
**Wichtige Models:**
```prisma
model User { ... }
model Workspace { 
  sites Site[]
}
model Site {
  pages Page[]
  settings Json  // SiteSettings
}
model Page {
  builderTree Json  // BuilderTree
}
model Asset { ... }  // Uploads
model Template { ... }  // DB-Templates
```

#### `src/index.ts`
```typescript
export const prisma = new PrismaClient();
```

---

### packages/sdk

API-Typen und Validierungs-Schemas.

#### `src/types/api.ts`
**Wichtige Schemas:**
```typescript
const CreatePageSchema = z.object({
  name: z.string().min(1),
  slug: z.string(),
  builderTree: BuilderTreeSchema.optional(),
});

const UpdatePageSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  builderTree: BuilderTreeSchema.optional(),
  isPublished: z.boolean().optional(),
});
```

---

### packages/ui

Shared UI-Komponenten (shadcn/ui Pattern).

#### Komponenten-Liste:
| Datei | Komponente | Beschreibung |
|-------|------------|--------------|
| `button.tsx` | Button | Verschiedene Variants: primary, secondary, outline, ghost, destructive |
| `dialog.tsx` | Dialog | Modal-Dialog mit Overlay |
| `alert-dialog.tsx` | AlertDialog | Bestätigungs-Dialog (NEU erstellt für Template-Picker) |
| `input.tsx` | Input | Text-Input mit Label |
| `select.tsx` | Select | Dropdown-Auswahl |
| `tabs.tsx` | Tabs | Tab-Navigation |
| `badge.tsx` | Badge | Label/Tag |
| `card.tsx` | Card | Container mit Border/Shadow |
| `sheet.tsx` | Sheet | Slide-in Panel |
| `slider.tsx` | Slider | Range-Input |
| `switch.tsx` | Switch | Toggle |
| `tooltip.tsx` | Tooltip | Hover-Info |
| `collapsible.tsx` | Collapsible | Ausklappbarer Bereich |
| `scroll-area.tsx` | ScrollArea | Scrollbarer Container |
| `separator.tsx` | Separator | Trennlinie |

#### `src/index.ts`
Exportiert alle Komponenten + `cn()` Utility für classNames.

---

## APPS - Detaillierte Struktur

### apps/editor (Vite + React)

Der visuelle Page-Builder (Port 5173).

---

#### `src/App.tsx`
**Zweck:** Haupt-App-Komponente, lädt Page-Daten von API.

**Funktionalität:**
1. Liest URL-Parameter: `workspaceId`, `siteId`, `pageId`, `templateId`
2. Lädt Page-Daten von API: `GET /api/workspaces/.../pages/...`
3. Setzt Tree und PageName in Store
4. Registriert Keyboard-Shortcuts (Ctrl+Z, Ctrl+S, Delete, etc.)
5. Rendert Layout: Toolbar, Palette, Canvas, Inspector, LayerPanel

**URL-Aufruf:**
```
http://localhost:5173/?workspaceId=xxx&siteId=xxx&pageId=xxx
```

---

#### `src/store/editor-store.ts`
**Zweck:** Zentraler Zustand-Store (Zustand).

**State-Struktur:**
```typescript
interface EditorState {
  // Context
  workspaceId: string | null;
  siteId: string | null;
  pageId: string | null;
  pageName: string;
  siteName: string;
  
  // Daten
  tree: BuilderTree;           // Der aktuelle Page-Tree
  siteSettings: SiteSettings;  // Theme, SEO, etc.
  
  // Selection
  selectedNodeId: string | null;  // Ausgewählter Node
  hoveredNodeId: string | null;   // Gehoverter Node
  
  // Viewport
  breakpoint: 'desktop' | 'tablet' | 'mobile';
  zoom: number;  // 25-200%
  
  // History (Undo/Redo)
  history: BuilderTree[];
  historyIndex: number;
  
  // UI-State
  isPaletteOpen: boolean;      // Linke Komponenten-Palette
  isInspectorOpen: boolean;    // Rechter Properties-Panel
  isLayerPanelOpen: boolean;   // Tree-View Panel
  isSiteSettingsOpen: boolean; // Site-Settings Sheet
  isPreviewMode: boolean;      // Preview ohne Editing-UI
  
  // Persistence
  isDirty: boolean;    // Ungespeicherte Änderungen?
  isSaving: boolean;   // Speichern läuft?
  lastSaved: Date | null;
}
```

**Wichtige Actions:**
```typescript
// Initiales Laden (setzt isDirty: false)
setTree(tree: BuilderTree): void

// User-Änderung (setzt isDirty: true, fügt zu History hinzu)
replaceTree(tree: BuilderTree): void

// Node-Operationen (alle setzen isDirty: true)
addNode(parentId: string, nodeType: string, index?: number): void
updateNode(nodeId: string, updates: Partial<BuilderNode>): void
updateNodeProps(nodeId: string, props: Record<string, unknown>): void
updateNodeStyle(nodeId: string, style: BuilderStyle): void
deleteNode(nodeId: string): void
duplicateNode(nodeId: string): void
moveNode(nodeId: string, newParentId: string, newIndex: number): void

// Selection
selectNode(nodeId: string | null): void
hoverNode(nodeId: string | null): void

// Site Settings
updateSiteSettings(settings: Partial<SiteSettings>): void

// History
undo(): void
redo(): void
canUndo(): boolean
canRedo(): boolean
```

---

#### `src/components/Canvas.tsx`
**Zweck:** Haupt-Canvas der Page-Preview.

**Funktionalität:**
1. Rendert Device-Frame (Desktop/Tablet/Mobile mit entsprechenden Breiten)
2. Generiert CSS-Variablen aus `siteSettings.theme.colors`
3. Wendet Background-Styles an (Color, Gradient, Image, Pattern)
4. Rendert `<CanvasNode>` rekursiv für den Tree
5. Zeigt Zoom-Level Indikator
6. Unterstützt Drag-and-Drop als Drop-Target

**CSS-Variablen die gesetzt werden:**
```css
--color-primary, --color-background, --color-foreground, 
--color-muted, --color-border, --font-family, --font-size-base, etc.
```

---

#### `src/components/CanvasNode.tsx`
**Zweck:** Rendert einen einzelnen Node rekursiv.

**Funktionalität:**
1. Holt Component-Definition aus Registry
2. Berechnet Styles aus `node.style` (base + tablet/mobile Overrides)
3. Rendert Komponente basierend auf `node.type`
4. Zeigt Selection/Hover-Highlight im Edit-Mode
5. Implementiert Drag-and-Drop (draggable + droppable für Container)
6. Rendert Kinder rekursiv

**Komponenten-Rendering (Auszug):**
```tsx
switch (node.type) {
  case 'Heading':
    return <h1 style={...}>{node.props.text}</h1>;
  case 'Button':
    return <button style={...}>{node.props.text}</button>;
  case 'Section':
    return <section style={...}>{children}</section>;
  // ... ~50 weitere Komponenten
}
```

---

#### `src/components/Inspector.tsx`
**Zweck:** Rechte Sidebar - Property-Editor für ausgewählten Node.

**Funktionalität:**
1. Zeigt Node-Type und ID
2. **Props-Tab:** Komponenten-spezifische Props (Text, Variant, Size, etc.)
3. **Style-Tab:** CSS-Editor (Layout, Spacing, Colors, Typography, etc.)
4. **Actions-Tab:** Event-Aktionen konfigurieren
5. Duplicate/Delete Buttons

**Style-Editor Kategorien:**
- Layout (Display, Position, Width, Height)
- Spacing (Padding, Margin)
- Colors (Background, Text, Border)
- Typography (Font, Size, Weight, Align)
- Border (Width, Radius, Style)
- Effects (Shadow, Opacity)

---

#### `src/components/Palette.tsx`
**Zweck:** Linke Sidebar - Komponenten zum Hinzufügen.

**Funktionalität:**
1. Zeigt alle registrierten Komponenten gruppiert nach Kategorie
2. Suchfunktion für Komponenten
3. Drag-and-Drop zum Canvas
4. Tooltips mit deutschen Beschreibungen

**Kategorien:**
- Layout (Section, Container, Stack, Grid, ...)
- Content (Heading, Text, Link, Badge, ...)
- UI (Button, Card, Alert, Avatar, ...)
- Forms (Input, Textarea, Select, ...)
- Media (Image, Video, Map, ...)
- Navigation (Header, Footer, NavLink, ...)

---

#### `src/components/Toolbar.tsx`
**Zweck:** Obere Toolbar mit globalen Actions.

**Buttons/Features:**
- **Undo/Redo** - History Navigation
- **Breakpoint Switcher** - Desktop/Tablet/Mobile
- **Zoom Controls** - 25-200%
- **Save Button** - Speichert Page + Site-Settings
- **Publish Button** - Veröffentlicht die Seite
- **Preview Toggle** - Wechselt in Preview-Mode
- **Template Picker Button** - Öffnet Template-Library
- **Settings Button** - Öffnet Site-Settings Panel
- **Panel Toggles** - Palette/Inspector/Layers ein/aus

**Save-Funktion:**
```typescript
// PATCH /api/workspaces/{id}/sites/{id}/pages/{id}
fetch(url, {
  method: 'PATCH',
  body: JSON.stringify({ builderTree: tree })
});

// PATCH /api/workspaces/{id}/sites/{id}/settings
fetch(url, {
  method: 'PATCH',
  body: JSON.stringify({ settings: siteSettings })
});
```

---

#### `src/components/LayerPanel.tsx`
**Zweck:** Tree-View aller Nodes.

**Funktionalität:**
1. Zeigt Node-Hierarchie als ausklappbaren Baum
2. Klick selektiert Node
3. Drag-and-Drop zum Umordnen
4. Inline-Rename (meta.name)
5. Visibility Toggle (hidden)
6. Lock Toggle (locked)
7. Quick Actions (Duplicate, Delete)

---

#### `src/components/TemplatePicker.tsx`
**Zweck:** Dialog für Template-Auswahl.

**Funktionalität:**
1. **Tabs:** Sections / Full Pages
2. **Kategorie-Filter:** Hero, Features, Pricing, CTA, etc.
3. **Suche:** Nach Name, Tags, Beschreibung
4. **Lädt Templates:** Aus Registry + API (`/api/templates`)
5. **Bestätigungs-Dialog:** Warnt vor Überschreiben
6. **Theme-Anpassung:** Wendet `applyThemeToNode/Tree` an!

**Template einfügen:**
```typescript
// Section: Am Ende des Root hinzufügen
const themedNode = applyThemeToNode(clonedNode, siteSettings.theme.colors);
tree.root.children.push(themedNode);

// Page: Kompletten Tree ersetzen
const themedTree = applyThemeToTree(clonedTree, siteSettings.theme.colors);
replaceTree(themedTree);
```

---

#### `src/components/SiteSettingsPanel.tsx`
**Zweck:** Sheet für globale Site-Einstellungen.

**Tabs:**
1. **Design** - Theme-Farben, Typography, Spacing
2. **SEO** - Title, Description, Keywords, OG-Tags
3. **Header** - Type, Logo, Navigation, CTA, Mobile-Menu
4. **Footer** - Columns, Links, Newsletter, Copyright
5. **Code** - Custom CSS, Head-Scripts, Body-Scripts
6. **Analytics** - Google Analytics, Facebook Pixel
7. **Social** - Social Media Links

---

#### `src/components/DndProvider.tsx`
**Zweck:** Wrapper für dnd-kit Drag-and-Drop.

**Context-Werte:**
```typescript
interface DndState {
  activeId: string | null;  // Aktuell gezogenes Element
  overId: string | null;    // Aktuelles Drop-Target
}
```

---

### apps/web (Next.js 14)

Dashboard und API (Port 3000).

---

#### `src/app/api/workspaces/[workspaceId]/sites/[siteId]/pages/[pageId]/route.ts`
**Zweck:** Page CRUD API.

**Endpoints:**
```typescript
GET    - Lädt eine Page (mit builderTree)
PATCH  - Aktualisiert Page (name, slug, builderTree, isPublished)
DELETE - Löscht eine Page
```

---

#### `src/app/api/templates/route.ts`
**Zweck:** Templates API.

**Endpoints:**
```typescript
GET /api/templates - Lädt alle Templates aus DB
GET /api/templates?templateId=xxx - Lädt spezifisches Template
```

---

#### `src/lib/permissions.ts`
**Zweck:** Auth-Middleware für API-Routes.

**Wichtige Funktion:**
```typescript
async function requireWorkspacePermission(
  workspaceId: string, 
  role: 'viewer' | 'editor' | 'admin' | 'owner'
): Promise<{ userId: string; workspaceId: string }>
```

---

## Aktuelle Session - Letzte Änderungen

### 1. Theme-Transformer (NEU)
**Datei:** `packages/core/src/templates/theme-transformer.ts`

Wandelt hardcoded Farben in Templates in die aktuellen Theme-Farben um.

### 2. TemplatePicker Update
**Datei:** `apps/editor/src/components/TemplatePicker.tsx`

- Wendet Theme-Farben beim Template-Einfügen an
- Verwendet `applyThemeToNode()` für Sections
- Verwendet `applyThemeToTree()` für Full Pages

### 3. Canvas.tsx Fix
**Datei:** `apps/editor/src/components/Canvas.tsx`

- `maxHeight: '90vh'` entfernt - Preview zeigt volle Höhe
- `rounded-lg` für Desktop entfernt

### 4. AlertDialog (NEU)
**Datei:** `packages/ui/src/components/alert-dialog.tsx`

Bestätigungs-Dialog für destruktive Aktionen.

---

## Entwicklungs-Befehle

```bash
pnpm dev                    # Startet alle Apps
pnpm build                  # Baut alle Packages
pnpm db:generate            # Regeneriert Prisma Client
pnpm db:migrate             # Führt Migrationen aus

# Core Package neu bauen nach Änderungen:
cd packages/core && pnpm build

# Bei Prisma-Cache-Fehlern:
Get-Process -Name "node" | Stop-Process -Force
cd packages/db && pnpm exec prisma generate
Remove-Item -Recurse -Force apps/web/.next
pnpm dev
```

---

## Wichtige Code-Patterns

### 1. Node erstellen
```typescript
import { createNode, generateNodeId } from '@builderly/core';

const newNode: BuilderNode = {
  id: generateNodeId(),
  type: 'Heading',
  props: { level: 1, text: 'Hello' },
  style: { base: { textColor: '#000000' } },
  actions: [],
  children: [],
};
```

### 2. Store verwenden
```typescript
import { useEditorStore } from '../store/editor-store';

const { tree, selectedNodeId, updateNodeProps, siteSettings } = useEditorStore();

// Props updaten
updateNodeProps(nodeId, { text: 'New Text' });

// Theme-Farben lesen
const primaryColor = siteSettings.theme.colors.primary;
```

### 3. Template mit Theme einfügen
```typescript
import { cloneNode, applyThemeToNode } from '@builderly/core';

const clonedNode = cloneNode(template.node, true);
const themedNode = applyThemeToNode(clonedNode, siteSettings.theme.colors);
```

### 4. API-Route mit Permissions
```typescript
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { UpdatePageSchema } from '@builderly/sdk';

export async function PATCH(req, { params }) {
  await requireWorkspacePermission(params.workspaceId, 'editor');
  const body = UpdatePageSchema.parse(await req.json());
  // ...
}
```

---

## Konventionen

- **Deutsche UI-Texte** für User-facing Strings
- **Zod-Validierung** für alle API-Schemas
- **Tailwind CSS** mit `cn()` Utility
- **Dark Mode** via `next-themes`

---

## Nächste Schritte

1. ✅ Theme-Transformer implementiert
2. ✅ TemplatePicker verwendet Theme-Farben
3. 🔄 Testen: Template einfügen und Farben prüfen
4. 💡 Optional: Live-Preview der Theme-Farben in Templates
