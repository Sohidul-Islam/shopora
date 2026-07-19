'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { formatPrice } from '../../lib/utils';
import { useStore, CartItem } from '../../store/useStore';
import Link from 'next/link';
import { 
  ChevronRight, 
  Heart, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2 
} from 'lucide-react';

function ProductListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  // Filter States
  const categoryFilter = searchParams.get('category') || '';
  const brandFilter = searchParams.get('brand') || '';
  const sortFilter = searchParams.get('sortBy') || 'newest';
  const queryFilter = searchParams.get('q') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  // Accordion state
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    brand: true,
    battery: false,
    screen: false,
    diagonal: false,
    protection: false,
    memory: false
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const queryStr = new URLSearchParams({
          category: categoryFilter,
          brand: brandFilter,
          sortBy: sortFilter,
          q: queryFilter,
          minPrice: minPrice,
          maxPrice: maxPrice,
        }).toString();

        const response = await fetch(`/api/products?${queryStr}`);
        const res = await response.json();
        if (res.success) {
          setProductsList(res.products);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [categoryFilter, brandFilter, sortFilter, queryFilter, minPrice, maxPrice]);

  const updateFilters = (newFilters: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val === '') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    router.push(`/products?${params.toString()}`);
  };

  const handleAddToCartClick = (prod: any) => {
    const variant = prod.productVariants?.[0];
    if (!variant) return;

    const cartItem: CartItem = {
      id: variant.id,
      productId: prod.id,
      name: prod.name,
      sku: variant.sku,
      image: prod.productImages?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200',
      price: Number(prod.price),
      salePrice: prod.salePrice ? Number(prod.salePrice) : null,
      quantity: 1,
      stock: variant.stock,
    };

    addToCart(cartItem);
    setAddedItem(variant.id);
    setTimeout(() => setAddedItem(null), 1800);
  };

  const brands = [
    { name: 'Apple', count: 110, slug: 'apple' },
    { name: 'Samsung', count: 125, slug: 'samsung' },
    { name: 'Xiaomi', count: 58, slug: 'xiaomi' },
    { name: 'Poco', count: 44, slug: 'poco' },
    { name: 'OPPO', count: 36, slug: 'oppo' },
    { name: 'Sony', count: 10, slug: 'sony' },
    { name: 'Nike', count: 85, slug: 'nike' }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#05060b] text-slate-800 dark:text-slate-100 font-sans py-8 px-6 sm:px-12 lg:px-24 transition-colors duration-300">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs text-slate-400 mb-8">
        <Link href="/" className="hover:text-purple-650 dark:hover:text-white transition">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/products" className="hover:text-purple-650 dark:hover:text-white transition">Catalog</Link>
        {categoryFilter && (
          <>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-800 dark:text-white capitalize font-medium">{categoryFilter}</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          {/* Brand Filter */}
          <div className="border-b border-black/5 dark:border-white/5 pb-4">
            <button 
              onClick={() => toggleAccordion('brand')} 
              className="w-full flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider py-2"
            >
              <span>Brand</span>
              {openAccordions.brand ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {openAccordions.brand && (
              <div className="mt-3 space-y-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 dark:text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search brand"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {brands.map((br) => (
                    <label key={br.slug} className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">
                      <div className="flex items-center space-x-2.5">
                        <input
                          type="checkbox"
                          checked={brandFilter === br.slug}
                          onChange={() => updateFilters({ brand: brandFilter === br.slug ? '' : br.slug })}
                          className="w-4 h-4 rounded border-slate-300 dark:border-white/10 text-purple-650 dark:text-purple-600 focus:ring-purple-650 dark:focus:ring-purple-600 bg-white dark:bg-[#0a0c14] cursor-pointer"
                        />
                        <span>{br.name}</span>
                      </div>
                      <span className="text-slate-400 dark:text-slate-500 text-[10px]">{br.count}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Battery capacity */}
          <div className="border-b border-black/5 dark:border-white/5 pb-4">
            <button 
              onClick={() => toggleAccordion('battery')} 
              className="w-full flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider py-2"
            >
              <span>Battery capacity</span>
              {openAccordions.battery ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Screen type */}
          <div className="border-b border-black/5 dark:border-white/5 pb-4">
            <button 
              onClick={() => toggleAccordion('screen')} 
              className="w-full flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider py-2"
            >
              <span>Screen type</span>
              {openAccordions.screen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Screen diagonal */}
          <div className="border-b border-black/5 dark:border-white/5 pb-4">
            <button 
              onClick={() => toggleAccordion('diagonal')} 
              className="w-full flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider py-2"
            >
              <span>Screen diagonal</span>
              {openAccordions.diagonal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Protection class */}
          <div className="border-b border-black/5 dark:border-white/5 pb-4">
            <button 
              onClick={() => toggleAccordion('protection')} 
              className="w-full flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider py-2"
            >
              <span>Protection class</span>
              {openAccordions.protection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Built-in memory */}
          <div className="border-b border-black/5 dark:border-white/5 pb-4">
            <button 
              onClick={() => toggleAccordion('memory')} 
              className="w-full flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider py-2"
            >
              <span>Built-in memory</span>
              {openAccordions.memory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Products Listing Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-4">
            <div className="text-slate-400 dark:text-slate-400 text-sm font-semibold">
              Selected Products: <span className="text-slate-900 dark:text-white font-extrabold">{productsList.length}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={sortFilter}
                onChange={(e) => updateFilters({ sortBy: e.target.value })}
                className="bg-white dark:bg-[#0c0d15] border border-black/5 dark:border-white/10 text-slate-700 dark:text-slate-350 rounded-lg py-2 px-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
              >
                <option value="newest">By rating</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price Low → High</option>
                <option value="price-high">Price High → Low</option>
              </select>
            </div>
          </div>

          {/* Product Items Rendering */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl h-[360px] animate-pulse" />
              ))}
            </div>
          ) : productsList.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
              <p className="text-slate-500 dark:text-slate-400 text-sm">No products found matching the criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {productsList.map((prod) => {
                const isWished = isInWishlist(prod.id);
                const firstVariant = prod.productVariants?.[0];
                const isAdded = addedItem === firstVariant?.id;

                return (
                  <div key={prod.id} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/15 rounded-3xl p-5 flex flex-col justify-between h-[390px] relative group hover:shadow-2xl hover:shadow-purple-650/5 transition-all duration-500">
                    <button
                      onClick={() => toggleWishlist({
                        id: prod.id,
                        name: prod.name,
                        slug: prod.slug,
                        price: Number(prod.price),
                        image: prod.productImages?.[0]?.url || ''
                      })}
                      className={`absolute top-4 right-4 z-10 p-2.5 rounded-2xl border transition ${
                        isWished 
                          ? 'text-red-500 bg-white border-red-100 shadow-md' 
                          : 'text-gray-405 bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:text-red-500 hover:bg-white hover:border-white'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <div className="flex-1 flex flex-col items-center justify-center p-2">
                      <img 
                        src={prod.productImages?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200'} 
                        alt={prod.name} 
                        className="max-h-[150px] object-contain group-hover:scale-102 transition duration-350 drop-shadow-[0_10px_20px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]" 
                      />
                    </div>

                    <div className="mt-4 space-y-2.5 text-center">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-2 hover:text-purple-650 dark:hover:text-white transition">
                        <Link href={`/products/${prod.slug}`}>{prod.name}</Link>
                      </h4>
                      <p className="font-bold text-base text-slate-905 dark:text-white">
                        {formatPrice(prod.salePrice || prod.price)}
                      </p>
                      
                      <button
                        onClick={() => handleAddToCartClick(prod)}
                        disabled={firstVariant?.stock === 0}
                        className={`w-full py-3.5 rounded-2xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                          isAdded 
                            ? 'bg-emerald-650 dark:bg-emerald-600 text-white' 
                            : 'bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 shadow-md'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Added to Cart</span>
                          </>
                        ) : (
                          <span>Buy Now</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-2 pt-8">
            <button className="px-3.5 py-2 border border-black/5 dark:border-white/10 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-xs font-semibold text-slate-500 dark:text-slate-400">&lt;</button>
            <button className="px-3.5 py-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl text-xs font-semibold">1</button>
            <button className="px-3.5 py-2 border border-black/5 dark:border-white/10 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-xs font-semibold text-slate-500 dark:text-slate-400">2</button>
            <button className="px-3.5 py-2 border border-black/5 dark:border-white/10 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-xs font-semibold text-slate-500 dark:text-slate-400">3</button>
            <span className="text-slate-400 dark:text-slate-600 text-xs px-2">...</span>
            <button className="px-3.5 py-2 border border-black/5 dark:border-white/10 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-xs font-semibold text-slate-500 dark:text-slate-400">12</button>
            <button className="px-3.5 py-2 border border-black/5 dark:border-white/10 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-xs font-semibold text-slate-500 dark:text-slate-400">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductListPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa] dark:bg-[#05060b] text-slate-900 dark:text-white flex items-center justify-center">Loading catalogue...</div>}>
      <ProductListContent />
    </Suspense>
  );
}
