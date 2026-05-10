# PV Construcción — Product Requirements Document

## Vision
AI-powered bilingual construction lead-generation platform for the Puerto Vallarta / Bahía de Banderas region. Connects American and Canadian investors with vetted Mexican contractors. Operates as a **referral agency** — not a construction company.

## Business Model
- **Lead generation and contractor matching** (referral fees: 3-8% of project value)
- **Social purpose company** (Sociedad Anónima Promotora de Inversión — S.A.P.I.): tree planting, carbon offsets, community reinvestment
- **Target geography**: 200-mile radius around Puerto Vallarta (Jalisco + Nayarit)
- **Target customers**: Foreign investors (primarily US/Canadian) seeking to build, remodel, or develop in the region

## Legal Framework
- Mexican corporate structure: S.A.P.I. de C.V. (Social Purpose)
- REPSE registration required for referral services
- Fideicomiso guidance for restricted-zone property purchases
- IMSS compliance for any employees
- RFC (tax ID) for invoicing
- Platform is NOT a contractor, does NOT hold construction licenses

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| i18n | next-intl v4 (es-MX default, en secondary) |
| Conversational AI | Tiledesk (self-hosted, 14-container Docker stack) |
| Database | PostgreSQL 16 (leads, contractors, reviews, assignments, social_impact) |
| SMS/Voice | Twilio (SMS, Voice, WhatsApp sandbox) |
| TTS | ElevenLabs (eleven_multilingual_v2, ulaw_8000 for Twilio) |
| Agent Orchestration | Beads + Agent Mail (Phase 2) |

## Architecture Decisions
1. **No Tiledesk fork** — consume as Docker dependency, embed widget, use REST API
2. **Monorepo** with npm workspaces: `apps/web`, `packages/shared`, `infra/`
3. **Spanish-first** — default locale `es-MX` has no URL prefix; English at `/en/`
4. **Postgres for business data** — separate from Tiledesk's MongoDB
5. **API routes** in Next.js for all CRUD, webhooks, and integrations

## Pages
| Route | Purpose |
|-------|---------|
| `/` | Hero, services overview, trust signals, zone links |
| `/servicios` | 6 service categories |
| `/portafolio` | Project gallery |
| `/resenas` | SMS-verified reviews |
| `/nosotros` | Mission, legal, social impact, team |
| `/contacto` | Multi-step lead form + Google Maps |
| `/legal` | Bilingual disclaimers |
| `/zona/[slug]` | 13 geo-targeted landing pages |
| `/blog` | SEO content hub |
| `/admin` | Password-protected admin dashboard |

## API Endpoints
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/leads` | Create lead (public) |
| GET | `/api/leads` | List leads (admin) |
| PATCH | `/api/leads/[id]` | Update lead status (admin) |
| POST | `/api/leads/[id]/assign` | Assign contractor (admin) |
| POST | `/api/tiledesk/lead-intake` | Tiledesk chatbot webhook |
| POST | `/api/twilio/voice-twiml` | Voice call TwiML |
| POST | `/api/twilio/sms-webhook` | SMS handler |
| POST | `/api/contractors` | Create contractor (admin) |
| GET | `/api/contractors` | List contractors (admin) |
| POST | `/api/reviews` | Create review (public) |
| GET | `/api/reviews` | List verified reviews (public) |
| POST | `/api/voice/tts` | ElevenLabs TTS (admin) |

## Phases
### Phase 1 (MVP) — Current
- Bilingual website with lead capture
- Self-hosted Tiledesk chatbot
- Postgres lead management
- Twilio SMS/Voice
- Admin dashboard
- SEO infrastructure (sitemap, robots, Schema.org, geo pages)

### Phase 2
- Beads agent coordination
- Agent Mail inter-agent messaging
- Automated contractor matching
- Review verification via SMS
- WhatsApp Business API
- ElevenLabs voice agent for phone calls

### Phase 3
- Agent Zero autonomous operations
- Automated social impact tracking
- CRM integration
- Payment processing (Stripe + SPEI)
- Mobile app (React Native)
