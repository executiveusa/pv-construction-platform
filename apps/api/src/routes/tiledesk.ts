import { Router, Response } from "express";
import { TenantRequest } from "../middleware/tenant";
import { query } from "../db";

const router = Router();

/**
 * POST /lead-intake
 * Webhook endpoint for Tiledesk chatbot lead-intake flow.
 */
router.post("/lead-intake", async (req: TenantRequest, res: Response) => {
  try {
    // Validate webhook secret
    const secret = req.headers["x-tiledesk-secret"];
    if (
      process.env.TILEDESK_WEBHOOK_SECRET &&
      secret !== process.env.TILEDESK_WEBHOOK_SECRET
    ) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const attrs = req.body.attributes || req.body.lead || req.body;

    const fullName = attrs.full_name || attrs.nombre || "Desconocido";
    const phone = attrs.phone || attrs.telefono || null;
    const email = attrs.email || null;
    const projectType = attrs.project_type || attrs.tipo_proyecto || "other";
    const budgetRange = attrs.budget_range || attrs.presupuesto || null;
    const locationZone = attrs.location_zone || attrs.zona || null;
    const timeline = attrs.timeline_months || attrs.meses_plazo
        ? parseInt(attrs.timeline_months || attrs.meses_plazo)
        : null;
    const notes = attrs.notes || attrs.notas || null;
    const tenantId = req.tenantId!;

    const rows = await query<{ id: string }>(
      `INSERT INTO leads
        (full_name, email, phone, project_type, budget_range,
         location_zone, timeline_months, notes, preferred_contact, source, preferred_language, tenant_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING id`,
      [
        fullName,
        email,
        phone,
        projectType,
        budgetRange,
        locationZone,
        timeline,
        notes,
        "chatbot",
        "tiledesk_chatbot",
        "es-MX",
        tenantId
      ]
    );

    const leadId = rows[0]?.id;
    console.log(`Tiledesk lead created: ${leadId} for tenant ${req.tenantConfig?.name}`);

    return res.status(201).json({ success: true, leadId });
  } catch (err) {
    console.error("POST /tiledesk/lead-intake error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
