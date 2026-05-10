-- =============================================================================
-- 002_contractors.sql — Vetted contractor network
-- =============================================================================

CREATE TABLE contractors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  company_name    TEXT,
  phone           TEXT NOT NULL,
  email           TEXT,
  specialties     TEXT[] DEFAULT '{}',
  license_info    JSONB DEFAULT '{}',
  imss_registered BOOLEAN DEFAULT FALSE,
  repse_number    TEXT,
  portfolio_url   TEXT,
  service_zones   TEXT[] DEFAULT '{}',
  is_primary      BOOLEAN DEFAULT FALSE,
  active          BOOLEAN DEFAULT TRUE,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER contractors_updated_at
  BEFORE UPDATE ON contractors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
