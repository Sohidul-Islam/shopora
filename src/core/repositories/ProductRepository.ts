import { db } from '../../db';
import { products, productVariants, categories, brands, productImages, inventories, stockLogs, productCategories } from '../../db/schema';
import { eq, and, or, like, asc, desc, between, sql, inArray } from 'drizzle-orm';

export interface ProductFilterOptions {
  categorySlug?: string;
  brandSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  sortBy?: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'popular' | 'best-selling';
  limit?: number;
  offset?: number;
}

export class ProductRepository {
  async getProducts(filters: ProductFilterOptions = {}) {
    const { categorySlug, brandSlug, minPrice, maxPrice, searchQuery, sortBy, limit = 20, offset = 0 } = filters;
    
    // We can do advanced query compilation. Let's query using db.query API
    let whereClauses: any[] = [eq(products.status, 'PUBLISHED')];

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

    // Handled category subqueries or joins
    let categoryIds: string[] = [];
    if (categorySlug) {
      const cat = await db.query.categories.findFirst({
        where: eq(categories.slug, categorySlug),
      });
      if (cat) {
        categoryIds.push(cat.id);
        // also find children subcategories
        const subCats = await db.select({ id: categories.id }).from(categories).where(eq(categories.parentId, cat.id));
        categoryIds.push(...subCats.map(c => c.id));
      }
    }

    if (brandSlug) {
      const br = await db.query.brands.findFirst({
        where: eq(brands.slug, brandSlug),
      });
      if (br) {
        whereClauses.push(eq(products.brandId, br.id));
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

    // Perform query
    const results = await db.query.products.findMany({
      where: and(...whereClauses),
      limit,
      offset,
      orderBy: sortOrder,
      with: {
        brand: true,
        productCategories: {
          with: {
            category: true,
          }
        },
        productImages: {
          orderBy: asc(productImages.sortOrder),
        },
        productVariants: true,
      }
    });

    // If category filter is applied, we post-filter or adjust joins.
    if (categoryIds.length > 0) {
      return (results as any[]).filter(prod => 
        (prod.productCategories as any[]).some((pc: any) => categoryIds.includes(pc.categoryId))
      );
    }

    return results;
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
}
