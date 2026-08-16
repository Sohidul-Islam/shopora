import { NextResponse } from 'next/server';
import { OrderRepository } from '../../../../../core/repositories/OrderRepository';
import { requireAdmin } from '../../../../../lib/api-auth';

const orderRepository = new OrderRepository();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req);
    const order = await orderRepository.getOrderById(params.id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    const status = error.message === 'Forbidden' ? 403 : error.message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAdmin(req);
    const body = await req.json();
    const { status, paymentStatus, notes } = body;
    const actorName = (user as any).name || (user as any).email || 'Admin';

    if (status) {
      await orderRepository.updateOrderStatus(params.id, status, notes || `Status changed to ${status}`, actorName);
    }

    if (paymentStatus) {
      const order = await orderRepository.getOrderById(params.id);
      if (order && order.payments && order.payments.length > 0) {
        const payRecord = order.payments[0];
        await orderRepository.recordPaymentTransaction(
          payRecord.id,
          'MANUAL_ADMIN_' + Date.now(),
          paymentStatus,
          JSON.stringify({ updatedBy: actorName, timestamp: new Date().toISOString() })
        );
      }
    }

    const updatedOrder = await orderRepository.getOrderById(params.id);
    return NextResponse.json({ success: true, order: updatedOrder, message: 'Order updated successfully.' });
  } catch (error: any) {
    const status = error.message === 'Forbidden' ? 403 : error.message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
