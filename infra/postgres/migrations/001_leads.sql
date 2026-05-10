-- =============================================================================
-- 001_leads.sql — Lead capture table
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE lead_status AS ENUM (
  'new',
  'contacted',
  'qualified',
  'assigned',
  'in_progress',
  'completed',
  'lost'
);

CREATE TYPE project_type AS ENUM (
  'new_build',
  'remodel',
  'luxury',
  'commercial',
  'land_purchase',
  'permits_only',
  'other'
);

CREATE TYPE budget_range AS ENUM (
  'under_50k',
  '50k_100k',
  '100k_250k',
  '250k_500k',
  '500k_1m',
  'over_1m'
);

CREATE TYPE contact_method AS ENUM (
  'phone',
  'whatsapp',
  'email',
  'chat'
);

CREATE TABLE leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name       TEXT NOT NULL,
  email           TEXT,
  phone           TEXT,
  project_type    project_type NOT NULL DEFAULT 'other',
  budget_range    budget_range,
  timeline_months INTEGER,
  location_zone   TEXT,
  property_status TEXT,
  preferred_contact contact_method DEFAULT 'whatsapp',
  preferred_language TEXT DEFAULT 'es-MX',
  is_high_value   BOOLEAN DEFAULT FALSE,
  status          lead_status DEFAULT 'new',
  source          TEXT DEFAULT 'website',
  notes           TEXT,
  tiledesk_request_id TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_high_value ON leads(is_high_value) WHERE is_high_value = TRUE;
CREATE INDEX idx_leads_created ON leads(created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
