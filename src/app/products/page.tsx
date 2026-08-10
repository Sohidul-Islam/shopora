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
  CheckCircle2,
  SlidersHorizontal,
  X,
  Tag,
  Layers,
  Star,
} from 'lucide-react';

// ── helpers ───────────────────────────────────────────────────────────────────
function StarRating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${s <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
        />
      ))}
    </span>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────
function ProductListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);

  // Sidebar data (dynamic from DB)
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [brandsList, setBrandsList] = useState<any[]>([]);
  const [brandSearch, setBrandSearch] = useState('');
  const [catSearch, setCatSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── URL filter state ────────────────────────────────────────────────────────
  const categoryFilter = searchParams.get('category') || '';
  // Multi-brand: stored as repeated ?brand=x&brand=y
  const brandFilters: string[] = searchParams.getAll('brand');
  const sortFilter = searchParams.get('sortBy') || 'newest';
  const queryFilter = searchParams.get('q') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minRating = searchParams.get('minRating') || '';
  const pageFilter = Number(searchParams.get('page')) || 1;
  const limitFilter = Number(searchParams.get('limit')) || 12;

  // Accordion state
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    category: true,
    brand: true,
    price: true,
    rating: true,
  });
  const toggleAccordion = (key: string) =>
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── fetch sidebar data ──────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/products?categories=true')
      .then((r) => r.json())
      .then((d) => { if (d.success) setCategoriesList(d.categories); })
      .catch(() => {});
    fetch('/api/brands')
      .then((r) => r.json())
      .then((d) => { if (d.success) setBrandsList(d.brands); })
      .catch(() => {});
  }, []);

  // ── fetch products ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const offset = (pageFilter - 1) * limitFilter;
        const params = new URLSearchParams({
          category: categoryFilter,
          sortBy: sortFilter,
          q: queryFilter,
          minPrice,
          maxPrice,
          minRating,
          limit: String(limitFilter),
          offset: String(offset),
        });
        // Append each brand as a separate ?brand= param
        brandFilters.forEach((b) => params.append('brand', b));

        const response = await fetch(`/api/products?${params.toString()}`);
        const res = await response.json();
        if (res.success) {
          setProductsList(res.products);
          setTotalProducts(res.total || 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, brandFilters.join(','), sortFilter, queryFilter, minPrice, maxPrice, minRating, pageFilter, limitFilter]);

  // ── URL helpers ─────────────────────────────────────────────────────────────
  /** Generic single-value filter update */
  const updateFilters = (newFilters: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val === '') params.delete(key);
      else params.set(key, val);
    });
    if (!Object.prototype.hasOwnProperty.call(newFilters, 'page')) {
      params.delete('page');
    }
    if (Object.prototype.hasOwnProperty.call(newFilters, 'limit')) {
      params.delete('page');
    }
    router.push(`/products?${params.toString()}`);
  };

  /** Toggle a brand slug in the multi-select list */
  const toggleBrand = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('brand');           // remove all existing brand params
    params.delete('page');
    const next = brandFilters.includes(slug)
      ? brandFilters.filter((b) => b !== slug)
      : [...brandFilters, slug];
    next.forEach((b) => params.append('brand', b));
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => router.push('/products');

  // ── derived ─────────────────────────────────────────────────────────────────
  const activeFilterCount = [
    categoryFilter,
    ...brandFilters,
    minPrice,
    maxPrice,
    minRating,
  ].filter(Boolean).length;

  const filteredBrands = brandsList.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase())
  );
  const filteredCats = categoriesList.filter(
    (c) => !c.parentId && c.name.toLowerCase().includes(catSearch.toLowerCase())
  );

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

  // ── sidebar JSX ─────────────────────────────────────────────────────────────
  const SidebarContent = () => (
    <div className="space-y-1">
      {/* Active Filters pill row */}
      {activeFilterCount > 0 && (
        <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/25 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-700 dark:text-purple-400">
              Active ({activeFilterCount})
            </span>
            <button onClick={clearAllFilters} className="text-[10px] text-purple-600 dark:text-purple-400 hover:underline font-semibold">
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categoryFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-500/20 rounded-lg text-[10px] font-bold text-purple-700 dark:text-purple-300">
                <Layers className="w-2.5 h-2.5" />
                <span className="capitalize">{categoryFilter.replace(/-/g, ' ')}</span>
                <button onClick={() => updateFilters({ category: '' })}><X className="w-2.5 h-2.5" /></button>
              </span>
            )}
            {brandFilters.map((b) => (
              <span key={b} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-500/20 rounded-lg text-[10px] font-bold text-purple-700 dark:text-purple-300">
                <Tag className="w-2.5 h-2.5" />
                <span className="capitalize">{b.replace(/-/g, ' ')}</span>
                <button onClick={() => toggleBrand(b)}><X className="w-2.5 h-2.5" /></button>
              </span>
            ))}
            {minRating && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-500/20 rounded-lg text-[10px] font-bold text-purple-700 dark:text-purple-300">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                <span>{minRating}+ Stars</span>
                <button onClick={() => updateFilters({ minRating: '' })}><X className="w-2.5 h-2.5" /></button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-500/20 rounded-lg text-[10px] font-bold text-purple-700 dark:text-purple-300">
                <span>${minPrice || '0'} – ${maxPrice || '∞'}</span>
                <button onClick={() => updateFilters({ minPrice: '', maxPrice: '' })}><X className="w-2.5 h-2.5" /></button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── CATEGORY ── */}
      <div className="border-b border-black/5 dark:border-white/5 pb-4">
        <button
          onClick={() => toggleAccordion('category')}
          className="w-full flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider py-2"
        >
          <span>Category</span>
          {openAccordions.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {openAccordions.category && (
          <div className="mt-3 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={catSearch}
                onChange={(e) => setCatSearch(e.target.value)}
                placeholder="Search category"
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            {/* All categories option */}
            <label className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer py-0.5">
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="category"
                  checked={!categoryFilter}
                  onChange={() => updateFilters({ category: '' })}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
                <span className="text-slate-800 dark:text-white font-bold">All Categories</span>
              </div>
              <span className="text-slate-400 text-[10px]">{totalProducts}</span>
            </label>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {filteredCats.length === 0 && (
                <p className="text-xs text-slate-400 py-2">No categories found</p>
              )}
              {filteredCats.map((cat) => (
                <label key={cat.id} className="flex items-center text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer py-0.5 group">
                  <div className="flex items-center gap-2.5 flex-1">
                    <input
                      type="radio"
                      name="category"
                      checked={categoryFilter === cat.slug}
                      onChange={() => updateFilters({ category: categoryFilter === cat.slug ? '' : cat.slug })}
                      className="w-4 h-4 accent-purple-600 cursor-pointer"
                    />
                    <div className="flex items-center gap-1.5">
                      {cat.iconUrl && (
                        <img src={cat.iconUrl} alt={cat.name} className="w-4 h-4 rounded object-cover opacity-70 group-hover:opacity-100 transition" />
                      )}
                      <span className="group-hover:text-slate-900 dark:group-hover:text-white transition">{cat.name}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── BRAND (multi-select checkboxes) ── */}
      <div className="border-b border-black/5 dark:border-white/5 pb-4">
        <button
          onClick={() => toggleAccordion('brand')}
          className="w-full flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider py-2"
        >
          <div className="flex items-center gap-2">
            <span>Brand</span>
            {brandFilters.length > 0 && (
              <span className="px-1.5 py-0.5 bg-purple-600 text-white rounded-full text-[9px] font-extrabold">{brandFilters.length}</span>
            )}
          </div>
          {openAccordions.brand ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {openAccordions.brand && (
          <div className="mt-3 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Search brand"
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {filteredBrands.length === 0 && (
                <p className="text-xs text-slate-400 py-2">No brands found</p>
              )}
              {filteredBrands.map((br) => (
                <label key={br.id} className="flex items-center text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer py-0.5 group">
                  <div className="flex items-center gap-2.5 flex-1">
                    <input
                      type="checkbox"
                      checked={brandFilters.includes(br.slug)}
                      onChange={() => toggleBrand(br.slug)}
                      className="w-4 h-4 rounded accent-purple-600 cursor-pointer"
                    />
                    <div className="flex items-center gap-1.5">
                      {br.logoUrl && (
                        <img src={br.logoUrl} alt={br.name} className="w-4 h-4 rounded object-cover opacity-70 group-hover:opacity-100 transition" />
                      )}
                      <span className="group-hover:text-slate-900 dark:group-hover:text-white transition">{br.name}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {brandFilters.length > 0 && (
              <button
                onClick={() => {
                  const p = new URLSearchParams(searchParams.toString());
                  p.delete('brand');
                  p.delete('page');
                  router.push(`/products?${p.toString()}`);
                }}
                className="text-[10px] text-rose-500 font-semibold hover:underline mt-1"
              >
                Clear brand filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── RATING ── */}
      <div className="border-b border-black/5 dark:border-white/5 pb-4">
        <button
          onClick={() => toggleAccordion('rating')}
          className="w-full flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider py-2"
        >
          <span>Rating</span>
          {openAccordions.rating ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {openAccordions.rating && (
          <div className="mt-3 space-y-2">
            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer py-0.5">
              <input type="radio" name="rating" checked={!minRating} onChange={() => updateFilters({ minRating: '' })} className="w-4 h-4 accent-purple-600 cursor-pointer" />
              <span className="dark:text-white text-slate-800 font-bold">All Ratings</span>
            </label>
            {[4, 3, 2, 1].map((r) => (
              <label key={r} className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer py-0.5 group">
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === String(r)}
                  onChange={() => updateFilters({ minRating: String(r) })}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
                <div className="flex items-center gap-1.5">
                  <StarRating value={r} />
                  <span className="group-hover:text-slate-900 dark:group-hover:text-white transition">&amp; up</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* ── PRICE RANGE ── */}
      <div className="border-b border-black/5 dark:border-white/5 pb-4">
        <button
          onClick={() => toggleAccordion('price')}
          className="w-full flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider py-2"
        >
          <span>Price Range</span>
          {openAccordions.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {openAccordions.price && (
          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Min $</label>
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) => updateFilters({ minPrice: e.target.value })}
                  placeholder="0"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <span className="text-slate-400 mt-5 text-xs">—</span>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Max $</label>
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                  placeholder="999"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
            {(minPrice || maxPrice) && (
              <button
                onClick={() => updateFilters({ minPrice: '', maxPrice: '' })}
                className="text-[10px] text-rose-500 font-semibold hover:underline"
              >
                Clear price filter
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // ── page ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#05060b] text-slate-800 dark:text-slate-100 font-sans py-8 px-6 sm:px-12 lg:px-24 transition-colors duration-300">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
        <Link href="/" className="hover:text-purple-650 dark:hover:text-white transition">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/products" className="hover:text-purple-650 dark:hover:text-white transition">Catalog</Link>
        {categoryFilter && (
          <>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-800 dark:text-white capitalize font-medium">{categoryFilter.replace(/-/g, ' ')}</span>
          </>
        )}
      </div>

      {/* Mobile filter button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-xs font-bold text-slate-800 dark:text-white shadow-sm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-purple-600 text-white rounded-full text-[10px] flex items-center justify-center font-extrabold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative ml-auto w-80 h-full bg-white dark:bg-[#0c0d15] p-6 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-slate-900 dark:text-white text-lg">Filters</h2>
              <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-purple-500" />
                <span>Filters</span>
              </h2>
              {activeFilterCount > 0 && (
                <button onClick={clearAllFilters} className="text-[10px] text-rose-500 dark:text-rose-400 hover:underline font-bold">
                  Clear All
                </button>
              )}
            </div>
            <SidebarContent />
          </div>
        </div>

        {/* Products Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-4">
            <div className="text-slate-400 text-sm font-semibold">
              {loading ? (
                <span>Loading…</span>
              ) : (
                <>
                  Showing <span className="text-slate-900 dark:text-white font-extrabold">{productsList.length}</span>
                  {' '}of{' '}
                  <span className="text-slate-900 dark:text-white font-extrabold">{totalProducts}</span> products
                </>
              )}
            </div>
            <select
              value={sortFilter}
              onChange={(e) => updateFilters({ sortBy: e.target.value })}
              className="bg-white dark:bg-[#0c0d15] border border-black/5 dark:border-white/10 text-slate-700 dark:text-slate-350 rounded-xl py-2 px-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
            </select>
          </div>

          {/* Active filter chips (desktop inline) */}
          {activeFilterCount > 0 && (
            <div className="hidden lg:flex flex-wrap gap-2">
              {categoryFilter && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/25 rounded-full text-xs font-bold text-purple-700 dark:text-purple-300">
                  <Layers className="w-3 h-3" />
                  <span className="capitalize">{categoryFilter.replace(/-/g, ' ')}</span>
                  <button onClick={() => updateFilters({ category: '' })} className="hover:text-rose-500 transition"><X className="w-3 h-3" /></button>
                </span>
              )}
              {brandFilters.map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/25 rounded-full text-xs font-bold text-purple-700 dark:text-purple-300">
                  <Tag className="w-3 h-3" />
                  <span className="capitalize">{b.replace(/-/g, ' ')}</span>
                  <button onClick={() => toggleBrand(b)} className="hover:text-rose-500 transition"><X className="w-3 h-3" /></button>
                </span>
              ))}
              {minRating && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/25 rounded-full text-xs font-bold text-purple-700 dark:text-purple-300">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{minRating}+ Stars</span>
                  <button onClick={() => updateFilters({ minRating: '' })} className="hover:text-rose-500 transition"><X className="w-3 h-3" /></button>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/25 rounded-full text-xs font-bold text-purple-700 dark:text-purple-300">
                  <span>${minPrice || '0'} – ${maxPrice || '∞'}</span>
                  <button onClick={() => updateFilters({ minPrice: '', maxPrice: '' })} className="hover:text-rose-500 transition"><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}

          {/* Products grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(Math.min(limitFilter, 12))].map((_, i) => (
                <div key={i} className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl h-[360px] animate-pulse" />
              ))}
            </div>
          ) : productsList.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">No products found matching the criteria.</p>
              {activeFilterCount > 0 && (
                <button onClick={clearAllFilters} className="text-xs text-purple-650 dark:text-purple-400 font-bold hover:underline">
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {productsList.map((prod) => {
                const isWished = isInWishlist(prod.id);
                const firstVariant = prod.productVariants?.[0];
                const isAdded = addedItem === firstVariant?.id;
                const rating = Number(prod.averageRating || 0);

                return (
                  <div
                    key={prod.id}
                    className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/15 rounded-3xl p-5 flex flex-col justify-between h-[410px] relative group hover:shadow-2xl hover:shadow-purple-650/5 transition-all duration-500"
                  >
                    <button
                      onClick={() => toggleWishlist({
                        id: prod.id,
                        name: prod.name,
                        price: Number(prod.salePrice ?? prod.price),
                        image: prod.productImages?.[0]?.url || '',
                        slug: prod.slug,
                      })}
                      className={`absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                        isWished
                          ? 'bg-rose-500 scale-110'
                          : 'bg-white dark:bg-[#0c0d15] border border-black/5 dark:border-white/5 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWished ? 'fill-white text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                    </button>

                    <div className="flex-1 flex flex-col items-center justify-center p-2">
                      <img
                        src={prod.productImages?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200'}
                        alt={prod.name}
                        className="max-h-[140px] object-contain group-hover:scale-105 transition duration-350 drop-shadow-[0_10px_20px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
                      />
                    </div>

                    <div className="mt-3 space-y-2 text-center">
                      {/* Rating stars */}
                      {rating > 0 && (
                        <div className="flex items-center justify-center gap-1">
                          <StarRating value={Math.round(rating)} />
                          <span className="text-[10px] text-slate-400">({rating.toFixed(1)})</span>
                        </div>
                      )}

                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-2 hover:text-purple-650 dark:hover:text-white transition">
                        <Link href={`/products/${prod.slug}`}>{prod.name}</Link>
                      </h4>

                      <div className="flex items-center justify-center gap-2">
                        <p className="font-bold text-base text-slate-905 dark:text-white">
                          {formatPrice(prod.salePrice || prod.price)}
                        </p>
                        {prod.salePrice && (
                          <p className="text-xs text-slate-400 line-through">{formatPrice(prod.price)}</p>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCartClick(prod)}
                        disabled={firstVariant?.stock === 0}
                        className={`w-full py-3.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          isAdded
                            ? 'bg-emerald-650 dark:bg-emerald-600 text-white'
                            : firstVariant?.stock === 0
                            ? 'bg-slate-200 dark:bg-white/10 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 shadow-md'
                        }`}
                      >
                        {isAdded ? (
                          <><CheckCircle2 className="w-3.5 h-3.5" /><span>Added to Cart</span></>
                        ) : firstVariant?.stock === 0 ? (
                          <span>Out of Stock</span>
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

          {/* Smart Pagination */}
          {(() => {
            const totalPages = Math.ceil(totalProducts / limitFilter) || 1;

            const getPageNumbers = () => {
              const pages: (number | string)[] = [];
              const delta = 1;
              for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= pageFilter - delta && i <= pageFilter + delta)) {
                  pages.push(i);
                } else if (pages[pages.length - 1] !== '...') {
                  pages.push('...');
                }
              }
              return pages;
            };

            if (totalPages <= 1 && totalProducts <= limitFilter) return null;

            return (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 border-t border-black/5 dark:border-white/5 mt-8">
                {/* Page size selector */}
                <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                  <span>Show</span>
                  <select
                    value={limitFilter}
                    onChange={(e) => updateFilters({ limit: e.target.value })}
                    className="bg-white dark:bg-[#0c0d15] border border-black/10 dark:border-slate-800/80 rounded-xl px-3 py-1.5 font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 transition cursor-pointer"
                  >
                    <option value="12">12 products</option>
                    <option value="24">24 products</option>
                    <option value="48">48 products</option>
                    <option value="96">96 products</option>
                  </select>
                  <span>of {totalProducts} items</span>
                </div>

                {/* Page number controls */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => pageFilter > 1 && updateFilters({ page: String(pageFilter - 1) })}
                      disabled={pageFilter === 1}
                      className="p-2 border border-black/10 dark:border-slate-800 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-xs font-bold text-slate-600 dark:text-slate-350 disabled:opacity-30 disabled:pointer-events-none transition min-w-[36px] min-h-[36px] flex items-center justify-center"
                    >
                      &lt;
                    </button>
                    {getPageNumbers().map((pNum, idx) => {
                      if (pNum === '...') {
                        return <span key={`e-${idx}`} className="text-slate-400 text-xs px-1.5">...</span>;
                      }
                      const isCurrent = pNum === pageFilter;
                      return (
                        <button
                          key={`p-${pNum}`}
                          onClick={() => updateFilters({ page: String(pNum) })}
                          className={`min-w-[36px] min-h-[36px] px-2 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                            isCurrent
                              ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-md'
                              : 'border border-black/10 dark:border-slate-800 hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-350'
                          }`}
                        >
                          {pNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => pageFilter < totalPages && updateFilters({ page: String(pageFilter + 1) })}
                      disabled={pageFilter === totalPages}
                      className="p-2 border border-black/10 dark:border-slate-800 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-xs font-bold text-slate-600 dark:text-slate-350 disabled:opacity-30 disabled:pointer-events-none transition min-w-[36px] min-h-[36px] flex items-center justify-center"
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

export default function ProductListPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#05060b] text-slate-900 dark:text-white flex items-center justify-center">
        Loading catalogue…
      </div>
    }>
      <ProductListContent />
    </Suspense>
  );
}
