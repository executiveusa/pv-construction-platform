# HANDOFF: Multitenant Directory Dashboard & Skills Integration

**Generated**: 2026-05-25
**Branch**: feat/add-dashboard-skills
**Status**: Ready for handoff (merge in progress)

---

## Goal
Turn the PV Construction Platform into a multitenant, agent-friendly directory that:

- Onboards clients as tenant listings
- Generates templated landing pages per client
- Captures and routes leads per tenant
- Presents trust signals and agent-readable metadata (llm.txt)
- Uses token-efficient tooling (jcodemunch, rtk) for LLM-driven workflows

This handoff synthesizes best practices from `claude-handoff` and `mattpocock/skills` to allow any coding agent to continue work reliably.

---

## What was completed (so far)

- Added a categorized `skills/` folder with per-domain SKILL files for lazy-loading by agents.
  - `skills/README.md`, `skills/ai-automation.md`, `skills/token-optimization.md`, `skills/frontend.md`, `skills/backend.md`, `skills/testing.md`, `skills/deployment.md`, `skills/directory.md`, `skills/llm.txt`
- Added `llm.txt` at repo root and `apps/web/public/llm.txt` for agent-readability.
- Cloned token-optimization tools into `external-tools/`:
  - `external-tools/jcodemunch-mcp`
  - `external-tools/rtk`
- Built initial Directory Management Dashboard UI component and page:
  - `apps/web/src/components/DirectoryDashboard.tsx`
  - `apps/web/src/app/[locale]/dashboard/page.tsx`
- Added Directory API for tenant CRUD (basic create/list):
  - `apps/web/src/app/api/directory/route.ts`
- Added multitenancy DB migration already exists: `infra/postgres/migrations/006_multitenancy.sql`
- Fixed type issues and installed missing `openai` dependency for the web workspace.
- Verified `npm run build --workspace=apps/web` completes successfully locally.
- Created `HANDOFF.md` (this file) per `claude-handoff` guidance and `mattpocock/skills` practices.

---

## What is NOT done / open items (high priority)

1. Tenant onboarding: landing page generator for each tenant is not implemented (only tenant metadata + admin UI exists).
2. Authentication and authorization for the dashboard and APIs (admin-only endpoints) — currently unauthenticated.
3. Lead routing notifications (SMS, Tiledesk) are TODO in `apps/web/src/app/api/leads/route.ts`.
4. Full tenant isolation checks in API routes — ensure every API respects `tenant_id` on read/write.
5. CI configuration and tests: repository lacks automated CI workflows to run lint, typecheck, and build in PRs (create GitHub Actions).
6. End-to-end test suites for the admin flows and lead capture funnels.
7. File-level agent guides (`CONTEXT.md`) and domain language documents for `mattpocock/skills` `grill-with-docs`.
8. Pre-commit hooks and basic repo guardrails (`setup-pre-commit`) to ensure consistent formatting and safe pushes.
9. Optimization: integrate `jcodemunch-mcp` pipeline to produce compressed code summaries for agent queries.
10. Protected deploy pipeline (staging) and migration-runner for `infra/postgres` in CI.
11. Secrets management: `master.env` references but no secure secrets setup or instructions for local dev.
12. Unit and integration tests for the new API routes.

---

## Key Decisions & Rationale

- Use `jcodemunch-mcp` + `rtk` as the default token-saver: they provide immediate token-cost savings and indexing for agent workflows.
- Use per-category `skills/` markdown for lazy-loading agents to reduce token load (see `skills/llm.txt`).
- Keep `llm.txt` files at repo root and public web root for easy agent scanning.
- Build the dashboard as an App Router page (`/[locale]/dashboard`) to reuse Next.js localization and routing.

---

## Code Context / Quick references

