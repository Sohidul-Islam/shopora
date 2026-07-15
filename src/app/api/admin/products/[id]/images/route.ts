import { NextResponse } from 'next/server';
import { db } from '../../../../../db';
import { productImages } from '../../../../../db/schema';
import { eq, asc } from 'drizzle-orm';

// GET /api/admin/products/[id]/images — list all images for a product
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const images = await db.select()
      .from(productImages)
      .where(eq(productImages.productId, params.id))
      .orderBy(asc(productImages.sortOrder));
    return NextResponse.json({ success: true, images });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// POST /api/admin/products/[id]/images — add an image URL to a product
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { url, sortOrder } = body;

    if (!url) {
      return NextResponse.json({ success: false, error: 'url is required.' }, { status: 400 });
    }

    // Auto-calculate sortOrder if not provided
    const existing = await db.select()
      .from(productImages)
      .where(eq(productImages.productId, params.id))
      .orderBy(asc(productImages.sortOrder));

    const nextOrder = sortOrder ?? (existing.length > 0 ? existing[existing.length - 1].sortOrder + 1 : 0);

    const id = crypto.randomUUID();
    await db.insert(productImages).values({
      id,
      productId: params.id,
      url,
      sortOrder: nextOrder,
    });

    const image = await db.select().from(productImages).where(eq(productImages.id, id));
    return NextResponse.json({ success: true, image: image[0] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// PATCH /api/admin/products/[id]/images — reorder images (pass array of {id, sortOrder})
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { order } = body as { order: Array<{ id: string; sortOrder: number }> };

    if (!Array.isArray(order)) {
      return NextResponse.json({ success: false, error: 'order must be an array of {id, sortOrder}.' }, { status: 400 });
    }

    // Update each image sortOrder
    await Promise.all(
      order.map(item =>
        db.update(productImages)
          .set({ sortOrder: item.sortOrder })
          .where(eq(productImages.id, item.id))
      )
    );

    const images = await db.select()
      .from(productImages)
      .where(eq(productImages.productId, params.id))
      .orderBy(asc(productImages.sortOrder));

    return NextResponse.json({ success: true, images });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
