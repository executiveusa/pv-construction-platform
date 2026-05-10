import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { CreateContractorSchema } from "@pv/shared";

// POST /api/contractors — create a contractor (admin)
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || authHeader !== `Bearer ${expected}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = CreateContractorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const d = parsed.data;

    const rows = await query(
      `INSERT INTO contractors
        (name, company_name, phone, email, specialties, license_info, service_zones, imss_registered, repse_number, portfolio_url, is_primary)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
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
      ]
    );

    return NextResponse.json({ contractor: rows[0] }, { status: 201 });
  } catch (err) {
    console.error("POST /api/contractors error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// GET /api/contractors — list contractors (admin)
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || authHeader !== `Bearer ${expected}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const rows = await query(
      "SELECT * FROM contractors ORDER BY created_at DESC"
    );
    return NextResponse.json({ contractors: rows });
  } catch (err) {
    console.error("GET /api/contractors error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
