import { mysqlTable, varchar, text, int, decimal, timestamp, boolean, mysqlEnum } from 'drizzle-orm/mysql-core';
import { users } from './auth';
import { productVariants } from './catalog';

export const addresses = mysqlTable('addresses', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 100 }).default('Home').notNull(),
  addressLine1: varchar('address_line1', { length: 255 }).notNull(),
  addressLine2: varchar('address_line2', { length: 255 }),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const coupons = mysqlTable('coupons', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: varchar('code', { length: 50 }).notNull().unique(),
  type: mysqlEnum('type', ['FIXED', 'PERCENTAGE', 'FREE_SHIPPING']).notNull(),
  value: decimal('value', { precision: 10, scale: 2 }).notNull(),
  minPurchase: decimal('min_purchase', { precision: 10, scale: 2 }).default('0.00').notNull(),
  maxDiscount: decimal('max_discount', { precision: 10, scale: 2 }),
  limitTotal: int('limit_total'),
  limitPerUser: int('limit_per_user').default(1).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const orders = mysqlTable('orders', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 }).references(() => users.id, { onDelete: 'set null' }),
  status: mysqlEnum('status', ['PENDING', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED']).default('PENDING').notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  shippingAddressId: varchar('shipping_address_id', { length: 36 }).references(() => addresses.id),
  billingAddressId: varchar('billing_address_id', { length: 36 }).references(() => addresses.id),
  couponId: varchar('coupon_id', { length: 36 }).references(() => coupons.id),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0.00').notNull(),
  shippingFee: decimal('shipping_fee', { precision: 10, scale: 2 }).default('0.00').notNull(),
  taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }).default('0.00').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const orderItems = mysqlTable('order_items', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: varchar('order_id', { length: 36 }).notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productVariantId: varchar('product_variant_id', { length: 36 }).notNull().references(() => productVariants.id),
  quantity: int('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  discount: decimal('discount', { precision: 10, scale: 2 }).default('0.00').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orderStatusLogs = mysqlTable('order_status_logs', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: varchar('order_id', { length: 36 }).notNull().references(() => orders.id, { onDelete: 'cascade' }),
  status: mysqlEnum('status', ['PENDING', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED']).notNull(),
  notes: varchar('notes', { length: 255 }),
  createdBy: varchar('created_by', { length: 36 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const payments = mysqlTable('payments', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: varchar('order_id', { length: 36 }).notNull().references(() => orders.id, { onDelete: 'cascade' }),
  gateway: mysqlEnum('gateway', ['COD', 'STRIPE', 'PAYPAL', 'SSLCOMMERZ']).notNull(),
  status: mysqlEnum('status', ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']).default('PENDING').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const paymentTransactions = mysqlTable('payment_transactions', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  paymentId: varchar('payment_id', { length: 36 }).notNull().references(() => payments.id, { onDelete: 'cascade' }),
  transactionId: varchar('transaction_id', { length: 255 }).notNull().unique(),
  rawResponse: text('raw_response'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const couponUsages = mysqlTable('coupon_usages', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  couponId: varchar('coupon_id', { length: 36 }).notNull().references(() => coupons.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  orderId: varchar('order_id', { length: 36 }).notNull().references(() => orders.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
