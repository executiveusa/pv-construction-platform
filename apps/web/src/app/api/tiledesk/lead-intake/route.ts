import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * POST /api/tiledesk/lead-intake
 * Webhook endpoint for Tiledesk chatbot lead-intake flow.
 * Receives structured lead data extracted from the conversation.
 */
export async function POST(req: NextRequest) {
  try {
    // Validate webhook secret
    const secret = req.headers.get("x-tiledesk-secret");
    if (
      process.env.TILEDESK_WEBHOOK_SECRET &&
      secret !== process.env.TILEDESK_WEBHOOK_SECRET
    ) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();

    // Tiledesk sends the full conversation context.
    // Extract stored attributes from the chatbot flow.
    const attrs = body.attributes || body.lead || body;

    const fullName = attrs.full_name || attrs.nombre || "Desconocido";
    const phone = attrs.phone || attrs.telefono || null;
    const email = attrs.email || null;
    const projectType =
      attrs.project_type || attrs.tipo_proyecto || "other";
    const budgetRange =
      attrs.budget_range || attrs.presupuesto || null;
    const locationZone = attrs.location_zone || attrs.zona || null;
    const timeline =
      attrs.timeline_months || attrs.meses_plazo
        ? parseInt(attrs.timeline_months || attrs.meses_plazo)
        : null;
    const notes = attrs.notes || attrs.notas || null;

    const rows = await query<{ id: string }>(
      `INSERT INTO leads
        (full_name, email, phone, project_type, budget_range,
         location_zone, timeline_months, notes, contact_method, source, locale)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
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
      ]
    );

    const leadId = rows[0]?.id;
    console.log(`Tiledesk lead created: ${leadId}`);

    return NextResponse.json({ success: true, leadId }, { status: 201 });
  } catch (err) {
    console.error("POST /api/tiledesk/lead-intake error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
