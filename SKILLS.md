# PV Construction Platform - Skills Registry

This document catalogs available agent skills and capabilities for developing, testing, and deploying the PV construction platform. Skills are organized by domain (Frontend, Backend, Deployment, Testing) with triggering conditions and tool dependencies.

## Frontend Skills

### Browser Automation & Testing
**When to use**: Testing web interfaces, form interactions, responsive design validation, login flows, screenshot capture, web scraping, automating user workflows.

**Available Tools**:
- `open_browser_page` – Launch a new browser tab at a given URL
- `click_element` – Click buttons, links, or interactive elements
- `type_in_page` – Type text into input fields or textareas
- `read_page` – Get accessibility snapshot and page state
- `screenshot_page` – Capture visual representation of current viewport
- `navigate_page` – Navigate by URL, back/forward, or reload
- `hover_element` – Hover over elements to trigger tooltips or menus
- `handle_dialog` – Respond to modals, alerts, confirm dialogs
- `run_playwright_code` – Execute custom Playwright scripts for advanced automation
- `mcp_microsoft_pla_browser_*` – Extended browser controls (drag, typing, console messages)

**Triggering phrases**:
- "test the web app"
- "check if the form works"
- "take a screenshot of the page"
- "fill out the lead form"
- "validate responsive design"
- "login to the app"
- "test the checkout flow"
- "click the button and verify"

**Example workflow**:
```
1. open_browser_page("http://localhost:3000")
2. click_element → select lead form
3. type_in_page → fill fields
4. click_element → submit button
5. screenshot_page → capture success state
6. read_page → verify form submission
```

---

### UI/Component Development
**When to use**: Building new pages, components, dashboards, forms, layouts, styling with Tailwind CSS and shadcn/ui.

**Available Skills**:
- **uncodixfy** – Enforces clean, human-designed UI (bans glassmorphism, pill overload, gradient abuse)
- **frontend-design** – Design mockups, landing pages, and application interfaces
- **frontend-design-meta** – Master frontend design workflow with aesthetic enforcement

**Stack**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, next-intl

**Triggering phrases**:
- "design a new page"
- "create a landing page"
- "build a dashboard"
- "design the admin interface"
- "create a responsive form"

**Code patterns**:
- Bilingual routing via `next-intl` → use `[locale]` folders
- Shared UI components in `apps/web/src/components/ui/`
- i18n strings in `apps/web/messages/{en.json, es-MX.json}`

---

## Backend Skills

### API Development & Validation
**When to use**: Building REST endpoints, validating request/response data, database queries, third-party integrations.

**Tech Stack**:
- **Framework**: Next.js 15 API Routes (folder: `apps/web/src/app/api/`)
- **Validation**: Zod schemas from `packages/shared`
- **Database**: PostgreSQL 16 via `pg` client
- **External APIs**: Twilio (SMS/voice), ElevenLabs (TTS), Tiledesk (chat)

**Key Files**:
- Lead management: `apps/web/src/app/api/leads/route.ts`
- Contractor management: `apps/web/src/app/api/contractors/route.ts`
- Review system: `apps/web/src/app/api/reviews/route.ts`
- Twilio webhooks: `apps/web/src/app/api/twilio/*`
- Tiledesk integration: `apps/web/src/app/api/tiledesk/lead-intake/route.ts`

**Triggering phrases**:
- "add an API endpoint"
- "fix the schema validation"
- "connect the database query"
- "integrate with Twilio"
- "handle the webhook"

**Example API pattern**:
```typescript
// POST /api/leads
import { leadSchema } from '@/packages/shared';
export async function POST(req: Request) {
  const data = await req.json();
  const validated = leadSchema.parse(data); // Zod validation
  const result = await db.query(
    'INSERT INTO leads (...) VALUES (...)',
    [validated.field]
  );
  return Response.json(result);
}
```

---

### Database & Migrations
**When to use**: Schema design, migrations, data model updates, SQL queries.

**Location**: `infra/postgres/migrations/`

**Migrations**:
- `001_leads.sql` – Lead model
- `002_contractors.sql` – Contractor model
- `003_assignments.sql` – Lead-to-contractor assignments
- `004_reviews.sql` – Verified reviews
- `005_social_impact.sql` – Impact metrics

**Commands**:
```bash
npm run db:migrate          # Run migrations
npm run infra:up           # Start PostgreSQL container
```

**Triggering phrases**:
- "add a new database table"
- "update the schema"
- "create a migration"
- "fix the database query"

---

### Infrastructure & Deployment
**When to use**: Docker setup, reverse proxy configuration, TLS/SSL, VPS deployment, monitoring.

**Tech Stack**:
- **Docker Compose**: Manages PostgreSQL, Caddy, web app
- **Reverse Proxy**: Caddy (automatic HTTPS)
- **Hosting**: VPS with Ubuntu, systemd, certbot
- **Monitoring**: System health checks, application logs

**Key Files**:
- `docker-compose.yml` – Service orchestration
- `apps/web/Dockerfile` – Multi-stage build for Next.js
- `docs/DEPLOYMENT.md` – Deployment runbook
- `docs/SECURITY_ROTATION.md` – Credential rotation procedures

