'use client';

import { useEffect, useState } from 'react';
import { formatPrice } from '../lib/utils';
import { useStore, CartItem } from '../store/useStore';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Countdown from '../components/Countdown';
import { 
  ArrowRight, 
  ShoppingCart, 
  Heart, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Smartphone, 
  Watch, 
  Camera, 
  Headphones, 
  Monitor, 
  Gamepad2,
  Sparkles,
  Zap,
  ShieldCheck,
  TrendingUp,
  Truck
} from 'lucide-react';

export default function Home() {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [banner, setBanner] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'new' | 'bestseller' | 'featured'>('new');

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/api/products?limit=12');
        const res = await response.json();
        if (res.success) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    async function loadBanner() {
      try {
        const response = await fetch('/api/products?banners=true');
        const res = await response.json();
        if (res.success && res.banners && res.banners.length > 0) {
          setBanner(res.banners[0]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    async function loadCategories() {
      try {
        const response = await fetch('/api/products?categories=true');
        const res = await response.json();
        if (res.success) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadProducts();
    loadBanner();
    loadCategories();
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

  // Get dynamic tab products
  const getTabProducts = () => {
    if (activeTab === 'new') return products.slice(0, 8);
    if (activeTab === 'bestseller') return [...products].reverse().slice(0, 8);
    return products.filter(p => p.salePrice !== null).slice(0, 8);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#05060b] text-slate-800 dark:text-slate-100 flex flex-col justify-between font-sans selection:bg-purple-650 dark:selection:bg-purple-600 selection:text-white transition-colors duration-300">
      <main className="flex-1 pb-16">
        
        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-b from-purple-50/50 via-[#fafafa] to-[#fafafa] dark:from-[#0a0c16] dark:via-[#05060b] dark:to-[#05060b] overflow-hidden py-20 px-6 sm:px-12 lg:px-24 flex flex-col lg:flex-row items-center justify-between min-h-[780px] border-b border-black/5 dark:border-white/5 transition-colors duration-300">
          {/* Decorative Glowing Orbs */}
          <div className="absolute top-20 left-10 w-[350px] h-[350px] bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-8 lg:pr-8">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-3 py-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full text-xs font-semibold tracking-wider text-purple-750 dark:text-purple-300 backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-pulse" />
              <span>Premium Tech Redefined</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-8xl font-black tracking-tight leading-[0.9] uppercase font-display text-slate-900 dark:text-white"
            >
              {banner ? banner.title.split(' ')[0] : 'INTRODUCING'}{' '}
              <span className="bg-gradient-to-r from-purple-650 via-pink-600 to-blue-500 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent block mt-2">
                {banner ? banner.title.split(' ').slice(1).join(' ') : 'IPHONE 15 PRO'}
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-slate-600 dark:text-slate-400 text-sm sm:text-xl max-w-lg font-medium leading-relaxed"
            >
              {banner ? banner.subtitle : 'Titanium design, ultimate A17 Pro chip. The new era of mobile power and elegancy.'}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <Link 
                href={banner ? banner.linkUrl || '/products' : '/products'} 
                className="group inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 px-10 rounded-2xl transition duration-300 shadow-xl shadow-purple-600/25 text-sm uppercase tracking-wider"
              >
                <span>Shop Now</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/products" 
                className="inline-flex items-center justify-center space-x-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-slate-800 dark:text-white font-bold py-4 px-8 rounded-2xl transition duration-300 text-sm uppercase tracking-wider"
              >
                <span>Explore Catalog</span>
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 mt-16 lg:mt-0 w-full max-w-md lg:max-w-xl flex items-center justify-center"
          >
            {/* Ambient Background Glow for image */}
            <div className="absolute w-[380px] h-[380px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[110px] -z-10 animate-pulse" />
            <img 
              src={banner ? banner.imageUrl : 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600'} 
              alt={banner ? banner.title : 'iPhone 15 Pro'} 
              className="object-contain max-h-[520px] hover:scale-[1.03] transition duration-700 ease-out drop-shadow-[0_25px_45px_rgba(139,92,246,0.15)] dark:drop-shadow-[0_25px_45px_rgba(139,92,246,0.35)]"
            />
          </motion.div>
        </section>

        {/* TRUST SIGNALS */}
        <section className="py-8 px-6 sm:px-12 lg:px-24 bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/5 backdrop-blur-md transition-colors duration-300">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-650 dark:text-purple-400">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Free Shipping</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">On all orders above $100</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Secure Payments</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">SSL Encrypted Checkout</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-pink-500/10 rounded-2xl text-pink-600 dark:text-pink-400">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">24/7 Support</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Instant Live Chat Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Premium Quality</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">100% Genuine Products</p>
              </div>
            </div>
          </div>
        </section>

        {/* BENTO GRID PROMO */}
        <section className="py-24 px-6 sm:px-12 lg:px-24 bg-[#fafafa] dark:bg-[#05060b] relative overflow-hidden transition-colors duration-300">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[140px] -z-10 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Exclusive Highlights</span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Lucrative Additions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px]">
              {/* Box 1: PlayStation 5 (Large 2x2 Bento Box) */}
              <div className="md:col-span-2 md:row-span-2 bg-white dark:bg-[#0c0d15] border border-black/5 dark:border-white/5 hover:border-purple-500/30 transition duration-500 rounded-3xl p-10 flex flex-col justify-between relative group overflow-hidden shadow-xl dark:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 dark:from-purple-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="absolute bottom-[-10%] right-[-5%] w-72 h-72 bg-gradient-to-tr from-purple-500/10 dark:from-purple-500/20 to-blue-500/0 rounded-full blur-[80px]" />
                
                <div className="space-y-4 max-w-md z-10">
                  <span className="text-[10px] font-bold tracking-widest text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full">Best Seller</span>
                  <h3 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none">Playstation 5</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    Play Has No Limits. Experience ultra-high speed loading with a custom SSD and breathtaking immersion.
                  </p>
                  <Link href="/products" className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-slate-800 dark:text-white border-b border-slate-800 dark:border-white pb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:border-purple-650 dark:group-hover:border-purple-400 transition duration-300">
                    <span>Explore Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                
                <div className="relative mt-4 flex justify-end z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=400" 
                    alt="Playstation 5" 
                    className="w-64 h-64 object-contain group-hover:scale-105 group-hover:rotate-2 transition duration-500 ease-out"
                  />
                </div>
              </div>

              {/* Box 2: AirPods Max (1x1 Bento Box) */}
              <div className="md:col-span-1 bg-white dark:bg-[#0c0d15] border border-black/5 dark:border-white/5 hover:border-pink-500/30 transition duration-500 rounded-3xl p-6 flex flex-col justify-between relative group overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 dark:from-pink-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="space-y-2 z-10">
                  <h4 className="text-xl font-extrabold leading-tight text-slate-900 dark:text-white uppercase">AirPods Max</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Reimagined over-ear listening comfort.</p>
                </div>
                <div className="flex justify-between items-end z-10">
                  <Link href="/products" className="text-[10px] font-bold uppercase tracking-widest text-pink-600 dark:text-pink-400">Shop Now</Link>
                  <img 
                    src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=180" 
                    alt="AirPods Max" 
                    className="w-24 h-24 object-contain group-hover:scale-105 transition duration-500"
                  />
                </div>
              </div>

              {/* Box 3: Apple Vision Pro (1x1 Bento Box) */}
              <div className="md:col-span-1 bg-white dark:bg-[#16151a] border border-black/5 dark:border-white/5 hover:border-blue-500/30 transition duration-500 rounded-3xl p-6 flex flex-col justify-between relative group overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 dark:from-blue-500/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="space-y-2 z-10">
                  <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">New Age</span>
                  <h4 className="text-xl font-extrabold leading-tight text-slate-900 dark:text-white uppercase">Vision Pro</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Welcome to spatial computing.</p>
                </div>
                <div className="flex justify-between items-end z-10">
                  <Link href="/products" className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Details</Link>
                  <img 
                    src="https://images.unsplash.com/photo-1617806118233-18e1db207f62?q=80&w=180" 
                    alt="Vision Pro" 
                    className="w-24 h-24 object-contain dark:invert dark:brightness-150 group-hover:scale-105 transition duration-500"
                  />
                </div>
              </div>

              {/* Box 4: MacBook Air (Large 2x1 Bento Box) */}
              <div className="md:col-span-2 bg-white dark:bg-[#0c0d15] border border-black/5 dark:border-white/5 hover:border-emerald-500/30 transition duration-500 rounded-3xl p-8 flex flex-row items-center justify-between relative group overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 dark:from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="space-y-4 max-w-xs z-10">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Macbook Air</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    Strikingly thin design. Incredible M3 performance. Up to 18 hours of pure battery life.
                  </p>
                  <Link href="/products" className="inline-block text-xs font-bold uppercase tracking-wider border-b border-emerald-500 text-emerald-600 dark:text-emerald-400 pb-0.5 hover:text-slate-900 dark:hover:text-white hover:border-slate-900 dark:hover:border-white transition duration-300">
                    Order Mac
                  </Link>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=260" 
                  alt="Macbook Air" 
                  className="w-48 h-full object-contain pt-4 group-hover:translate-x-2 group-hover:scale-103 transition duration-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FLASH DEALS WITH COUNTDOWN TIMER */}
        <section className="py-24 px-6 sm:px-12 lg:px-24 bg-gradient-to-b from-[#fafafa] via-purple-50/20 to-[#fafafa] dark:from-[#05060b] dark:via-[#080711] dark:to-[#05060b] border-t border-b border-black/5 dark:border-white/5 relative overflow-hidden transition-colors duration-300">
          <div className="absolute top-1/2 left-1/4 w-[450px] h-[450px] bg-pink-500/5 rounded-full blur-[130px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-widest text-red-500">
                  <Zap className="w-4 h-4 text-red-500 fill-current animate-bounce" />
                  <span>Limited Time Only</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Lightning Flash Deals</h2>
              </div>
              {/* Countdown Timer integration */}
              <Countdown endTime={new Date(Date.now() + 86400000 * 2).toISOString()} />
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl h-80 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.filter(p => p.salePrice).slice(0, 4).map((prod) => {
                  const isWished = isInWishlist(prod.id);
                  const variant = prod.productVariants?.[0];
                  const isAdded = addedItem === variant?.id;
                  const discountPct = Math.round(((prod.price - prod.salePrice) / prod.price) * 100);

                  return (
                    <div key={prod.id} className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-red-500/30 rounded-3xl p-5 flex flex-col justify-between h-[410px] relative group hover:shadow-2xl hover:shadow-purple-600/5 transition-all duration-500 backdrop-blur-md">
                      {/* Discount Badge */}
                      <span className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-red-650 dark:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-md shadow-red-600/30">
                        -{discountPct}% OFF
                      </span>

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
                            ? 'text-red-500 bg-white border-red-105 shadow-lg' 
                            : 'text-gray-400 bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:text-red-500 hover:bg-white hover:border-white'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <div className="flex-1 flex flex-col items-center justify-center p-2 mt-8">
                        <img 
                          src={prod.productImages?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200'} 
                          alt={prod.name} 
                          className="max-h-[160px] object-contain group-hover:scale-105 transition duration-500 ease-out drop-shadow-[0_15px_15px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_15px_15px_rgba(0,0,0,0.3)]" 
                        />
                      </div>

                      <div className="mt-6 space-y-4">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-2 hover:text-purple-650 dark:hover:text-white transition">
                          <Link href={`/products/${prod.slug}`}>{prod.name}</Link>
                        </h4>
                        
                        <div className="flex items-baseline space-x-2">
                          <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                            {formatPrice(prod.salePrice)}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-bold">
                            {formatPrice(prod.price)}
                          </span>
                        </div>

                        {/* Stock status indicator */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                            <span>Stock Left</span>
                            <span>{variant?.stock || 5} items</span>
                          </div>
                          <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" style={{ width: '40%' }}></div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleAddToCart(prod)}
                          className={`w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center space-x-2 ${
                            isAdded 
                              ? 'bg-emerald-650 dark:bg-emerald-600 text-white' 
                              : 'bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-205 shadow-lg'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <span>Claim Deal</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* BROWSE BY CATEGORY */}
        <section className="py-24 px-6 sm:px-12 lg:px-24 bg-[#fafafa] dark:bg-[#05060b] space-y-12 transition-colors duration-300">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-purple-650 dark:text-purple-400 font-display">Collections</span>
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Browse By Category</h2>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-3 border border-black/10 dark:border-white/10 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/20 dark:hover:border-white/30 transition">
                  <ChevronLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
                <button className="p-3 border border-black/10 dark:border-white/10 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/20 dark:hover:border-white/30 transition">
                  <ChevronRight className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {categories.length === 0 ? (
                // Fallback static categories
                [
                  { name: 'Phones', slug: 'phones', icon: Smartphone },
                  { name: 'Smart Watches', slug: 'watches', icon: Watch },
                  { name: 'Cameras', slug: 'cameras', icon: Camera },
                  { name: 'Headphones', slug: 'headphones', icon: Headphones },
                  { name: 'Computers', slug: 'computers', icon: Monitor },
                  { name: 'Gaming', slug: 'gaming', icon: Gamepad2 },
                ].map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.slug}
                      href={`/products?category=${cat.slug}`}
                      className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-purple-500/35 hover:shadow-2xl hover:shadow-purple-600/5 transition duration-300 py-8 px-4 rounded-3xl flex flex-col items-center justify-center text-center space-y-3 group"
                    >
                      <div className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl group-hover:bg-purple-600/10 group-hover:text-purple-400 transition duration-300">
                        <Icon className="w-7 h-7 text-slate-700 dark:text-slate-300 stroke-[1.5]" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 group-hover:text-purple-650 dark:group-hover:text-white transition">{cat.name}</span>
                    </Link>
                  );
                })
              ) : (
                categories.map((cat) => {
                  let Icon = Smartphone;
                  if (cat.slug.includes('electronics')) Icon = Monitor;
                  else if (cat.slug.includes('footwear')) Icon = Gamepad2;
                  else if (cat.slug.includes('apparel')) Icon = Watch;
                  else if (cat.slug.includes('accessories')) Icon = Camera;

                  return (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-purple-500/35 hover:shadow-2xl hover:shadow-purple-600/5 transition duration-300 py-8 px-4 rounded-3xl flex flex-col items-center justify-center text-center space-y-3 group"
                    >
                      <div className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl group-hover:bg-purple-600/10 group-hover:text-purple-400 transition duration-300">
                        <Icon className="w-7 h-7 text-slate-700 dark:text-slate-300 stroke-[1.5]" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 group-hover:text-purple-650 dark:group-hover:text-white transition">{cat.name}</span>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* TABBED PRODUCTS GRID */}
        <section className="py-16 px-6 sm:px-12 lg:px-24 bg-[#fafafa] dark:bg-[#05060b] space-y-10 transition-colors duration-300">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex items-center space-x-8 border-b border-black/5 dark:border-white/5 pb-4">
              {[
                { id: 'new', label: 'New Arrivals' },
                { id: 'bestseller', label: 'Bestsellers' },
                { id: 'featured', label: 'Featured Products' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`text-sm font-bold uppercase tracking-wider pb-4 transition relative ${
                    activeTab === tab.id ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.span 
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 w-full h-[3px] bg-purple-650 dark:bg-purple-500 rounded-full" 
                    />
                  )}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl h-80 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {getTabProducts().map((prod) => {
                  const isWished = isInWishlist(prod.id);
                  const variant = prod.productVariants?.[0];
                  const isAdded = addedItem === variant?.id;

                  return (
                    <motion.div 
                      layout
                      key={prod.id} 
                      className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/15 rounded-3xl p-5 flex flex-col justify-between h-[390px] relative group hover:shadow-2xl hover:shadow-purple-600/5 transition-all duration-500"
                    >
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
                            : 'text-gray-400 bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:text-red-500 hover:bg-white hover:border-white'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <div className="flex-1 flex flex-col items-center justify-center p-2 mt-4">
                        <img 
                          src={prod.productImages?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200'} 
                          alt={prod.name} 
                          className="max-h-[150px] object-contain group-hover:scale-105 transition duration-500 ease-out drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]" 
                        />
                      </div>

                      <div className="mt-6 space-y-3.5 text-center">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-2 hover:text-purple-650 dark:hover:text-white transition">
                          <Link href={`/products/${prod.slug}`}>{prod.name}</Link>
                        </h4>
                        <p className="font-extrabold text-base text-slate-900 dark:text-white">
                          {formatPrice(prod.salePrice || prod.price)}
                        </p>
                        
                        <button
                          onClick={() => handleAddToCart(prod)}
                          className={`w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center space-x-2 ${
                            isAdded 
                              ? 'bg-emerald-650 dark:bg-emerald-600 text-white' 
                              : 'bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-250 shadow-md'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <span>Buy Now</span>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* POPULAR SPLIT BLOCKS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-b border-black/5 dark:border-white/5 bg-[#fafafa] dark:bg-[#05060b] transition-colors duration-300">
          {/* Popular Products */}
          <div className="bg-white dark:bg-[#0c0d15] p-10 flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-black/5 dark:border-white/5 min-h-[420px] group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-[40px] pointer-events-none" />
            <img 
              src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=200" 
              alt="Airpods & Apple Watch" 
              className="w-40 h-40 object-contain mx-auto group-hover:scale-105 transition duration-500"
            />
            <div className="space-y-3.5 mt-6 z-10">
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Popular Curated</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Loved by thousands. Discover our most popular curated collection.
              </p>
              <Link href="/products" className="inline-flex items-center space-x-2 bg-black/5 dark:bg-white/5 hover:bg-slate-950 dark:hover:bg-white text-slate-800 dark:text-white hover:text-white dark:hover:text-black font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl transition duration-300 border border-black/10 dark:border-white/10 hover:border-slate-950 dark:hover:border-white">
                <span>Shop Collection</span>
              </Link>
            </div>
          </div>

          {/* iPad Pro */}
          <div className="bg-purple-50/20 dark:bg-[#080711] p-10 flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-black/5 dark:border-white/5 min-h-[420px] group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-[40px] pointer-events-none" />
            <img 
              src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=200" 
              alt="iPad Pro" 
              className="w-40 h-40 object-contain mx-auto group-hover:scale-105 transition duration-500"
            />
            <div className="space-y-3.5 mt-6 z-10">
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">iPad Pro</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Supercharged by Apple M2 chip. Astounding performance and displays.
              </p>
              <Link href="/products" className="inline-flex items-center space-x-2 bg-black/5 dark:bg-white/5 hover:bg-slate-950 dark:hover:bg-white text-slate-800 dark:text-white hover:text-white dark:hover:text-black font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl transition duration-300 border border-black/10 dark:border-white/10 hover:border-slate-950 dark:hover:border-white">
                <span>Shop iPad</span>
              </Link>
            </div>
          </div>

          {/* Samsung Galaxy */}
          <div className="bg-white dark:bg-[#0c0d15] p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-black/5 dark:border-white/5 min-h-[420px] group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/5 rounded-full blur-[40px] pointer-events-none" />
            <img 
              src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=200" 
              alt="Samsung Galaxy Fold" 
              className="w-40 h-40 object-contain mx-auto group-hover:scale-105 transition duration-500"
            />
            <div className="space-y-3.5 mt-6 z-10">
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Samsung Galaxy</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Explore the power of folding smartphones and flagship cameras.
              </p>
              <Link href="/products" className="inline-flex items-center space-x-2 bg-black/5 dark:bg-white/5 hover:bg-slate-950 dark:hover:bg-white text-slate-800 dark:text-white hover:text-white dark:hover:text-black font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl transition duration-300 border border-black/10 dark:border-white/10 hover:border-slate-950 dark:hover:border-white">
                <span>Shop Galaxy</span>
              </Link>
            </div>
          </div>

          {/* Macbook Pro */}
          <div className="bg-[#18171C] text-white p-10 flex flex-col justify-between min-h-[420px] group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] pointer-events-none" />
            <img 
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=200" 
              alt="Macbook Pro" 
              className="w-40 h-40 object-contain mx-auto invert brightness-125 group-hover:scale-105 transition duration-500"
            />
            <div className="space-y-3.5 mt-6 z-10">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Macbook Pro</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                The ultimate pro laptop. Liquid Retina XDR screen and high efficiency.
              </p>
              <Link href="/products" className="inline-flex items-center space-x-2 bg-white hover:bg-slate-200 text-black font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl transition duration-300">
                <span>Shop Mac</span>
              </Link>
            </div>
          </div>
        </section>

        {/* BIG SUMMER SALE BANNER */}
        <section className="relative bg-gradient-to-br from-purple-100 via-white to-purple-50 dark:from-[#1E1D22] dark:via-[#0A0A0C] dark:to-[#05060b] text-slate-800 dark:text-white overflow-hidden py-24 px-6 sm:px-12 lg:px-24 flex flex-col items-center justify-center text-center min-h-[460px] border-t border-black/5 dark:border-white/5 transition-colors duration-300">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15),transparent_70%)]" />
          <div className="relative z-10 max-w-xl space-y-6">
            <span className="inline-block px-3 py-1 bg-purple-500/10 dark:bg-purple-500/15 border border-purple-550/20 dark:border-purple-500/30 rounded-full text-[10px] font-bold tracking-widest text-purple-750 dark:text-purple-300 uppercase">
              Limited Period Offer
            </span>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-none uppercase font-display text-slate-900 dark:text-white">
              Big Summer <span className="bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-500 bg-clip-text text-transparent block sm:inline">Sale</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-base max-w-md mx-auto leading-relaxed">
              Get premium quality apparel, footwear, laptops and electronics with up to 50% discount. Free shipping worldwide.
            </p>
            <div className="pt-4">
              <Link href="/products" className="inline-flex items-center space-x-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-black font-bold py-4 px-10 rounded-2xl transition duration-300 shadow-xl text-xs uppercase tracking-wider">
                <span>Shop Sale</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-black text-slate-800 dark:text-white py-20 px-6 sm:px-12 lg:px-24 border-t border-black/5 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-5">
            <h3 className="text-2xl font-black tracking-tight uppercase text-slate-950 dark:text-white">shopora</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-xs font-medium">
              Discover curated luxury items, premium electronics, fashion, and accessories. Tailored for quality and convenience.
            </p>
          </div>
          <div className="space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Services</h4>
            <ul className="space-y-3.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <li><Link href="/loyalty" className="hover:text-slate-950 dark:hover:text-white transition">Bonus program</Link></li>
              <li><Link href="/gift-cards" className="hover:text-slate-950 dark:hover:text-white transition">Gift cards</Link></li>
              <li><Link href="/credit" className="hover:text-slate-950 dark:hover:text-white transition">Credit and payment</Link></li>
              <li><Link href="/contracts" className="hover:text-slate-950 dark:hover:text-white transition">Service contracts</Link></li>
            </ul>
          </div>
          <div className="space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Assistance to the buyer</h4>
            <ul className="space-y-3.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <li><Link href="/orders" className="hover:text-slate-950 dark:hover:text-white transition">Find an order</Link></li>
              <li><Link href="/shipping" className="hover:text-slate-950 dark:hover:text-white transition">Terms of delivery</Link></li>
              <li><Link href="/refunds" className="hover:text-slate-950 dark:hover:text-white transition">Exchange and return of goods</Link></li>
              <li><Link href="/guarantee" className="hover:text-slate-950 dark:hover:text-white transition">Guarantee</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-black/5 dark:border-white/5 text-center text-xs text-slate-400 dark:text-slate-650 font-semibold">
          <p>© {currentYear} Shopora E-Commerce. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
