import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { CreateReviewSchema } from "@pv/shared";
import { sendReviewVerificationSMS } from "@/lib/twilio";

function generateVerificationCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// POST /api/reviews — create a review (public)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const code = generateVerificationCode();

    const rows = await query(
      `INSERT INTO reviews
        (lead_id, contractor_id, rating, title, body, reviewer_name, reviewer_phone, photos, verification_code, language)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
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
      ]
    );

    // Send SMS with verification code
    if (d.reviewer_phone) {
      await sendReviewVerificationSMS(
        d.reviewer_phone,
        code,
        d.language || "es-MX"
      ).catch(console.error);
    }

    return NextResponse.json(
      {
        id: rows[0],
        message: "Reseña creada. Revisa tu SMS para verificación.",
        verification_pending: true,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/reviews error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// GET /api/reviews — list verified reviews (public)
export async function GET(req: NextRequest) {
  try {
    const contractorId = req.nextUrl.searchParams.get("contractor_id");
    const limit = Math.min(
      parseInt(req.nextUrl.searchParams.get("limit") || "20"),
      100
    );

    let sql = "SELECT id, rating, title, body, reviewer_name, created_at FROM reviews WHERE verified = true AND published = true";
    const params: unknown[] = [];

    if (contractorId) {
      params.push(contractorId);
      sql += ` AND contractor_id = $${params.length}`;
    }

    sql += " ORDER BY created_at DESC";
    params.push(limit);
    sql += ` LIMIT $${params.length}`;

    const rows = await query(sql, params);
    return NextResponse.json({ reviews: rows });
  } catch (err) {
    console.error("GET /api/reviews error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
