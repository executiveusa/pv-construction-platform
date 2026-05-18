import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { z } from 'zod';

const CreateReviewSchema = z.object({
  leadId: z.string().uuid().optional(),
  contractorId: z.string().uuid().optional(),
  authorName: z.string().min(2),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(10),
  authorPhone: z.string().optional(),
  isVerifiedPurchase: z.boolean().default(false),
});

// POST — Create review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = CreateReviewSchema.parse(body);

    const query = `
      INSERT INTO reviews (lead_id, contractor_id, author_name, rating, text, author_phone, is_verified_purchase, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
      RETURNING *;
    `;

    const result = await pool.query(query, [
      data.leadId || null,
      data.contractorId || null,
      data.authorName,
      data.rating,
      data.text,
      data.authorPhone || null,
      data.isVerifiedPurchase,
    ]);

    // TODO: Send SMS verification link to author

    return NextResponse.json(
      { success: true, review: result.rows[0], message: 'Review submitted for verification' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create review' },
      { status: 500 }
    );
  }
}

// GET — List verified reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contractorId = searchParams.get('contractorId');
    const minRating = parseInt(searchParams.get('minRating') || '0');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    let query = "SELECT * FROM reviews WHERE status = 'verified' AND rating >= $1";
    const params: unknown[] = [minRating];

    if (contractorId) {
      query += ` AND contractor_id = $${params.length + 1}`;
      params.push(contractorId);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const reviews = await pool.query(query, params);

    // Calculate average rating
    const avgQuery = `
      SELECT AVG(rating) as avg_rating, COUNT(*) as total
      FROM reviews
      WHERE status = 'verified' ${contractorId ? `AND contractor_id = $1` : ''}
    `;

    const avgResult = await pool.query(
      avgQuery,
      contractorId ? [contractorId] : []
    );

    return NextResponse.json({
      success: true,
      reviews,
      averageRating: parseFloat(avgResult[0]?.avg_rating || 0),
      totalReviews: parseInt(avgResult[0]?.total || 0),
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
