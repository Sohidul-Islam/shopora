import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { brands } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const list = await db
      .select()
      .from(brands)
      .where(eq(brands.status, 'ACTIVE'))
      .orderBy(brands.name);
    return NextResponse.json({ success: true, brands: list });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch brands' }, { status: 400 });
  }
}
