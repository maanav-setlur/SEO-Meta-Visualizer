# SEO Vision

## Overview

SEO Vision is a web application that analyzes websites' SEO meta tags and provides actionable feedback. Users enter a URL, and the app fetches the page HTML server-side, extracts meta tags (title, description, Open Graph, Twitter Cards, etc.), calculates an SEO health score, and presents platform previews showing how the site appears on Google, Facebook, and Twitter. It also maintains a history of past analyses in a PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: `wouter` (lightweight client-side router) with two pages: Home (`/`) and History (`/history`)
- **State Management**: TanStack React Query for server state (fetching, caching, mutations)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming. Two font families: `Outfit` (display/headings) and `Inter` (body text)
- **Animations**: Framer Motion for smooth transitions and result reveals
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Framework**: Express.js running on Node.js with TypeScript (via `tsx`)
- **HTML Scraping**: Uses `cheerio` to parse fetched HTML and extract meta tags server-side
- **API Design**: A typed API contract is defined in `shared/routes.ts` using Zod schemas. The frontend and backend share request/response types through this contract.
- **Key Endpoints**:
  - `POST /api/analyze` — Accepts a URL, fetches the page, extracts meta tags, computes SEO score and issues, returns full analysis
  - `GET /api/history` — Returns the 20 most recent analyses
  - `DELETE /api/history` — Clears all history
- **Dev Server**: Vite middleware is used in development for HMR; in production, static files are served from `dist/public`

### Shared Code (`shared/`)
- **`schema.ts`**: Drizzle ORM table definitions, Zod validation schemas, and TypeScript type definitions for the API (MetaTags, SeoIssue, AnalyzeResponse, etc.)
- **`routes.ts`**: Typed API contract specifying method, path, input schema, and response schemas for each endpoint. Both frontend and backend import from here.

### Database
- **PostgreSQL** with Drizzle ORM
- **Schema**: Single table `analysis_history` with columns: `id` (serial PK), `url` (text), `title` (text, nullable), `created_at` (timestamp)
- **Connection**: Uses `node-postgres` (`pg.Pool`) with `DATABASE_URL` environment variable
- **Migrations**: Managed via `drizzle-kit push` (schema push approach, not migration files)

### Build System
- **Development**: `tsx server/index.ts` runs the Express server with Vite middleware for HMR
- **Production Build**: Custom `script/build.ts` that runs Vite build for the client and esbuild for the server, outputting to `dist/`
- **Server bundle**: esbuild bundles server code with select dependencies inlined (allowlisted) to reduce cold start syscalls; other deps are kept external

### Project Structure
```
client/               # Frontend React app
  src/
    components/
      analysis/       # SEO-specific components (SeoScore, IssueList, SeoPreviews, Suggestions)
      layout/         # Layout shell and sidebar navigation
      ui/             # shadcn/ui component library
    hooks/            # Custom hooks (use-analysis, use-toast, use-mobile)
    lib/              # Utilities (queryClient, cn helper)
    pages/            # Route pages (Home, History, NotFound)
server/               # Express backend
  index.ts            # Server entry point
  routes.ts           # API route handlers
  storage.ts          # Database access layer (IStorage interface + DatabaseStorage)
  db.ts               # Drizzle + pg pool setup
  vite.ts             # Vite dev middleware setup
  static.ts           # Production static file serving
shared/               # Shared between frontend and backend
  schema.ts           # DB schema + API types
  routes.ts           # API contract definitions
```

## External Dependencies

### Database
- **PostgreSQL** — Required. Connection via `DATABASE_URL` environment variable. Must be provisioned before running.

### Key NPM Packages
- **cheerio** — Server-side HTML parsing for meta tag extraction
- **drizzle-orm** + **drizzle-kit** — ORM and schema management for PostgreSQL
- **@tanstack/react-query** — Client-side async state management
- **framer-motion** — Animation library for UI transitions
- **zod** — Schema validation shared across client and server
- **wouter** — Lightweight client-side routing
- **shadcn/ui** (Radix UI primitives) — Component library foundation
- **react-icons** — Social media icons (Facebook, Twitter/X)

### External Services
- No third-party APIs or authentication services are used
- The app fetches arbitrary URLs server-side with a custom User-Agent header for SEO analysis
- Google Fonts CDN is used for Inter and Outfit typefaces