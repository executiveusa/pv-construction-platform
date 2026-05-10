-- =============================================================================
-- 003_assignments.sql — Lead-to-contractor assignment tracking
-- =============================================================================

CREATE TYPE assignment_status AS ENUM (
  'pending',
  'accepted',
  'declined',
  'in_progress',
  'completed',
  'cancelled'
);

CREATE TABLE assignments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id         UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  contractor_id   UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
  status          assignment_status DEFAULT 'pending',
  offered_at      TIMESTAMPTZ DEFAULT NOW(),
  responded_at    TIMESTAMPTZ,
  completion_date TIMESTAMPTZ,
  referral_fee    NUMERIC(12,2),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assignments_lead ON assignments(lead_id);
CREATE INDEX idx_assignments_contractor ON assignments(contractor_id);
CREATE INDEX idx_assignments_status ON assignments(status);

CREATE TRIGGER assignments_updated_at
  BEFORE UPDATE ON assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
