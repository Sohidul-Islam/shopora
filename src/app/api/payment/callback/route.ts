import { NextResponse } from 'next/server';
import { OrderService } from '../../../../core/services/OrderService';
import { PaymentFactory } from '../../../../core/adapters/payment/Gateways';

const orderService = new OrderService();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { paymentId, transactionId, status, gateway, rawPayload } = body;

    if (!paymentId || !transactionId || !status || !gateway) {
      return NextResponse.json({ error: 'Missing callback parameters.' }, { status: 400 });
    }

    const adapter = PaymentFactory.getAdapter(gateway);
    const verified = await adapter.verifyPayment(transactionId, { status: status === 'SUCCESS' || status === 'COMPLETED' ? 'complete' : 'failed' });

    if (verified) {
      await orderService.processPaymentCallback(
        paymentId,
        transactionId,
        status === 'SUCCESS' || status === 'COMPLETED' ? 'COMPLETED' : 'FAILED',
        rawPayload || { source: 'mock_callback', receivedAt: new Date() }
      );
      return NextResponse.json({ success: true, message: 'Transaction verified and updated.' });
    } else {
      return NextResponse.json({ error: 'Payment validation signature mismatch.' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Callback handling failed.' }, { status: 400 });
  }
}
