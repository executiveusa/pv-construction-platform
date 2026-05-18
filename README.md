# Synthia Design Studio 🎨

**Premium design studio + directory infrastructure for SaaS founders.**  
*UDEC 8.5+ quality floor • Luxury minimalism • Revenue-generating systems*

We build directories and marketplaces that make money. Premium design + systems automation for founders who scale fast. We work with 50+ founders in Latin America.

## Design Authority

This project follows **Synthia Design Governance** — cloned from [executiveusa/synthia-superdesign](https://github.com/executiveusa/synthia-superdesign).

### UDEC 8.5 Quality Rules
- **Typography**: Cormorant Garamond (display) + DM Sans (body) — no banned fonts
- **Colors**: Single accent (#10b981) on dark canvas (#0d0f0e) — no generic gradients
- **Layout**: Golden ratio spacing, alternating sections, no generic cards
- **Psychology**: Luxury minimalism communicates confidence, not emptiness
- **Standards**: Awwwards SOTD caliber, WCAG AA accessibility

### Behavioral Laws
- **Don't Make Me Think**: Clear visual hierarchy, obvious CTAs
- **Progressive Disclosure**: Information revealed contextually
- **Error Prevention**: Validation before submission
- **Recognition Over Recall**: Consistent patterns, familiar metaphors

## Quick Start

```bash
# 1. Clone
git clone https://github.com/executiveusa/pv-construction-platform.git
cd pv-construction-platform

# 2. Configure
cp master.env .env
# Edit .env with your values

# 3. Start infrastructure
npm run infra:up          # Postgres
npm run tiledesk:up       # Tiledesk chatbot

# 4. Install & run
npm install
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) — Synthia-grade luxury landing.

## Architecture

```
pv-construction-platform/
├── apps/web/              # Next.js 15 + TypeScript + Tailwind + Synthia Design
│   ├── src/app/           # App Router pages + API routes
│   ├── src/components/    # shadcn/ui + Synthia-grade components
│   ├── src/lib/           # DB, Twilio, ElevenLabs clients
│   ├── src/i18n/          # next-intl v4 config (es-MX/en)
│   └── messages/          # es-MX.json, en.json
├── packages/shared/       # Zod schemas, types, qualification logic
├── infra/
│   ├── postgres/          # SQL migrations (5 tables)
│   └── tiledesk/          # Docker Compose (14 services) + chatbot flows
├── docs/                  # PRD, Runbook, Assumptions, SEO, Legal, Agents
└── synthia-superdesign/   # Design governance, UDEC 8.5 rules, AI studio reference
```

## What We Build

### 🎨 Design Studios
UDEC 8.5+ landing pages and product interfaces. Luxury minimalism that converts.

### ⚡ Marketplace Infrastructure
Next.js + Supabase + Stripe. Automated systems that scale to millions.

### 📊 Directory Platforms
Curated marketplaces that beat Google. Subscription revenue models.

## Investment Options

- **Strategy Audit**: $5K — 30-page design audit + technical review
- **Design Sprint**: $15K — Complete design system + Figma files
- **Full Build**: $50K–$75K — Production-ready application + infrastructure

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, PostgreSQL, pg client
- **AI/ML**: ElevenLabs TTS, Twilio SMS/Voice, Tiledesk chatbot
- **Infrastructure**: Docker Compose, SQL migrations
- **Design**: Synthia UDEC 8.5 framework, Cormorant + DM Sans
- **Internationalization**: next-intl v4 (Spanish default, English /en)

## Development Commands

```bash
npm run dev              # Start development server
npm run build           # Production build
npm run lint            # ESLint check
npm run infra:up        # Start PostgreSQL
npm run tiledesk:up     # Start Tiledesk
npm run db:migrate      # Run database migrations
```

## Design Governance

See `synthia-superdesign/` for complete design rules, patterns, and anti-patterns.

**Key Rules Applied:**
- No Inter/Roboto/Arial fonts
- Single accent color only
- Golden ratio spacing
- Luxury minimalism over generic UI
- Psychology-driven design
- WCAG AA accessibility
- Awwwards SOTD standards

## Project TODO

### Phase 1 — MVP (current)
- [x] Luxury homepage design transformed to Synthia-grade landing
- [x] Next.js app built and production build validated
- [ ] Complete bilingual pages: `servicios`, `portafolio`, `resenas`, `nosotros`, `legal`, `blog`, `zona/[slug]`
- [ ] Implement `/contacto` lead capture with API submission and validation
- [ ] Wire PostgreSQL data persistence, contractor matching, and admin tooling
- [ ] Integrate Twilio SMS/Voice, ElevenLabs TTS, and Tiledesk chatbot

### Phase 2 — Automation
- [ ] Build Beads agent coordination and Agent Mail workflow
- [ ] Add automated contractor matching logic
- [ ] Add SMS review verification and WhatsApp Business support
- [ ] Add ElevenLabs voice agent for incoming/outgoing calls

### Phase 3 — Autonomy
- [ ] Build Agent Zero autonomous operations
- [ ] Add automated social impact tracking and CRM sync
- [ ] Add Stripe + SPEI payment processing and billing flows
- [ ] Add mobile experience / React Native companion app

### Phase 4 — Ship & Validate
- [ ] Test full app end-to-end in production mode
- [ ] Push to Vercel and configure deployment
- [ ] Confirm working live Vercel link

### Execution Workflow
- [ ] Use `GSD` and `Ralphy` for planning, execution, and verification

## Deployment

Ready for production deployment with luxury design standards maintained.

This workspace uses `synthia-superdesign/` as the design and system thinking reference. All UI work should follow its luxury minimalism rules, UDEC 8.5 quality floor, and Steve Krug usability principles.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui |
| i18n | next-intl v4 (es-MX default, en at /en/) |
| Chat | Tiledesk self-hosted (14 Docker containers) |
| Database | PostgreSQL 16 |
| SMS/Voice | Twilio |
| TTS | ElevenLabs (eleven_multilingual_v2) |
| Agents | Beads + Agent Mail (Phase 2) |

## Pages

- **/** — Hero, services, trust signals, geo links
- **/servicios** — 6 service categories
- **/portafolio** — Project gallery
- **/resenas** — SMS-verified reviews
- **/nosotros** — Mission, legal, social impact
- **/contacto** — Multi-step lead form + map
- **/zona/[slug]** — 13 geo-targeted landing pages
- **/blog** — SEO content hub
- **/legal** — Bilingual disclaimers
- **/admin** — Lead management dashboard

## API Endpoints

- `POST /api/leads` — Create lead (public)
- `GET /api/leads` — List leads (admin)
- `PATCH /api/leads/[id]` — Update lead (admin)
- `POST /api/leads/[id]/assign` — Assign contractor (admin)
- `POST /api/tiledesk/lead-intake` — Chatbot webhook
- `POST /api/twilio/voice-twiml` — Voice TwiML
- `POST /api/twilio/sms-webhook` — SMS handler
- `POST /api/contractors` — Create contractor (admin)
- `GET /api/contractors` — List contractors (admin)
- `POST/GET /api/reviews` — Reviews (public)
- `POST /api/voice/tts` — ElevenLabs TTS (admin)

## Documentation

- [PRD](docs/PRD.md)
- [Deployment Runbook](docs/RUNBOOK.md)
- [Assumptions & Decisions](docs/ASSUMPTIONS.md)
- [SEO Plan](docs/SEO_PLAN.md)
- [Legal Disclaimers](docs/LEGAL_DISCLAIMERS.md)
- [Agent Orchestration](docs/AGENT_ORCHESTRATION.md)

## License

Private — © 2024 Executive USA / PV Construcción
