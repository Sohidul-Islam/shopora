import { NextResponse } from 'next/server';
import { ProductService } from '../../../../core/services/ProductService';
import { requireAdmin } from '../../../../lib/api-auth';

const productService = new ProductService();

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const categories = await productService.listCategories();
    return NextResponse.json({ success: true, categories });
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
    const category = await productService.createCategory(roleName, body);
    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    const status = error.message === 'Forbidden' ? 403 : error.message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
