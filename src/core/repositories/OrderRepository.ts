import { db } from '../../db';
import { orders, orderItems, orderStatusLogs, payments, paymentTransactions, productVariants } from '../../db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export interface CheckoutData {
  userId?: string;
  shippingAddressId: string;
  billingAddressId: string;
  couponId?: string;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  items: {
    productVariantId: string;
    quantity: number;
    price: string;
    discount: string;
  }[];
  paymentGateway: 'COD' | 'STRIPE' | 'PAYPAL' | 'SSLCOMMERZ';
}

export class OrderRepository {
  async createOrderTransaction(checkout: CheckoutData) {
    return db.transaction(async (tx) => {
      const orderId = crypto.randomUUID();

      // 1. Create the Order
      await tx.insert(orders).values({
        id: orderId,
        userId: checkout.userId || null,
        status: 'PENDING',
        totalAmount: String(checkout.totalAmount),
        shippingAddressId: checkout.shippingAddressId,
        billingAddressId: checkout.billingAddressId,
        couponId: checkout.couponId || null,
        discountAmount: String(checkout.discountAmount),
        shippingFee: String(checkout.shippingFee),
        taxAmount: String(checkout.taxAmount),
      });

      // 2. Insert Order Items & Deduct Stock
      for (const item of checkout.items) {
        const itemId = crypto.randomUUID();
        await tx.insert(orderItems).values({
          id: itemId,
          orderId,
          productVariantId: item.productVariantId,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
        });

        // Decrement product variant stock
        await tx.update(productVariants)
          .set({
            stock: sql`${productVariants.stock} - ${item.quantity}`
          })
          .where(eq(productVariants.id, item.productVariantId));
      }

      // 3. Log initial status
      await tx.insert(orderStatusLogs).values({
        id: crypto.randomUUID(),
        orderId,
        status: 'PENDING',
        notes: 'Order placed by customer.',
        createdBy: checkout.userId || 'GUEST',
      });

      // 4. Create initial Payment record
      const paymentId = crypto.randomUUID();
      await tx.insert(payments).values({
        id: paymentId,
        orderId,
        gateway: checkout.paymentGateway,
        status: 'PENDING',
        amount: String(checkout.totalAmount),
      });

      return { orderId, paymentId };
    });
  }

  async getOrderById(id: string) {
    return db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        shippingAddress: true,
        billingAddress: true,
        orderItems: {
          with: {
            productVariant: {
              with: {
                product: true,
              }
            }
          }
        },
        orderStatusLogs: {
          orderBy: desc(orderStatusLogs.createdAt),
        },
        payments: true,
      }
    });
  }

  async getOrdersByUser(userId: string) {
    return db.query.orders.findMany({
      where: eq(orders.userId, userId),
      orderBy: desc(orders.createdAt),
      with: {
        orderItems: {
          with: {
            productVariant: {
              with: {
                product: true
              }
            }
          }
        }
      }
    });
  }

  async updateOrderStatus(orderId: string, status: typeof orders.status.enumValues[number], notes: string, actor: string) {
    await db.transaction(async (tx) => {
      await tx.update(orders).set({ status }).where(eq(orders.id, orderId));
      await tx.insert(orderStatusLogs).values({
        id: crypto.randomUUID(),
        orderId,
        status,
        notes,
        createdBy: actor,
      });

      // If order is cancelled, we restore inventory stock
      if (status === 'CANCELLED') {
        const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, orderId));
        for (const item of items) {
          await tx.update(productVariants)
            .set({ stock: sql`${productVariants.stock} + ${item.quantity}` })
            .where(eq(productVariants.id, item.productVariantId));
        }
      }
    });
  }

  async recordPaymentTransaction(paymentId: string, transactionId: string, status: 'COMPLETED' | 'FAILED' | 'REFUNDED', rawResponse: string) {
    await db.transaction(async (tx) => {
      const payStatus = status === 'COMPLETED' ? 'COMPLETED' : status === 'REFUNDED' ? 'REFUNDED' : 'FAILED';
      await tx.update(payments).set({ status: payStatus }).where(eq(payments.id, paymentId));
      
      const txId = crypto.randomUUID();
      await tx.insert(paymentTransactions).values({
        id: txId,
        paymentId,
        transactionId,
        rawResponse,
      });

      // If payment completed successfully, transition order to CONFIRMED
      if (status === 'COMPLETED') {
        const payRecord = await tx.query.payments.findFirst({ where: eq(payments.id, paymentId) });
        if (payRecord) {
          await tx.update(orders).set({ status: 'CONFIRMED' }).where(eq(orders.id, payRecord.orderId));
          await tx.insert(orderStatusLogs).values({
            id: crypto.randomUUID(),
            orderId: payRecord.orderId,
            status: 'CONFIRMED',
            notes: 'Payment confirmed. Processing started.',
            createdBy: 'SYSTEM_PAYMENT',
          });
        }
      }
    });
  }

  async getAdminOrders(status?: typeof orders.status.enumValues[number]) {
    return db.query.orders.findMany({
      where: status ? eq(orders.status, status) : undefined,
      orderBy: desc(orders.createdAt),
      with: {
        user: true,
        payments: true,
      }
    });
  }

  async getRevenueMetrics() {
    const results = await db.select({
      totalRevenue: sql<string>`COALESCE(SUM(${orders.totalAmount}), 0)`,
      orderCount: sql<number>`COUNT(*)`,
    })
    .from(orders)
    .where(eq(orders.status, 'DELIVERED'));
    return results[0];
  }
}
