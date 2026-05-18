import { Router, Response } from "express";
import { TenantRequest } from "../middleware/tenant";
import { query } from "../db";
import { CreateContractorSchema } from "@pv/shared";

const router = Router();

// POST / — create a contractor (admin)
router.post("/", async (req: TenantRequest, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || authHeader !== `Bearer ${expected}`) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const parsed = CreateContractorSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ 
        error: "Datos inválidos", 
        issues: parsed.error.flatten() 
      });
    }

    const d = parsed.data;
    const tenantId = req.tenantId!;

    const rows = await query(
      `INSERT INTO contractors
        (name, company_name, phone, email, specialties, license_info, service_zones, 
         imss_registered, repse_number, portfolio_url, is_primary, tenant_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [
        d.name,
        d.company_name || null,
        d.phone,
        d.email || null,
        d.specialties || [],
        d.license_info ? JSON.stringify(d.license_info) : null,
        d.service_zones || [],
        d.imss_registered || false,
        d.repse_number || null,
        d.portfolio_url || null,
        d.is_primary || false,
        tenantId
      ]
    );

    return res.status(201).json({ contractor: rows[0] });
  } catch (err) {
    console.error("POST /contractors error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET / — list contractors (admin)
router.get("/", async (req: TenantRequest, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || authHeader !== `Bearer ${expected}`) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const tenantId = req.tenantId!;
    const rows = await query(
      "SELECT * FROM contractors WHERE tenant_id = $1 ORDER BY created_at DESC",
      [tenantId]
    );
    res.json({ contractors: rows });
  } catch (err) {
    console.error("GET /contractors error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
