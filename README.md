# PV Construcción 🏗️

Bilingual AI-powered construction lead-generation platform for Puerto Vallarta / Bahía de Banderas.

**We connect American and Canadian investors with vetted Mexican contractors.**

## Quick Start

```bash
# 1. Clone
git clone https://github.com/executiveusa/pv-construction-platform.git
cd pv-construction-platform

# 2. Configure
cp .env.example .env
# Edit .env with your values

# 3. Start infrastructure
docker compose up -d          # Postgres
cd infra/tiledesk && docker compose up -d && cd ../..  # Tiledesk

# 4. Install & run
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — Spanish by default.
Open [http://localhost:3000/en](http://localhost:3000/en) — English.
Admin: [http://localhost:3000/admin](http://localhost:3000/admin).

## Architecture

```
pv-construction-platform/
├── apps/web/              # Next.js 15 + TypeScript + Tailwind
│   ├── src/app/           # App Router pages + API routes
│   ├── src/components/    # shadcn/ui + custom components
│   ├── src/lib/           # DB, Twilio, ElevenLabs clients
│   ├── src/i18n/          # next-intl v4 config
│   └── messages/          # es-MX.json, en.json
├── packages/shared/       # Zod schemas, types, qualification logic
├── infra/
│   ├── postgres/          # SQL migrations (5 tables)
│   └── tiledesk/          # Docker Compose (14 services) + chatbot flows
└── docs/                  # PRD, Runbook, Assumptions, SEO, Legal, Agents
```

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
