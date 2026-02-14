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
