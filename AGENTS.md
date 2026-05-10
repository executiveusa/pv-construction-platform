# Repository Guidelines

## Project Structure & Module Organization

The project is a monorepo managed with npm workspaces, designed for a bilingual construction lead-generation platform.

- **`apps/web`**: Next.js 15 application utilizing the App Router. It handles the frontend, bilingual routing (`next-intl`), and API routes for lead management and third-party integrations (Twilio, ElevenLabs, Tiledesk).
- **`packages/shared`**: Contains shared Zod schemas and TypeScript types used by both the frontend and API routes to ensure data consistency.
- **`infra/`**: Contains infrastructure configuration.
  - **`postgres/`**: SQL migrations and database setup scripts.
  - **`tiledesk/`**: Docker Compose configuration for self-hosting the Tiledesk chatbot platform (14 services).
- **`docs/`**: Centralized repository for project documentation, including PRD, SEO plans, and architectural decisions.

## Build, Test, and Development Commands

Commands should be run from the repository root using `npm`.

### Development
- **`npm run dev`**: Starts the Next.js development server for `apps/web`.
- **`npm run infra:up`**: Starts the PostgreSQL database container via Docker Compose.
- **`npm run tiledesk:up`**: Starts the Tiledesk infrastructure.

### Build & Production
- **`npm run build`**: Builds the `apps/web` application for production.
- **`npm run start`**: Starts the production server for `apps/web`.

### Database
- **`npm run db:migrate`**: Executes SQL migrations located in `infra/postgres/migrations` against the target database.

### Linting
- **`npm run lint`**: Runs ESLint for the `apps/web` workspace.

## Coding Style & Naming Conventions

- **Framework**: Next.js 15 (App Router) with TypeScript.
- **Styling**: Tailwind CSS with `shadcn/ui` components. Follow existing patterns in `apps/web/src/components`.
- **Internationalization**: Bilingual support using `next-intl`. Default locale is Spanish (`es-MX`), with English available at `/en`.
- **Validation**: Use Zod schemas defined in `packages/shared` for all data validation (API requests, form submissions).
- **API Clients**: Database access is handled via `pg`, and external services (Twilio, ElevenLabs) have dedicated clients in `apps/web/src/lib`.
