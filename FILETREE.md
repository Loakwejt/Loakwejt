# Dateibaum / File Tree

```
builderly/                                # Loakwejt/Loakwejt Repository
├── .env.example
├── .github/
│   └── copilot-instructions.md
├── .gitignore
├── .prettierignore
├── .prettierrc
├── README.md
├── SESSION-CONTEXT.md
├── docker-compose.yml
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── turbo.json
│
├── apps/
│   ├── editor/                          # Vite + React Editor (Port 5173)
│   │   ├── .env.example
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── postcss.config.cjs
│   │   ├── tailwind.config.cjs
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── src/
│   │       ├── App.tsx
│   │       ├── index.css
│   │       ├── main.tsx
│   │       ├── vite-env.d.ts
│   │       ├── components/
│   │       │   ├── AssetPicker.tsx
│   │       │   ├── Canvas.tsx
│   │       │   ├── CanvasNode.tsx
│   │       │   ├── DndProvider.tsx
│   │       │   ├── FloatingLayerPanel.tsx
│   │       │   ├── FloatingPalette.tsx
│   │       │   ├── Inspector.tsx
│   │       │   ├── LayerPanel.tsx
│   │       │   ├── PagesPanel.tsx
│   │       │   ├── Palette.tsx
│   │       │   ├── SidebarLayerPanel.tsx
│   │       │   ├── SiteSettingsPanel.tsx
│   │       │   ├── TemplatePicker.tsx
│   │       │   └── Toolbar.tsx
│   │       └── store/
│   │           └── editor-store.ts
│   │
│   └── web/                             # Next.js 14 App Router (Port 3000)
│       ├── .env.example
│       ├── next-env.d.ts
│       ├── next.config.js
│       ├── package.json
│       ├── postcss.config.js
│       ├── tailwind.config.js
│       ├── tsconfig.json
│       └── src/
│           ├── middleware.ts
│           ├── app/
│           │   ├── globals.css
│           │   ├── layout.tsx
│           │   ├── page.tsx
│           │   ├── providers.tsx
│           │   ├── (auth)/
│           │   │   ├── login/
│           │   │   │   └── page.tsx
│           │   │   └── register/
│           │   │       └── page.tsx
│           │   ├── (dashboard)/
│           │   │   ├── layout.tsx
│           │   │   └── dashboard/
│           │   │       ├── page.tsx
│           │   │       ├── activity/
│           │   │       │   └── page.tsx
│           │   │       ├── admin/
│           │   │       │   └── templates/
│           │   │       │       └── page.tsx
│           │   │       ├── billing/
│           │   │       │   └── page.tsx
│           │   │       ├── settings/
│           │   │       │   └── page.tsx
│           │   │       └── workspaces/
│           │   │           └── [workspaceId]/
│           │   │               ├── layout.tsx
│           │   │               ├── page.tsx
│           │   │               ├── assets/
│           │   │               │   └── page.tsx
│           │   │               ├── collections/
│           │   │               │   ├── page.tsx
│           │   │               │   └── [collectionId]/
│           │   │               │       └── page.tsx
│           │   │               ├── settings/
│           │   │               │   └── page.tsx
│           │   │               └── sites/
│           │   │                   └── [siteId]/
│           │   │                       └── page.tsx
│           │   ├── api/
│           │   │   ├── admin/
│           │   │   │   └── templates/
│           │   │   │       ├── route.ts
│           │   │   │       └── [templateId]/
│           │   │   │           └── route.ts
│           │   │   ├── auth/
│           │   │   │   ├── register/
│           │   │   │   │   └── route.ts
│           │   │   │   └── [...nextauth]/
│           │   │   │       └── route.ts
│           │   │   ├── public/
│           │   │   │   └── forms/
│           │   │   │       └── [formId]/
│           │   │   │           └── submit/
│           │   │   │               └── route.ts
│           │   │   ├── runtime/
│           │   │   │   └── sites/
│           │   │   │       └── [siteSlug]/
│           │   │   │           ├── route.ts
│           │   │   │           └── pages/
│           │   │   │               ├── route.ts
│           │   │   │               └── [pageSlug]/
│           │   │   │                   └── route.ts
│           │   │   ├── templates/
│           │   │   │   └── route.ts
│           │   │   ├── webhooks/
│           │   │   │   └── stripe/
│           │   │   │       └── route.ts
│           │   │   └── workspaces/
│           │   │       ├── route.ts
│           │   │       └── [workspaceId]/
│           │   │           ├── route.ts
│           │   │           ├── assets/
│           │   │           │   ├── route.ts
│           │   │           │   ├── upload/
│           │   │           │   │   └── route.ts
│           │   │           │   └── [assetId]/
│           │   │           │       └── route.ts
│           │   │           ├── billing/
│           │   │           │   └── checkout/
│           │   │           │       └── route.ts
│           │   │           ├── collections/
│           │   │           │   ├── route.ts
│           │   │           │   └── [collectionId]/
│           │   │           │       ├── route.ts
│           │   │           │       └── records/
│           │   │           │           ├── route.ts
│           │   │           │           ├── bulk/
│           │   │           │           │   └── route.ts
│           │   │           │           └── [recordId]/
│           │   │           │               └── route.ts
│           │   │           └── sites/
│           │   │               ├── route.ts
│           │   │               └── [siteId]/
│           │   │                   ├── route.ts
│           │   │                   ├── forms/
│           │   │                   │   ├── route.ts
│           │   │                   │   └── [formId]/
│           │   │                   │       ├── route.ts
│           │   │                   │       └── submissions/
│           │   │                   │           ├── route.ts
│           │   │                   │           └── [submissionId]/
│           │   │                   │               └── route.ts
│           │   │                   ├── pages/
│           │   │                   │   ├── route.ts
│           │   │                   │   └── [pageId]/
│           │   │                   │       ├── route.ts
│           │   │                   │       ├── publish/
│           │   │                   │       │   └── route.ts
│           │   │                   │       ├── revisions/
│           │   │                   │       │   └── route.ts
│           │   │                   │       └── rollback/
│           │   │                   │           └── route.ts
│           │   │                   └── settings/
│           │   │                       └── route.ts
│           │   └── s/
│           │       └── [siteSlug]/
│           │           ├── page.tsx
│           │           └── [pageSlug]/
│           │               └── page.tsx
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
│           └── lib/
│               ├── api-handler.ts
│               ├── api-response.ts
│               ├── auth.ts
│               ├── entitlements.ts
│               ├── image-processor.ts
│               ├── permissions.ts
│               ├── rate-limit.ts
│               ├── sanitize.ts
│               ├── schema-validator.ts
│               ├── security.ts
│               ├── storage.ts
│               ├── stripe.ts
│               └── email/
│                   ├── index.ts
│                   ├── templates.ts
│                   ├── types.ts
│                   └── providers/
│                       ├── console.ts
│                       ├── resend.ts
│                       └── smtp.ts
│
└── packages/
    ├── config/                          # Shared Configuration
    │   ├── eslint.config.js
    │   ├── package.json
    │   ├── tailwind.config.js
    │   ├── tsconfig.base.json
    │   ├── tsconfig.nextjs.json
    │   └── tsconfig.react.json
    │
    ├── core/                            # Core Business Logic
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
    ├── db/                              # Database (Prisma)
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── prisma/
    │   │   ├── schema.prisma
    │   │   ├── seed.ts
    │   │   ├── update-template.ts
    │   │   └── migrations/
    │   │       ├── migration_lock.toml
    │   │       └── 20260130003423_add_template_model/
    │   └── src/
    │       └── index.ts
    │
    ├── sdk/                             # API Types & Validation
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── src/
    │       ├── index.ts
    │       ├── client/
    │       │   └── api-client.ts
    │       └── types/
    │           └── api.ts
    │
    └── ui/                              # Shared UI Components (shadcn/ui)
        ├── package.json
        ├── tsconfig.json
        └── src/
            ├── globals.css
            ├── index.ts
            ├── components/
            │   ├── alert.tsx
            │   ├── alert-dialog.tsx
            │   ├── avatar.tsx
            │   ├── badge.tsx
            │   ├── button.tsx
            │   ├── card.tsx
            │   ├── checkbox.tsx
            │   ├── collapsible.tsx
            │   ├── dialog.tsx
            │   ├── dropdown-menu.tsx
            │   ├── input.tsx
            │   ├── label.tsx
            │   ├── progress.tsx
            │   ├── scroll-area.tsx
            │   ├── select.tsx
            │   ├── separator.tsx
            │   ├── sheet.tsx
            │   ├── skeleton.tsx
            │   ├── slider.tsx
            │   ├── switch.tsx
            │   ├── table.tsx
            │   ├── tabs.tsx
            │   ├── textarea.tsx
            │   ├── toast.tsx
            │   └── tooltip.tsx
            └── lib/
                └── utils.ts
```

## Architektur-Übersicht

Dieses Repository ist ein **Monorepo Website Builder** (pnpm + Turborepo) mit zwei Hauptanwendungen:

### Apps

- **`apps/web`** (Next.js 14 App Router, Port 3000): Dashboard, API-Routen, Laufzeit-Seiten-Rendering
- **`apps/editor`** (Vite + React, Port 5173): Visueller Drag-and-Drop Page Builder

### Packages

- **`packages/core`**: Komponenten-Registry, Schemas (Zod), Templates, Actions, Plugins
- **`packages/db`**: Prisma Schema + Client (PostgreSQL)
- **`packages/sdk`**: API-Typen und Validierungsschemas
- **`packages/ui`**: Geteilte UI-Komponenten (shadcn/ui-Muster mit Radix Primitives)
- **`packages/config`**: Geteilte ESLint-, TypeScript-, Tailwind-Konfigurationen

### Datenmodell

Multi-Tenant-Hierarchie: `User → WorkspaceMember → Workspace → Site → Page`
