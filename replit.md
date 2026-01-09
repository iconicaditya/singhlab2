# Singh Lab Environment Website

## Overview

A full-stack research lab website for the Singh Lab at Kobe City University of Foreign Studies. The platform showcases environmental research initiatives, team members, publications, projects, and community engagement activities focused on sustainability, plastics, waste management, and climate change.

The application features a public-facing website with multiple content sections and an admin dashboard for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React Context for global app data (DataContext)
- **Styling**: Tailwind CSS v4 with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Carousel**: Embla Carousel for team member display
- **Build Tool**: Vite with custom plugins for meta images and Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints under `/api/*` prefix
- **Validation**: Zod schemas with drizzle-zod integration
- **Build**: esbuild for production bundling with dependency allowlist optimization

### Data Storage
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between frontend/backend)
- **Tables**: users, projects, team_members, publications, gallery_items, messages, research_topics

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/      # UI components (home/, admin/, ui/, layout/)
│   ├── pages/           # Route pages
│   ├── lib/             # Utilities, API client, context, i18n
│   └── hooks/           # Custom React hooks
├── server/              # Express backend
│   ├── routes.ts        # API route definitions
│   ├── storage.ts       # Database operations interface
│   └── db.ts            # Drizzle database connection
├── shared/              # Shared code between frontend/backend
│   └── schema.ts        # Drizzle schema definitions
└── migrations/          # Database migrations
```

### Key Design Patterns
- **Shared Schema**: Database schemas defined once in `shared/schema.ts`, used by both frontend (type inference) and backend (database operations)
- **Storage Interface**: `IStorage` interface in `server/storage.ts` abstracts database operations
- **API Client**: Centralized API functions in `client/src/lib/api.ts` for all HTTP requests
- **Data Context**: Global data provider (`DataContext`) manages fetched data and provides update methods
- **Internationalization**: Custom i18n system with English/Japanese translations in `client/src/lib/i18n.tsx`

### Development vs Production
- **Development**: Vite dev server with HMR, served through Express middleware
- **Production**: Static files built to `dist/public`, served by Express; server bundled to `dist/index.cjs`

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless Postgres database
- **Connection**: Uses `NEON_DATABASE_URL` or `DATABASE_URL` environment variable
- **Driver**: `pg` (node-postgres) with connection pooling

### Third-Party UI Libraries
- **Radix UI**: Headless accessible components (dialog, dropdown, tabs, etc.)
- **Lucide React**: Icon library
- **Embla Carousel**: Touch-friendly carousel
- **shadcn/ui**: Pre-styled component library built on Radix

### Deployment Configuration
- **Backend/Frontend**: Render (configured via `render.yaml`)
- **Database**: Neon (PostgreSQL)
- **CORS**: Configured to allow cross-origin requests.

### Environment Variables Required
- `DATABASE_URL` or `NEON_DATABASE_URL`: PostgreSQL connection string
- `FRONTEND_URL`: Production frontend URL (for CORS)
- `NODE_ENV`: Runtime environment
- `VITE_API_URL`: Frontend API base URL (for production API calls)