- Dashboard UI: `apps/web/src/components/DirectoryDashboard.tsx`
- Dashboard page: `apps/web/src/app/[locale]/dashboard/page.tsx`
- Directory API: `apps/web/src/app/api/directory/route.ts`
- Lead API: `apps/web/src/app/api/leads/route.ts`
- DB pool helper: `apps/web/src/lib/db.ts`
- Multitenancy migration: `infra/postgres/migrations/006_multitenancy.sql`
- External token tools: `external-tools/jcodemunch-mcp`, `external-tools/rtk`
- Skills metadata: `skills/*`

---

## Reproduction / Quick dev setup

1. Copy `.env.example` to `.env.local` and set the required vars (DB URL, LLM keys if needed).
2. Start infra (Postgres) locally via Docker: `npm run infra:up` (requires Docker).
3. Run DB migrations: `npm run db:migrate` (executes `infra/postgres/migrate.sh`).
4. Start dev server:

```bash
npm run dev
# or
cd apps/web && npm run dev
```

5. Open the site at `http://localhost:3000/en/dashboard` (or `/es-MX/dashboard`).

---

## Tests / Checks to run before continuing

- `npm run lint` (apps/web workspace)
- `npm run build --workspace=apps/web` (confirm build passes)
- Run DB migrations on a staging DB and confirm `tenants` table is present and default tenant inserted.

---

## Resume Instructions (step-by-step for the next agent)

Follow these steps (numbered) to continue work reliably. Use `/grill-with-docs` or similar interrogation skills first.

1. Read this `HANDOFF.md` and `skills/` category files.
2. Run the project locally and confirm the dashboard page renders: `npm run dev` and open `/en/dashboard`.
3. Implement authentication for dashboard APIs:
   - Add simple admin auth (JWT or NextAuth) to protect `/api/directory` and `/api/leads`.
   - Add a quick smoke test to ensure unauthorized requests return 401.
4. Implement tenant landing page generator:
   - Create a template page at `apps/web/src/app/[locale]/tenants/[subdomain]/page.tsx` or similar.
   - It should pull tenant metadata by `subdomain` and render a simple landing page with `llm.txt` metadata.
5. Implement lead routing to contractor pool:
   - Complete TODOs in `apps/web/src/app/api/leads/route.ts` for SMS/Tiledesk notification.
6. Add CI workflows:
   - Create `.github/workflows/ci.yml` running `npm ci`, `npm run lint`, and build for `apps/web`.
   - Add a matrix for node versions if needed.
7. Add tests:
   - Create basic Jest + Playwright suites for API and E2E flows (lead capture form submit, tenant page render).
8. Integrate `jcodemunch-mcp` usage:
   - Build an indexing job that scans `apps/web` and generates compressed summaries for agent queries.
   - Expose an endpoint or CLI to regenerate compressed index after major changes.
9. Secrets & env:
   - Move sensitive keys into a secure store (Vault/Secrets Manager) and document `.env` usage in `README.md`.
10. Documentation:
   - Create `CONTEXT.md` with domain terms, list of tenants, and naming conventions to help agents (`mattpocock/skills` style).
   - Add a `docs/handoff/` folder with examples and a `HANDOFF_TEMPLATES.md` referencing `claude-handoff`.

---

## Failed approaches (lessons learned)

- N/A for this handoff: no approaches tried that broke the repo during the current session. If issues are later found, document them under this heading (mandatory per `claude-handoff`).

---

## Important Files to Review

- `HANDOFF.md` (this file)
- `skills/llm.txt` (agent summary)
- `apps/web/src/components/DirectoryDashboard.tsx`
- `apps/web/src/app/api/directory/route.ts`
- `infra/postgres/migrations/006_multitenancy.sql`

---

## Contacts / Maintainers

- Primary: repository owner — `executiveusa` (GitHub origin)

---

## Next agent checklist (copy into their session)

1. Run `npm ci` and `npm run build --workspace=apps/web` and paste any errors here.
2. Run migration script and validate `tenants` table.
3. Implement auth middleware and protect admin routes.
4. Implement tenant landing page generator and link to tenant list in dashboard.
5. Add CI workflow and ensure PR checks run green.

---

End of handoff. Read `skills/*` and use `/grill-with-docs` to align with project language before continuing.
