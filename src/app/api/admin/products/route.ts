import { NextResponse } from 'next/server';
import { ProductService } from '../../../../core/services/ProductService';
import { requireAdmin } from '../../../../lib/api-auth';

const productService = new ProductService();

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const searchQuery = searchParams.get('q') || undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 100;
    const offset = searchParams.get('offset') ? Number(searchParams.get('offset')) : 0;

    const products = await productService.listAdminProducts({ status, searchQuery, limit, offset });
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    const status = error.message === 'Forbidden' ? 403 : error.message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAdmin(req);
    const roleName = (user as any).role?.name || 'Admin';
    const body = await req.json();
    const product = await productService.createProduct(roleName, body);
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    const status = error.message === 'Forbidden' ? 403 : error.message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
