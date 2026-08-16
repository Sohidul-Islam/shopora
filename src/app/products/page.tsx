'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
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
  ShoppingBag,
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

  // Category expansion state for accordion tree
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});
  const toggleCatExpand = (catId: string) => {
    setExpandedCats((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  // Build hierarchical category tree: parent categories with nested subcategories
  const categoryTree = useMemo(() => {
    const parentMap = new Map<string, any>();
    const childrenMap = new Map<string, any[]>();
    const orphanChildren: any[] = [];

    categoriesList.forEach((c) => {
      if (!c.parentId) {
        parentMap.set(c.id, { ...c, subCategories: [] });
      } else {
        const list = childrenMap.get(c.parentId) || [];
        list.push(c);
        childrenMap.set(c.parentId, list);
      }
    });

    parentMap.forEach((parent, parentId) => {
      if (childrenMap.has(parentId)) {
        parent.subCategories = childrenMap.get(parentId)!;
      }
    });

    categoriesList.forEach((c) => {
      if (c.parentId && !parentMap.has(c.parentId)) {
        orphanChildren.push(c);
      }
    });

    const roots = Array.from(parentMap.values());
    if (orphanChildren.length > 0) {
      roots.push(...orphanChildren.map((orphan) => ({ ...orphan, subCategories: [] })));
    }

    return roots;
  }, [categoriesList]);

  // Smooth Category & Sub-category Search filtering
  const filteredCategoryTree = useMemo(() => {
    const query = catSearch.trim().toLowerCase();
    if (!query) return categoryTree;

    return categoryTree
      .map((parent) => {
        const parentMatch = parent.name.toLowerCase().includes(query) || parent.slug.toLowerCase().includes(query);
        const matchingSubs = (parent.subCategories || []).filter((sub: any) =>
          sub.name.toLowerCase().includes(query) || sub.slug.toLowerCase().includes(query)
        );

        if (parentMatch || matchingSubs.length > 0) {
          return {
            ...parent,
            subCategories: parentMatch ? parent.subCategories : matchingSubs,
            isSearching: true,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [categoryTree, catSearch]);

  // Smooth Brand Search filtering
  const filteredBrands = useMemo(() => {
    const query = brandSearch.trim().toLowerCase();
    if (!query) return brandsList;
    return brandsList.filter(
      (b) => b.name.toLowerCase().includes(query) || b.slug.toLowerCase().includes(query)
    );
  }, [brandsList, brandSearch]);

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
          <div className="flex items-center gap-2">
            <span>Category</span>
            {categoryFilter && (
              <span className="px-1.5 py-0.5 bg-purple-600 text-white rounded-full text-[9px] font-extrabold">1</span>
            )}
          </div>
          {openAccordions.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openAccordions.category && (
          <div className="mt-3 space-y-2">
            {/* Search Input with smooth clear button */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={catSearch}
                onChange={(e) => setCatSearch(e.target.value)}
                placeholder="Search category or subcategory..."
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
              />
              {catSearch && (
                <button
                  onClick={() => setCatSearch('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* All categories option */}
            <label className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer py-1 px-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition">
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
              <span className="text-slate-400 text-[10px] bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded-full">{totalProducts}</span>
            </label>

            {/* Category & Subcategory Tree */}
            <div className="space-y-1 max-h-64 overflow-y-auto pr-1 text-xs">
              {filteredCategoryTree.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">No categories found matching "{catSearch}"</p>
              ) : (
                filteredCategoryTree.map((cat: any) => {
                  const isParentSelected = categoryFilter === cat.slug;
                  const hasSubs = cat.subCategories && cat.subCategories.length > 0;
                  const isExpanded = cat.isSearching || expandedCats[cat.id] || cat.subCategories?.some((s: any) => s.slug === categoryFilter);

                  return (
                    <div key={cat.id} className="space-y-1">
                      {/* Parent Category Row */}
                      <div className="flex items-center justify-between py-1 px-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition group">
                        <label className="flex items-center gap-2 flex-1 cursor-pointer min-w-0">
                          <input
                            type="radio"
                            name="category"
                            checked={isParentSelected}
                            onChange={() => updateFilters({ category: isParentSelected ? '' : cat.slug })}
                            className="w-4 h-4 accent-purple-600 cursor-pointer flex-shrink-0"
                          />
                          <div className="flex items-center gap-1.5 min-w-0">
                            {cat.iconUrl && (
                              <img src={cat.iconUrl} alt={cat.name} className="w-4 h-4 rounded object-cover opacity-70 group-hover:opacity-100 flex-shrink-0" />
                            )}
                            <span className={`truncate font-semibold ${isParentSelected ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                              {cat.name}
                            </span>
                          </div>
                        </label>

                        {/* Expand / Collapse Subcategories Toggle Button */}
                        {hasSubs && (
                          <button
                            onClick={() => toggleCatExpand(cat.id)}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition"
                            title={isExpanded ? 'Collapse subcategories' : 'Expand subcategories'}
                          >
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-purple-600' : ''}`} />
                          </button>
                        )}
                      </div>

                      {/* Subcategories Nested Container */}
                      {hasSubs && isExpanded && (
                        <div className="ml-4 pl-2.5 border-l-2 border-slate-200 dark:border-slate-800/80 space-y-1 py-0.5">
                          {cat.subCategories.map((sub: any) => {
                            const isSubSelected = categoryFilter === sub.slug;
                            return (
                              <label key={sub.id} className="flex items-center justify-between py-1 px-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer group">
                                <div className="flex items-center gap-2 min-w-0">
                                  <input
                                    type="radio"
                                    name="category"
                                    checked={isSubSelected}
                                    onChange={() => updateFilters({ category: isSubSelected ? '' : sub.slug })}
                                    className="w-3.5 h-3.5 accent-purple-600 cursor-pointer flex-shrink-0"
                                  />
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    {sub.iconUrl && (
                                      <img src={sub.iconUrl} alt={sub.name} className="w-3.5 h-3.5 rounded object-cover opacity-70 group-hover:opacity-100 flex-shrink-0" />
                                    )}
                                    <span className={`truncate text-xs ${isSubSelected ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                                      {sub.name}
                                    </span>
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
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
            {/* Search Brand Input with clear button */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Search brand..."
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
              />
              {brandSearch && (
                <button
                  onClick={() => setBrandSearch('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Brands list */}
            <div className="space-y-1 max-h-60 overflow-y-auto pr-1 text-xs">
              {filteredBrands.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">No brands found matching "{brandSearch}"</p>
              ) : (
                filteredBrands.map((br) => {
                  const isChecked = brandFilters.includes(br.slug);
                  return (
                    <label key={br.id} className="flex items-center justify-between text-xs font-semibold py-1 px-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer group">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleBrand(br.slug)}
                          className="w-4 h-4 rounded accent-purple-600 cursor-pointer flex-shrink-0"
                        />
                        <div className="flex items-center gap-1.5 min-w-0">
                          {br.logoUrl && (
                            <img src={br.logoUrl} alt={br.name} className="w-4 h-4 rounded object-cover opacity-70 group-hover:opacity-100 flex-shrink-0" />
                          )}
                          <span className={`truncate ${isChecked ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                            {br.name}
                          </span>
                        </div>
                      </div>
                    </label>
                  );
                })
              )}
            </div>

            {brandFilters.length > 0 && (
              <button
                onClick={() => {
                  const p = new URLSearchParams(searchParams.toString());
                  p.delete('brand');
                  p.delete('page');
                  router.push(`/products?${p.toString()}`);
                }}
                className="text-[10px] text-rose-500 font-bold hover:underline mt-1 block"
              >
                Clear all brand filters ({brandFilters.length})
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
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#05060b] text-slate-800 dark:text-slate-100 font-sans py-6 sm:py-8 px-4 sm:px-8 lg:px-10 xl:px-12 2xl:px-16 max-w-[1720px] mx-auto transition-colors duration-300">
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

      <div className="flex flex-col lg:flex-row gap-8 xl:gap-10">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 xl:w-72 shrink-0">
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
        <div className="flex-1 min-w-0 space-y-6">
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
              className="bg-white dark:bg-[#0c0d15] border border-black/5 dark:border-white/10 text-slate-700 dark:text-slate-350 rounded-xl py-2 px-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer shadow-sm"
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

          {/* Products grid - 4 Column Layout on large devices */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {[...Array(Math.min(limitFilter, 12))].map((_, i) => (
                <div key={i} className="bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-3xl p-3.5 h-[340px] flex flex-col justify-between animate-pulse">
                  <div className="w-full aspect-square rounded-2xl bg-black/5 dark:bg-white/5" />
                  <div className="space-y-2 mt-3">
                    <div className="h-3 w-16 bg-black/5 dark:bg-white/5 rounded-full" />
                    <div className="h-4 w-3/4 bg-black/5 dark:bg-white/5 rounded-lg" />
                    <div className="h-4 w-1/3 bg-black/5 dark:bg-white/5 rounded-lg" />
                    <div className="h-9 w-full bg-black/5 dark:bg-white/5 rounded-xl mt-2" />
                  </div>
                </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {productsList.map((prod) => {
                const isWished = isInWishlist(prod.id);
                const firstVariant = prod.productVariants?.[0];
                const isAdded = addedItem === firstVariant?.id;
                const rating = Number(prod.averageRating || 0);
                const discountPct = prod.salePrice && Number(prod.price) > Number(prod.salePrice)
                  ? Math.round(((Number(prod.price) - Number(prod.salePrice)) / Number(prod.price)) * 100)
                  : null;
                const brandName = prod.brand?.name || (typeof prod.brand === 'string' ? prod.brand : null);
                const categoryName = prod.productCategories?.[0]?.category?.name || (typeof prod.category === 'string' ? prod.category : null);
                const primaryImg = prod.productImages?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400';
                const hasStock = firstVariant ? firstVariant.stock > 0 : true;

                return (
                  <div
                    key={prod.id}
                    className="group relative bg-white dark:bg-[#0c0d15] border border-slate-200/80 dark:border-white/[0.08] hover:border-purple-500/40 dark:hover:border-purple-500/40 rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 flex flex-col justify-between hover:shadow-[0_16px_35px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_16px_35px_rgba(0,0,0,0.45)] hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Top Fitted Image Section */}
                    <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-b from-slate-100/70 via-slate-50/50 to-transparent dark:from-white/[0.05] dark:via-white/[0.02] dark:to-transparent border border-black/[0.03] dark:border-white/[0.04] flex items-center justify-center p-3 sm:p-4 mb-3 group/img">
                      {/* Discount Badge / Top Rated Pill */}
                      {discountPct ? (
                        <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">
                          -{discountPct}%
                        </span>
                      ) : rating >= 4.5 ? (
                        <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm flex items-center gap-0.5">
                          ★ Top
                        </span>
                      ) : null}

                      {/* Wishlist Floating Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist({
                            id: prod.id,
                            name: prod.name,
                            price: Number(prod.salePrice ?? prod.price),
                            image: primaryImg,
                            slug: prod.slug,
                          });
                        }}
                        aria-label="Add to wishlist"
                        className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-sm border ${
                          isWished
                            ? 'bg-rose-500 border-rose-500 text-white scale-105 shadow-rose-500/25'
                            : 'bg-white/90 dark:bg-slate-900/90 border-slate-200/70 dark:border-white/10 text-slate-400 dark:text-slate-400 hover:text-rose-500 hover:border-rose-300 dark:hover:border-rose-500/40 hover:scale-110'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWished ? 'fill-white text-white' : ''}`} />
                      </button>

                      {/* Product Image with Fallback and smooth scale */}
                      <Link href={`/products/${prod.slug}`} className="w-full h-full flex items-center justify-center">
                        <img
                          src={primaryImg}
                          alt={prod.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400';
                          }}
                          className="max-h-full max-w-full object-contain group-hover/img:scale-108 transition-transform duration-500 ease-out drop-shadow-[0_8px_16px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
                        />
                      </Link>
                    </div>

                    {/* Card Content Section */}
                    <div className="flex-1 flex flex-col justify-between space-y-2.5">
                      <div className="space-y-1.5">
                        {/* Brand / Category Micro-Header & Rating */}
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                          <span className="truncate max-w-[120px] uppercase tracking-wider text-[10px] font-bold text-purple-600 dark:text-purple-400">
                            {brandName || categoryName || 'Product'}
                          </span>
                          {rating > 0 && (
                            <div className="flex items-center gap-1 shrink-0">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                          <Link href={`/products/${prod.slug}`}>{prod.name}</Link>
                        </h4>
                      </div>

                      {/* Pricing & CTA */}
                      <div className="space-y-2.5 pt-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-black text-slate-900 dark:text-white">
                            {formatPrice(prod.salePrice || prod.price)}
                          </span>
                          {prod.salePrice && (
                            <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-semibold">
                              {formatPrice(prod.price)}
                            </span>
                          )}
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => handleAddToCartClick(prod)}
                          disabled={!hasStock}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : !hasStock
                              ? 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-white/5'
                              : 'bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-purple-600 dark:hover:bg-slate-200 hover:shadow-md'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Added to Cart</span>
                            </>
                          ) : !hasStock ? (
                            <span>Out of Stock</span>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5 opacity-80" />
                              <span>Buy Now</span>
                            </>
                          )}
                        </button>
                      </div>
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
