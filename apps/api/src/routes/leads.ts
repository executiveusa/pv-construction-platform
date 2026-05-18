import { Router, Response } from "express";
import { TenantRequest } from "../middleware/tenant";
import { query } from "../db";
import { CreateLeadSchema, isHighValueLead } from "@pv/shared";
import { notifyContractor, confirmLeadSMS } from "../lib/twilio";
import { sendEmail, generateLeadEmailHtml } from "../lib/email";
import { findMatchingContractors } from "../lib/matching";

const router = Router();

// POST / — create a new lead
router.post("/", async (req: TenantRequest, res: Response) => {
  try {
    const parsed = CreateLeadSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ 
        error: "Datos inválidos", 
        issues: parsed.error.flatten() 
      });
    }

    const d = parsed.data;
    const highValue = isHighValueLead(d);
    const tenantId = req.tenantId!;

    const rows = await query<{ id: string }>(
      `INSERT INTO leads
        (full_name, email, phone, project_type, budget_range,
         location_zone, property_status, timeline_months, notes,
         preferred_contact, preferred_language, source, is_high_value, tenant_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING id`,
      [
        d.full_name,
        d.email || null,
        d.phone || null,
        d.project_type,
        d.budget_range || null,
        d.location_zone || null,
        d.property_status || null,
        d.timeline_months || null,
        d.notes || null,
        d.preferred_contact || "whatsapp",
        d.preferred_language || "es-MX",
        d.source || "website_form",
        highValue,
        tenantId
      ]
    );

    const leadId = rows[0]?.id;

    // Fire-and-forget notifications
    notifyContractor({
      full_name: d.full_name,
      phone: d.phone,
      project_type: d.project_type,
      budget_range: d.budget_range,
      location_zone: d.location_zone,
      is_high_value: highValue,
      leadId: leadId,
    }).catch(console.error);

    // Email notification
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      sendEmail({
        to: adminEmail,
        subject: `🔥 Nuevo Lead: ${d.full_name} (${req.tenantConfig?.name})`,
        html: generateLeadEmailHtml(d, req.tenantConfig),
      }).catch(console.error);
    }

    // Confirm to the lead via SMS
    if (d.phone) {
      confirmLeadSMS(
        d.phone, 
        d.full_name, 
        d.preferred_language || "es-MX"
      ).catch(console.error);
    }
    
    return res.status(201).json({ 
      id: leadId, 
      high_value: highValue, 
      message: "Lead creado",
      tenant: req.tenantConfig?.name
    });
  } catch (err) {
    console.error("POST /leads error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET / — list leads
router.get("/", async (req: TenantRequest, res: Response) => {
  try {
    // Basic admin check (to be improved with JWT)
    const authHeader = req.headers.authorization;
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || authHeader !== `Bearer ${expected}`) {
      return res.status(401).json({ error: "No autorizado" });
    }
    
    const status = req.query.status as string;
    const limit = Math.min(parseInt(req.query.limit as string || "50"), 200);
    const offset = parseInt(req.query.offset as string || "0");
    const tenantId = req.tenantId!;

    let sql = "SELECT * FROM leads WHERE tenant_id = $1";
    const params: any[] = [tenantId];

    if (status) {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    sql += " ORDER BY created_at DESC";
    params.push(limit);
    sql += ` LIMIT $${params.length}`;
    params.push(offset);
    sql += ` OFFSET $${params.length}`;

    const rows = await query(sql, params);

    res.json({ 
      leads: rows, 
      count: rows.length, 
      tenant: req.tenantConfig?.name 
    });
  } catch (err) {
    console.error("GET /leads error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /:id/matches — get matching contractors for a lead
router.get("/:id/matches", async (req: TenantRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId!;

    const leads = await query<any>(
      "SELECT project_type, location_zone FROM leads WHERE id = $1 AND tenant_id = $2",
      [id, tenantId]
    );

    if (leads.length === 0) {
      return res.status(404).json({ error: "Lead no encontrado" });
    }

    const matches = await findMatchingContractors(leads[0], tenantId);
    res.json({ matches });
  } catch (err) {
    console.error("GET /leads/:id/matches error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /:id/assign — assign a contractor to a lead
router.post("/:id/assign", async (req: TenantRequest, res: Response) => {
  try {
    const { id: leadId } = req.params;
    const { contractor_id, notes } = req.body;
    const tenantId = req.tenantId!;

    if (!contractor_id) {
      return res.status(400).json({ error: "contractor_id es requerido" });
    }

    // Check if lead and contractor belong to the same tenant
    const lead = await query(
      "SELECT id FROM leads WHERE id = $1 AND tenant_id = $2",
      [leadId, tenantId]
    );
    const contractor = await query(
      "SELECT id, phone, name FROM contractors WHERE id = $1 AND tenant_id = $2",
      [contractor_id, tenantId]
    );

    if (lead.length === 0 || contractor.length === 0) {
      return res.status(404).json({ error: "Lead o contratista no encontrado" });
    }

    // Create assignment
    const assignment = await query(
      `INSERT INTO assignments (lead_id, contractor_id, notes, tenant_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [leadId, contractor_id, notes || null, tenantId]
    );

    // Update lead status
    await query(
      "UPDATE leads SET status = 'assigned' WHERE id = $1",
      [leadId]
    );

    // TODO: Notify contractor via SMS/WhatsApp about the assignment
    // notifyContractorOfAssignment(contractor[0], leadId).catch(console.error);

    res.status(201).json({ 
      message: "Contratista asignado", 
      assignment: assignment[0] 
    });
  } catch (err) {
    console.error("POST /leads/:id/assign error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// PATCH /:id — update lead status or notes
router.patch("/:id", async (req: TenantRequest, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || authHeader !== `Bearer ${expected}`) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const { id } = req.params;
    const { status, notes } = req.body;
    const tenantId = req.tenantId!;

    if (!status) {
      return res.status(400).json({ error: "status es requerido" });
    }

    const allowedStatuses = [
      "new",
      "contacted",
      "qualified",
      "assigned",
      "in_progress",
      "completed",
      "lost",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Estado no válido" });
    }

    const updated = await query(
      `UPDATE leads
         SET status = $1,
             notes = COALESCE($2, notes)
       WHERE id = $3 AND tenant_id = $4
       RETURNING *`,
      [status, notes || null, id, tenantId]
    );

    if (updated.length === 0) {
      return res.status(404).json({ error: "Lead no encontrado" });
    }

    res.json({ lead: updated[0] });
  } catch (err) {
    console.error("PATCH /leads/:id error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
