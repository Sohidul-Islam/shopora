import { NextResponse } from 'next/server';
import { ProductService } from '../../../core/services/ProductService';

const productService = new ProductService();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
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
