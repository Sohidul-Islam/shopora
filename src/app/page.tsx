'use client';

import { useEffect, useState } from 'react';
import { formatPrice } from '../lib/utils';
import { useStore, CartItem } from '../store/useStore';
import Link from 'next/link';
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
  Gamepad2 
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

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between font-sans selection:bg-black selection:text-white">
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-br from-[#18171C] via-[#0E0D10] to-[#0A0A0C] text-white overflow-hidden py-24 px-6 sm:px-12 lg:px-24 flex flex-col lg:flex-row items-center justify-between min-h-[700px] border-b border-gray-900">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15),transparent_80%)]" />
          <div className="relative z-10 max-w-xl space-y-6 lg:pr-8">
            <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold tracking-wider text-gray-300 backdrop-blur-md">
              ✨ Shopora Exclusives
            </span>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-none uppercase">
              {banner ? banner.title.split(' ')[0] : 'iPhone 14'}{' '}
              <span className="font-light text-gray-400 block sm:inline">
                {banner ? banner.title.split(' ').slice(1).join(' ') : 'Pro'}
              </span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-lg max-w-md font-medium leading-relaxed">
              {banner ? banner.subtitle : 'Created to change everything for the better. For everyone.'}
            </p>
            <div className="pt-6">
              <Link href={banner ? banner.linkUrl || '/products' : '/products/iphone-14-pro-max'} className="inline-flex items-center space-x-2 bg-white hover:bg-gray-100 text-black font-bold py-4 px-10 rounded-xl transition duration-300 shadow-lg shadow-white/5 text-sm uppercase tracking-wider">
                <span>Shop Now</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative z-10 mt-16 lg:mt-0 max-w-md lg:max-w-xl flex items-center justify-center">
            <div className="absolute w-[360px] h-[360px] bg-purple-500/10 rounded-full blur-[100px] -z-10" />
            <img 
              src={banner ? banner.imageUrl : 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600'} 
              alt={banner ? banner.title : 'iPhone 14 Pro Max'} 
              className="object-contain max-h-[500px] hover:scale-102 transition duration-700 ease-out drop-shadow-[0_35px_35px_rgba(0,0,0,0.65)]"
            />
          </div>
        </section>

        {/* PROMO GRID */}
        <section className="grid grid-cols-1 md:grid-cols-4 bg-[#F9F9FB] border-b border-gray-100">
          {/* Dynamic Promo Box 1 - PS5 */}
          <div className="md:col-span-2 bg-white p-10 flex flex-col sm:flex-row items-center justify-between border-b md:border-b-0 md:border-r border-gray-150 relative group overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=300" 
              alt="Playstation 5" 
              className="w-48 h-48 object-contain order-2 sm:order-1 group-hover:scale-105 transition duration-500"
            />
            <div className="space-y-4 order-1 sm:order-2 max-w-xs text-center sm:text-left z-10">
              <h3 className="text-3xl font-black uppercase tracking-tight">Playstation 5</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Play Has No Limits. Experience lightning fast loading with an ultra-high speed SSD.
              </p>
              <Link href="/products" className="inline-block text-xs font-bold uppercase tracking-wider border-b-2 border-black pb-1 hover:opacity-70 transition">
                Explore Now
              </Link>
            </div>
          </div>

          {/* AirPods / Vision Pro Split */}
          <div className="md:col-span-1 flex flex-col border-b md:border-b-0 md:border-r border-gray-150">
            {/* AirPods Max */}
            <div className="bg-[#EDEDF0] p-8 flex flex-row items-center justify-between flex-1 group relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=150" 
                alt="AirPods Max" 
                className="w-24 h-24 object-contain group-hover:scale-105 transition duration-500"
              />
              <div className="space-y-2 max-w-[140px] z-10">
                <h4 className="text-lg font-extrabold leading-tight uppercase">AirPods Max</h4>
                <p className="text-[11px] text-gray-500 font-medium">Reimagined over-ear listening experience.</p>
              </div>
            </div>
            {/* Vision Pro */}
            <div className="bg-[#1C1B1E] text-white p-8 flex flex-row items-center justify-between flex-1 group relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1617806118233-18e1db207f62?q=80&w=150" 
                alt="Vision Pro" 
                className="w-24 h-24 object-contain invert brightness-150 group-hover:scale-105 transition duration-500"
              />
              <div className="space-y-2 max-w-[140px] z-10">
                <h4 className="text-lg font-extrabold leading-tight text-white uppercase">Vision Pro</h4>
                <p className="text-[11px] text-gray-400 font-medium">Enter the beautiful era of spatial computing.</p>
              </div>
            </div>
          </div>

          {/* Macbook Air */}
          <div className="md:col-span-1 bg-[#F5F5F7] p-10 flex flex-col justify-between group relative overflow-hidden">
            <div className="space-y-3 z-10">
              <h3 className="text-2xl font-black uppercase tracking-tight">Macbook Air</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Strikingly thin design. Fast performance. Up to 18 hours of battery life.
              </p>
              <Link href="/products" className="inline-block text-xs font-bold uppercase tracking-wider border-b-2 border-black pb-1 hover:opacity-70 transition">
                Shop Now
              </Link>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=260" 
              alt="Macbook Air" 
              className="object-contain pt-6 group-hover:translate-x-2 transition duration-500"
            />
          </div>
        </section>

        {/* BROWSE BY CATEGORY */}
        <section className="py-24 px-6 sm:px-12 lg:px-24 bg-white space-y-12">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Browse By Category</h2>
              <p className="text-xs text-gray-500 font-medium">Explore premium curated categories crafted for your lifestyle.</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-black transition">
                <ChevronLeft className="w-5 h-5 text-gray-650" />
              </button>
              <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-black transition">
                <ChevronRight className="w-5 h-5 text-gray-650" />
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
                    className="bg-white border border-gray-150 hover:border-black hover:shadow-lg hover:shadow-black/5 transition duration-300 py-8 px-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-3"
                  >
                    <Icon className="w-7 h-7 text-black stroke-[1.5]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-black">{cat.name}</span>
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
                    className="bg-white border border-gray-150 hover:border-black hover:shadow-lg hover:shadow-black/5 transition duration-300 py-8 px-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-3"
                  >
                    <Icon className="w-7 h-7 text-black stroke-[1.5]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-black">{cat.name}</span>
                  </Link>
                );
              })
            )}
          </div>
        </section>

        {/* TABBED PRODUCTS GRID */}
        <section className="py-16 px-6 sm:px-12 lg:px-24 bg-white space-y-10">
          <div className="flex items-center space-x-8 border-b border-gray-150 pb-4">
            {[
              { id: 'new', label: 'New Arrivals' },
              { id: 'bestseller', label: 'Bestsellers' },
              { id: 'featured', label: 'Featured Products' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-sm font-bold uppercase tracking-wider pb-4 transition relative ${
                  activeTab === tab.id ? 'text-black' : 'text-gray-400 hover:text-black'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-black rounded-full" />
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-50 border border-gray-150 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.slice(0, 8).map((prod) => {
                const isWished = isInWishlist(prod.id);
                const variant = prod.productVariants?.[0];
                const isAdded = addedItem === variant?.id;

                return (
                  <div key={prod.id} className="bg-white border border-gray-150 rounded-2xl p-5 flex flex-col justify-between h-[390px] relative group hover:border-black hover:shadow-xl hover:shadow-black/5 transition-all duration-300">
                    <button
                      onClick={() => toggleWishlist({
                        id: prod.id,
                        name: prod.name,
                        slug: prod.slug,
                        price: Number(prod.price),
                        image: prod.productImages?.[0]?.url || ''
                      })}
                      className={`absolute top-4 right-4 p-2.5 rounded-full border transition ${
                        isWished 
                          ? 'text-red-500 bg-white border-red-100 shadow-sm' 
                          : 'text-gray-400 bg-white border-gray-100 hover:text-red-500 hover:border-red-100'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <div className="flex-1 flex flex-col items-center justify-center p-2 mt-4">
                      <img 
                        src={prod.productImages?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200'} 
                        alt={prod.name} 
                        className="max-h-[150px] object-contain group-hover:scale-105 transition duration-500 ease-out" 
                      />
                    </div>

                    <div className="mt-6 space-y-3.5 text-center">
                      <h4 className="font-bold text-sm text-gray-800 line-clamp-2 hover:text-black transition">
                        <Link href={`/products/${prod.slug}`}>{prod.name}</Link>
                      </h4>
                      <p className="font-extrabold text-base text-black">
                        {formatPrice(prod.salePrice || prod.price)}
                      </p>
                      
                      <button
                        onClick={() => handleAddToCart(prod)}
                        className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center space-x-2 ${
                          isAdded 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-black text-white hover:bg-gray-900 shadow-md shadow-black/5'
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
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* POPULAR SPLIT BLOCKS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-b border-gray-150">
          {/* Popular Products */}
          <div className="bg-white p-10 flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-gray-150 min-h-[400px] group">
            <img 
              src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=200" 
              alt="Airpods & Apple Watch" 
              className="w-40 h-40 object-contain mx-auto group-hover:scale-105 transition duration-550"
            />
            <div className="space-y-3.5 mt-6">
              <h3 className="text-xl font-black uppercase tracking-tight">Popular Curated</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Loved by thousands. Discover our most popular curated collection.
              </p>
              <Link href="/products" className="inline-flex items-center space-x-2 border border-black hover:bg-black hover:text-white text-black font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition">
                <span>Shop Collection</span>
              </Link>
            </div>
          </div>

          {/* iPad Pro */}
          <div className="bg-[#FBFBFC] p-10 flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-gray-150 min-h-[400px] group">
            <img 
              src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=200" 
              alt="iPad Pro" 
              className="w-40 h-40 object-contain mx-auto group-hover:scale-105 transition duration-550"
            />
            <div className="space-y-3.5 mt-6">
              <h3 className="text-xl font-black uppercase tracking-tight">iPad Pro</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Supercharged by Apple M2 chip. Astounding performance and displays.
              </p>
              <Link href="/products" className="inline-flex items-center space-x-2 border border-black hover:bg-black hover:text-white text-black font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition">
                <span>Shop iPad</span>
              </Link>
            </div>
          </div>

          {/* Samsung Galaxy */}
          <div className="bg-[#F2F2F4] p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-150 min-h-[400px] group">
            <img 
              src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=200" 
              alt="Samsung Galaxy Fold" 
              className="w-40 h-40 object-contain mx-auto group-hover:scale-105 transition duration-550"
            />
            <div className="space-y-3.5 mt-6">
              <h3 className="text-xl font-black uppercase tracking-tight">Samsung Galaxy</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Explore the power of folding smartphones and flagship cameras.
              </p>
              <Link href="/products" className="inline-flex items-center space-x-2 border border-black hover:bg-black hover:text-white text-black font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition">
                <span>Shop Galaxy</span>
              </Link>
            </div>
          </div>

          {/* Macbook Pro */}
          <div className="bg-[#18171C] text-white p-10 flex flex-col justify-between min-h-[400px] group">
            <img 
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=200" 
              alt="Macbook Pro" 
              className="w-40 h-40 object-contain mx-auto invert brightness-125 group-hover:scale-105 transition duration-550"
            />
            <div className="space-y-3.5 mt-6">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Macbook Pro</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                The ultimate pro laptop. Liquid Retina XDR screen and high efficiency.
              </p>
              <Link href="/products" className="inline-flex items-center space-x-2 border border-white hover:bg-white hover:text-black text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition">
                <span>Shop Mac</span>
              </Link>
            </div>
          </div>
        </section>

        {/* DISCOUNTS SECTION */}
        <section className="py-24 px-6 sm:px-12 lg:px-24 bg-white space-y-12">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Discounts up to 50%</h2>
            <p className="text-xs text-gray-500 font-medium">Seasonal pricing updates on top tier catalog selections.</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-50 border border-gray-150 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.slice(4, 8).map((prod) => {
                const isWished = isInWishlist(prod.id);
                const variant = prod.productVariants?.[0];
                const isAdded = addedItem === variant?.id;

                return (
                  <div key={prod.id} className="bg-white border border-gray-150 rounded-2xl p-5 flex flex-col justify-between h-[390px] relative group hover:border-black hover:shadow-xl hover:shadow-black/5 transition-all duration-300">
                    <button
                      onClick={() => toggleWishlist({
                        id: prod.id,
                        name: prod.name,
                        slug: prod.slug,
                        price: Number(prod.price),
                        image: prod.productImages?.[0]?.url || ''
                      })}
                      className={`absolute top-4 right-4 p-2.5 rounded-full border transition ${
                        isWished 
                          ? 'text-red-500 bg-white border-red-100 shadow-sm' 
                          : 'text-gray-400 bg-white border-gray-100 hover:text-red-500 hover:border-red-100'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <div className="flex-1 flex flex-col items-center justify-center p-2 mt-4">
                      <img 
                        src={prod.productImages?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200'} 
                        alt={prod.name} 
                        className="max-h-[150px] object-contain group-hover:scale-105 transition duration-500 ease-out" 
                      />
                    </div>

                    <div className="mt-6 space-y-3 text-center">
                      <h4 className="font-bold text-sm text-gray-800 line-clamp-2 hover:text-black transition">
                        <Link href={`/products/${prod.slug}`}>{prod.name}</Link>
                      </h4>
                      <div className="flex items-center justify-center space-x-2.5">
                        <span className="font-extrabold text-base text-black">
                          {formatPrice(prod.salePrice || prod.price)}
                        </span>
                        {prod.salePrice && (
                          <span className="text-xs text-gray-400 line-through font-bold">
                            {formatPrice(prod.price)}
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleAddToCart(prod)}
                        className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center space-x-2 ${
                          isAdded 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-black text-white hover:bg-gray-900 shadow-md shadow-black/5'
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
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* BIG SUMMER SALE BANNER */}
        <section className="relative bg-gradient-to-br from-[#1E1D22] to-[#0A0A0C] text-white overflow-hidden py-24 px-6 sm:px-12 lg:px-24 flex flex-col items-center justify-center text-center min-h-[420px] border-t border-gray-900">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]" />
          <div className="relative z-10 max-w-xl space-y-6">
            <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold tracking-widest text-gray-300 uppercase">
              Limited Period Offer
            </span>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-none uppercase">
              Big Summer <span className="font-light text-gray-400 block sm:inline">Sale</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-base max-w-md mx-auto leading-relaxed">
              Get premium quality apparel, footwear, laptops and electronics with up to 50% discount. Free shipping worldwide.
            </p>
            <div className="pt-4">
              <Link href="/products" className="inline-flex items-center space-x-2 bg-white hover:bg-gray-100 text-black font-bold py-4 px-10 rounded-xl transition duration-300 shadow-lg text-xs uppercase tracking-wider">
                <span>Shop Sale</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-black text-white py-20 px-6 sm:px-12 lg:px-24 border-t border-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-5">
            <h3 className="text-2xl font-black tracking-tight uppercase">shopora</h3>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs font-medium">
              Discover curated luxury items, premium electronics, fashion, and accessories. Tailored for quality and convenience.
            </p>
          </div>
          <div className="space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Services</h4>
            <ul className="space-y-3.5 text-xs text-gray-400 font-semibold">
              <li><Link href="/loyalty" className="hover:text-white transition">Bonus program</Link></li>
              <li><Link href="/gift-cards" className="hover:text-white transition">Gift cards</Link></li>
              <li><Link href="/credit" className="hover:text-white transition">Credit and payment</Link></li>
              <li><Link href="/contracts" className="hover:text-white transition">Service contracts</Link></li>
            </ul>
          </div>
          <div className="space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Assistance to the buyer</h4>
            <ul className="space-y-3.5 text-xs text-gray-400 font-semibold">
              <li><Link href="/orders" className="hover:text-white transition">Find an order</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition">Terms of delivery</Link></li>
              <li><Link href="/refunds" className="hover:text-white transition">Exchange and return of goods</Link></li>
              <li><Link href="/guarantee" className="hover:text-white transition">Guarantee</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-gray-950 text-center text-xs text-gray-600 font-semibold">
          <p>© 2026 Shopora E-Commerce. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
