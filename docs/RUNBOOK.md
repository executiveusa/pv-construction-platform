# PV Construcción — Deployment Runbook

## Prerequisites
- VPS with Docker + Docker Compose (Ubuntu 22.04+ recommended)
- Domain pointed at VPS IP (e.g., pvconstruccion.com)
- Node.js 20+ (on build machine or CI)
- PostgreSQL client tools (optional, for manual queries)

## 1. Clone & Configure

```bash
git clone https://github.com/executiveusa/pv-construction-platform.git
cd pv-construction-platform
cp .env.example .env
# Edit .env with your real values
```

## 2. Start Infrastructure

```bash
# Start Postgres
docker compose up -d

# Start Tiledesk (14 containers)
cd infra/tiledesk
cp .env.example .env
# Edit .env — set MONGO_URL, SERVER_BASE_URL, etc.
docker compose up -d
cd ../..
```

## 3. Run Database Migrations

```bash
# Migrations auto-run via Docker entrypoint, but can be run manually:
chmod +x infra/postgres/migrate.sh
./infra/postgres/migrate.sh
```

## 4. Install Dependencies & Build

```bash
npm install
npm run build
```

## 5. Start the App

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 6. Configure Tiledesk

1. Open Tiledesk Dashboard at `http://your-server:8081/dashboard/`
2. Create a new project
3. Import the chatbot flow from `infra/tiledesk/flows/lead-intake-es.json` via Design Studio
4. Get the Project ID and save to `NEXT_PUBLIC_TILEDESK_PROJECT_ID` in `.env`
5. Set the webhook URL in Tiledesk to `https://yourdomain.com/api/tiledesk/lead-intake`

## 7. Configure Twilio

1. Get Account SID, Auth Token, and Phone Number from Twilio Console
2. Set in `.env`:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`
3. Configure webhooks in Twilio Console:
   - Voice URL: `https://yourdomain.com/api/twilio/voice-twiml`
   - SMS URL: `https://yourdomain.com/api/twilio/sms-webhook`

## 8. Configure ElevenLabs

1. Get API key from ElevenLabs dashboard
2. Set `ELEVENLABS_API_KEY` in `.env`

## 9. SSL/TLS (Production)

Use Caddy or Certbot for automatic HTTPS:

```bash
# Caddyfile example
pvconstruccion.com {
    reverse_proxy localhost:3000
}
```

## 10. Monitoring

- Tiledesk Dashboard: `https://yourdomain.com:8081/dashboard/`
- Next.js health: `https://yourdomain.com/`
- Postgres: `docker compose logs postgres`
- Tiledesk: `cd infra/tiledesk && docker compose logs -f`

## Environment Variables Reference

See `.env.example` for the full list. Critical ones:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Postgres connection string |
| `ADMIN_PASSWORD` | Yes | Admin panel bearer token |
| `NEXT_PUBLIC_TILEDESK_URL` | Yes | Tiledesk server URL |
| `NEXT_PUBLIC_TILEDESK_PROJECT_ID` | Yes | Tiledesk project ID |
| `TWILIO_ACCOUNT_SID` | For SMS | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | For SMS | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | For SMS | Twilio phone number |
| `ELEVENLABS_API_KEY` | For TTS | ElevenLabs API key |
| `JWT_SECRET` | Yes | JWT signing secret |
