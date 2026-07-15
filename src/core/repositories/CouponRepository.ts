import { db } from '../../db';
import { coupons, couponUsages } from '../../db/schema';
import { eq, and, sql } from 'drizzle-orm';

export class CouponRepository {
  async getCouponByCode(code: string) {
    return db.query.coupons.findFirst({
      where: eq(coupons.code, code),
    });
  }

  async validateCoupon(code: string, userId: string, subtotal: number) {
    const coupon = await this.getCouponByCode(code);
    if (!coupon) {
      return { valid: false, reason: 'Coupon code not found.' };
    }

    const now = new Date();
    if (new Date(coupon.expiresAt) < now) {
      return { valid: false, reason: 'Coupon code has expired.' };
    }

    if (subtotal < Number(coupon.minPurchase)) {
      return { valid: false, reason: `Minimum purchase of $${coupon.minPurchase} is required.` };
    }

    // Check overall usage limit
    if (coupon.limitTotal !== null) {
      const totalUsages = await db.select({ count: sql<number>`count(*)` })
        .from(couponUsages)
        .where(eq(couponUsages.couponId, coupon.id));
      if (totalUsages[0].count >= coupon.limitTotal) {
        return { valid: false, reason: 'Coupon code usage limit reached.' };
      }
    }

    // Check user-specific usage limit
    const userUsages = await db.select({ count: sql<number>`count(*)` })
      .from(couponUsages)
      .where(and(
        eq(couponUsages.couponId, coupon.id),
        eq(couponUsages.userId, userId)
      ));
    if (userUsages[0].count >= coupon.limitPerUser) {
      return { valid: false, reason: 'You have reached the usage limit for this coupon.' };
    }

    return { valid: true, coupon };
  }

  async recordCouponUsage(couponId: string, userId: string, orderId: string) {
    await db.insert(couponUsages).values({
      id: crypto.randomUUID(),
      couponId,
      userId,
      orderId,
    });
  }

  async getActiveCoupons() {
    return db.select().from(coupons).where(sql`${coupons.expiresAt} > NOW()`);
  }

  async createCoupon(data: typeof coupons.$inferInsert) {
    const id = data.id || crypto.randomUUID();
    await db.insert(coupons).values({ ...data, id });
    return id;
  }
}
