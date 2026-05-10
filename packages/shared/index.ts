// =============================================================================
// Shared TypeScript types and Zod schemas for PV Construction Platform
// =============================================================================

import { z } from "zod";

// ---- Enums ----

export const ProjectType = z.enum([
  "new_build",
  "remodel",
  "luxury",
  "commercial",
  "land_purchase",
  "permits_only",
  "other",
]);
export type ProjectType = z.infer<typeof ProjectType>;

export const BudgetRange = z.enum([
  "under_50k",
  "50k_100k",
  "100k_250k",
  "250k_500k",
  "500k_1m",
  "over_1m",
]);
export type BudgetRange = z.infer<typeof BudgetRange>;

export const ContactMethod = z.enum(["phone", "whatsapp", "email", "chat"]);
export type ContactMethod = z.infer<typeof ContactMethod>;

export const LeadStatus = z.enum([
  "new",
  "contacted",
  "qualified",
  "assigned",
  "in_progress",
  "completed",
  "lost",
]);
export type LeadStatus = z.infer<typeof LeadStatus>;

export const AssignmentStatus = z.enum([
  "pending",
  "accepted",
  "declined",
  "in_progress",
  "completed",
  "cancelled",
]);
export type AssignmentStatus = z.infer<typeof AssignmentStatus>;

// ---- Lead ----

export const CreateLeadSchema = z.object({
  full_name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  phone: z.string().min(7, "Teléfono requerido").optional().or(z.literal("")),
  project_type: ProjectType.default("other"),
  budget_range: BudgetRange.optional(),
  timeline_months: z.coerce.number().int().positive().optional(),
  location_zone: z.string().optional(),
  property_status: z.string().optional(),
  preferred_contact: ContactMethod.default("whatsapp"),
  preferred_language: z.string().default("es-MX"),
  notes: z.string().optional(),
  source: z.string().default("website"),
});
export type CreateLeadInput = z.infer<typeof CreateLeadSchema>;

export const LeadSchema = CreateLeadSchema.extend({
  id: z.string().uuid(),
  is_high_value: z.boolean(),
  status: LeadStatus,
  tiledesk_request_id: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Lead = z.infer<typeof LeadSchema>;

// ---- Contractor ----

export const ContractorSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  company_name: z.string().optional(),
  phone: z.string(),
  email: z.string().email().optional(),
  specialties: z.array(z.string()),
  license_info: z.record(z.unknown()).optional(),
  imss_registered: z.boolean(),
  repse_number: z.string().optional(),
  portfolio_url: z.string().url().optional(),
  service_zones: z.array(z.string()),
  is_primary: z.boolean(),
  active: z.boolean(),
});
export type Contractor = z.infer<typeof ContractorSchema>;

export const CreateContractorSchema = ContractorSchema.omit({
  id: true,
  active: true,
});
export type CreateContractorInput = z.infer<typeof CreateContractorSchema>;

// ---- Assignment ----

export const CreateAssignmentSchema = z.object({
  lead_id: z.string().uuid(),
  contractor_id: z.string().uuid(),
  notes: z.string().optional(),
});
export type CreateAssignmentInput = z.infer<typeof CreateAssignmentSchema>;

// ---- Review ----

export const CreateReviewSchema = z.object({
  lead_id: z.string().uuid().optional(),
  contractor_id: z.string().uuid().optional(),
  reviewer_name: z.string().min(2),
  reviewer_phone: z.string().optional(),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().optional(),
  body: z.string().optional(),
  photos: z.array(z.string().url()).optional(),
  language: z.string().default("es-MX"),
});
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;

// ---- Qualification Logic ----

const HIGH_VALUE_BUDGETS: BudgetRange[] = [
  "250k_500k",
  "500k_1m",
  "over_1m",
];
const HIGH_VALUE_TYPES: ProjectType[] = ["new_build", "luxury"];

export function isHighValueLead(input: CreateLeadInput): boolean {
  const hasBigBudget =
    input.budget_range != null &&
    HIGH_VALUE_BUDGETS.includes(input.budget_range);
  const isHighType = HIGH_VALUE_TYPES.includes(input.project_type);
  const hasShortTimeline =
    input.timeline_months != null && input.timeline_months <= 12;

  return (hasBigBudget || isHighType) && hasShortTimeline !== false;
}

// ---- Budget display helpers ----

export const BUDGET_LABELS: Record<BudgetRange, { es: string; en: string }> = {
  under_50k: { es: "Menos de $50,000 USD", en: "Under $50,000 USD" },
  "50k_100k": { es: "$50,000 - $100,000 USD", en: "$50,000 - $100,000 USD" },
  "100k_250k": {
    es: "$100,000 - $250,000 USD",
    en: "$100,000 - $250,000 USD",
  },
  "250k_500k": {
    es: "$250,000 - $500,000 USD",
    en: "$250,000 - $500,000 USD",
  },
  "500k_1m": {
    es: "$500,000 - $1,000,000 USD",
    en: "$500,000 - $1,000,000 USD",
  },
  over_1m: { es: "Más de $1,000,000 USD", en: "Over $1,000,000 USD" },
};

export const PROJECT_TYPE_LABELS: Record<
  ProjectType,
  { es: string; en: string }
> = {
  new_build: { es: "Construcción nueva", en: "New Build" },
  remodel: { es: "Remodelación", en: "Remodel" },
  luxury: { es: "Proyecto de lujo", en: "Luxury Project" },
  commercial: { es: "Comercial", en: "Commercial" },
  land_purchase: { es: "Compra de terreno", en: "Land Purchase" },
  permits_only: { es: "Solo permisos", en: "Permits Only" },
  other: { es: "Otro", en: "Other" },
};

export const LOCATION_ZONES = [
  "Puerto Vallarta Centro",
  "Zona Romántica",
  "Marina Vallarta",
  "Nuevo Vallarta",
  "Bucerías",
  "Punta de Mita",
  "Sayulita",
  "San Pancho",
  "La Cruz de Huanacaxtle",
  "Lo de Marcos",
  "Rincón de Guayabitos",
  "Mezcales",
  "Bahía de Banderas",
  "Otra zona",
] as const;
