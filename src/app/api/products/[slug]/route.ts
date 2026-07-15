import { NextResponse } from 'next/server';
import { ProductService } from '../../../../core/services/ProductService';

const productService = new ProductService();

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const product = await productService.getProductDetails(params.slug);
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Product not found' }, { status: 404 });
  }
}
