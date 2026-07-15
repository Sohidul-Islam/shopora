'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { formatPrice } from '../../lib/utils';
import { useStore, CartItem } from '../../store/useStore';
import Link from 'next/link';
import { LayoutGrid, List, SlidersHorizontal, Search, Star, ShoppingCart, Heart, CheckCircle2 } from 'lucide-react';

function ProductListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [addedItem, setAddedItem] = useState<string | null>(null);

  // Filter States
  const categoryFilter = searchParams.get('category') || '';
  const brandFilter = searchParams.get('brand') || '';
  const sortFilter = searchParams.get('sortBy') || 'newest';
  const queryFilter = searchParams.get('q') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [brandsList, setBrandsList] = useState<any[]>([]);

  useEffect(() => {
    async function loadFilters() {
      // Stub metadata list
      setCategoriesList([
        { name: 'All Categories', slug: '' },
        { name: 'Electronics', slug: 'electronics' },
        { name: 'Apparel', slug: 'apparel' },
        { name: 'Footwear', slug: 'footwear' },
        { name: 'Accessories', slug: 'accessories' }
      ]);
      setBrandsList([
        { name: 'All Brands', slug: '' },
        { name: 'Apple Inc.', slug: 'apple' },
        { name: 'Nike', slug: 'nike' },
        { name: 'Sony', slug: 'sony' }
      ]);
    }
    loadFilters();
  }, []);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 glass rounded-2xl p-6 border border-slate-800/80 space-y-6 h-fit">
          <div className="flex items-center space-x-2 border-b border-slate-900 pb-3">
            <SlidersHorizontal className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold font-display text-white">Filters</h2>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Category</h3>
            <div className="flex flex-col space-y-1">
              {categoriesList.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => updateFilters({ category: cat.slug })}
                  className={`text-left text-sm py-1.5 px-3 rounded-lg transition font-medium ${
                    categoryFilter === cat.slug
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-450 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Brand</h3>
            <div className="flex flex-col space-y-1">
              {brandsList.map((brand) => (
                <button
                  key={brand.slug}
                  onClick={() => updateFilters({ brand: brand.slug })}
                  className={`text-left text-sm py-1.5 px-3 rounded-lg transition font-medium ${
                    brandFilter === brand.slug
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-450 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Price Range</h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => updateFilters({ minPrice: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Products Listing Grid/List Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort/Toggle Header */}
          <div className="glass rounded-xl p-4 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={queryFilter}
                onChange={(e) => updateFilters({ q: e.target.value })}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
              <select
                value={sortFilter}
                onChange={(e) => updateFilters({ sortBy: e.target.value })}
                className="bg-slate-900 border border-slate-800 text-slate-350 rounded-xl py-2 px-3.5 text-xs font-semibold focus:outline-none"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="price-low">Sort: Price Low → High</option>
                <option value="price-high">Sort: Price High → Low</option>
              </select>

              <div className="flex space-x-1 border border-slate-800 rounded-xl p-1 bg-slate-900/60 shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Items Rendering */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass border border-slate-800 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : productsList.length === 0 ? (
            <div className="text-center py-20 glass rounded-2xl border border-slate-850">
              <p className="text-slate-400 text-sm">No products found matching the criteria.</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6' : 'flex flex-col space-y-4'}>
              {productsList.map((prod) => {
                const isWished = isInWishlist(prod.id);
                const firstVariant = prod.productVariants?.[0];
                const isAdded = addedItem === firstVariant?.id;

                return (
                  <div
                    key={prod.id}
                    className={`glass border border-slate-800/70 rounded-2xl overflow-hidden hover-premium ${
                      viewMode === 'list' ? 'flex flex-col sm:flex-row items-center p-4 gap-6' : 'relative'
                    }`}
                  >
                    <div className={`relative bg-slate-900 overflow-hidden shrink-0 ${viewMode === 'list' ? 'w-full sm:w-36 h-36 rounded-xl' : 'aspect-square'}`}>
                      <img src={prod.productImages?.[0]?.url} alt={prod.name} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                      <button
                        onClick={() => toggleWishlist({
                          id: prod.id,
                          name: prod.name,
                          slug: prod.slug,
                          price: Number(prod.price),
                          image: prod.productImages?.[0]?.url || ''
                        })}
                        className={`absolute top-3 right-3 p-1.5 rounded-full border transition ${
                          isWished
                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                            : 'bg-slate-950/65 border-slate-800/80 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    <div className={`p-5 flex-1 flex flex-col justify-between ${viewMode === 'list' ? 'w-full text-left' : 'space-y-4'}`}>
                      <div className="space-y-1">
                        <span className="text-[10px] tracking-widest text-slate-500 font-bold uppercase block">{prod.brand?.name}</span>
                        <h4 className="font-semibold text-white hover:text-blue-400 transition text-base">
                          <Link href={`/products/${prod.slug}`}>{prod.name}</Link>
                        </h4>
                        {viewMode === 'list' && (
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1">{prod.description}</p>
                        )}
                        <div className="flex items-center space-x-1.5 pt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-900 pt-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-base font-bold text-white">
                            {formatPrice(prod.salePrice || prod.price)}
                          </span>
                          {prod.salePrice && (
                            <span className="text-xs text-slate-500 line-through">
                              {formatPrice(prod.price)}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleAddToCartClick(prod)}
                          disabled={firstVariant?.stock === 0}
                          className={`p-2 rounded-xl transition ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-950/10'
                          }`}
                        >
                          {isAdded ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <ShoppingCart className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductListPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">Loading catalogue...</div>}>
      <ProductListContent />
    </Suspense>
  );
}
