import { NextResponse } from 'next/server';
import { ProductService } from '../../../../../core/services/ProductService';
import { requireAdmin } from '../../../../../lib/api-auth';

const productService = new ProductService();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAdmin(req);
    const roleName = (user as any).role?.name || 'Admin';
    const body = await req.json();
    const category = await productService.updateCategory(roleName, params.id, body);
    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    const status = error.message === 'Forbidden' ? 403 : error.message === 'Unauthorized' ? 401 : error.message.includes('not found') ? 404 : 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAdmin(req);
    const roleName = (user as any).role?.name || 'Admin';
    await productService.deleteCategory(roleName, params.id);
    return NextResponse.json({ success: true, message: 'Category deleted.' });
  } catch (error: any) {
    const status = error.message === 'Forbidden' ? 403 : error.message === 'Unauthorized' ? 401 : error.message.includes('not found') ? 404 : 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
