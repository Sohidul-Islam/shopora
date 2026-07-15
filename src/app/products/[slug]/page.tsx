'use client';

import { useEffect, useState } from 'react';
import { useStore, CartItem } from '../../../store/useStore';
import { formatPrice } from '../../../lib/utils';
import Countdown from '../../../components/Countdown';
import { 
  Star, Heart, ChevronRight, Truck, RefreshCcw, 
  ShieldCheck, ShoppingBag, Flame, Gift, Copy, Award, ShieldAlert, Sparkles 
} from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${params.slug}`);
        const res = await response.json();
        if (res.success && res.product) {
          const match = res.product;
          setProduct(match);
          setSelectedImage(match.productImages?.[0]?.url || '');
          setSelectedVariant(match.productVariants?.[0] || null);
          
          // Load related products
          const catSlug = match.productCategories?.[0]?.category?.slug;
          if (catSlug) {
            const relResponse = await fetch(`/api/products?category=${catSlug}&limit=5`);
            const relRes = await relResponse.json();
            if (relRes.success) {
              setRelatedProducts(relRes.products.filter((p: any) => p.id !== match.id).slice(0, 3));
            }
          }
        } else {
          throw new Error('Product details could not be retrieved.');
        }
      } catch (err: any) {
        setError(err.message || 'Error loading product.');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [params.slug]);

  // Scroll listener for sticky purchase bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#05060b] via-[#090b11] to-[#040508] text-slate-100 flex items-center justify-center">
        <p className="animate-pulse font-display text-sm font-semibold tracking-wider uppercase">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#05060b] via-[#090b11] to-[#040508] text-slate-100 flex flex-col items-center justify-center space-y-4">
        <p className="text-red-400 font-semibold">{error || 'Product not found.'}</p>
        <Link href="/products" className="text-xs uppercase tracking-wider font-bold py-2.5 px-5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition">Back to Catalogue</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    const cartItem: CartItem = {
      id: selectedVariant.id,
      productId: product.id,
      name: product.name,
      sku: selectedVariant.sku,
      image: selectedImage || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200',
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : null,
      quantity,
      stock: selectedVariant.stock,
    };

    addToCart(cartItem);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  const isWished = isInWishlist(product.id);

  // Mock Reviews
  const mockReviews = [
    { name: 'Sarah Jenkins', rating: 5, date: 'June 18, 2026', comment: 'Absolutely stunning! The build quality is premium, and shipping was incredibly fast. Highly recommended.' },
    { name: 'David Chen', rating: 5, date: 'May 24, 2026', comment: 'Worth every single penny. The performance exceeded my expectations and matches perfectly with my workflow.' },
    { name: 'Elena Rostova', rating: 4, date: 'April 09, 2026', comment: 'Excellent product. Packaging was slightly worn during shipping, but the item itself is pristine and works flawlessly.' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05060b] via-[#090b11] to-[#040508] text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12 pb-24">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 font-bold uppercase tracking-widest">
          <Link href="/" className="hover:text-blue-400 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-blue-400 transition">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-300 truncate max-w-[150px]">{product.name}</span>
        </div>

        {/* Core Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Gallery View */}
          <div className="space-y-4">
            <div className="aspect-square w-full rounded-3xl bg-[#0a0c14] border border-slate-800/40 overflow-hidden relative shadow-lg shadow-black/20">
              <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.productImages?.map((img: any) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border transition-all duration-300 shrink-0 bg-[#0a0c14] ${
                    selectedImage === img.url ? 'border-blue-500 scale-95 shadow-md shadow-blue-500/10' : 'border-slate-850 hover:border-slate-700'
                  }`}
                >
                  <img src={img.url} alt={product.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details & Selectors */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-blue-400 font-extrabold block">{product.brand?.name || 'Shopora'}</span>
              <h1 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight leading-none">{product.name}</h1>
              
              <div className="flex items-center space-x-3 pt-1">
                <div className="flex items-center space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-slate-400 font-bold">(3 reviews)</span>
              </div>
            </div>

            {/* Price Tags */}
            <div className="flex items-baseline space-x-3 border-y border-slate-900/60 py-4">
              <span className="text-3xl font-black text-white font-display">
                {formatPrice(product.salePrice || product.price)}
              </span>
              {product.salePrice && (
                <span className="text-sm text-slate-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Flash Sale Bar */}
            <div className="glass border border-rose-950/30 bg-rose-950/5 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-xs">
                <Flame className="w-4 h-4 text-rose-500 animate-pulse fill-current" />
                <span className="text-rose-400 font-bold uppercase tracking-wider">Flash Deal Special Discount!</span>
              </div>
              <Countdown endTime="2027-12-31 23:59:59" />
            </div>

            <p className="text-slate-400 text-sm leading-relaxed">{product.description}</p>

            {/* Variants Selector */}
            {product.productVariants && product.productVariants.length > 1 && (
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Select Variant</h3>
                <div className="flex gap-2.5">
                  {product.productVariants.map((variant: any) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`py-2.5 px-4 text-xs font-semibold rounded-xl border transition-all duration-300 ${
                        selectedVariant?.id === variant.id
                          ? 'border-blue-500 bg-blue-500/5 text-white'
                          : 'border-slate-800 text-slate-400 hover:border-slate-700 bg-[#090b11]/80'
                      }`}
                    >
                      {variant.sku} - {formatPrice(variant.price)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock status indicator */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500 font-semibold">Availability:</span>
              {selectedVariant && selectedVariant.stock > 0 ? (
                <span className="text-emerald-400 font-extrabold">{selectedVariant.stock} In Stock</span>
              ) : (
                <span className="text-rose-400 font-extrabold">Out of Stock</span>
              )}
            </div>

            {/* Add to Cart Actions */}
            <div className="flex gap-4 pt-2">
              <div className="flex items-center bg-[#090b11]/80 border border-slate-800 rounded-xl px-2.5">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-2 py-3 text-slate-400 hover:text-white font-bold"
                >
                  -
                </button>
                <span className="px-3 font-extrabold text-sm min-w-[24px] text-center text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-2 py-3 text-slate-400 hover:text-white font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
                className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-900/25 hover:shadow-blue-900/45 text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{addedMessage ? 'Added to Cart ✓' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={() => toggleWishlist({
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: Number(product.price),
                  image: selectedImage
                })}
                className={`p-3 rounded-xl border transition-all duration-300 ${
                  isWished
                    ? 'bg-rose-500/10 border-rose-500/25 text-rose-500'
                    : 'bg-[#090b11]/85 border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-950'
                }`}
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 border-t border-slate-900/60 pt-6 text-center">
              <div className="glass border border-slate-850 p-3 rounded-2xl space-y-1">
                <Truck className="w-4 h-4 mx-auto text-blue-400" />
                <span className="text-[10px] text-slate-400 font-extrabold block">Express Delivery</span>
              </div>
              <div className="glass border border-slate-850 p-3 rounded-2xl space-y-1">
                <ShieldCheck className="w-4 h-4 mx-auto text-emerald-400" />
                <span className="text-[10px] text-slate-400 font-extrabold block">Secure checkout</span>
              </div>
              <div className="glass border border-slate-850 p-3 rounded-2xl space-y-1">
                <RefreshCcw className="w-4 h-4 mx-auto text-purple-400" />
                <span className="text-[10px] text-slate-400 font-extrabold block">30-day refunds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Promo Coupon banner block */}
        <div className="glass border border-blue-900/35 bg-blue-950/5 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-lg shadow-black/10">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/15 border border-blue-500/20 rounded-2xl text-blue-400">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Claim your welcome discount code: <span className="text-blue-400 font-black">WELCOME10</span></h3>
              <p className="text-xs text-slate-400">Copy and paste this code at checkout to claim your promotional discount.</p>
            </div>
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText('WELCOME10');
              alert('Coupon code copied to clipboard!');
            }}
            className="flex items-center justify-center space-x-2 py-2.5 px-5 bg-blue-605 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition border border-blue-800"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Code</span>
          </button>
        </div>

        {/* Specs Comparison Table */}
        <div className="border-t border-slate-900/60 pt-12 space-y-6">
          <h2 className="text-2xl font-bold font-display text-white tracking-tight">Technical Specifications</h2>
          <div className="glass border border-slate-800/40 rounded-3xl overflow-hidden shadow-lg shadow-black/10">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-850 bg-[#0c0f17]/50 text-slate-400 uppercase font-extrabold tracking-wider">
                  <th className="py-4 px-6">Specification</th>
                  <th className="py-4 px-6">{product.name} Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-slate-350">
                <tr>
                  <td className="py-4 px-6 font-bold text-white">Model Sku</td>
                  <td className="py-4 px-6">{selectedVariant?.sku || product.sku}</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-white">Manufacturer Warranty</td>
                  <td className="py-4 px-6">1 Year Comprehensive Warranty</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-white">Certifications</td>
                  <td className="py-4 px-6">CE, RoHS Compliant</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-white">Shipping Carrier</td>
                  <td className="py-4 px-6">DHL Express, FedEx Priority</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-slate-900/60 pt-12 space-y-6">
            <h2 className="text-2xl font-bold font-display text-white tracking-tight">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => {
                const relImage = rel.productImages?.[0]?.url || '';
                return (
                  <Link
                    key={rel.id}
                    href={`/products/${rel.slug}`}
                    className="glass border border-slate-800/40 rounded-3xl p-5 hover-premium flex items-center space-x-4 shadow-lg shadow-black/10"
                  >
                    <div className="w-20 h-20 bg-[#0d0f17] rounded-2xl overflow-hidden shrink-0 border border-slate-850">
                      <img src={relImage} alt={rel.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] uppercase tracking-wider text-blue-400 font-extrabold block">{rel.brand?.name || 'Shopora'}</span>
                      <h4 className="font-bold text-white text-sm truncate hover:text-blue-400 transition">{rel.name}</h4>
                      <span className="text-xs font-extrabold text-slate-300 font-display block mt-0.5">{formatPrice(rel.price)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Customer Reviews Section */}
        <div className="border-t border-slate-900/60 pt-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl font-bold font-display text-white tracking-tight">Customer Reviews</h2>
            <div className="flex items-center space-x-2 py-1 px-3 bg-[#0a0c14] border border-slate-850 rounded-xl">
              <span className="text-sm font-black text-white">4.8</span>
              <span className="text-xs text-slate-500">out of 5</span>
              <div className="flex items-center space-x-0.5 ml-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockReviews.map((rev, i) => (
              <div key={i} className="glass border border-slate-800/40 rounded-3xl p-6 space-y-4 shadow-lg shadow-black/10">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-sm">{rev.name}</h4>
                    <span className="text-[10px] text-slate-500 font-semibold">{rev.date}</span>
                  </div>
                  <div className="flex space-x-0.5">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed italic">"{rev.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Purchase Bar */}
      {showSticky && product && selectedVariant && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#090b11]/95 backdrop-blur border-t border-slate-800/80 py-4 px-6 z-40 flex items-center justify-between shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center space-x-4">
            <img src={selectedImage} alt={product.name} className="w-10 h-10 object-cover rounded-lg border border-slate-800" />
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm line-clamp-1">{product.name}</h4>
              <p className="text-[10px] text-slate-500 font-extrabold">{selectedVariant.sku}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-extrabold text-white text-sm sm:text-base">{formatPrice(product.salePrice || product.price)}</span>
            <button 
              onClick={handleAddToCart}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-blue-900/20"
            >
              Add To Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
