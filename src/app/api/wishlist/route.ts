import { NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/api-auth';
import { db } from '../../../db';
import { wishlists, products, productImages, productVariants } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/wishlist - Get current user's wishlist
export async function GET(req: Request) {
  try {
    const user = await requireAuth(req);

    // Fetch wishlist items with product, images, and variants
    const items = await db.query.wishlists.findMany({
      where: eq(wishlists.userId, user.id),
      with: {
        product: {
          with: {
            productImages: {
              orderBy: (images, { asc }) => [asc(images.sortOrder)],
            },
            productVariants: {
              orderBy: (vars, { asc }) => [asc(vars.id)],
            }
          }
        }
      }
    });

    // Format the products to match what frontend expects
    const formattedWishlist = items
      .filter((item) => item.product !== null && item.product.deletedAt === null)
      .map((item) => {
        const prod = item.product!;
        return {
          id: prod.id,
          name: prod.name,
          slug: prod.slug,
          price: Number(prod.price),
          salePrice: prod.salePrice ? Number(prod.salePrice) : null,
          status: prod.status,
          image: prod.productImages?.[0]?.url || '',
          variants: prod.productVariants || [],
        };
      });

    return NextResponse.json({ success: true, wishlist: formattedWishlist });
  } catch (error: any) {
    const status = error.message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch wishlist' }, { status });
  }
}

// POST /api/wishlist - Add product to wishlist
export async function POST(req: Request) {
  try {
    const user = await requireAuth(req);
    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID is required.' }, { status: 400 });
    }

    // Verify product exists and is not deleted
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product || product.deletedAt !== null) {
      return NextResponse.json({ success: false, error: 'Product not found.' }, { status: 404 });
    }

    // Check if duplicate entry
    const existing = await db.query.wishlists.findFirst({
      where: and(
        eq(wishlists.userId, user.id),
        eq(wishlists.productId, productId)
      ),
    });

    if (existing) {
      return NextResponse.json({ success: true, message: 'Product already in wishlist.' });
    }

    // Insert
    await db.insert(wishlists).values({
      id: crypto.randomUUID(),
      userId: user.id,
      productId: productId,
    });

    return NextResponse.json({ success: true, message: 'Product added to wishlist.' });
  } catch (error: any) {
    const status = error.message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ success: false, error: error.message || 'Failed to add to wishlist' }, { status });
  }
}

// DELETE /api/wishlist - Remove product from wishlist
export async function DELETE(req: Request) {
  try {
    const user = await requireAuth(req);
    const { searchParams } = new URL(req.url);
    let productId = searchParams.get('productId');

    if (!productId) {
      try {
        const body = await req.json();
        productId = body.productId;
      } catch {
        // Body might be empty, that's fine
      }
    }

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID is required.' }, { status: 400 });
    }

    await db
      .delete(wishlists)
      .where(and(
        eq(wishlists.userId, user.id),
        eq(wishlists.productId, productId)
      ));

    return NextResponse.json({ success: true, message: 'Product removed from wishlist.' });
  } catch (error: any) {
    const status = error.message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ success: false, error: error.message || 'Failed to remove from wishlist' }, { status });
  }
}
