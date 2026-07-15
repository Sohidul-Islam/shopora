export interface PaymentRequest {
  orderId: string;
  paymentId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  successUrl: string;
  failUrl: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string; // Redirect URL for Stripe checkout / PayPal / SSLCommerz
  message?: string;
  rawResponse?: any;
}

export interface PaymentAdapter {
  initiatePayment(request: PaymentRequest): Promise<PaymentResponse>;
  verifyPayment(transactionId: string, payload: any): Promise<boolean>;
}
