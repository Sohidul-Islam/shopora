import { NextResponse } from 'next/server';
import { db } from '../../../../../db';
import { banners } from '../../../../../db/schema';
import { eq } from 'drizzle-orm';

// PATCH /api/admin/banners/[id] - update a banner
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { title, subtitle, imageUrl, linkUrl, status } = body;

    const existing = await db.select().from(banners).where(eq(banners.id, params.id));
    if (existing.length === 0) {
      return NextResponse.json({ success: false, error: 'Banner not found.' }, { status: 404 });
    }

    await db.update(banners)
      .set({
        title: title !== undefined ? title : existing[0].title,
        subtitle: subtitle !== undefined ? subtitle : existing[0].subtitle,
        imageUrl: imageUrl !== undefined ? imageUrl : existing[0].imageUrl,
        linkUrl: linkUrl !== undefined ? linkUrl : existing[0].linkUrl,
        status: status !== undefined ? status : existing[0].status,
      })
      .where(eq(banners.id, params.id));

    const updated = await db.select().from(banners).where(eq(banners.id, params.id));

    return NextResponse.json({ success: true, banner: updated[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to update banner' }, { status: 400 });
  }
}

// DELETE /api/admin/banners/[id] - delete a banner
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const existing = await db.select().from(banners).where(eq(banners.id, params.id));
    if (existing.length === 0) {
      return NextResponse.json({ success: false, error: 'Banner not found.' }, { status: 404 });
    }

    await db.delete(banners).where(eq(banners.id, params.id));

    return NextResponse.json({ success: true, message: 'Banner deleted.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete banner' }, { status: 400 });
  }
}
