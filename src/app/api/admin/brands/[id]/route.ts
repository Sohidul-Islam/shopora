import { NextResponse } from 'next/server';
import { ProductService } from '../../../../../core/services/ProductService';

const productService = new ProductService();
const ADMIN_ROLE = 'Admin';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const brand = await productService.updateBrand(ADMIN_ROLE, params.id, body);
    return NextResponse.json({ success: true, brand });
  } catch (error: any) {
    const status = error.message.includes('Unauthorized') ? 403 : error.message.includes('not found') ? 404 : 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await productService.deleteBrand(ADMIN_ROLE, params.id);
    return NextResponse.json({ success: true, message: 'Brand deleted.' });
  } catch (error: any) {
    const status = error.message.includes('Unauthorized') ? 403 : error.message.includes('not found') ? 404 : 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
