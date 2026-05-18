import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { z } from 'zod';

const AssignLeadSchema = z.object({
  contractorId: z.string().uuid('Valid contractor ID required'),
  notes: z.string().optional(),
});

// POST — Assign lead to contractor
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = AssignLeadSchema.parse(body);

    // TODO: Verify admin authentication

    // Create assignment record
    const assignQuery = `
      INSERT INTO assignments (lead_id, contractor_id, status, assigned_at)
      VALUES ($1, $2, 'assigned', NOW())
      RETURNING *;
    `;

    const assignResult = await pool.query(assignQuery, [id, data.contractorId]);

    // Update lead status to assigned
    const updateQuery = `
      UPDATE leads
      SET status = 'assigned', notes = $1
      WHERE id = $2
      RETURNING *;
    `;

    const updateResult = await pool.query(updateQuery, [data.notes || null, id]);

    // TODO: Send SMS to contractor
    // const contractor = await getContractorById(data.contractorId);
    // await sendSMS(contractor.phone, `New lead assigned: ${lead.full_name}`);

    return NextResponse.json({
      success: true,
      message: 'Lead assigned successfully',
      assignment: assignResult.rows[0],
      lead: updateResult.rows[0],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Error assigning lead:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to assign lead' },
      { status: 500 }
    );
  }
}
