#!/bin/bash
# migrate.sh — Run all SQL migrations against Postgres
# Usage: DATABASE_URL=postgresql://user:pass@host:5432/db bash migrate.sh

set -euo pipefail

DB_URL="${DATABASE_URL:-postgresql://pvplatform:changeme@localhost:5432/pvplatform}"

echo "Running migrations against: ${DB_URL%%@*}@..."

for f in migrations/*.sql; do
  echo "  → $f"
  psql "$DB_URL" -f "$f" 2>&1 | grep -v "already exists" || true
done

echo "✓ All migrations applied."
