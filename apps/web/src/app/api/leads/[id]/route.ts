import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { z } from 'zod';

const UpdateLeadSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'assigned', 'in_progress', 'completed', 'lost']).optional(),
  notes: z.string().optional(),
  contractorId: z.string().uuid().optional(),
});

// PATCH — Update lead status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = UpdateLeadSchema.parse(body);

    // TODO: Verify admin authentication

    const query = `
      UPDATE leads
      SET status = COALESCE($1, status),
          notes = COALESCE($2, notes)
      WHERE id = $3
      RETURNING *;
    `;

    const result = await pool.query(query, [
      data.status || null,
      data.notes || null,
      id,
    ]);

    if (!result.rows.length) {
      return NextResponse.json(
        { success: false, message: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
 lead: result.rows[0],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating lead:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

// GET — Fetch single lead
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const query = 'SELECT * FROM leads WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (!result.rows.length) {
      return NextResponse.json(
        { success: false, message: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      lead: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}
