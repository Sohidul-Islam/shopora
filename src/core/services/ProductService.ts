import { ProductRepository, ProductFilterOptions } from '../repositories/ProductRepository';

const productRepository = new ProductRepository();

export class ProductService {

  // ── STOREFRONT ────────────────────────────────────────────────────────────────

  async listStorefrontProducts(filters: ProductFilterOptions) {
    return productRepository.getProducts(filters);
  }

  async getProductDetails(slug: string) {
    const product = await productRepository.findBySlug(slug);
    if (!product) throw new Error('Product not found.');
    return product;
  }

  async getHomeBannersAndFeatured() {
    const featured = await productRepository.getProducts({ limit: 8 });
    const brands = await productRepository.getBrands();
    const categories = await productRepository.getCategories();
    return { featured, brands, categories };
  }

  // ── ADMIN: PRODUCTS ───────────────────────────────────────────────────────────

  async listAdminProducts(filters: { status?: string; searchQuery?: string; limit?: number; offset?: number } = {}) {
    return productRepository.listAdminProducts(filters);
  }

  async createProduct(actorRole: string, data: any) {
    if (actorRole !== 'Admin' && actorRole !== 'Manager') throw new Error('Unauthorized.');
    if (!data.name || !data.slug || !data.price || !data.sku) {
      throw new Error('name, slug, sku, and price are required fields.');
    }
    const existing = await productRepository.findBySlug(data.slug);
    if (existing) throw new Error('A product with this slug already exists.');
    const product = await productRepository.adminCreateProduct({ ...data, status: data.status || 'DRAFT' });
    if (data.categoryIds && Array.isArray(data.categoryIds) && data.categoryIds.length > 0) {
      await productRepository.setProductCategories(product!.id, data.categoryIds);
    }
    return productRepository.adminFindById(product!.id);
  }

  async updateProduct(actorRole: string, id: string, data: any) {
    if (actorRole !== 'Admin' && actorRole !== 'Manager') throw new Error('Unauthorized.');
    const existing = await productRepository.adminFindById(id);
    if (!existing) throw new Error('Product not found.');
    if (data.slug && data.slug !== existing.slug) {
      const conflict = await productRepository.findBySlug(data.slug);
      if (conflict) throw new Error('This slug is already taken by another product.');
    }
    const { categoryIds, ...productData } = data;
    await productRepository.adminUpdateProduct(id, productData);
    if (categoryIds !== undefined) await productRepository.setProductCategories(id, categoryIds);
    return productRepository.adminFindById(id);
  }

  async deleteProduct(actorRole: string, id: string) {
    if (actorRole !== 'Admin' && actorRole !== 'Manager') throw new Error('Unauthorized.');
    const existing = await productRepository.adminFindById(id);
    if (!existing) throw new Error('Product not found.');
    await productRepository.adminSoftDeleteProduct(id);
  }

  // ── ADMIN: CATEGORIES & SUB-CATEGORIES ───────────────────────────────────────

  async listCategories() {
    return productRepository.listAllCategories();
  }

  async getCategoryTree() {
    return productRepository.getCategoryTree();
  }

  async createCategory(actorRole: string, data: any) {
    if (actorRole !== 'Admin' && actorRole !== 'Manager') throw new Error('Unauthorized.');
    if (!data.name || !data.slug) throw new Error('name and slug are required.');
    const existing = await productRepository.findCategoryBySlug(data.slug);
    if (existing) throw new Error('A category with this slug already exists.');
    return productRepository.createCategory(data);
  }

  async updateCategory(actorRole: string, id: string, data: any) {
    if (actorRole !== 'Admin' && actorRole !== 'Manager') throw new Error('Unauthorized.');
    const existing = await productRepository.findCategoryById(id);
    if (!existing) throw new Error('Category not found.');
    if (data.slug && data.slug !== existing.slug) {
      const conflict = await productRepository.findCategoryBySlug(data.slug);
      if (conflict) throw new Error('This slug is already taken by another category.');
    }
    return productRepository.updateCategory(id, data);
  }

  async deleteCategory(actorRole: string, id: string) {
    if (actorRole !== 'Admin' && actorRole !== 'Manager') throw new Error('Unauthorized.');
    const existing = await productRepository.findCategoryById(id);
    if (!existing) throw new Error('Category not found.');
    await productRepository.deleteCategory(id);
  }

  // ── ADMIN: BRANDS ─────────────────────────────────────────────────────────────

  async listBrands() {
    return productRepository.listAllBrands();
  }

  async createBrand(actorRole: string, data: any) {
    if (actorRole !== 'Admin' && actorRole !== 'Manager') throw new Error('Unauthorized.');
    if (!data.name || !data.slug) throw new Error('name and slug are required.');
    const existing = await productRepository.findBrandBySlug(data.slug);
    if (existing) throw new Error('A brand with this slug already exists.');
    return productRepository.createBrand(data);
  }

  async updateBrand(actorRole: string, id: string, data: any) {
    if (actorRole !== 'Admin' && actorRole !== 'Manager') throw new Error('Unauthorized.');
    const existing = await productRepository.findBrandById(id);
    if (!existing) throw new Error('Brand not found.');
    if (data.slug && data.slug !== existing.slug) {
      const conflict = await productRepository.findBrandBySlug(data.slug);
      if (conflict) throw new Error('This slug is already taken by another brand.');
    }
    return productRepository.updateBrand(id, data);
  }

  async deleteBrand(actorRole: string, id: string) {
    if (actorRole !== 'Admin' && actorRole !== 'Manager') throw new Error('Unauthorized.');
    const existing = await productRepository.findBrandById(id);
    if (!existing) throw new Error('Brand not found.');
    await productRepository.deleteBrand(id);
  }

  // ── INVENTORY ─────────────────────────────────────────────────────────────────

  async getInventoryAlerts(actorRole: string) {
    if (actorRole !== 'Admin' && actorRole !== 'Manager') throw new Error('Unauthorized.');
    return productRepository.getInventoryAlerts();
  }

  async adjustStock(actorId: string, actorRole: string, data: { variantId: string, warehouseId: string, quantity: number, type: 'IN' | 'OUT' | 'ADJUSTMENT', reason: string }) {
    if (actorRole !== 'Admin' && actorRole !== 'Manager') throw new Error('Unauthorized.');
    return productRepository.adjustStock(data.variantId, data.warehouseId, data.quantity, data.type, data.reason, actorId);
  }
}
