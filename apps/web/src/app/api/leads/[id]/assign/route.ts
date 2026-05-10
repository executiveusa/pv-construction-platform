import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { CreateAssignmentSchema } from "@pv/shared";

// POST /api/leads/[id]/assign — assign a contractor to the lead
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("authorization");
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || authHeader !== `Bearer ${expected}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id: leadId } = await params;
    const body = await req.json();

    const parsed = CreateAssignmentSchema.safeParse({
      lead_id: leadId,
      ...body,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const d = parsed.data;

    // Verify lead exists
    const lead = await query("SELECT id, status FROM leads WHERE id = $1", [
      leadId,
    ]);
    if (lead.length === 0) {
      return NextResponse.json(
        { error: "Lead no encontrado" },
        { status: 404 }
      );
    }

    // Verify contractor exists
    const contractor = await query(
      "SELECT id FROM contractors WHERE id = $1 AND verified = true",
      [d.contractor_id]
    );
    if (contractor.length === 0) {
      return NextResponse.json(
        { error: "Contratista no encontrado o no verificado" },
        { status: 404 }
      );
    }

    // Create assignment
    const rows = await query(
      `INSERT INTO assignments (lead_id, contractor_id, referral_fee, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [leadId, d.contractor_id, d.referral_fee || null, d.notes || null]
    );

    // Update lead status to assigned
    await query(
      "UPDATE leads SET status = 'assigned', updated_at = NOW() WHERE id = $1",
      [leadId]
    );

    return NextResponse.json(
      { assignment: rows[0], message: "Contratista asignado" },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/leads/[id]/assign error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
