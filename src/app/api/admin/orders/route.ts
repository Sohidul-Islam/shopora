import { NextResponse } from 'next/server';
import { OrderRepository } from '../../../../core/repositories/OrderRepository';
import { requireAdmin } from '../../../../lib/api-auth';

const orderRepository = new OrderRepository();

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status');
    const status = statusParam ? (statusParam as any) : undefined;

    const orders = await orderRepository.getAdminOrders(status);
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    const status = error.message === 'Forbidden' ? 403 : error.message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
