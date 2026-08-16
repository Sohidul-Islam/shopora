import { db } from '../../db';
import { products, productVariants, categories, brands, productImages, inventories, stockLogs, productCategories } from '../../db/schema';
import { eq, and, or, like, asc, desc, between, sql, inArray, isNull } from 'drizzle-orm';

export interface ProductFilterOptions {
  categorySlug?: string;
  brandSlug?: string;    // legacy single
  brandSlugs?: string[]; // multi-select
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  minRating?: number;
  sortBy?: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'popular' | 'best-selling';
  limit?: number;
  offset?: number;
}

export class ProductRepository {
  async getProducts(filters: ProductFilterOptions = {}) {
    const { categorySlug, brandSlug, brandSlugs, minPrice, maxPrice, searchQuery, sortBy, minRating, limit = 20, offset = 0 } = filters;
    
    let whereClauses: any[] = [eq(products.status, 'PUBLISHED'), isNull(products.deletedAt)];

    if (searchQuery) {
      whereClauses.push(
        or(
          like(products.name, `%${searchQuery}%`),
          like(products.description, `%${searchQuery}%`),
          like(products.sku, `%${searchQuery}%`)
        )
      );
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      whereClauses.push(between(products.price, String(minPrice), String(maxPrice)));
    } else if (minPrice !== undefined) {
      whereClauses.push(sql`${products.price} >= ${minPrice}`);
    } else if (maxPrice !== undefined) {
      whereClauses.push(sql`${products.price} <= ${maxPrice}`);
    }

    // Category filter — resolves slug → id + children
    let categoryIds: string[] = [];
    if (categorySlug) {
      const cat = await db.query.categories.findFirst({
        where: eq(categories.slug, categorySlug),
      });
      if (cat) {
        categoryIds.push(cat.id);
        const subCats = await db.select({ id: categories.id }).from(categories).where(eq(categories.parentId, cat.id));
        categoryIds.push(...subCats.map(c => c.id));
      }
    }

    // Multi-brand filter — resolve slugs → brandIds via inArray
    const effectiveBrandSlugs = brandSlugs && brandSlugs.length > 0 ? brandSlugs : (brandSlug ? [brandSlug] : []);
    if (effectiveBrandSlugs.length > 0) {
      const matchedBrands = await db.select({ id: brands.id }).from(brands).where(inArray(brands.slug, effectiveBrandSlugs));
      if (matchedBrands.length > 0) {
        whereClauses.push(inArray(products.brandId, matchedBrands.map(b => b.id)));
      } else {
        // No brand matched — return empty
        whereClauses.push(sql`1=0`);
      }
    }

    let sortOrder: any = desc(products.createdAt);
    if (sortBy === 'oldest') {
      sortOrder = asc(products.createdAt);
    } else if (sortBy === 'price-low') {
      sortOrder = asc(products.price);
    } else if (sortBy === 'price-high') {
      sortOrder = desc(products.price);
    }

    const results = await db.query.products.findMany({
      where: and(...whereClauses),
      limit: categoryIds.length > 0 || minRating ? limit * 5 : limit,
      offset: categoryIds.length > 0 || minRating ? 0 : offset,
      orderBy: sortOrder,
      with: {
        brand: true,
        productCategories: { with: { category: true } },
        productImages: { orderBy: asc(productImages.sortOrder) },
        productVariants: true,
      }
    });

    let filtered: any[] = results as any[];

    if (categoryIds.length > 0) {
      filtered = filtered.filter(prod =>
        (prod.productCategories as any[]).some((pc: any) => categoryIds.includes(pc.categoryId))
      );
    }

    // Rating post-filter (averageRating field on product)
    if (minRating !== undefined && minRating > 0) {
      filtered = filtered.filter(prod => Number(prod.averageRating || 0) >= minRating);
    }

    // Re-apply offset+limit after post-filters
    if (categoryIds.length > 0 || minRating) {
      return filtered.slice(offset, offset + limit);
    }

    return filtered;
  }

