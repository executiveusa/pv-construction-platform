import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * GET /api/healthz
 * Health check endpoint for monitoring and load balancers.
 * Returns 200 if app + database are healthy, 503 otherwise.
 */
export async function GET(req: NextRequest) {
  try {
    // Check database connectivity
    const result = await query<{ ok: number }>(
      "SELECT 1 as ok"
    );

    if (!result || result.length === 0) {
      return NextResponse.json(
        { status: "unhealthy", reason: "Database query failed" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        checks: {
          database: "ok",
          api: "ok",
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Health check error:", err);
    return NextResponse.json(
      {
        status: "unhealthy",
        reason: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
