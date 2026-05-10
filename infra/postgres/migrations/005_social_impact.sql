-- =============================================================================
-- 005_social_impact.sql — Social purpose tracking (carbon offsets, donations)
-- =============================================================================

CREATE TYPE impact_type AS ENUM (
  'trees_planted',
  'carbon_offset_tons',
  'community_donation',
  'material_recycled_tons',
  'local_jobs_created'
);

CREATE TABLE social_impact (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id   UUID REFERENCES assignments(id),
  impact_type     impact_type NOT NULL,
  quantity         NUMERIC(12,4) NOT NULL,
  description     TEXT,
  proof_hash      TEXT,
  verified        BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_impact_type ON social_impact(impact_type);
