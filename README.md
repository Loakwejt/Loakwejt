# Builderly - Website Builder Platform

A complete, modular SaaS website builder platform that supports landing pages, blogs, CMS sites, shops, forums, and membership portals.

## Features

- **Visual Editor**: Drag-and-drop page builder with real-time preview
- **Multi-tenant SaaS**: User → Workspace → Sites → Pages hierarchy
- **CMS Built-in**: Collections and records for structured content
- **E-Commerce Ready**: Products, cart, and Stripe checkout (via plugin)
- **Forum Support**: Threaded discussions (via plugin)
- **Blog Support**: Posts and categories (via plugin)
- **Security First**: Whitelist-based rendering, no dynamic code execution
- **Extensible**: Plugin system for components, actions, and collections

## Tech Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Web App**: Next.js 14 (App Router)
- **Editor**: Vite + React + TypeScript
- **Database**: PostgreSQL + Prisma
- **Auth**: Auth.js (NextAuth)
- **Storage**: S3-compatible (MinIO for local dev)
- **Cache**: Redis
- **Billing**: Stripe
- **UI**: Tailwind CSS + shadcn/ui patterns
- **Validation**: Zod

## Project Structure

```
builderly/
├── apps/
│   ├── web/          # Next.js dashboard + runtime renderer
│   └── editor/       # Vite visual editor
├── packages/
│   ├── core/         # Builder schemas, registry, actions, plugins
│   ├── sdk/          # API types and client
│   ├── db/           # Prisma schema and client
│   ├── ui/           # Shared UI components
│   └── config/       # Shared configs (ESLint, TypeScript, Tailwind)
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker and Docker Compose

### 1. Clone and Install

```bash
git clone <repository-url>
cd builderly
pnpm install
```

### 2. Setup Environment Variables

```bash
# Copy environment files
cp .env.example .env
cp apps/web/.env.example apps/web/.env
cp apps/editor/.env.example apps/editor/.env
```

Edit `.env` and `apps/web/.env` with your values. For local development, the defaults work out of the box.

### 3. Start Infrastructure

```bash
# Start PostgreSQL, Redis, and MinIO
docker compose up -d

# Wait for services to be healthy
docker compose ps
```

### 4. Setup Database

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed demo data
pnpm db:seed
```

### 5. Start Development Servers

```bash
# Start all apps in development mode
pnpm dev
```

This starts:
- Web app at http://localhost:3000
- Editor at http://localhost:5173
- MinIO console at http://localhost:9001 (admin/minioadmin)

### 6. Login with Demo Account

Open http://localhost:3000 and login with:
- Email: `demo@builderly.dev`
- Password: `demo1234`

## Development Commands

```bash
# Start development
pnpm dev

# Build all packages and apps
pnpm build

# Run linting
pnpm lint

# Type checking
pnpm typecheck

# Database commands
pnpm db:generate    # Generate Prisma client
pnpm db:migrate     # Run migrations
pnpm db:seed        # Seed database

# Clean all build artifacts
pnpm clean
```

## Architecture

### Data Model

```
User → WorkspaceMember → Workspace → Site → Page → PageRevision
                                  ↓
                              Collection → Record
```

### Builder Tree Structure

Pages are stored as JSON with a versioned schema:

```typescript
interface BuilderTree {
  builderVersion: number;
  root: BuilderNode;
}

interface BuilderNode {
  id: string;
  type: string;           // Registry key
  props: object;          // Component props
  style: BuilderStyle;    // Responsive styles
  actions: ActionBinding[]; // Event handlers
  children: BuilderNode[];
}
```

### Component Registry

All components are registered in a whitelist. Unknown types render a placeholder:

```typescript
componentRegistry.register({
  type: 'Heading',
  displayName: 'Heading',
  propsSchema: z.object({ level: z.number(), text: z.string() }),
  canHaveChildren: false,
  // ...
});
```

### Action System

Actions are declarative, not code:

```typescript
const action = {
  type: 'navigate',
  to: '/about',
};
```

Supported action types:
- `navigate` - Navigate to URL
- `openModal` / `closeModal` - Modal control
- `submitForm` - Form submission to collection
- `createRecord` / `updateRecord` / `deleteRecord` - CMS operations
- `addToCart` / `checkout` - E-commerce
- `login` / `logout` - Authentication
- `scrollTo` - Scroll to element
- `setState` / `toggleState` - UI state

### Plugins

Three built-in plugins:
- **Blog**: Posts, categories, blog components
- **Shop**: Products, orders, cart/checkout components
- **Forum**: Categories, threads, posts, forum components

## Security

- **No eval()**: No dynamic code execution
- **No dangerouslySetInnerHTML**: Except in controlled sandboxed contexts
- **Whitelist rendering**: Only registered components render
- **Zod validation**: All inputs validated at runtime
- **CSP headers**: Basic Content Security Policy
- **Role-based access**: OWNER / ADMIN / EDITOR / VIEWER

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `GET /api/auth/session` - Get current session

### Workspaces
- `GET /api/workspaces` - List workspaces
- `POST /api/workspaces` - Create workspace
- `GET /api/workspaces/:id` - Get workspace
- `PATCH /api/workspaces/:id` - Update workspace
- `DELETE /api/workspaces/:id` - Delete workspace

### Sites
- `GET /api/workspaces/:wid/sites` - List sites
- `POST /api/workspaces/:wid/sites` - Create site
- `GET /api/workspaces/:wid/sites/:sid` - Get site
- `PATCH /api/workspaces/:wid/sites/:sid` - Update site
- `DELETE /api/workspaces/:wid/sites/:sid` - Delete site

### Pages
- `GET /api/workspaces/:wid/sites/:sid/pages` - List pages
- `POST /api/workspaces/:wid/sites/:sid/pages` - Create page
- `GET /api/workspaces/:wid/sites/:sid/pages/:pid` - Get page
- `PATCH /api/workspaces/:wid/sites/:sid/pages/:pid` - Update page
- `DELETE /api/workspaces/:wid/sites/:sid/pages/:pid` - Delete page
- `POST /api/workspaces/:wid/sites/:sid/pages/:pid/publish` - Publish page
- `GET /api/workspaces/:wid/sites/:sid/pages/:pid/revisions` - List revisions
- `POST /api/workspaces/:wid/sites/:sid/pages/:pid/rollback` - Rollback to revision

### Runtime (Public)
- `GET /api/runtime/sites/:slug` - Get published site
- `GET /api/runtime/sites/:slug/pages` - Get homepage
- `GET /api/runtime/sites/:slug/pages/:page` - Get page by slug

## Billing (Stripe)

Plans:
- **Free**: 1 site, 5 pages, 100MB storage
- **Pro** ($19/mo): 5 sites, 50 pages/site, 1GB storage, custom domains
- **Business** ($49/mo): 20 sites, 200 pages/site, 10GB storage, priority support

## Verification Checklist

After setup, verify:

- [ ] Can access http://localhost:3000 (landing page)
- [ ] Can login with demo@builderly.dev / demo1234
- [ ] Can see dashboard with demo workspace
- [ ] Can create a new site
- [ ] Can create a new page
- [ ] Can open editor (edit button)
- [ ] Can add components in editor
- [ ] Can modify component props/styles
- [ ] Can save changes
- [ ] Can publish page
- [ ] Can view published page at /s/[site-slug]

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines first.
