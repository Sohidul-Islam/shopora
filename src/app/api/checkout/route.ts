import { NextResponse } from 'next/server';
import { OrderService } from '../../../core/services/OrderService';
import { PaymentFactory } from '../../../core/adapters/payment/Gateways';

const orderService = new OrderService();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, shippingAddressId, billingAddressId, couponCode, items, paymentGateway } = body;

    if (!shippingAddressId || !billingAddressId || !items || !items.length || !paymentGateway) {
      return NextResponse.json({ error: 'Missing required checkout information.' }, { status: 400 });
    }

    // 1. Core Order transaction
    const checkoutResult = await orderService.checkout(userId, {
      shippingAddressId,
      billingAddressId,
      couponCode,
      items,
      paymentGateway
    });

    // 2. Invoke extendable Payment Adapter
    const paymentAdapter = PaymentFactory.getAdapter(paymentGateway);
    
    // Simulate user details if guest or logged in
    const paymentInit = await paymentAdapter.initiatePayment({
      orderId: checkoutResult.orderId,
      paymentId: checkoutResult.paymentId,
      amount: checkoutResult.totalAmount,
      currency: 'USD',
      customerEmail: body.customerEmail || 'guest@shopora.com',
      customerName: body.customerName || 'Shopora Guest',
      successUrl: `${req.headers.get('origin') || 'http://localhost:3000'}/checkout/success?orderId=${checkoutResult.orderId}`,
      failUrl: `${req.headers.get('origin') || 'http://localhost:3000'}/checkout/fail?orderId=${checkoutResult.orderId}`,
    });

    return NextResponse.json({
      success: true,
      orderId: checkoutResult.orderId,
      paymentId: checkoutResult.paymentId,
      paymentUrl: paymentInit.paymentUrl || `/checkout/success?orderId=${checkoutResult.orderId}`,
      transactionId: paymentInit.transactionId,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Checkout failed.' }, { status: 400 });
  }
}
