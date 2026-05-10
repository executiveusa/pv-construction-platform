-- =============================================================================
-- 004_reviews.sql — Verified client reviews
-- =============================================================================

CREATE TABLE reviews (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id           UUID REFERENCES leads(id),
  contractor_id     UUID REFERENCES contractors(id),
  reviewer_name     TEXT NOT NULL,
  reviewer_phone    TEXT,
  rating            INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title             TEXT,
  body              TEXT,
  photos            JSONB DEFAULT '[]',
  verified          BOOLEAN DEFAULT FALSE,
  verification_code TEXT,
  verified_at       TIMESTAMPTZ,
  language          TEXT DEFAULT 'es-MX',
  published         BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_published ON reviews(published) WHERE published = TRUE;
CREATE INDEX idx_reviews_contractor ON reviews(contractor_id);

CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
