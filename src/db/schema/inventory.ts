import { mysqlTable, varchar, int, decimal, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';
import { productVariants } from './catalog';

export const warehouses = mysqlTable('warehouses', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const inventories = mysqlTable('inventories', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  productVariantId: varchar('product_variant_id', { length: 36 }).notNull().references(() => productVariants.id, { onDelete: 'cascade' }),
  warehouseId: varchar('warehouse_id', { length: 36 }).notNull().references(() => warehouses.id, { onDelete: 'cascade' }),
  quantity: int('quantity').default(0).notNull(),
  purchasePrice: decimal('purchase_price', { precision: 10, scale: 2 }).notNull(),
  sellingPrice: decimal('selling_price', { precision: 10, scale: 2 }).notNull(),
  batchNumber: varchar('batch_number', { length: 100 }),
  expiryDate: timestamp('expiry_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const stockLogs = mysqlTable('stock_logs', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  inventoryId: varchar('inventory_id', { length: 36 }).notNull().references(() => inventories.id, { onDelete: 'cascade' }),
  type: mysqlEnum('type', ['IN', 'OUT', 'ADJUSTMENT']).notNull(),
  quantity: int('quantity').notNull(),
  reason: varchar('reason', { length: 255 }),
  createdBy: varchar('created_by', { length: 36 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