  async getProductsCount(filters: ProductFilterOptions = {}) {
    const { categorySlug, brandSlug, brandSlugs, minPrice, maxPrice, searchQuery, minRating } = filters;
    let whereClauses: any[] = [eq(products.status, 'PUBLISHED'), isNull(products.deletedAt)];

    if (searchQuery) {
      whereClauses.push(
        or(
          like(products.name, `%${searchQuery}%`),
          like(products.description, `%${searchQuery}%`),
          like(products.sku, `%${searchQuery}%`)
        )
      );
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      whereClauses.push(between(products.price, String(minPrice), String(maxPrice)));
    } else if (minPrice !== undefined) {
      whereClauses.push(sql`${products.price} >= ${minPrice}`);
    } else if (maxPrice !== undefined) {
      whereClauses.push(sql`${products.price} <= ${maxPrice}`);
    }

    let categoryIds: string[] = [];
    if (categorySlug) {
      const cat = await db.query.categories.findFirst({
        where: eq(categories.slug, categorySlug),
      });
      if (cat) {
        categoryIds.push(cat.id);
        const subCats = await db.select({ id: categories.id }).from(categories).where(eq(categories.parentId, cat.id));
        categoryIds.push(...subCats.map(c => c.id));
      }
    }

    const effectiveBrandSlugs = brandSlugs && brandSlugs.length > 0 ? brandSlugs : (brandSlug ? [brandSlug] : []);
    if (effectiveBrandSlugs.length > 0) {
      const matchedBrands = await db.select({ id: brands.id }).from(brands).where(inArray(brands.slug, effectiveBrandSlugs));
      if (matchedBrands.length > 0) {
        whereClauses.push(inArray(products.brandId, matchedBrands.map(b => b.id)));
      } else {
        whereClauses.push(sql`1=0`);
      }
    }

    if (categoryIds.length > 0 || minRating) {
      const results = await db.query.products.findMany({
        where: and(...whereClauses),
        with: { productCategories: true },
      });
      let filtered = results as any[];
      if (categoryIds.length > 0) {
        filtered = filtered.filter(prod =>
          (prod.productCategories as any[]).some((pc: any) => categoryIds.includes(pc.categoryId))
        );
      }
      if (minRating !== undefined && minRating > 0) {
        filtered = filtered.filter(prod => Number(prod.averageRating || 0) >= minRating);
      }
      return filtered.length;
    }

    const result = await db.select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(...whereClauses));
    return result[0]?.count || 0;
  }

  async findBySlug(slug: string) {
    return db.query.products.findFirst({
      where: eq(products.slug, slug),
      with: {
        brand: true,
        productImages: {
          orderBy: asc(productImages.sortOrder),
        },
        productCategories: {
          with: {
            category: true,
          }
        },
        productVariants: {
          with: {
            variantAttributeValues: {
              with: {
                attributeValue: true
              }
            }
          }
        }
      }
    });
  }

  async findById(id: string) {
    return db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        brand: true,
        productImages: true,
        productVariants: true,
      }
    });
  }

  // Admin Management CRUD
  async createProduct(data: typeof products.$inferInsert) {
    const id = data.id || crypto.randomUUID();
    await db.insert(products).values({ ...data, id });
    return this.findById(id);
  }

  async updateProduct(id: string, data: Partial<typeof products.$inferInsert>) {
    await db.update(products).set(data).where(eq(products.id, id));
    return this.findById(id);
  }

  async softDeleteProduct(id: string) {
    await db.update(products).set({ deletedAt: new Date() }).where(eq(products.id, id));
  }

  // Stock and inventory updates
  async getInventoryAlerts(threshold: number = 10) {
    return db.select()
      .from(inventories)
      .leftJoin(productVariants, eq(inventories.productVariantId, productVariants.id))
      .where(sql`${inventories.quantity} <= ${threshold}`);
  }

  async adjustStock(variantId: string, warehouseId: string, quantity: number, type: 'IN' | 'OUT' | 'ADJUSTMENT', reason: string, user: string) {
    // Transactional inventory modification
    await db.transaction(async (tx) => {
      // Find or create inventory row
      let inv = await tx.query.inventories.findFirst({
        where: and(
          eq(inventories.productVariantId, variantId),
          eq(inventories.warehouseId, warehouseId)
        ),
      });

      if (!inv) {
        const invId = crypto.randomUUID();
        const priceResult = await tx.select().from(productVariants).where(eq(productVariants.id, variantId));
        const sellingPrice = priceResult[0]?.price || '0.00';
        
        await tx.insert(inventories).values({
          id: invId,
          productVariantId: variantId,
          warehouseId,
          quantity: type === 'IN' ? quantity : -quantity,
          purchasePrice: '0.00',
          sellingPrice,
        });
        inv = { id: invId } as any;
      } else {
        const newQty = type === 'IN' ? inv.quantity + quantity : inv.quantity - quantity;
        await tx.update(inventories).set({ quantity: newQty }).where(eq(inventories.id, inv.id));
      }

      // Log stock
      await tx.insert(stockLogs).values({
        id: crypto.randomUUID(),
        inventoryId: inv!.id,
        type,
        quantity,
        reason,
        createdBy: user,
      });

      // Update variant cached stock sum
      const allWarehouseInv = await tx.select().from(inventories).where(eq(inventories.productVariantId, variantId));
      const totalStock = allWarehouseInv.reduce((sum, item) => sum + item.quantity, 0);
      await tx.update(productVariants).set({ stock: totalStock }).where(eq(productVariants.id, variantId));
    });
  }

  async getBrands() {
    return db.select().from(brands).where(eq(brands.status, 'ACTIVE'));
  }

  async getCategories() {
    return db.select().from(categories).where(eq(categories.visible, true));
  }

  // ── ADMIN: PRODUCTS ───────────────────────────────────────────────────────────

  async listAdminProducts(filters: { status?: string; searchQuery?: string; limit?: number; offset?: number } = {}) {
    const { status, searchQuery, limit = 100, offset = 0 } = filters;
    const whereClauses: any[] = [isNull(products.deletedAt)];
    if (status) whereClauses.push(eq(products.status, status as any));
    if (searchQuery) {
      whereClauses.push(or(like(products.name, '%' + searchQuery + '%'), like(products.sku, '%' + searchQuery + '%')));
    }
    return db.query.products.findMany({
      where: and(...whereClauses),
      limit,
      offset,
      orderBy: desc(products.createdAt),
      with: {
        brand: true,
        productCategories: { with: { category: true } },
        productImages: { orderBy: asc(productImages.sortOrder), limit: 1 },
        productVariants: true,
      }
    });
  }

  async adminFindById(id: string) {
    return db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        brand: true,
        productImages: { orderBy: asc(productImages.sortOrder) },
        productCategories: { with: { category: true } },
        productVariants: true,
      }
    });
  }

  async adminCreateProduct(data: typeof products.$inferInsert) {
    const id = data.id || crypto.randomUUID();
    await db.insert(products).values({ ...data, id });
    return this.adminFindById(id);
  }

  async adminUpdateProduct(id: string, data: Partial<typeof products.$inferInsert>) {
    await db.update(products).set({ ...data, updatedAt: new Date() }).where(eq(products.id, id));
    return this.adminFindById(id);
  }

  async adminSoftDeleteProduct(id: string) {
    await db.update(products).set({ deletedAt: new Date() }).where(eq(products.id, id));
  }

  async adminHardDeleteProduct(id: string) {
    await db.delete(productCategories).where(eq(productCategories.productId, id));
    await db.delete(productImages).where(eq(productImages.productId, id));
    await db.delete(productVariants).where(eq(productVariants.productId, id));
    await db.delete(products).where(eq(products.id, id));
  }

  // ── ADMIN: PRODUCT-CATEGORY ASSIGNMENTS ──────────────────────────────────────

  async setProductCategories(productId: string, categoryIds: string[]) {
    await db.delete(productCategories).where(eq(productCategories.productId, productId));
    if (categoryIds.length > 0) {
      await db.insert(productCategories).values(categoryIds.map(categoryId => ({ productId, categoryId })));
    }
  }

  async assignProductToCategory(productId: string, categoryId: string) {
    await db.insert(productCategories).values({ productId, categoryId }).onDuplicateKeyUpdate({ set: { productId } });
  }

  async removeProductFromCategory(productId: string, categoryId: string) {
    await db.delete(productCategories).where(
      and(eq(productCategories.productId, productId), eq(productCategories.categoryId, categoryId))
    );
  }

  // ── ADMIN: CATEGORIES CRUD ────────────────────────────────────────────────────

  async listAllCategories() {
    return db.select().from(categories).orderBy(asc(categories.name));
  }

  async getCategoryTree() {
    const all = await db.select().from(categories).orderBy(asc(categories.name));
    const roots = all.filter(c => !c.parentId);
    const children = all.filter(c => !!c.parentId);
    return roots.map(root => ({
      ...root,
      children: children.filter(c => c.parentId === root.id)
    }));
  }

  async findCategoryById(id: string) {
    return db.query.categories.findFirst({ where: eq(categories.id, id) });
  }

  async findCategoryBySlug(slug: string) {
    return db.query.categories.findFirst({ where: eq(categories.slug, slug) });
  }

  async createCategory(data: typeof categories.$inferInsert) {
    const id = data.id || crypto.randomUUID();
    await db.insert(categories).values({ ...data, id });
    return this.findCategoryById(id);
  }

  async updateCategory(id: string, data: Partial<typeof categories.$inferInsert>) {
    await db.update(categories).set({ ...data, updatedAt: new Date() }).where(eq(categories.id, id));
    return this.findCategoryById(id);
  }

  async deleteCategory(id: string) {
    // Promote children to root before deleting parent
    const nullParent = { parentId: null } as unknown as Partial<typeof categories.$inferInsert>;
    await db.update(categories).set(nullParent).where(eq(categories.parentId, id));
    await db.delete(categories).where(eq(categories.id, id));
  }

  // ── ADMIN: BRANDS CRUD ────────────────────────────────────────────────────────

  async listAllBrands() {
    return db.select().from(brands).orderBy(asc(brands.name));
  }

  async findBrandById(id: string) {
    return db.query.brands.findFirst({ where: eq(brands.id, id) });
  }

  async findBrandBySlug(slug: string) {
    return db.query.brands.findFirst({ where: eq(brands.slug, slug) });
  }

  async createBrand(data: typeof brands.$inferInsert) {
    const id = data.id || crypto.randomUUID();
    await db.insert(brands).values({ ...data, id });
    return this.findBrandById(id);
  }

  async updateBrand(id: string, data: Partial<typeof brands.$inferInsert>) {
    await db.update(brands).set({ ...data, updatedAt: new Date() }).where(eq(brands.id, id));
    return this.findBrandById(id);
  }

  async deleteBrand(id: string) {
    // Detach brand from products first
    await db.update(products).set({ brandId: null }).where(eq(products.brandId, id));
    await db.delete(brands).where(eq(brands.id, id));
  }
}
