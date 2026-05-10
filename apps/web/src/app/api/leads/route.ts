import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { notifyContractor, confirmLeadSMS } from "@/lib/twilio";
import { CreateLeadSchema, isHighValueLead } from "@pv/shared";

// POST /api/leads — create a new lead
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const highValue = isHighValueLead(d);

    const rows = await query<{ id: string }>(
      `INSERT INTO leads
        (full_name, email, phone, project_type, budget_range,
         location_zone, property_status, timeline_months, notes,
         preferred_contact, preferred_language, source)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
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

    // Confirm to the lead via SMS
    if (d.phone) {
      confirmLeadSMS(d.phone, d.full_name, d.preferred_language || "es-MX").catch(
        console.error
      );
    }

    return NextResponse.json(
      { id: leadId, high_value: highValue, message: "Lead creado" },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/leads error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// GET /api/leads — list leads (admin only)
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || authHeader !== `Bearer ${expected}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const status = req.nextUrl.searchParams.get("status");
    const limit = Math.min(
      parseInt(req.nextUrl.searchParams.get("limit") || "50"),
      200
    );
    const offset = parseInt(req.nextUrl.searchParams.get("offset") || "0");

    let sql = "SELECT * FROM leads";
    const params: unknown[] = [];

    if (status) {
      params.push(status);
      sql += ` WHERE status = $${params.length}`;
    }

    sql += " ORDER BY created_at DESC";
    params.push(limit);
    sql += ` LIMIT $${params.length}`;
    params.push(offset);
    sql += ` OFFSET $${params.length}`;

    const rows = await query(sql, params);

    return NextResponse.json({ leads: rows, count: rows.length });
  } catch (err) {
    console.error("GET /api/leads error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
