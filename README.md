# Builderly — Website-Builder-Plattform

Eine vollständige, modulare SaaS-Website-Builder-Plattform mit visuellem Drag-and-Drop-Editor, CMS, E-Commerce, Forum, Blog, Mitgliederportal, Analytics und vielem mehr.

---

## Inhaltsverzeichnis

- [Features im Überblick](#features-im-überblick)
- [Tech Stack](#tech-stack)
- [Projektstruktur](#projektstruktur)
- [Schnellstart](#schnellstart)
- [Entwicklungsbefehle](#entwicklungsbefehle)
- [Architektur](#architektur)
- [Alle Features im Detail](#alle-features-im-detail)
- [Komponentenregister (58 Komponenten)](#komponentenregister-58-komponenten)
- [Plugin-System](#plugin-system)
- [Section-Templates (11 Vorlagen)](#section-templates-11-vorlagen)
- [API-Referenz (90+ Endpunkte)](#api-referenz-90-endpunkte)
- [Sicherheit](#sicherheit)
- [Tests](#tests)
- [Lizenz](#lizenz)

---

## Features im Überblick

| Bereich | Feature |
|---------|---------|
| **Visueller Editor** | Drag-and-Drop Page Builder mit Canvas, Live-Vorschau, Breakpoint-Unterstützung (Desktop/Tablet/Mobile) |
| **58 Komponenten** | Layout, Text, Bilder, Formulare, Navigation, Karten, Preistabellen, Testimonials, Countdowns u.v.m. |
| **11 Section-Templates** | Hero, Features, Pricing, CTA, Kontaktformular, FAQ, Testimonials, Stats, Footer, Galerie |
| **Plugin-System** | Blog, Shop & Forum als modulare Plugins mit eigenen Komponenten, Collections & Actions |
| **CMS** | Collections & Records mit flexiblem Schema, Bulk-Operationen, Draft/Published/Archived Status |
| **E-Commerce** | Produkte, Warenkorb, Bestellungen, Stripe-Checkout, Bestandsverwaltung |
| **Forum** | Kategorien, Threads, Posts mit Pinnen/Sperren, Moderation |
| **Blog** | Posts, Kategorien, Blog-Komponenten |
| **Formular-Builder** | Formulardefinitionen mit Schema, öffentliche Einreichung, Spam-Erkennung, Benachrichtigungen |
| **Analytics** | Seitenaufrufe, Geräte, Browser, Referrer, Tagesstatistiken mit visuellem Dashboard |
| **Multi-Tenant** | Benutzer → Workspace → Sites → Seiten Hierarchie mit Rollenkonzept |
| **Billing (Stripe)** | 4 Pläne (Starter/Pro/Business/Enterprise), Checkout, Portal, Usage-Tracking |
| **Admin-Panel** | 6 Admin-Seiten: Benutzer, Workspaces, Templates, Pläne, Audit-Log, Benutzer-Detail |
| **Audit-Log** | Lückenlose Protokollierung aller Aktionen (~45 Action-Types) mit IP/User-Agent |
| **DSGVO-konform** | Datenexport, Account-Löschung, Einwilligungsverwaltung, Cookie-Consent |
| **Besucher-Auth** | Login/Registrierung/Passwort-Reset für Site-Besucher, Mitgliederliste, Profilbearbeitung |
| **Custom Domains** | Eigene Domains mit DNS-Verifikation und SSL-Status |
| **Asset-Management** | Datei-Upload, Ordner, Tags, Bildoptimierung, Copy-URL |
| **Symbols** | Wiederverwendbare globale Komponenten-Bausteine |
| **Revisions** | Seitenversionen mit Rollback-Funktion |
| **Publish & Zeitplanung** | Sofort veröffentlichen oder zeitgesteuert (scheduledPublishAt) |
| **Collaborative Editing** | WebSocket-basierte Echtzeit-Zusammenarbeit (Cursor, Präsenz, Live-Änderungen) |
| **SEO** | robots.txt, dynamische sitemap.xml, JSON-LD Structured Data |
| **i18n** | Vollständig deutsche Benutzeroberfläche im Editor und Dashboard |
| **Tests** | 37 Unit-Tests (Vitest) für Schemas, Registry und Templates |

---

## Tech Stack

| Technologie | Einsatz |
|-------------|---------|
| **Turborepo + pnpm** | Monorepo-Management mit Workspaces |
| **Next.js 14** | App Router — Dashboard, API-Routes, Runtime-Rendering |
| **Vite + React** | Visueller Editor (Port 5173) |
| **TypeScript** | Durchgängig in allen Packages und Apps |
| **PostgreSQL** | Datenbank (31 Modelle, 9 Enums) |
| **Prisma** | ORM mit Migrationen und Type-Safety |
| **Auth.js (NextAuth)** | Authentifizierung (Credentials + OAuth-ready) |
| **Stripe** | Abrechnung, Checkout, Kundenportal |
| **Redis** | Rate-Limiting und Caching |
| **S3 / MinIO** | Datei-Speicher (Bilder, Assets) |
| **WebSocket (ws)** | Collaborative Editing in Echtzeit |
| **Zod** | Schema-Validierung für API + Builder-Daten |
| **Tailwind CSS** | Styling mit shadcn/ui-Komponentenpattern |
| **Zustand** | State-Management im Editor (720+ Zeilen) |
| **Vitest** | Unit-Test-Framework |
| **Sharp** | Serverseitige Bildverarbeitung |

---

## Projektstruktur

```
builderly/
├── apps/
│   ├── web/                  # Next.js 14 — Dashboard, API, Runtime-Renderer
│   │   ├── src/app/
│   │   │   ├── (auth)/       # Login, Register, Passwort-Reset
│   │   │   ├── (dashboard)/  # Dashboard mit allen Verwaltungsseiten
│   │   │   ├── api/          # 90+ REST-API-Endpunkte
│   │   │   ├── s/            # Public Runtime-Rendering (/s/[slug])
│   │   │   └── page.tsx      # Marketing Landing Page
│   │   └── src/lib/          # Auth, Permissions, Audit, Stripe, Storage
│   │
│   └── editor/               # Vite + React — Visueller Page Builder
│       └── src/
│           ├── components/   # 19 Editor-Komponenten (Canvas, Inspector, Palette…)
│           ├── hooks/        # useAnimation, useCollab
│           └── store/        # Zustand Editor-Store (Undo/Redo, Tree-Ops)
│
├── packages/
│   ├── core/                 # Builder-Kern
│   │   └── src/
│   │       ├── schemas/      # BuilderNode, BuilderTree, Style, Actions, Animation
│   │       ├── registry/     # 58 registrierte Komponenten
│   │       ├── plugins/      # Blog, Shop, Forum Plugins
│   │       ├── templates/    # 11 Section-Templates
│   │       └── actions/      # Deklaratives Action-System
│   │
│   ├── db/                   # Prisma Schema + Client (31 Modelle)
│   ├── sdk/                  # API-Typen und Zod-Validierung
│   ├── ui/                   # Shared UI-Komponenten (shadcn/ui)
│   └── config/               # Geteilte ESLint, TypeScript, Tailwind Configs
│
├── docker-compose.yml        # PostgreSQL, Redis, MinIO
└── README.md
```

---

## Schnellstart

### Voraussetzungen

- Node.js 20+
- pnpm 9+
- Docker und Docker Compose

### 1. Klonen & Installieren

```bash
git clone <repository-url>
cd builderly
pnpm install
```

### 2. Umgebungsvariablen einrichten

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/editor/.env.example apps/editor/.env
```

Für lokale Entwicklung funktionieren die Standardwerte.

### 3. Infrastruktur starten

```bash
docker compose up -d
docker compose ps   # Warten bis alles "healthy" ist
```

### 4. Datenbank einrichten

```bash
pnpm db:generate   # Prisma-Client generieren
pnpm db:migrate    # Migrationen ausführen
pnpm db:seed       # Demo-Daten laden
```

### 5. Entwicklungsserver starten

```bash
pnpm dev
```

Gestartet werden:
- **Web-App**: http://localhost:3000
- **Editor**: http://localhost:5173
- **MinIO Console**: http://localhost:9001 (admin/minioadmin)

### 6. Demo-Konto

```
E-Mail:   demo@builderly.dev
Passwort: demo1234
```

---

## Entwicklungsbefehle

```bash
pnpm dev              # Alle Apps im Dev-Modus starten
pnpm build            # Alle Packages und Apps bauen
pnpm lint             # Linting ausführen
pnpm typecheck        # Type-Checking
pnpm test             # Alle Tests ausführen (Vitest)
pnpm db:generate      # Prisma-Client regenerieren
pnpm db:migrate       # Migrationen ausführen
pnpm db:push          # Schema direkt pushen (Prototyping)
pnpm db:seed          # Datenbank seeden
pnpm clean            # Alle Build-Artefakte löschen
```

### Häufige Fixes

**Prisma/Next.js Cache-Fehler** (`Cannot find module './vendor-chunks/@prisma+client'`):
```powershell
Get-Process -Name "node" | Stop-Process -Force
cd packages/db; pnpm exec prisma generate
Remove-Item -Recurse -Force apps/web/.next
pnpm dev
```

**React Hooks Fehler** (`dispatcher is null`):
Radix-Dependencies müssen in `apps/editor/package.json` sein, nicht nur in `packages/ui`.

---

## Architektur

### Datenmodell

```
User ←→ WorkspaceMember ←→ Workspace
                              │
                    ┌─────────┼─────────┐
                    ▼         ▼         ▼
                  Site    Collection   Asset
                    │         │
              ┌─────┼─────┐   ▼
              ▼     ▼     ▼  Record
            Page  Symbol  CustomDomain
              │
         ┌────┼────┐
         ▼    ▼    ▼
    Revision Form  PageView
              │
              ▼
         Submission
```

Zusätzlich pro Site: `SiteUser` (Besucher-Auth), `Product`, `Order`, `ForumCategory`, `ForumThread`, `ForumPost`

### Builder-Tree-Struktur

Jede Seite speichert ihren Inhalt als JSON (`builderTree`):

```typescript
interface BuilderTree {
  builderVersion: number;
  root: BuilderNode;
}

interface BuilderNode {
  id: string;
  type: string;              // Registry-Schlüssel (z.B. 'Heading', 'Button')
  props: Record<string, any>;
  style: BuilderStyle;       // Responsive Styles (Desktop/Tablet/Mobile)
  actions: ActionBinding[];  // Deklarative Event-Handler
  animation?: BuilderAnimation;
  children: BuilderNode[];
}
```

### Editor-Store (Zustand)

State-Management im Editor mit:
- **Tree-Operationen**: `addNode`, `updateNode`, `deleteNode`, `duplicateNode`, `moveNode`, `insertNodeTree`, `replaceNodeType`
- **Undo/Redo**: Command-Pattern mit History-Array
- **Breakpoint-Editing**: Per-Breakpoint Style-Bearbeitung
- **Auto-Save**: Dirty-Tracking mit `isDirty`-Flag
- `setTree()` — Initialer Load (setzt `isDirty: false`)
- `replaceTree()` — User-Änderungen (setzt `isDirty: true`, History-Eintrag)

### Deklaratives Action-System

Actions sind datengetrieben — kein Code-Execution:

```typescript
{ type: 'navigate', to: '/about' }
{ type: 'submitForm', formId: '...' }
{ type: 'addToCart', productId: '...' }
```

Unterstützte Action-Typen: `navigate`, `openModal`, `closeModal`, `submitForm`, `createRecord`, `updateRecord`, `deleteRecord`, `addToCart`, `removeFromCart`, `checkout`, `login`, `logout`, `scrollTo`, `setState`, `toggleState`

---

## Alle Features im Detail

### 1. Visueller Drag-and-Drop-Editor

Der Editor (`apps/editor/`) ist eine eigenständige Vite+React-App. Kernkomponenten:

| Komponente | Funktion |
|-----------|----------|
| **Canvas** | Visuelle Arbeitsfläche — rendert den Builder-Tree, zeigt Drag-Targets und Auswahl |
| **CanvasNode** | Rendert einzelne Nodes mit Selection/Hover-Highlighting |
| **Inspector** | Eigenschafts-Panel mit 4 Tabs: Eigenschaften, Stil, Animation, Aktionen |
| **Palette** | Komponenten-Palette zum Hinzufügen neuer Elemente per Drag & Drop |
| **LayerPanel** | Hierarchische Baumansicht aller Nodes (Ebenen) |
| **Toolbar** | Obere Leiste — Breakpoint-Wechsel, Zoom, Speichern, Vorschau, Panels |
| **TemplatePicker** | Vorlagen-Browser für Sektionen und ganze Seiten |
| **PagesPanel** | Seitenverwaltung (erstellen, wechseln, löschen) |
| **SymbolsPanel** | Globale wiederverwendbare Bausteine |
| **SiteSettingsPanel** | Seitenweite Einstellungen |
| **AssetPicker** | Medienverwaltung mit Upload und Ordnern |
| **HistoryPanel** | Undo/Redo-Verlauf |
| **KeyboardShortcutsDialog** | Tastenkürzel-Referenz |
| **AnimatedWrapper** | Animations-Support pro Komponente |
| **DndProvider** | Drag-and-Drop-Kontext (dnd-kit) |

### 2. 58 registrierte Komponenten

Alle Komponenten sind in einer Whitelist registriert (`packages/core/src/registry/`). Nicht registrierte Typen zeigen einen Platzhalter.

**Layout (14)**: Section, Container, Stack, Grid, Divider, Spacer, Accordion, AccordionItem, Tabs, Tab, Carousel, Timeline, TimelineItem, CTA

**Content (12)**: Text, Heading, Image, Icon, Avatar, Progress, Rating, Counter, Quote, CodeBlock, Countdown, Marquee

**UI (9)**: Button, Card, Badge, Alert, PricingCard, FeatureCard, TestimonialCard, TeamMember, LogoCloud

**Formulare (6)**: Form, Input, Textarea, Select, Checkbox, SubmitButton

**Navigation (5)**: Navbar, Footer, Link, SocialLinks, Breadcrumb

**Medien (2)**: Video, Map

**Daten (4)**: CollectionList, RecordFieldText, Pagination, Table

**Auth/Besucher (9)**: AuthGate, LoginForm, RegisterForm, PasswordResetForm, UserProfile, UserAvatar, LogoutButton, MemberList, ProtectedContent

**Symbole (1)**: SymbolInstance (referenziert globale Bausteine)

### 3. Plugin-System

Drei eingebaute Plugins, die eigene Komponenten, Collections und Actions bereitstellen:

#### Shop-Plugin
- **Komponenten**: ProductList, ProductCard, ProductDetail, AddToCartButton, CartSummary, CartItems, CheckoutButton, PriceDisplay
- **Collections**: products, orders
- **Actions**: addToCart, removeFromCart, checkout
- **Dashboard**: Produkt- und Bestellverwaltung mit Statusfilter

#### Blog-Plugin
- **Komponenten**: PostList, PostCard, PostContent, PostMeta
- **Collections**: posts, blog-categories
- **Template**: Blog Page

#### Forum-Plugin
- **Komponenten**: ForumCategoryList, ThreadList, ThreadCard, ThreadDetail, ForumPost, NewThreadForm, ReplyForm
- **Collections**: forum-categories, forum-threads, forum-posts
- **Dashboard**: Kategorie- und Thread-Verwaltung mit Pinnen/Sperren

### 4. Section-Templates (11 Vorlagen)

Vorgefertigte Sektionen, die per Klick eingefügt werden können:

| Template | Kategorie | Beschreibung |
|----------|-----------|-------------|
| Hero – Einfach | hero | Headline + Subtext + CTA-Button |
| Hero – Mit Bild | hero | Hero mit seitlichem Bild |
| Features – 3 Spalten | features | Feature-Grid mit Icons |
| Pricing – 3 Stufen | pricing | Preistabelle mit 3 Plänen |
| CTA – Banner | cta | Call-to-Action-Banner |
| Kontakt – Formular | contact | Kontaktformular mit Feldern |
| FAQ – Einfach | faq | Frage-Antwort im Akkordeon |
| Testimonials – 3 Karten | testimonials | Kundenstimmen-Karten |
| Statistiken – Zeile | stats | Zahlen/Counter in einer Reihe |
| Footer – Mehrspaltig | footer | Footer mit mehreren Spalten |
| Galerie – Raster | gallery | Bildergalerie im Grid |

### 5. CMS (Collections & Records)

- Flexibles Schema-System für Collections
- Records mit Status: DRAFT → PUBLISHED → ARCHIVED
- Bulk-Operationen (erstellen, aktualisieren, löschen)
- API mit Pagination und Filterung

### 6. Formular-Builder

- Formulardefinition mit konfigurierbarem Schema
- Öffentlicher Einreichungs-Endpunkt (ohne Auth)
- Spam-Erkennung
- E-Mail-Benachrichtigungen
- reCAPTCHA-Support
- Dashboard mit Einreichungsübersicht

### 7. Analytics-Dashboard

- **PageView-Tracking**: Öffentlicher Endpunkt erfasst Seitenaufrufe
- **User-Agent-Parsing**: Erkennung von Gerät (Mobile/Tablet/Desktop), Browser, Betriebssystem
- **Dashboard**: Gesamt-Aufrufe, Ø pro Tag, Aufrufe nach Tag (Balkendiagramm), Top-Seiten, Geräte, Browser, Referrer
- **Zeitraum-Filter**: 7, 30 oder 90 Tage

### 8. Besucher-Authentifizierung

Pro Site können sich Besucher registrieren und anmelden:

- Login / Registrierung / Passwort-Reset
- E-Mail-Verifizierung
- Mitgliederliste (öffentlich)
- Profilbearbeitung
- Rollen: ADMIN, MODERATOR, MEMBER, VIP
- `AuthGate`-Komponente schützt Inhalte im Builder
- Dashboard zur Benutzerverwaltung mit Statistiken

### 9. E-Commerce

- Produktverwaltung (Name, Beschreibung, Preis, Bestand, SKU, Bilder)
- Bestellverwaltung mit Status (PENDING → PAID → SHIPPED → DELIVERED / CANCELLED)
- Stripe-Integration für Checkout
- Shop-Komponenten im Editor (ProductList, Cart, Checkout)

### 10. Forum

- Kategorie-Verwaltung (Name, Slug, Beschreibung, Reihenfolge)
- Thread-Erstellung mit Pinnen und Sperren
- Posts/Antworten
- Dashboard mit Kategorie-Karten und Thread-Tabelle (Pagination)

### 11. Multi-Tenant mit Rollen

4-stufiges Rollenkonzept pro Workspace:
- **OWNER** — Volle Kontrolle, Abrechnung
- **ADMIN** — Verwaltung, Mitglieder einladen
- **EDITOR** — Inhalte bearbeiten, Seiten veröffentlichen
- **VIEWER** — Nur lesen

### 12. Billing & Abonnements (Stripe)

| Plan | Preis | Sites | Seiten/Site | Speicher | Extras |
|------|-------|-------|-------------|----------|--------|
| **Starter** | €0/Monat | 1 | 5 | 100 MB | — |
| **Pro** | €9/Monat | 5 | 50 | 1 GB | Custom Domains |
| **Business** | €29/Monat | 20 | 200 | 10 GB | Priority Support |
| **Enterprise** | €79/Monat | Unbegrenzt | Unbegrenzt | 50 GB | Alles inklusive |

- Stripe Checkout-Sessions
- Kundenportal für Abo-Verwaltung
- Usage-Tracking (Kontingente prüfen)
- Plan-Config im Admin-Panel editierbar

### 13. Admin-Panel (6 Seiten)

| Seite | Funktion |
|-------|----------|
| **Übersicht** | Plattform-Statistiken |
| **Benutzer** | Alle User mit Suche, Filtern, Status-Badges |
| **Benutzer-Detail** | 6 Tabs: Übersicht, Workspaces, Sites, Aktivität, Sitzungen, Account |
| **Workspaces** | Alle Workspaces verwalten |
| **Templates** | Vorlagen erstellen und verwalten |
| **Pläne** | Plan-Limits und Features konfigurieren |
| **Audit-Log** | Alle Aktionen durchsuchbar (Action, Entity, User, IP) |

### 14. Audit-Logging

~45 verschiedene Action-Types werden protokolliert, darunter:
- User-Aktionen: `user.register`, `user.login`, `user.logout`, `user.delete`
- Workspace: `workspace.create`, `workspace.update`, `workspace.delete`
- Site/Page: `site.create`, `page.publish`, `page.rollback`
- Billing: `billing.checkout`, `billing.cancel`, `subscription.updated`
- Admin: `admin.user.update`, `admin.plan.update`

Jeder Eintrag enthält: User-ID, Action, Entity-Typ, Entity-ID, IP-Adresse, User-Agent, Metadaten, Zeitstempel.

### 15. DSGVO-Konformität

- **Datenexport** (Art. 15): Benutzer können alle gespeicherten Daten exportieren
- **Account-Löschung** (Art. 17): Soft-Delete mit vollständiger Bereinigung
- **Einwilligung**: Privacy-Consent und Marketing-Consent getrennt verwaltet
- **Cookie-Consent**: Banner mit Accept/Reject
- **Impressum & Datenschutz**: Eigene Seiten unter `/impressum` und `/datenschutz`

### 16. Custom Domains

- Domain hinzufügen und DNS verifizieren
- SSL-Status-Tracking (PENDING → ACTIVE → ERROR)
- Middleware erkennt externe Hostnames und routet transparent zum richtigen Site-Inhalt
- Rewrite-Logik über `/s/_custom/`-Pfad

### 17. Asset-Management

- Datei-Upload in S3/MinIO
- Ordner-Filterung
- Tags und Metadaten (Dimensionen, MIME-Type)
- Bildoptimierung via Sharp (Resize, Thumbnails)
- URL kopieren
- Integration im Editor über AssetPicker

### 18. Symbols (Wiederverwendbare Bausteine)

- Globale Komponenten-Bäume, die auf mehreren Seiten verwendet werden können
- `SymbolInstance`-Komponententyp referenziert Symbole
- CRUD-API + Panel im Editor

### 19. Publish & Zeitplanung

- **Sofort veröffentlichen**: Erstellt eine Revision und setzt die Seite live
- **Zeitgesteuert** (`scheduledPublishAt`): Seite wird zu einem bestimmten Zeitpunkt veröffentlicht
- Revisions-System mit Rollback zu früheren Versionen

### 20. Collaborative Editing (WebSocket)

- **Server** (`collab-server.ts`): Room-basiert pro Seite, Präsenz-Tracking, Farb-Zuweisung
- **Client** (`useCollab` Hook): WebSocket-Verbindung, Remote-User-Liste, Cursor-Broadcasting
- **Protokoll**: `join` → `presence` → `cursor` / `change` → `leave`
- Unterstützte Change-Typen: `updateProps`, `updateStyle`, `deleteNode`, `replaceTree`

### 21. SEO

- **robots.txt**: Erlaubt `/`, blockiert `/api/`, `/dashboard/`, `/(auth)/`
- **sitemap.xml**: Dynamisch generiert aus allen veröffentlichten Sites und Seiten + statische Seiten
- **JSON-LD**: WebPage Structured Data auf allen veröffentlichten Seiten (schema.org)

### 22. i18n — Deutsche Benutzeroberfläche

Der gesamte Editor und das Dashboard verwenden deutsche UI-Texte:
- Inspector: Alle Eigenschafts-Labels, Tab-Namen, Select-Optionen
- Toolbar: Speichern, Vorschau, Rückgängig, Wiederholen, Panel-Tooltips
- Palette: Komponenten, Suchen
- Layer-Panel: Ebenen, Duplizieren, Löschen
- Seiten-Panel: Seiten, Erstellen, Entwurf
- Template-Picker: Vorlagen-Bibliothek, Sektionen, Ganze Seiten
- Canvas: Ladebildschirm
- Landing Page: Komplett auf Deutsch

### 23. Landing Page

Marketing-Seite unter `/` mit:
- Hero-Bereich mit CTA
- 6 Feature-Karten (Editor, CMS, E-Commerce, Forum, Sicherheit, Domains)
- Preistabelle mit 4 Plänen
- CTA-Banner
- Mehrspaltigem Footer (Produkt, Rechtliches, Kontakt)

---

## API-Referenz (90+ Endpunkte)

### Authentifizierung
| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| POST | `/api/auth/register` | Neuen Benutzer registrieren |
| POST | `/api/auth/forgot-password` | Passwort-Reset anfordern |
| POST | `/api/auth/reset-password` | Neues Passwort setzen |
| POST | `/api/auth/verify-email` | E-Mail verifizieren |
| POST | `/api/auth/resend-verification` | Verifizierungs-Mail erneut senden |

### Benutzer (DSGVO)
| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| POST | `/api/user/consent` | Einwilligung speichern |
| GET | `/api/user/data-export` | Datenexport anfordern |
| DELETE | `/api/user/delete-account` | Account löschen |
| GET/DELETE | `/api/user/sessions` | Sitzungen verwalten |

### Workspaces
| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| GET/POST | `/api/workspaces` | Auflisten / Erstellen |
| GET/PATCH/DELETE | `/api/workspaces/:id` | Lesen / Aktualisieren / Löschen |
| GET/POST | `/api/workspaces/:id/members` | Mitglieder verwalten |
| PATCH/DELETE | `/api/workspaces/:id/members/:mid` | Einzelnes Mitglied |

### Billing (Stripe)
| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| POST | `/api/workspaces/:id/billing/checkout` | Checkout-Session erstellen |
| GET | `/api/workspaces/:id/billing/portal` | Kundenportal öffnen |
| GET | `/api/workspaces/:id/billing/subscription` | Abo-Status abrufen |
| POST | `/api/workspaces/:id/billing/cancel` | Abo kündigen |
| GET | `/api/workspaces/:id/billing/usage` | Ressourcen-Nutzung prüfen |

### Assets
| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| GET | `/api/workspaces/:id/assets` | Assets auflisten |
| POST | `/api/workspaces/:id/assets/upload` | Datei hochladen |
| GET/PATCH/DELETE | `/api/workspaces/:id/assets/:aid` | Einzelnes Asset |

### Collections (CMS)
| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| GET/POST | `/api/workspaces/:id/collections` | Collections verwalten |
| GET/PATCH/DELETE | `/api/workspaces/:id/collections/:cid` | Einzelne Collection |
| GET/POST | `/api/workspaces/:id/collections/:cid/records` | Records verwalten |
| POST | `/api/workspaces/:id/collections/:cid/records/bulk` | Bulk-Operationen |
| GET/PATCH/DELETE | `/api/workspaces/:id/collections/:cid/records/:rid` | Einzelner Record |

### Sites
| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| GET/POST | `/api/workspaces/:wid/sites` | Sites auflisten / erstellen |
| GET/PATCH/DELETE | `/api/workspaces/:wid/sites/:sid` | Einzelne Site |
| GET/PATCH | `/api/workspaces/:wid/sites/:sid/settings` | Site-Einstellungen |
| GET | `/api/workspaces/:wid/sites/:sid/analytics` | Analytics-Daten |

### Pages & Publishing
| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| GET/POST | `…/sites/:sid/pages` | Seiten verwalten |
| GET/PATCH/DELETE | `…/sites/:sid/pages/:pid` | Einzelne Seite |
| POST | `…/sites/:sid/pages/:pid/publish` | Veröffentlichen |
| POST | `…/sites/:sid/pages/:pid/rollback` | Rollback |
| GET | `…/sites/:sid/pages/:pid/revisions` | Revisionen auflisten |
| GET | `…/sites/:sid/pages/:pid/revisions/:rid` | Einzelne Revision |

### Symbols
| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| GET/POST | `…/sites/:sid/symbols` | Symbols verwalten |
| GET/PATCH/DELETE | `…/sites/:sid/symbols/:symid` | Einzelnes Symbol |

### Custom Domains
| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| GET/POST | `…/sites/:sid/domains` | Domains verwalten |
| GET/PATCH/DELETE | `…/sites/:sid/domains/:did` | Einzelne Domain |

### Formulare
| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| GET/POST | `…/sites/:sid/forms` | Formulare verwalten |
| GET/PATCH/DELETE | `…/sites/:sid/forms/:fid` | Einzelnes Formular |
| GET | `…/sites/:sid/forms/:fid/submissions` | Einreichungen |
| GET/PATCH | `…/sites/:sid/forms/:fid/submissions/:subid` | Einzelne Einreichung |

### Produkte & Bestellungen
| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| GET/POST | `…/sites/:sid/products` | Produkte verwalten |
| GET/PATCH/DELETE | `…/sites/:sid/products/:pid` | Einzelnes Produkt |
| GET | `…/sites/:sid/orders` | Bestellungen auflisten |
| GET/PATCH | `…/sites/:sid/orders/:oid` | Einzelne Bestellung |

### Forum
| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| GET/POST | `…/sites/:sid/forum/categories` | Forum-Kategorien |
| GET | `…/sites/:sid/forum/threads` | Threads auflisten |

### Site-Benutzer
| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| GET | `…/sites/:sid/users` | Besucher auflisten |
| GET | `…/sites/:sid/users/stats` | Benutzer-Statistiken |
| GET/PATCH/DELETE | `…/sites/:sid/users/:uid` | Einzelner Besucher |

### Runtime (öffentlich)
| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| GET | `/api/runtime/sites/:slug` | Site-Daten abrufen |
| GET | `/api/runtime/sites/:slug/pages` | Veröffentlichte Seiten |
| GET | `/api/runtime/sites/:slug/pages/:page` | Einzelne Seite |
| POST | `/api/runtime/sites/:slug/auth/login` | Besucher-Login |
| POST | `/api/runtime/sites/:slug/auth/register` | Besucher-Registrierung |
| POST | `/api/runtime/sites/:slug/auth/logout` | Besucher-Logout |
| GET | `/api/runtime/sites/:slug/auth/me` | Aktuelle Session |
| GET | `/api/runtime/sites/:slug/auth/members` | Mitgliederliste |
| CRUD | `/api/runtime/sites/:slug/auth/profile` | Besucherprofil |
| POST | `/api/runtime/sites/:slug/auth/forgot-password` | Passwort vergessen |
| POST | `/api/runtime/sites/:slug/auth/reset-password` | Passwort zurücksetzen |
| POST | `/api/runtime/sites/:slug/auth/verify-email` | E-Mail verifizieren |

### Analytics & Öffentlich
| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| POST | `/api/analytics/track` | Seitenaufruf tracken |
| POST | `/api/public/forms/:fid/submit` | Formular öffentlich einreichen |
| GET | `/api/templates` | Templates abrufen |

### Admin
| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| GET | `/api/admin/users` | Alle Benutzer |
| GET/PATCH/DELETE | `/api/admin/users/:uid` | Einzelner Benutzer |
| GET | `/api/admin/workspaces` | Alle Workspaces |
| GET/POST | `/api/admin/templates` | Templates verwalten |
| GET/PATCH/DELETE | `/api/admin/templates/:tid` | Einzelnes Template |
| GET | `/api/admin/audit-logs` | Audit-Logs abfragen |
| GET | `/api/admin/plan-configs` | Plan-Konfigurationen |
| GET/PATCH | `/api/admin/plan-configs/:plan` | Plan bearbeiten |

### Webhooks
| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| POST | `/api/webhooks/stripe` | Stripe-Events verarbeiten |

---

## Sicherheit

| Maßnahme | Details |
|----------|---------|
| **Kein `eval()`** | Keine dynamische Code-Ausführung |
| **Kein `dangerouslySetInnerHTML`** | Nur in kontrollierten, sandboxed Kontexten |
| **Whitelist-Rendering** | Nur registrierte Komponenten werden gerendert |
| **Zod-Validierung** | Alle Eingaben werden zur Laufzeit validiert |
| **CSP-Headers** | Content Security Policy |
| **Rate-Limiting** | Redis-basiert mit In-Memory-Fallback |
| **CSRF-Schutz** | Origin-Validierung in der Security-Library |
| **XSS-Prävention** | HTML-Escaping, Slug-Sanitization, Null-Byte-Entfernung |
| **Rollenbasierter Zugriff** | OWNER > ADMIN > EDITOR > VIEWER |
| **Audit-Trail** | Alle Aktionen werden protokolliert |

---

## Tests

37 Unit-Tests in `packages/core/` mit Vitest:

```bash
pnpm test   # Alle Tests ausführen
```

| Test-Datei | Tests | Beschreibung |
|-----------|-------|-------------|
| `schemas/node.test.ts` | 23 | Node-Operationen: createNode, findNodeById, findParentNode, cloneNode, updateNodeInTree, removeNodeFromTree, insertNodeAt, moveNode, flattenTree, countNodes, Validierung |
| `registry/registry.test.ts` | 9 | Component-Registry: registrierte Typen, Pflichtfelder, defaultProps-Validierung, Hierarchie-Regeln |
| `templates/templates.test.ts` | 5 | Section-Templates: Vorhandensein, Pflichtfelder, eindeutige IDs, Root-Typen, Kategorie-Abdeckung |

---

## Datenbank-Modelle (31 Modelle)

| Modell | Beschreibung |
|--------|-------------|
| User | Plattform-Benutzer (DSGVO-Felder, Soft-Delete) |
| Account | OAuth-Provider (NextAuth) |
| Session | Auth-Sitzungen mit IP/UA-Metadaten |
| VerificationToken | NextAuth-Verifizierung |
| EmailVerificationToken | E-Mail-Verifizierung |
| PasswordResetToken | Passwort-Reset mit IP-Tracking |
| AuditLog | DSGVO-Audit-Trail |
| DataExportRequest | Datenexport-Anfragen |
| Workspace | Multi-Tenant-Workspace mit Billing und Social Links |
| WorkspaceMember | User–Workspace mit Rolle |
| PlanConfig | Editierbare Plan-Limits pro Plan |
| Site | Website mit Settings, Besucher-Auth, Publish-Status |
| CustomDomain | Domain-Verifizierung und SSL |
| Page | Seite mit builderTree JSON, SEO, Draft/Published |
| PageRevision | Versions-Snapshots |
| PageView | Analytics: Seitenaufrufe mit Gerät/Browser/Geo |
| Symbol | Wiederverwendbare Komponenten-Bäume |
| Collection | CMS-Collection-Schema |
| Record | CMS-Einträge (DRAFT/PUBLISHED/ARCHIVED) |
| Asset | Hochgeladene Dateien mit Metadaten |
| SiteUser | Registrierte Site-Besucher |
| SiteUserSession | Besucher-Sitzungen |
| SiteUserPasswordReset | Besucher-Passwort-Reset |
| Product | E-Commerce-Produkte |
| Order | Bestellungen mit Stripe-Payment |
| OrderItem | Bestellpositionen |
| Form | Formular-Definitionen |
| FormSubmission | Formular-Einreichungen |
| ForumCategory | Forum-Kategorien |
| ForumThread | Forum-Threads |
| ForumPost | Forum-Posts |
| Template | Datenbank-gespeicherte Templates |

---

## Prüfliste nach Setup

- [ ] http://localhost:3000 erreichbar (Landing Page)
- [ ] Login mit demo@builderly.dev / demo1234
- [ ] Dashboard mit Demo-Workspace sichtbar
- [ ] Neue Site erstellen
- [ ] Neue Seite erstellen
- [ ] Editor öffnen (Bearbeiten-Button)
- [ ] Komponenten im Editor hinzufügen (Drag & Drop)
- [ ] Eigenschaften und Styles im Inspector bearbeiten
- [ ] Section-Template einfügen
- [ ] Änderungen speichern
- [ ] Seite veröffentlichen
- [ ] Veröffentlichte Seite unter /s/[slug] aufrufen
- [ ] Analytics-Dashboard prüfen
- [ ] Admin-Panel unter /dashboard/admin aufrufen

---

## Lizenz

MIT

## Mitwirken

Beiträge sind willkommen! Bitte lies zuerst unsere Contributing-Richtlinien.
