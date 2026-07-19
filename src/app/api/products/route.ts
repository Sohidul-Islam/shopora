import { NextResponse } from 'next/server';
import { ProductService } from '../../../core/services/ProductService';
import { db } from '../../../db';
import { banners, categories } from '../../../db/schema';
import { eq } from 'drizzle-orm';

const productService = new ProductService();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeBanners = searchParams.get('banners') === 'true';
    if (includeBanners) {
      const list = await db.select().from(banners).where(eq(banners.status, 'ACTIVE'));
      return NextResponse.json({ success: true, banners: list });
    }

    const includeCategories = searchParams.get('categories') === 'true';
    if (includeCategories) {
      const list = await db.select().from(categories).where(eq(categories.visible, true));
      return NextResponse.json({ success: true, categories: list });
    }

    const categorySlug = searchParams.get('category') || undefined;
    const brandSlug = searchParams.get('brand') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const searchQuery = searchParams.get('q') || undefined;
    const sortBy = (searchParams.get('sortBy') as any) || undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 20;
    const offset = searchParams.get('offset') ? Number(searchParams.get('offset')) : 0;

    const list = await productService.listStorefrontProducts({
      categorySlug,
      brandSlug,
      minPrice,
      maxPrice,
      searchQuery,
      sortBy,
      limit,
      offset
    });

    return NextResponse.json({ success: true, products: list });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to list products' }, { status: 400 });
  }
}
