# Assumptions & Decisions Log

## Architecture
- **No Tiledesk fork**: We consume Tiledesk as a Docker dependency, not fork its codebase. This keeps us decoupled from Tiledesk versioning and reduces maintenance burden.
- **Monorepo with npm workspaces**: `apps/web` for the Next.js frontend, `packages/shared` for Zod schemas and types, `infra/` for Docker configurations.
- **Postgres for business data**: Tiledesk uses MongoDB internally. We maintain a separate PostgreSQL database for leads, contractors, reviews, assignments, and social impact tracking.

## Internationalization
- **es-MX is the default locale** with no URL prefix (e.g., `pvconstruccion.com/servicios`)
- **English** uses the `/en/` prefix (e.g., `pvconstruccion.com/en/services`)
- **next-intl v4** is used with `localePrefix: 'as-needed'`
- All user-facing strings are in message catalogs (`messages/es-MX.json`, `messages/en.json`)

## Legal
- **We are a referral agency, NOT a contractor**. This is stated prominently on the legal page and repeated in disclaimers.
- **Fideicomiso**: We provide guidance but do NOT facilitate bank trust transactions. We refer to licensed notarios.
- **REPSE**: Required for referral/outsourcing services in Mexico.
- **Social purpose**: Structured as S.A.P.I. de C.V. with carbon offset and community investment commitments.

## Authentication
- **Admin dashboard** uses a simple bearer token (`ADMIN_PASSWORD` env var). Not JWT — sufficient for single-admin MVP.
- **No user registration** — leads submit forms without accounts.
- **Review verification** via SMS code — no account needed.

## API Security
- Admin endpoints require `Authorization: Bearer <ADMIN_PASSWORD>` header.
- Public endpoints (POST /api/leads, POST /api/reviews, GET /api/reviews) have no auth.
- Tiledesk webhook validates `x-tiledesk-secret` header.
- Rate limiting deferred to reverse proxy (Caddy/nginx) for MVP.

## Third-party Integrations
- **Twilio**: SMS notifications, voice TwiML, WhatsApp (sandbox). Fire-and-forget — failures don't block lead creation.
- **ElevenLabs**: TTS for voice calls. Falls back to Twilio's Polly voices if unavailable.
- **Google Maps**: Embedded iframes for location context. No API key needed for embeds.

## Phase 2: Agent Orchestration
- **Beads**: Git-backed SQLite task tracker by Steve Yegge. Will coordinate AI agents.
- **Agent Mail MCP**: Inter-agent messaging. Agents communicate via email-like protocol.
- **Agent Zero**: Autonomous operations layer. Phase 3.

## Database Schema
- UUIDs for all primary keys (gen_random_uuid)
- ENUM types for lead_status, project_type, budget_range, contact_method, impact_type
- Soft deletes not implemented — hard deletes for GDPR compliance
- Timestamps: `created_at`, `updated_at` with auto-update trigger
- JSONB for flexible fields: `license_info` (contractors), `photos` (reviews)

## SEO Strategy
- 13 geo-targeted landing pages (`/zona/[slug]`) for each sub-region
- Schema.org LocalBusiness + Service structured data
- Dynamic sitemap with all locale variants
- Blog content hub for long-tail keywords
- `hreflang` alternates via sitemap
