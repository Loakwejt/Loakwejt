# Dateienbaum / File Tree

Komplette Übersicht der Projektstruktur.

```
builderly/
├── .env.example                    # Umgebungsvariablen-Vorlage
├── .github/
│   └── copilot-instructions.md     # GitHub Copilot Konfiguration
├── .gitignore
├── .prettierignore
├── .prettierrc
├── README.md                       # Projektdokumentation
├── docker-compose.yml              # Docker-Dienste (PostgreSQL, Redis, MinIO)
├── package.json                    # Root-Paket-Konfiguration
├── pnpm-lock.yaml
├── pnpm-workspace.yaml             # pnpm Workspace-Konfiguration
├── turbo.json                      # Turborepo-Konfiguration
│
├── apps/
│   ├── editor/                     # Vite Visual Editor (Port 5173)
│   │   ├── .env.example
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── postcss.config.cjs
│   │   ├── tailwind.config.cjs
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── src/
│   │       ├── App.tsx             # Haupt-App-Komponente
│   │       ├── index.css           # Globale Styles
│   │       ├── main.tsx            # Entry Point
│   │       ├── vite-env.d.ts
│   │       ├── components/
│   │       │   ├── AssetPicker.tsx       # Asset-Auswahl
│   │       │   ├── Canvas.tsx            # Hauptbearbeitungsfläche
│   │       │   ├── CanvasNode.tsx        # Einzelne Canvas-Knoten
│   │       │   ├── DndProvider.tsx       # Drag-and-Drop Provider
│   │       │   ├── FloatingLayerPanel.tsx
│   │       │   ├── FloatingPalette.tsx
│   │       │   ├── Inspector.tsx         # Eigenschaften-Inspektor
│   │       │   ├── LayerPanel.tsx        # Ebenen-Panel
│   │       │   ├── PagesPanel.tsx        # Seiten-Übersicht
│   │       │   ├── Palette.tsx           # Komponenten-Palette
│   │       │   ├── SidebarLayerPanel.tsx
│   │       │   ├── SiteSettingsPanel.tsx # Site-Einstellungen
│   │       │   ├── TemplatePicker.tsx    # Vorlagen-Auswahl
│   │       │   └── Toolbar.tsx           # Werkzeugleiste
│   │       └── store/
│   │           └── editor-store.ts       # Zustand-basiertes State Management
│   │
│   └── web/                        # Next.js Dashboard + Runtime (Port 3000)
│       ├── .env.example
│       ├── next-env.d.ts
│       ├── next.config.js
│       ├── package.json
│       ├── postcss.config.js
│       ├── tailwind.config.js
│       ├── tsconfig.json
│       └── src/
│           ├── middleware.ts       # Next.js Middleware
│           ├── app/
│           │   ├── globals.css     # Globale Styles
│           │   ├── layout.tsx      # Root-Layout
│           │   ├── page.tsx        # Landing Page
│           │   ├── providers.tsx   # Context Provider
│           │   │
│           │   ├── (auth)/         # Authentifizierungs-Routen
│           │   │   ├── login/
│           │   │   │   └── page.tsx
│           │   │   └── register/
│           │   │       └── page.tsx
│           │   │
│           │   ├── (dashboard)/    # Dashboard-Routen
│           │   │   ├── layout.tsx
│           │   │   └── dashboard/
│           │   │       ├── page.tsx
│           │   │       ├── activity/
│           │   │       ├── admin/
│           │   │       ├── billing/
│           │   │       ├── settings/
│           │   │       └── workspaces/
│           │   │           └── [workspaceId]/
│           │   │               ├── layout.tsx
│           │   │               ├── page.tsx
│           │   │               ├── assets/
│           │   │               ├── collections/
│           │   │               ├── settings/
│           │   │               └── sites/
│           │   │                   └── [siteId]/
│           │   │                       └── page.tsx
│           │   │
│           │   ├── api/            # API-Routen
│           │   │   ├── admin/
│           │   │   │   └── templates/
│           │   │   ├── auth/
│           │   │   │   ├── [...nextauth]/   # NextAuth.js
│           │   │   │   └── register/
│           │   │   ├── public/
│           │   │   │   └── forms/
│           │   │   ├── runtime/
│           │   │   │   └── sites/
│           │   │   │       └── [siteSlug]/
│           │   │   │           ├── route.ts
│           │   │   │           └── pages/
│           │   │   │               ├── route.ts
│           │   │   │               └── [pageSlug]/
│           │   │   ├── templates/
│           │   │   │   └── route.ts
│           │   │   ├── webhooks/
│           │   │   │   └── stripe/
│           │   │   └── workspaces/
│           │   │       ├── route.ts
│           │   │       └── [workspaceId]/
│           │   │           ├── route.ts
│           │   │           ├── assets/
│           │   │           │   ├── route.ts
│           │   │           │   ├── upload/
│           │   │           │   └── [assetId]/
│           │   │           ├── billing/
│           │   │           ├── collections/
│           │   │           │   ├── route.ts
│           │   │           │   └── [collectionId]/
│           │   │           │       ├── route.ts
│           │   │           │       └── records/
│           │   │           └── sites/
│           │   │               ├── route.ts
│           │   │               └── [siteId]/
│           │   │                   ├── route.ts
│           │   │                   ├── forms/
│           │   │                   ├── settings/
│           │   │                   └── pages/
│           │   │                       ├── route.ts
│           │   │                       └── [pageId]/
│           │   │                           ├── route.ts
│           │   │                           ├── publish/
│           │   │                           ├── revisions/
│           │   │                           └── rollback/
│           │   │
│           │   └── s/              # Public Site Rendering
│           │       └── [siteSlug]/
│           │           ├── page.tsx
│           │           └── [pageSlug]/
│           │               └── page.tsx
│           │
│           ├── components/
│           │   ├── landing-header.tsx
│           │   ├── theme-toggle.tsx
│           │   ├── dashboard/
│           │   │   ├── create-page-dialog.tsx
│           │   │   ├── create-site-dialog.tsx
│           │   │   ├── create-workspace-dialog.tsx
│           │   │   ├── nav.tsx
│           │   │   └── workspace-sidebar.tsx
│           │   └── runtime/
│           │       └── safe-renderer.tsx
│           │
│           └── lib/
│               ├── api-handler.ts
│               ├── api-response.ts
│               ├── auth.ts
│               ├── email/
│               ├── entitlements.ts
│               ├── image-processor.ts
│               ├── permissions.ts
│               ├── rate-limit.ts
│               ├── sanitize.ts
│               ├── schema-validator.ts
│               ├── security.ts
│               ├── storage.ts
│               └── stripe.ts
│
└── packages/
    ├── config/                     # Gemeinsame Konfigurationen
    │   ├── eslint.config.js
    │   ├── package.json
    │   ├── tailwind.config.js
    │   ├── tsconfig.base.json
    │   ├── tsconfig.nextjs.json
    │   └── tsconfig.react.json
    │
    ├── core/                       # Builder-Kern
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── tsup.config.ts
    │   └── src/
    │       ├── index.ts
    │       ├── actions/
    │       │   ├── action-runner.ts
    │       │   └── index.ts
    │       ├── plugins/
    │       │   ├── index.ts
    │       │   ├── plugin-registry.ts
    │       │   └── builtin/
    │       │       ├── blog-plugin.ts
    │       │       ├── forum-plugin.ts
    │       │       ├── index.ts
    │       │       └── shop-plugin.ts
    │       ├── registry/
    │       │   ├── builtin-components.ts
    │       │   ├── component-registry.ts
    │       │   └── index.ts
    │       ├── schemas/
    │       │   ├── actions.ts
    │       │   ├── collection.ts
    │       │   ├── index.ts
    │       │   ├── node.ts
    │       │   ├── site-settings.ts
    │       │   └── style.ts
    │       └── templates/
    │           ├── index.ts
    │           ├── template-registry.ts
    │           ├── theme-transformer.ts
    │           ├── pages/
    │           │   ├── craftsman-templates.ts
    │           │   ├── index.ts
    │           │   └── landing-page-templates.ts
    │           └── sections/
    │               ├── contact-templates.ts
    │               ├── cta-templates.ts
    │               ├── faq-templates.ts
    │               ├── feature-templates.ts
    │               ├── footer-templates.ts
    │               ├── hero-templates.ts
    │               ├── index.ts
    │               ├── pricing-templates.ts
    │               ├── stats-templates.ts
    │               └── testimonial-templates.ts
    │
    ├── db/                         # Datenbank (Prisma)
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── src/
    │   │   └── index.ts
    │   └── prisma/
    │       ├── schema.prisma       # Datenbankschema
    │       ├── seed.ts             # Seed-Daten
    │       ├── update-template.ts
    │       └── migrations/         # Datenbank-Migrationen
    │
    ├── sdk/                        # API-Client & Typen
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── src/
    │       ├── index.ts
    │       ├── client/
    │       │   └── api-client.ts
    │       └── types/
    │           └── api.ts
    │
    └── ui/                         # Gemeinsame UI-Komponenten
        ├── package.json
        ├── tsconfig.json
        └── src/
            ├── globals.css
            ├── index.ts
            ├── lib/
            └── components/
                ├── alert-dialog.tsx
                ├── alert.tsx
                ├── avatar.tsx
                ├── badge.tsx
                ├── button.tsx
                ├── card.tsx
                ├── checkbox.tsx
                ├── collapsible.tsx
                ├── dialog.tsx
                ├── dropdown-menu.tsx
                ├── input.tsx
                ├── label.tsx
                ├── progress.tsx
                ├── scroll-area.tsx
                ├── select.tsx
                ├── separator.tsx
                ├── sheet.tsx
                ├── skeleton.tsx
                ├── slider.tsx
                ├── switch.tsx
                ├── table.tsx
                ├── tabs.tsx
                ├── textarea.tsx
                ├── toast.tsx
                └── tooltip.tsx
```

## Übersicht der Hauptverzeichnisse

| Verzeichnis | Beschreibung |
|-------------|-------------|
| `apps/web` | Next.js 14 Dashboard, API-Routen, Runtime-Rendering |
| `apps/editor` | Vite + React Visual Drag-and-Drop Editor |
| `packages/core` | Komponenten-Registry, Schemas, Templates, Actions, Plugins |
| `packages/db` | Prisma-Schema + Client (PostgreSQL) |
| `packages/sdk` | API-Typen und Validierungsschemas |
| `packages/ui` | Gemeinsame UI-Komponenten (shadcn/ui-Pattern) |
| `packages/config` | Gemeinsame ESLint, TypeScript, Tailwind Konfigurationen |

## Datenmodell

```
User → WorkspaceMember → Workspace → Site → Page → PageRevision
                                  ↓
                              Collection → Record
```
