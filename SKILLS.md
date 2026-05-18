# PV Construction Platform - Skills Registry

This document catalogs available agent skills and capabilities for developing, testing, and deploying the PV construction platform. Skills are organized by domain (Frontend, Backend, Deployment, Testing, AI Automation) with triggering conditions and tool dependencies.

## Master Skills Index

- **Automation & Code Generation**: Ralphy, jcodemunch-MCP, Pauli-Uncodixfy, matt-pocock/skills
- **Frontend & Design**: Browser-harness, uncodixfy, frontend-design
- **Backend & Data**: Paperclip, Supabase MCP, mcp2cli
- **Code Analysis**: ast-grep-MCP, comprehensive-review
- **E2E Testing**: Browser automation, E2E test framework
- **Deployment**: opensrc (Vercel labs)

---

## AI Automation & Code Generation Skills

### Ralphy - Autonomous Task Execution
**Repository**: https://github.com/michaelshimeles/ralphy.git  
**When to use**: Automating multi-step development tasks, PRD-based batch execution, autonomous coding workflows, continuous task execution without human intervention.

**Capabilities**:
- Execute complex tasks from natural language descriptions
- Maintain context across multiple sub-tasks
- Generate test suites, documentation, migrations
- Orchestrate Ralphy + jcodemunch + Uncodixfy workflows

**Triggering phrases**:
- "execute complete build plan"
- "automate this workflow"
- "run batch task generation"
- "create automated tests"

---

### jcodemunch-MCP - Token Compression for LLMs
**Repository**: https://github.com/jgravelle/jcodemunch-mcp.git  
**When to use**: Optimizing prompt context, compressing large codebases, reducing token usage in LLM calls, efficient code search and indexing.

**Capabilities**:
- Compress source code while preserving semantics
- Index entire projects for fast search
- Reduce LLM context overhead by 70-90%
- Generate efficient code summaries

**Integration**: Automatically triggered with Ralphy for token-efficient task execution

---

### Pauli-Uncodixfy - UI/UX Token Optimization
**Repository**: https://github.com/executiveusa/pauli-Uncodixfy.git  
**When to use**: Enforcing clean, human-designed UI patterns, preventing common design anti-patterns, saving tokens on design decisions.

**Capabilities**:
- Ban glassmorphism, pill-button overload, gradient abuse
- Enforce Emerald Tablet design consistency
- Optimize component tokens
- Generate design-compliant components

**Triggering phrases**:
- "clean up this UI"
- "apply design rules"
- "enforce design consistency"

---

### Matt Pocock's Skills - TypeScript & Testing
**Repository**: https://github.com/mattpocock/skills.git  
**When to use**: Advanced TypeScript patterns, testing strategies, type safety, performance optimization.

**Capabilities**:
- Expert TypeScript patterns and utilities
- Testing best practices and frameworks
- Type inference and safety techniques
- Performance profiling skills

---

### Pauli-Taste-Skill - Taste-Based Code Generation
**Repository**: git@github.com:executiveusa/pauli-taste-skill.git  
**When to use**: Generating code that matches project aesthetics and preferences, maintaining code taste consistency.

**Capabilities**:
- Learn codebase taste and style
- Generate code matching project patterns
- Enforce consistent code aesthetics

---

### Pauli-Blog - Documentation & Narrative Generation
**Repository**: git@github.com:executiveusa/pauli-blog.git  
**When to use**: Creating narratives, documentation, blog posts, API documentation, README generation.

**Capabilities**:
- Generate high-quality narratives
- Create technical documentation
- Blog post and tutorial generation
- API documentation from code

---

## Frontend Skills

### Browser-Harness - Advanced Browser Automation
**Repository**: https://github.com/browser-use/browser-harness.git  
**When to use**: Complex browser automation, multi-step workflows, advanced form interactions, screenshot testing, web scraping.

**Capabilities**:
- Advanced Playwright integration
- Multi-tab coordination
- Screenshot and video capture
- Network interception and mocking
- Cookie and session management

**Triggering phrases**:
- "test this complex workflow"
- "automate multi-step browser task"
- "capture page state"
- "validate user journey"

