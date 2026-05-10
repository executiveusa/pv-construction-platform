import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// PATCH /api/leads/[id] — update lead status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("authorization");
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || authHeader !== `Bearer ${expected}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const allowedStatuses = [
      "new",
      "contacted",
      "qualified",
      "assigned",
      "in_progress",
      "completed",
      "lost",
    ];
    if (body.status && !allowedStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: "Estado inválido" },
        { status: 400 }
      );
    }

    const updates: string[] = [];
    const values: unknown[] = [];

    if (body.status) {
      values.push(body.status);
      updates.push(`status = $${values.length}`);
    }
    if (body.notes !== undefined) {
      values.push(body.notes);
      updates.push(`notes = $${values.length}`);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No hay campos para actualizar" },
        { status: 400 }
      );
    }

    values.push(id);
    const sql = `UPDATE leads SET ${updates.join(", ")}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`;

    const rows = await query(sql, values);
    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Lead no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ lead: rows[0] });
  } catch (err) {
    console.error("PATCH /api/leads/[id] error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// GET /api/leads/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("authorization");
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || authHeader !== `Bearer ${expected}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const rows = await query("SELECT * FROM leads WHERE id = $1", [id]);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Lead no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ lead: rows[0] });
  } catch (err) {
    console.error("GET /api/leads/[id] error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
