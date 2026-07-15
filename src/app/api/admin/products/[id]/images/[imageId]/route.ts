import { NextResponse } from 'next/server';
import { db } from '../../../../../../db';
import { productImages } from '../../../../../../db/schema';
import { eq } from 'drizzle-orm';
import { unlink } from 'fs/promises';
import { join } from 'path';

// DELETE /api/admin/products/[id]/images/[imageId] — remove an image from a product
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const image = await db.select()
      .from(productImages)
      .where(eq(productImages.id, params.imageId));

    if (image.length === 0) {
      return NextResponse.json({ success: false, error: 'Image not found.' }, { status: 404 });
    }

    // Delete the DB record
    await db.delete(productImages).where(eq(productImages.id, params.imageId));

    // Attempt to delete the physical file if it's a local upload
    const imgUrl = image[0].url;
    if (imgUrl.startsWith('/uploads/')) {
      try {
        const filePath = join(process.cwd(), 'public', imgUrl);
        await unlink(filePath);
      } catch {
        // File may already be deleted or hosted externally — non-fatal
      }
    }

    return NextResponse.json({ success: true, message: 'Image deleted.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
