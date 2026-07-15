import { PaymentAdapter, PaymentRequest, PaymentResponse } from './PaymentAdapter';

export class CODAdapter implements PaymentAdapter {
  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Cash on Delivery is completed immediately with a pending payment status
    return {
      success: true,
      transactionId: `COD-${request.orderId}-${Date.now()}`,
      message: 'Cash on delivery initialized successfully.',
      rawResponse: { type: 'COD', initializedAt: new Date() }
    };
  }

  async verifyPayment(transactionId: string, payload: any): Promise<boolean> {
    return true; // verified automatically upon order delivery
  }
}

export class StripeAdapter implements PaymentAdapter {
  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    // In a real-world app, you would initialize Stripe SDK and create a Stripe Checkout Session
    // e.g. const session = await stripe.checkout.sessions.create({...})
    console.log(`[Stripe] Initializing checkout session for order ${request.orderId}`);
    
    return {
      success: true,
      transactionId: `STRIPE-TX-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      paymentUrl: `/checkout/payment-mock?gateway=stripe&paymentId=${request.paymentId}&amount=${request.amount}`,
      message: 'Stripe redirect URL generated.',
      rawResponse: { gateway: 'stripe', status: 'session_created' }
    };
  }

  async verifyPayment(transactionId: string, payload: any): Promise<boolean> {
    // Verify Stripe signature & session status
    return payload.status === 'succeeded' || payload.status === 'complete';
  }
}

export class PayPalAdapter implements PaymentAdapter {
  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    console.log(`[PayPal] Creating order for ${request.amount} ${request.currency}`);
    
    return {
      success: true,
      transactionId: `PAYPAL-TX-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      paymentUrl: `/checkout/payment-mock?gateway=paypal&paymentId=${request.paymentId}&amount=${request.amount}`,
      message: 'PayPal redirect URL generated.',
      rawResponse: { gateway: 'paypal', status: 'created' }
    };
  }

  async verifyPayment(transactionId: string, payload: any): Promise<boolean> {
    return payload.status === 'COMPLETED';
  }
}

export class SSLCommerzAdapter implements PaymentAdapter {
  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    console.log(`[SSLCommerz] Creating transaction session for customer ${request.customerName}`);
    
    return {
      success: true,
      transactionId: `SSLC-TX-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      paymentUrl: `/checkout/payment-mock?gateway=sslcommerz&paymentId=${request.paymentId}&amount=${request.amount}`,
      message: 'SSLCommerz payment session created.',
      rawResponse: { gateway: 'sslcommerz', status: 'SUCCESS' }
    };
  }

  async verifyPayment(transactionId: string, payload: any): Promise<boolean> {
    return payload.status === 'VALID' || payload.status === 'SUCCESS';
  }
}

export class PaymentFactory {
  static getAdapter(gateway: 'COD' | 'STRIPE' | 'PAYPAL' | 'SSLCOMMERZ'): PaymentAdapter {
    switch (gateway) {
      case 'COD':
        return new CODAdapter();
      case 'STRIPE':
        return new StripeAdapter();
      case 'PAYPAL':
        return new PayPalAdapter();
      case 'SSLCOMMERZ':
        return new SSLCommerzAdapter();
      default:
        throw new Error(`Unsupported payment gateway: ${gateway}`);
    }
  }
}
