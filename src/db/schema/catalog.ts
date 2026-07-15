import { mysqlTable, varchar, text, int, decimal, timestamp, boolean, mysqlEnum, index, primaryKey, foreignKey } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

export const categories = mysqlTable('categories', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  parentId: varchar('parent_id', { length: 36 }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  bannerUrl: varchar('banner_url', { length: 2048 }),
  iconUrl: varchar('icon_url', { length: 2048 }),
  featured: boolean('featured').default(false).notNull(),
  visible: boolean('visible').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  slugIdx: index('categories_slug_idx').on(table.slug),
}));

export const brands = mysqlTable('brands', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  logoUrl: varchar('logo_url', { length: 2048 }),
  featured: boolean('featured').default(false).notNull(),
  status: mysqlEnum('status', ['ACTIVE', 'INACTIVE']).default('ACTIVE').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  slugIdx: index('brands_slug_idx').on(table.slug),
}));

export const products = mysqlTable('products', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  brandId: varchar('brand_id', { length: 36 }).references(() => brands.id, { onDelete: 'set null' }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal('sale_price', { precision: 10, scale: 2 }),
  sku: varchar('sku', { length: 100 }).notNull().unique(),
  barcode: varchar('barcode', { length: 100 }),
  featured: boolean('featured').default(false).notNull(),
  status: mysqlEnum('status', ['DRAFT', 'PUBLISHED', 'OUT_OF_STOCK']).default('DRAFT').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  slugIdx: index('products_slug_idx').on(table.slug),
  skuIdx: index('products_sku_idx').on(table.sku),
}));

export const productCategories = mysqlTable('product_categories', {
  productId: varchar('product_id', { length: 36 }).notNull().references(() => products.id, { onDelete: 'cascade' }),
  categoryId: varchar('category_id', { length: 36 }).notNull().references(() => categories.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.productId, table.categoryId] }),
}));

export const productImages = mysqlTable('product_images', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  productId: varchar('product_id', { length: 36 }).notNull().references(() => products.id, { onDelete: 'cascade' }),
  url: varchar('url', { length: 2048 }).notNull(),
  sortOrder: int('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const productTags = mysqlTable('product_tags', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  productId: varchar('product_id', { length: 36 }).notNull().references(() => products.id, { onDelete: 'cascade' }),
  tag: varchar('tag', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  tagIdx: index('product_tags_tag_idx').on(table.tag),
}));

export const productAttributes = mysqlTable('product_attributes', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  productId: varchar('product_id', { length: 36 }).notNull().references(() => products.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const attributeValues = mysqlTable('attribute_values', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  attributeId: varchar('attribute_id', { length: 36 }).notNull().references(() => productAttributes.id, { onDelete: 'cascade' }),
  value: varchar('value', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const productVariants = mysqlTable('product_variants', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  productId: varchar('product_id', { length: 36 }).notNull().references(() => products.id, { onDelete: 'cascade' }),
  sku: varchar('sku', { length: 100 }).notNull().unique(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal('sale_price', { precision: 10, scale: 2 }),
  stock: int('stock').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  skuIdx: index('product_variants_sku_idx').on(table.sku),
}));

export const variantAttributeValues = mysqlTable('variant_attribute_values', {
  variantId: varchar('variant_id', { length: 36 }).notNull(),
  attributeValueId: varchar('attribute_value_id', { length: 36 }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.variantId, table.attributeValueId] }),
  variantIdFk: foreignKey({
    name: 'var_attr_val_var_id_fk',
    columns: [table.variantId],
    foreignColumns: [productVariants.id],
  }).onDelete('cascade'),
  attributeValueIdFk: foreignKey({
    name: 'var_attr_val_attr_val_id_fk',
    columns: [table.attributeValueId],
    foreignColumns: [attributeValues.id],
  }).onDelete('cascade'),
}));

// Relation definitions
export const categoriesRelations = relations(categories, ({ many }) => ({
  productCategories: many(productCategories),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  productCategories: many(productCategories),
  productImages: many(productImages),
  productVariants: many(productVariants),
}));

export const productCategoriesRelations = relations(productCategories, ({ one }) => ({
  product: one(products, {
    fields: [productCategories.productId],
    references: [products.id],
  }),
  category: one(categories, {
    fields: [productCategories.categoryId],
    references: [categories.id],
  }),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  variantAttributeValues: many(variantAttributeValues),
}));

export const variantAttributeValuesRelations = relations(variantAttributeValues, ({ one }) => ({
  variant: one(productVariants, {
    fields: [variantAttributeValues.variantId],
    references: [productVariants.id],
  }),
  attributeValue: one(attributeValues, {
    fields: [variantAttributeValues.attributeValueId],
    references: [attributeValues.id],
  }),
}));

export const attributeValuesRelations = relations(attributeValues, ({ many }) => ({
  variantAttributeValues: many(variantAttributeValues),
}));
