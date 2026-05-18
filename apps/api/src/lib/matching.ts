import { query } from "../db";

export interface MatchResult {
  contractor_id: string;
  name: string;
  score: number;
}

/**
 * Basic matching algorithm based on location and project type
 */
export async function findMatchingContractors(
  lead: { location_zone?: string; project_type: string },
  tenantId: string
): Promise<MatchResult[]> {
  // Get all active contractors for the tenant
  const contractors = await query<any>(
    "SELECT id, name, specialties, service_zones, is_primary FROM contractors WHERE active = TRUE AND tenant_id = $1",
    [tenantId]
  );

  const matches = contractors.map((c) => {
    let score = 0;

    // Specialty match
    if (c.specialties.includes(lead.project_type)) {
      score += 50;
    }

    // Zone match
    if (lead.location_zone && c.service_zones.includes(lead.location_zone)) {
      score += 40;
    }

    // Primary contractor bonus
    if (c.is_primary) {
      score += 10;
    }

    return {
      contractor_id: c.id,
      name: c.name,
      score,
    };
  });

  // Sort by score and filter out low matches
  return matches
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);
}
