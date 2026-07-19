import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { banners } from '../../../../db/schema';
import { desc, eq } from 'drizzle-orm';

// GET /api/admin/banners - list all banners
export async function GET() {
  try {
    const list = await db.select().from(banners).orderBy(desc(banners.createdAt));
    return NextResponse.json({ success: true, banners: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to list banners' }, { status: 400 });
  }
}

// POST /api/admin/banners - create a new banner
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, subtitle, imageUrl, linkUrl, status } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ success: false, error: 'title and imageUrl are required.' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    await db.insert(banners).values({
      id,
      title,
      subtitle,
      imageUrl,
      linkUrl,
      status: status || 'ACTIVE',
    });

    const newBanner = await db.select().from(banners).where(eq(banners.id, id));

    return NextResponse.json({ success: true, banner: newBanner[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to create banner' }, { status: 400 });
  }
}
