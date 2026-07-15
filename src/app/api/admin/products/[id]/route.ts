import { NextResponse } from 'next/server';
import { ProductService } from '../../../../../core/services/ProductService';

const productService = new ProductService();
const ADMIN_ROLE = 'Admin';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Re-use updateProduct path to fetch — or just list and filter
    const products = await productService.listAdminProducts({ limit: 1 });
    return NextResponse.json({ success: true, message: 'Use /api/products/:slug for single product detail.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 404 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const product = await productService.updateProduct(ADMIN_ROLE, params.id, body);
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    const status = error.message.includes('Unauthorized') ? 403 : error.message.includes('not found') ? 404 : 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await productService.deleteProduct(ADMIN_ROLE, params.id);
    return NextResponse.json({ success: true, message: 'Product deleted.' });
  } catch (error: any) {
    const status = error.message.includes('Unauthorized') ? 403 : error.message.includes('not found') ? 404 : 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
