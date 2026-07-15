import { mysqlTable, varchar, int, timestamp, index } from 'drizzle-orm/mysql-core';
import { users } from './auth';
import { products, productVariants } from './catalog';

export const carts = mysqlTable('carts', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 }).references(() => users.id, { onDelete: 'cascade' }),
  sessionId: varchar('session_id', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  sessionIdx: index('carts_session_idx').on(table.sessionId),
}));

export const cartItems = mysqlTable('cart_items', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  cartId: varchar('cart_id', { length: 36 }).notNull().references(() => carts.id, { onDelete: 'cascade' }),
  productVariantId: varchar('product_variant_id', { length: 36 }).notNull().references(() => productVariants.id, { onDelete: 'cascade' }),
  quantity: int('quantity').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const wishlists = mysqlTable('wishlists', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: varchar('product_id', { length: 36 }).notNull().references(() => products.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pk: index('wishlist_user_product_idx').on(table.userId, table.productId),
}));