---

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

## Testing Skills

### E2E Testing Framework
**When to use**: End-to-end testing workflows, test suite generation, test automation, CI/CD testing pipelines.

**Available Tools**:
- Playwright for browser automation
- Jest for unit and integration testing
- Browser-harness for advanced scenarios
- Network mocking and interception

**Example E2E workflow**:
```typescript
1. Launch browser with Browser-harness
2. Navigate to app
3. Fill lead form with test data
4. Submit form
5. Verify API call received
6. Check database entry created
7. Verify confirmation email sent
8. Screenshot success state
```

**Triggering phrases**:
- "write e2e tests for the form"
- "create test suite"
- "test the entire user journey"
- "generate integration tests"

---

## Backend Skills

### Paperclip - Knowledge Management & Context
**Repository**: https://github.com/paperclipai/paperclip.git  
**When to use**: Managing knowledge bases, context preservation, documentation indexing, API documentation, system design documentation.

**Capabilities**:
- Index and search knowledge bases
- Context preservation across sessions
- API documentation generation
- System design documentation
- Markdown and technical documentation management

**Triggering phrases**:
- "index this documentation"
- "search the knowledge base"
- "create system documentation"
- "generate API docs"

---

### Supabase MCP - Database & Realtime Integration
**Repository**: https://github.com/supabase-community/supabase-mcp.git  
**When to use**: Database operations beyond PostgreSQL, realtime subscriptions, authentication, file storage, edge functions.

**Capabilities**:
- Supabase database operations
- Realtime event subscriptions
- Authentication management
- File storage integration
- Edge function deployment

**Triggering phrases**:
- "set up Supabase auth"
- "create realtime subscription"
- "upload file to storage"
- "create database table"

---

### mcp2cli - CLI Tool Integration
**Repository**: https://github.com/knowsuchagency/mcp2cli.git  
**When to use**: Integrating CLI tools with MCP, command-line automation, system commands, build tools integration.

**Capabilities**:
- Execute CLI commands from MCP context
- Capture command output
- Chain CLI operations
- Build tool automation

---

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

## Code Analysis & Search Skills

### ast-grep-MCP - AST-Based Code Search
**Repository**: https://github.com/ast-grep/ast-grep-mcp.git  
**When to use**: Advanced code search, refactoring, code pattern matching, automated fixes, multi-file transformations.

**Capabilities**:
- Pattern-based code search using AST
- Automated code refactoring
- Find all usages of patterns
- Cross-file modifications
- Language-agnostic search

**Triggering phrases**:
- "find all instances of this pattern"
- "refactor this code pattern"
- "search for deprecated APIs"
- "find unused variables"

---

## Cross-Domain Skills

### opensrc - Vercel Labs Deployment & OSS Best Practices
**Repository**: https://github.com/vercel-labs/opensrc.git  
**When to use**: Deploying to Vercel, Next.js optimization, open-source best practices, performance optimization, deployment strategies.

**Capabilities**:
- Vercel deployment automation
- Next.js performance optimization
- OSS project best practices
- CI/CD pipeline setup
- Deployment preview generation

**Triggering phrases**:
- "deploy to Vercel"
- "optimize Next.js performance"
- "set up CI/CD for OSS"
- "create deployment previews"

---

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
| Automate multi-step workflow | Ralphy + jcodemunch-MCP |
| Design a new page | `frontend-design` or `uncodixfy` |
| Test web interaction | Browser-harness or browser control tools |
| Write E2E tests | E2E Testing Framework + Browser automation |
| Optimize code for LLM context | jcodemunch-MCP |
| Build API endpoint | API development best practices + Zod validation |
| Add database table | Database migrations + Postgres |
| Search code patterns | ast-grep-MCP |
| Deploy to production | opensrc + Vercel deployment |
| Review code | `code-review` or `comprehensive-review` |
| Create PR | `mcp_io_github_git_create_pull_request` |
| Manage knowledge base | Paperclip |
| Generate documentation | Pauli-Blog |
| Enforce UI consistency | Pauli-Uncodixfy |
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
