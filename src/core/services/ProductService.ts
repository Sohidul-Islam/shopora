import { ProductRepository, ProductFilterOptions } from '../repositories/ProductRepository';

const productRepository = new ProductRepository();

export class ProductService {
  async listStorefrontProducts(filters: ProductFilterOptions) {
    return productRepository.getProducts(filters);
  }

  async getProductDetails(slug: string) {
    const product = await productRepository.findBySlug(slug);
    if (!product) {
      throw new Error('Product not found.');
    }
    return product;
  }

  async getHomeBannersAndFeatured() {
    const featured = await productRepository.getProducts({ limit: 8 });
    const brands = await productRepository.getBrands();
    const categories = await productRepository.getCategories();
    return { featured, brands, categories };
  }

  async getInventoryAlerts(actorRole: string) {
    if (actorRole !== 'Admin' && actorRole !== 'Manager') {
      throw new Error('Unauthorized access.');
    }
    return productRepository.getInventoryAlerts();
  }

  async adjustStockLevel(actorId: string, actorRole: string, data: { variantId: string, warehouseId: string, quantity: number, type: 'IN' | 'OUT' | 'ADJUSTMENT', reason: string }) {
    if (actorRole !== 'Admin' && actorRole !== 'Manager') {
      throw new Error('Unauthorized access to inventory management.');
    }
    return productRepository.adjustStock(
      data.variantId,
      data.warehouseId,
      data.quantity,
      data.type,
      data.reason,
      actorId
    );
  }
}
