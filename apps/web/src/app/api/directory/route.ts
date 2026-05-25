import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { z } from 'zod';

const CreateTenantSchema = z.object({
  name: z.string().min(2),
  subdomain: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Subdomain must be lowercase letters, numbers, or hyphens'),
  logoUrl: z.string().url().nullable().optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Primary color must be a hex code'),
  active: z.boolean().default(true),
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, name, subdomain, logo_url, primary_color, active, created_at
      FROM tenants
      ORDER BY created_at DESC
      LIMIT 100;
    `);

    return NextResponse.json({ success: true, tenants: result.rows });
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return NextResponse.json({ success: false, message: 'Failed to load tenants' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = CreateTenantSchema.parse(body);

    const result = await pool.query(
      `INSERT INTO tenants (name, subdomain, logo_url, primary_color, active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, subdomain, logo_url, primary_color, active, created_at;
      `,
      [data.name, data.subdomain, data.logoUrl, data.primaryColor, data.active]
    );

    return NextResponse.json({ success: true, tenant: result.rows[0] }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }

    console.error('Error creating tenant:', error);
    return NextResponse.json({ success: false, message: 'Failed to create tenant' }, { status: 500 });
  }
}
