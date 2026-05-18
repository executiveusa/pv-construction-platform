-- =============================================================================
-- 006_multitenancy.sql — Multitenant isolation
-- =============================================================================

-- Tenant table
CREATE TABLE IF NOT EXISTS tenants (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subdomain     VARCHAR(255) UNIQUE NOT NULL,
  name          VARCHAR(255) NOT NULL,
  logo_url      TEXT,
  primary_color VARCHAR(7),
  active        BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default tenant (Puerto Vallarta main)
-- We use a fixed ID for the default tenant to simplify initial setup
INSERT INTO tenants (id, subdomain, name) 
VALUES ('d152a537-8f55-4670-8774-729f270a6c6d', 'www', 'PV Construction Main')
ON CONFLICT (subdomain) DO NOTHING;

-- Add tenant_id to all existing tables
-- We use the default tenant ID for existing records

-- Leads
ALTER TABLE leads ADD COLUMN IF NOT EXISTS tenant_id UUID NOT NULL DEFAULT 'd152a537-8f55-4670-8774-729f270a6c6d' REFERENCES tenants(id);
CREATE INDEX IF NOT EXISTS idx_leads_tenant ON leads(tenant_id);

-- Contractors
ALTER TABLE contractors ADD COLUMN IF NOT EXISTS tenant_id UUID NOT NULL DEFAULT 'd152a537-8f55-4670-8774-729f270a6c6d' REFERENCES tenants(id);
CREATE INDEX IF NOT EXISTS idx_contractors_tenant ON contractors(tenant_id);

-- Reviews
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS tenant_id UUID NOT NULL DEFAULT 'd152a537-8f55-4670-8774-729f270a6c6d' REFERENCES tenants(id);
CREATE INDEX IF NOT EXISTS idx_reviews_tenant ON reviews(tenant_id);

-- Assignments
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS tenant_id UUID NOT NULL DEFAULT 'd152a537-8f55-4670-8774-729f270a6c6d' REFERENCES tenants(id);
CREATE INDEX IF NOT EXISTS idx_assignments_tenant ON assignments(tenant_id);

-- Trigger for tenants updated_at
CREATE TRIGGER tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
