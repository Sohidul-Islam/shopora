import { NextResponse } from 'next/server';
import { ProductService } from '../../../../core/services/ProductService';

const productService = new ProductService();
const ADMIN_ROLE = 'Admin';

export async function GET() {
  try {
    const brands = await productService.listBrands();
    return NextResponse.json({ success: true, brands });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const brand = await productService.createBrand(ADMIN_ROLE, body);
    return NextResponse.json({ success: true, brand }, { status: 201 });
  } catch (error: any) {
    const status = error.message.includes('Unauthorized') ? 403 : 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
