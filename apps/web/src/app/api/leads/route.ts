import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { z } from 'zod';

// Lead creation schema
const CreateLeadSchema = z.object({
  fullName: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required').optional(),
  phone: z.string().min(10, 'Phone required'),
  projectType: z.enum(['new_build', 'remodel', 'luxury', 'commercial', 'land_purchase', 'permits_only', 'other']),
  budgetRange: z.enum(['under_50k', '50k_100k', '100k_250k', '250k_500k', '500k_1m', 'over_1m']).optional(),
  timelineMonths: z.number().int().positive().optional(),
  locationZone: z.string().optional(),
  propertyStatus: z.string().optional(),
  preferredContact: z.enum(['phone', 'whatsapp', 'email', 'chat']).default('whatsapp'),
  preferredLanguage: z.string().default('es-MX'),
  notes: z.string().optional(),
  source: z.string().default('website'),
});

type CreateLeadInput = z.infer<typeof CreateLeadSchema>;

// POST — Create a new lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = CreateLeadSchema.parse(body);

    const query = `
      INSERT INTO leads (
        full_name, email, phone, project_type, budget_range, 
        timeline_months, location_zone, property_status, 
        preferred_contact, preferred_language, notes, source
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      ) RETURNING id, full_name, email, phone, status, created_at;
    `;

    const result = await pool.query(query, [
      data.fullName,
      data.email || null,
      data.phone,
      data.projectType,
      data.budgetRange || null,
      data.timelineMonths || null,
      data.locationZone || null,
      data.propertyStatus || null,
      data.preferredContact,
      data.preferredLanguage,
      data.notes || null,
      data.source,
    ]);

    const lead = result[0];

    // TODO: Send SMS notification to contractor pool
    // TODO: Create Tiledesk request if configured

    return NextResponse.json(
      {
        success: true,
        message: 'Lead created successfully',
        lead: {
          id: lead.id,
          fullName: lead.full_name,
          status: lead.status,
          createdAt: lead.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Lead creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create lead' },
      { status: 500 }
    );
  }
}

// GET — List leads (admin only)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication/authorization check
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    let whereClause = '';
    const params: unknown[] = [];

    if (status && status !== 'all') {
      whereClause = 'WHERE status = $1';
      params.push(status);
    }

    const query = `
      SELECT 
        id, full_name, email, phone, project_type, budget_range,
        timeline_months, location_zone, status, created_at, updated_at
      FROM leads
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2};
    `;

    params.push(limit, offset);

    const leads = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      leads,
      count: leads.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
