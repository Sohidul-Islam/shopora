'use client';

import { useEffect, useState } from 'react';
import { formatPrice } from '../lib/utils';
import { useStore, CartItem } from '../store/useStore';
import Link from 'next/link';
import { ArrowRight, ShoppingCart, Star, Heart, CheckCircle2, ChevronRight, Mail, Sparkles, ShieldCheck } from 'lucide-react';

export default function Home() {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const response = await fetch('/api/products?limit=8');
        const res = await response.json();
        if (res.success) {
          setFeaturedProducts(res.products);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const handleAddToCart = (prod: any) => {
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      


      {/* Main Home Sections */}
      <main className="flex-1 pb-16 space-y-20">
        {/* Hero Section */}
        <section className="relative h-[65vh] flex items-center justify-center overflow-hidden border-b border-slate-900 bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,102,255,0.18),rgba(255,255,255,0))]" />
          <div className="relative max-w-4xl mx-auto text-center px-4 space-y-6">
            <span className="inline-flex items-center space-x-2 py-1 px-3 bg-blue-500/10 border border-blue-500/25 rounded-full text-blue-400 text-xs font-semibold tracking-wider uppercase">
              <span>SaaS-Grade Full-Stack E-commerce</span>
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-white leading-tight">
              Design Minimal. <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Perform Enterprise.</span>
            </h1>
            <p className="max-w-xl mx-auto text-slate-400 text-sm sm:text-base leading-relaxed">
              Experience the power of Next.js App Router, MySQL via Drizzle ORM, and customizable payment gateway adapters in a single optimized container.
            </p>
            <div className="pt-4 flex justify-center space-x-4">
              <Link href="/products" className="py-3.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition flex items-center space-x-2 shadow-lg shadow-blue-950/20 text-sm">
                <span>Explore Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Showcase */}
        <section className="max-w-6xl mx-auto px-6 space-y-6">
          <h2 className="text-2xl font-bold font-display text-white tracking-tight">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300' },
              { name: 'Footwear', slug: 'footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300' },
              { name: 'Apparel', slug: 'apparel', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300' },
              { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300' },
            ].map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group relative h-40 rounded-2xl overflow-hidden border border-slate-900 flex items-end p-4 transition-all duration-300 hover:border-slate-800"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <span className="relative z-20 font-bold text-white text-base font-display flex items-center group-hover:text-blue-400 transition">
                  <span>{cat.name}</span>
                  <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products Grid */}
        <section className="max-w-6xl mx-auto px-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-display text-white tracking-tight">Best Sellers</h2>
            <Link href="/products" className="text-xs uppercase tracking-widest font-bold text-blue-400 hover:text-blue-300 transition flex items-center space-x-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass border border-slate-900 rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((prod) => {
                const isWished = isInWishlist(prod.id);
                const variant = prod.productVariants?.[0];
                const isAdded = addedItem === variant?.id;

                return (
                  <div key={prod.id} className="glass border border-slate-900 hover-premium rounded-2xl overflow-hidden flex flex-col justify-between h-fit group">
                    <div className="relative bg-slate-900 overflow-hidden aspect-square">
                      <img src={prod.productImages?.[0]?.url} alt={prod.name} className="w-full h-full object-cover group-hover:scale-102 transition duration-500" />
                      <button
                        onClick={() => toggleWishlist({
                          id: prod.id,
                          name: prod.name,
                          slug: prod.slug,
                          price: Number(prod.price),
                          image: prod.productImages?.[0]?.url || ''
                        })}
                        className={`absolute top-2.5 right-2.5 p-1.5 rounded-full border transition ${
                          isWished ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-slate-950/65 border-slate-800/80 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>

                    <div className="p-4 space-y-3.5">
                      <div className="space-y-0.5">
                        <span className="text-[9px] tracking-widest text-slate-500 font-bold uppercase block">{prod.brand?.name}</span>
                        <h4 className="font-semibold text-white truncate text-sm hover:text-blue-400 transition">
                          <Link href={`/products/${prod.slug}`}>{prod.name}</Link>
                        </h4>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-900 pt-3">
                        <div className="flex items-baseline space-x-1.5">
                          <span className="text-sm font-bold text-white">
                            {formatPrice(prod.salePrice || prod.price)}
                          </span>
                          {prod.salePrice && (
                            <span className="text-[10px] text-slate-500 line-through">
                              {formatPrice(prod.price)}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleAddToCart(prod)}
                          className={`p-1.5 rounded-lg border transition ${
                            isAdded
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-slate-900 border-slate-850 hover:border-slate-750 text-slate-450 hover:text-white'
                          }`}
                        >
                          {isAdded ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Newsletter Section */}
        <section className="max-w-4xl mx-auto px-6">
          <div className="glass rounded-3xl p-8 sm:p-12 border border-slate-850 text-center space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,102,255,0.06),transparent)]" />
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mx-auto border border-blue-500/20">
              <Mail className="w-6 h-6" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl sm:text-2xl font-bold font-display text-white">Join the Newsletter</h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Receive curated updates on product releases, developer tools, and exclusive discounts.
              </p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                required
                className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-semibold"
              />
              <button
                type="submit"
                className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-blue-950/20"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500 space-y-3 bg-slate-950">
        <div className="flex items-center justify-center space-x-2.5 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span>SaaS Shopora Security Protocol Active</span>
        </div>
        <p>© 2026 Shopora Enterprise E-Commerce. All rights reserved.</p>
      </footer>

    </div>
  );
}
