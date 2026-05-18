import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { z } from 'zod';

const CreateContractorSchema = z.object({
  name: z.string().min(2),
  specialization: z.string(),
  phone: z.string().min(10),
  email: z.string().email().optional(),
  whatsapp: z.string().optional(),
  yearsOfExperience: z.number().int().positive().optional(),
  baseRegions: z.array(z.string()).optional(),
  isVerified: z.boolean().default(false),
});

// POST — Create contractor
export async function POST(request: NextRequest) {
  try {
    // TODO: Verify admin authentication
    const body = await request.json();
    const data = CreateContractorSchema.parse(body);

    const query = `
      INSERT INTO contractors (name, specialization, phone, email, whatsapp, years_of_experience, base_regions, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      data.name,
      data.specialization,
      data.phone,
      data.email || null,
      data.whatsapp || null,
      data.yearsOfExperience || null,
      JSON.stringify(data.baseRegions || []),
      data.isVerified,
    ]);

    return NextResponse.json(
      { success: true, contractor: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating contractor:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create contractor' },
      { status: 500 }
    );
  }
}

// GET — List contractors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const specialization = searchParams.get('specialization');
    const verified = searchParams.get('verified') === 'true';

    let query = 'SELECT * FROM contractors WHERE 1=1';
    const params: unknown[] = [];

    if (specialization) {
      query += ` AND specialization ILIKE $${params.length + 1}`;
      params.push(`%${specialization}%`);
    }

    if (verified) {
      query += ` AND is_verified = $${params.length + 1}`;
      params.push(true);
    }

    query += ' ORDER BY created_at DESC';

    const contractors = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      contractors: contractors.rows,
      count: contractors.rows.length,
    });
  } catch (error) {
    console.error('Error fetching contractors:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch contractors' },
      { status: 500 }
    );
  }
}
