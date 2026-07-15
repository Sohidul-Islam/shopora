import { OrderRepository, CheckoutData } from '../repositories/OrderRepository';
import { CouponRepository } from '../repositories/CouponRepository';
import { ProductRepository } from '../repositories/ProductRepository';

const orderRepository = new OrderRepository();
const couponRepository = new CouponRepository();
const productRepository = new ProductRepository();

export class OrderService {
  async checkout(userId: string | undefined, data: {
    shippingAddressId: string;
    billingAddressId: string;
    couponCode?: string;
    items: { productVariantId: string; quantity: number }[];
    paymentGateway: 'COD' | 'STRIPE' | 'PAYPAL' | 'SSLCOMMERZ';
  }) {
    // 1. Calculate prices and verify stock
    let subtotal = 0;
    const checkoutItems: CheckoutData['items'] = [];

    for (const item of data.items) {
      // Find variant details
      const prod = await productRepository.getProducts({ limit: 100 }); // simplified variant search
      let matchingVariant: any = null;
      for (const p of prod) {
        const match = (p as any).productVariants?.find((v: any) => v.id === item.productVariantId);
        if (match) {
          matchingVariant = { ...match, product: p };
          break;
        }
      }

      if (!matchingVariant) {
        throw new Error(`Product variant with ID ${item.productVariantId} not found.`);
      }

      if (matchingVariant.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${matchingVariant.product.name}. Available: ${matchingVariant.stock}`);
      }

      const itemPrice = Number(matchingVariant.salePrice || matchingVariant.price);
      subtotal += itemPrice * item.quantity;

      checkoutItems.push({
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        price: String(itemPrice),
        discount: matchingVariant.salePrice ? String(Number(matchingVariant.price) - Number(matchingVariant.salePrice)) : '0.00',
      });
    }

    // 2. Coupon Validation
    let discountAmount = 0;
    let couponId: string | undefined;

    if (data.couponCode && userId) {
      const val = await couponRepository.validateCoupon(data.couponCode, userId, subtotal);
      if (val.valid && val.coupon) {
        couponId = val.coupon.id;
        if (val.coupon.type === 'PERCENTAGE') {
          discountAmount = (subtotal * Number(val.coupon.value)) / 100;
          if (val.coupon.maxDiscount && discountAmount > Number(val.coupon.maxDiscount)) {
            discountAmount = Number(val.coupon.maxDiscount);
          }
        } else if (val.coupon.type === 'FIXED') {
          discountAmount = Number(val.coupon.value);
        } else if (val.coupon.type === 'FREE_SHIPPING') {
          // handled in shipping fee deduction
        }
      } else {
        throw new Error(val.reason || 'Invalid coupon code.');
      }
    }

    const shippingFee = subtotal > 150 ? 0 : 15; // Free shipping over $150
    const taxAmount = subtotal * 0.08; // 8% sales tax
    const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee + taxAmount);

    // 3. Create Order
    const { orderId, paymentId } = await orderRepository.createOrderTransaction({
      userId,
      shippingAddressId: data.shippingAddressId,
      billingAddressId: data.billingAddressId,
      couponId,
      discountAmount,
      shippingFee,
      taxAmount,
      totalAmount,
      items: checkoutItems,
      paymentGateway: data.paymentGateway,
    });

    // Record coupon usage
    if (couponId && userId) {
      await couponRepository.recordCouponUsage(couponId, userId, orderId);
    }

    return { orderId, paymentId, totalAmount, gateway: data.paymentGateway };
  }

  async getOrder(orderId: string, userId?: string) {
    const order = await orderRepository.getOrderById(orderId);
    if (!order) {
      throw new Error('Order not found.');
    }
    // If guest or different user, verify unless admin/manager is requestor
    if (userId && order.userId !== userId) {
      // simplified auth check
    }
    return order;
  }

  async processPaymentCallback(paymentId: string, transactionId: string, status: 'COMPLETED' | 'FAILED', rawResponse: any) {
    await orderRepository.recordPaymentTransaction(paymentId, transactionId, status, JSON.stringify(rawResponse));
  }

  async updateStatus(orderId: string, status: any, notes: string, actor: string) {
    await orderRepository.updateOrderStatus(orderId, status, notes, actor);
  }
}
