import { NextResponse } from 'next/server';
import { ProductService } from '../../../../core/services/ProductService';

const productService = new ProductService();
// In production, extract actorRole from a verified JWT/session.
// For now we use a header that the admin UI can pass.
const ADMIN_ROLE = 'Admin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const searchQuery = searchParams.get('q') || undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 100;
    const offset = searchParams.get('offset') ? Number(searchParams.get('offset')) : 0;

    const products = await productService.listAdminProducts({ status, searchQuery, limit, offset });
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const product = await productService.createProduct(ADMIN_ROLE, body);
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    const status = error.message.includes('Unauthorized') ? 403 : 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