**Commands**:
```bash
npm run infra:up           # Start Docker services
npm run dev                # Development server
npm run build              # Production build
npm run start              # Start production server
```

**Triggering phrases**:
- "deploy to production"
- "set up Docker"
- "configure Caddy"
- "enable HTTPS"
- "monitor the app"

---

### Code Review & QA
**When to use**: Reviewing code for correctness, security, performance, and quality before merge.

**Available Skills**:
- **code-review** – Review diffs, commits, or PRs for issues
- **comprehensive-review** – Multi-model code review using specialized subagents
- **zen-comprehensive-review** – Orchestrate 3-model review, post PR comments

**Triggering phrases**:
- "review this code"
- "check for security issues"
- "review the diff"
- "is this performant?"
- "review the PR"

---

## Cross-Domain Skills

### Planning & Exploration
**When to use**: Understanding the codebase, planning implementation, exploring dependencies.

**Skills**:
- **plan** – Task breakdown and implementation planning
- **explore_subagent** – Fast codebase exploration and search

**Triggering phrases**:
- "help me plan this feature"
- "how does the lead form work?"
- "where are the API routes?"

---

### Git & Version Control
**When to use**: Managing branches, commits, pull requests, code reviews.

**Available Tools**:
- `mcp_gitkraken_git_add_or_commit` – Stage and commit changes
- `mcp_gitkraken_git_push` – Push commits to remote
- `mcp_gitkraken_git_blame` – See who last modified each line
- `mcp_gitkraken_gitlens_start_work` – Create branch linked to issue
- `mcp_gitkraken_gitlens_start_review` – Create worktree for PR review
- `mcp_io_github_git_create_pull_request` – Create PR on GitHub
- `mcp_io_github_git_create_branch` – Create new branch

**Triggering phrases**:
- "commit my changes"
- "push to GitHub"
- "create a pull request"
- "start work on this issue"

---

## Full-Stack Workflows

### Lead Generation & CRM
**Path**: `apps/web/src/app/[locale]/` → Form submission → API validation → DB insert → Twilio notify → Tiledesk intake

**Components**:
1. **Frontend**: Lead form (`lead-form.tsx`)
2. **API**: POST `/api/leads` with Zod validation
3. **Database**: `leads` table with contact info
4. **Notification**: SMS via Twilio, chat via Tiledesk
5. **Contractor**: Assignment & review workflow

---

### Bilingual Routing
**Path**: `next-intl` middleware → locale detection → `/[locale]/` folder structure

**Setup**:
- `apps/web/src/middleware.ts` – Intercepts requests, sets locale
- `apps/web/src/i18n/` – Navigation, routing config
- `apps/web/messages/` – Translation files (en.json, es-MX.json)

**Adding a new page**:
```
apps/web/src/app/[locale]/my-page/page.tsx
Translations: messages/en.json, messages/es-MX.json
```

---

## Environment & Setup

### Development
```bash
npm install                # Install all dependencies
npm run dev                # Start Next.js dev server (http://localhost:3000)
npm run infra:up           # Start PostgreSQL, Caddy
```

### Production Build
```bash
npm run build              # Compile Next.js
npm run start              # Run production server
docker-compose up -d       # Deploy with Docker Compose
```

### Database
```bash
npm run db:migrate         # Apply SQL migrations
npm run infra:up           # Start PostgreSQL container
```

---

## Browser Control Capabilities

Yes, **full browser control is available**:

✅ **Navigation**: Open URLs, go back/forward, reload  
✅ **Interaction**: Click, type, hover, drag, submit forms  
✅ **Inspection**: Read page state, accessibility snapshots  
✅ **Capture**: Screenshots, console logs, network traces  
✅ **Advanced**: Custom Playwright scripts, dialog handling  

**Use Cases**:
- Test lead form end-to-end
- Validate responsive design on mobile
- Screenshot landing pages for documentation
- Automate testing workflows
- Verify Tiledesk chat widget integration
- Test admin dashboard features

---

## Quick Reference: When to Use Each Skill

| Task | Skill / Tool |
|------|------|
| Design a new page | `frontend-design` or `uncodixfy` |
| Test web interaction | Browser control tools (`open_browser_page`, `click_element`, etc.) |
| Build API endpoint | API development best practices + Zod validation |
| Add database table | Database migrations + Postgres |
| Deploy to production | Infrastructure docs + Docker Compose |
| Review code | `code-review` or `comprehensive-review` |
| Create PR | `mcp_io_github_git_create_pull_request` |
| Explore codebase | `explore_subagent` or `plan` |
| Fix a bug | Browser testing + code review + targeted fix |

---

## Resources

- **Codebase**: `c:\Users\execu\Documents\pv-construction-platform`
- **Frontend**: `apps/web/src/` (Next.js 15, TypeScript, Tailwind, shadcn/ui)
- **Backend**: `apps/web/src/app/api/` (Next.js API Routes)
- **Shared**: `packages/shared/` (Zod schemas, types)
- **Infrastructure**: `infra/postgres/` (SQL migrations), `docker-compose.yml`
- **Documentation**: `docs/` (PRD, deployment, security)
