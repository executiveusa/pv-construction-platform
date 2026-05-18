import { Router, Response } from "express";
import { TenantRequest } from "../middleware/tenant";
import { query } from "../db";
import { CreateReviewSchema } from "@pv/shared";
import { sendReviewVerificationSMS } from "../lib/twilio";

const router = Router();

function generateVerificationCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// POST / — create a review (public)
router.post("/", async (req: TenantRequest, res: Response) => {
  try {
    const parsed = CreateReviewSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ 
        error: "Datos inválidos", 
        issues: parsed.error.flatten() 
      });
    }

    const d = parsed.data;
    const code = generateVerificationCode();
    const tenantId = req.tenantId!;

    const rows = await query<{ id: string }>(
      `INSERT INTO reviews
        (lead_id, contractor_id, rating, title, body, reviewer_name, reviewer_phone, 
         photos, verification_code, language, tenant_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING id`,
      [
        d.lead_id || null,
        d.contractor_id || null,
        d.rating,
        d.title || null,
        d.body || null,
        d.reviewer_name,
        d.reviewer_phone || null,
        d.photos ? JSON.stringify(d.photos) : null,
        code,
        d.language || "es-MX",
        tenantId
      ]
    );

    // Send SMS with verification code
    if (d.reviewer_phone) {
      sendReviewVerificationSMS(
        d.reviewer_phone,
        code,
        d.language || "es-MX"
      ).catch(console.error);
    }

    return res.status(201).json({
      id: rows[0]?.id,
      message: "Reseña creada. Revisa tu SMS para verificación.",
      verification_pending: true,
    });
  } catch (err) {
    console.error("POST /reviews error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET / — list verified reviews (public)
router.get("/", async (req: TenantRequest, res: Response) => {
  try {
    const contractorId = req.query.contractor_id as string;
    const limit = Math.min(parseInt(req.query.limit as string || "20"), 100);
    const tenantId = req.tenantId!;

    let sql = `SELECT id, rating, title, body, reviewer_name, created_at 
               FROM reviews 
               WHERE verified = true AND published = true AND tenant_id = $1`;
    const params: any[] = [tenantId];

    if (contractorId) {
      params.push(contractorId);
      sql += ` AND contractor_id = $${params.length}`;
    }

    sql += " ORDER BY created_at DESC";
    params.push(limit);
    sql += ` LIMIT $${params.length}`;

    const rows = await query(sql, params);
    res.json({ reviews: rows });
  } catch (err) {
    console.error("GET /reviews error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
