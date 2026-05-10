# Deployment Guide — PV Construction Platform

## Quick Start (Local / VPS)

### Prerequisites
- Docker & Docker Compose 2.0+
- Ubuntu 20.04 LTS or newer (for VPS)
- 4GB+ RAM, 20GB+ disk
- Domain name with DNS pointing to VPS IP

### 1. Clone & Setup

```bash
git clone https://github.com/executiveusa/pv-construction-platform.git
cd pv-construction-platform

# Copy environment template
cp .env.example .env.production

# Edit with real values (Postgres password, Twilio keys, etc.)
nano .env.production
```

### 2. Build & Start

```bash
# Build Docker images
docker-compose build

# Start services (Postgres + Next.js web)
docker-compose up -d

# Verify health
docker-compose ps
docker logs pv-web
docker logs pv-postgres
```

### 3. Check Services

```bash
# Web app is ready when this returns 200
curl -i http://localhost:3000/

# Admin panel at:
curl -i http://localhost:3000/admin

# API health check:
curl -i http://localhost:3000/healthz

# Check database:
docker exec pv-postgres psql -U pvplatform -d pvplatform -c "SELECT COUNT(*) FROM leads;"
```

---

## VPS Production Deployment (Ubuntu 20.04)

### 1. SSH Setup

```bash
# On your local machine
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y
apt install -y curl wget gnupg lsb-release ca-certificates

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl start docker
systemctl enable docker

# Add current user to docker group
usermod -aG docker $USER
newgrp docker
```

### 2. Clone & Configure

```bash
cd /opt
git clone https://github.com/executiveusa/pv-construction-platform.git app
cd app

# Create .env.production (from .env.example)
# Use strong passwords, real API keys
nano .env.production
chmod 600 .env.production

# Backup directory
mkdir -p infra/postgres/backups
chmod 755 infra/postgres/backups
```

### 3. Reverse Proxy (Caddy)

Install Caddy for automatic HTTPS:

```bash
apt install -y caddy

# Create Caddyfile
sudo tee /etc/caddy/Caddyfile > /dev/null <<EOF
pvconstruccion.com, www.pvconstruccion.com {
  reverse_proxy localhost:3000 {
    header_uri -X-Forwarded-Proto https
  }
  
  # Security headers
  header {
    Strict-Transport-Security "max-age=31536000"
    X-Content-Type-Options "nosniff"
    X-Frame-Options "DENY"
    X-XSS-Protection "1; mode=block"
    Referrer-Policy "no-referrer-when-downgrade"
  }
  
  # Cache static files
  @static {
    path /_next/static/*
    path /favicon.ico
    path /robots.txt
    path /sitemap.xml
  }
  handle @static {
    header Cache-Control "max-age=31536000, immutable"
  }
}
EOF

sudo systemctl restart caddy
sudo systemctl enable caddy
```

### 4. Start Services

```bash
cd /opt/app

# Start docker-compose in background
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 5. Database Backups

Create backup script at `/opt/app/infra/postgres/backup.sh`:

```bash
#!/bin/bash
set -e

BACKUP_DIR="/opt/app/infra/postgres/backups"
DB_CONTAINER="pv-postgres"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Create backup
docker exec $DB_CONTAINER pg_dump -U pvplatform pvplatform | \
  gzip > "$BACKUP_DIR/backup-$TIMESTAMP.sql.gz"

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "backup-*.sql.gz" -mtime +7 -delete

echo "Backup complete: $BACKUP_DIR/backup-$TIMESTAMP.sql.gz"
```

Make executable and add to crontab:

```bash
chmod +x /opt/app/infra/postgres/backup.sh

# Daily backup at 2 AM
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/app/infra/postgres/backup.sh") | crontab -
```

### 6. Monitoring & Alerts

#### Uptime Monitoring

```bash
# Install monitoring agent (e.g., Uptime Kuma, Netdata)
# Quick health check endpoint:
curl -X GET https://pvconstruccion.com/healthz

# Set up external monitoring at:
# - StatusCake
# - UptimeRobot
# - Pingdom
# Point to: https://pvconstruccion.com/healthz
```

#### Logs & Errors

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f pv-web
docker-compose logs -f postgres

# Export logs for analysis
docker-compose logs pv-web > logs/web.log
```

#### Error Tracking (Optional: Sentry)

```bash
# Add to .env.production
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-key@sentry.io/project-id

# Sentry integration in app/web/next.config.ts
# See: https://docs.sentry.io/platforms/javascript/guides/nextjs/
```

---

## SSL Certificate (Auto-renewal)

Caddy automatically renews Let's Encrypt certificates. Verify:

```bash
sudo systemctl status caddy
sudo caddy list-modules | grep tls
```

---

## Scaling & Performance

### For Higher Load
1. **Add Redis** for caching:
   ```yaml
   # In docker-compose.yml
   redis:
     image: redis:7-alpine
     ports:
       - "6379:6379"
   ```

2. **Add Load Balancer** (HAProxy/Nginx) if running multiple `web` instances

3. **Database Connection Pooling**:
   ```bash
   # Update DATABASE_URL to use connection pooler
   DATABASE_URL=postgresql://user:pass@pgbouncer:6432/db
   ```

---

## Troubleshooting

### Port 3000 Already in Use
```bash
lsof -i :3000
kill -9 <PID>
```

### Database Connection Failed
```bash
docker-compose logs postgres
docker exec pv-postgres pg_isready
```

### Postgres Migrations Didn't Run
```bash
# Manually run migrations
docker exec pv-postgres psql -U pvplatform -d pvplatform < infra/postgres/migrations/001_leads.sql
docker exec pv-postgres psql -U pvplatform -d pvplatform < infra/postgres/migrations/002_contractors.sql
# ... etc
```

### Out of Memory
```bash
# Check current usage
docker stats

# Increase VPS RAM or optimize containers
# Limit in docker-compose.yml:
# mem_limit: 512m
```

---

## Maintenance

### Weekly
- [ ] Check logs for errors: `docker-compose logs pv-web | grep -i error`
- [ ] Verify backups exist: `ls -lh infra/postgres/backups/`

### Monthly
- [ ] Update Docker images: `docker-compose pull && docker-compose up -d`
- [ ] Review SSL certificate expiry: `sudo caddy version`
- [ ] Database optimization: `VACUUM ANALYZE leads, contractors, reviews;`

### Quarterly
- [ ] Test restore from backup
- [ ] Rotate secrets (API keys)
- [ ] Security audit

---

## Rollback Procedure

```bash
# Stop current deployment
docker-compose down

# Restore database from backup
gunzip < infra/postgres/backups/backup-YYYYMMDD.sql.gz | \
  docker exec -i pv-postgres psql -U pvplatform -d pvplatform

# Checkout previous app version
git checkout v1.0.0

# Rebuild & restart
docker-compose build && docker-compose up -d
```

---

## References
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Next.js Production Deployment](https://nextjs.org/docs/deployment)
- [Postgres Backup & Recovery](https://www.postgresql.org/docs/current/backup.html)
- [Caddy Documentation](https://caddyserver.com/docs/)

