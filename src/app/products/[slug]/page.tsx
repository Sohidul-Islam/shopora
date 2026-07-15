'use client';

import { useEffect, useState } from 'react';
import { useStore, CartItem } from '../../../store/useStore';
import { formatPrice } from '../../../lib/utils';
import { Star, Heart, CheckCircle2, ChevronRight, Truck, RefreshCcw, ShieldCheck, ShoppingBag } from 'lucide-react';
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

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        // In clean architecture, Next.js calls local api or repository directly.
        // We will fetch from /api/products and filter by slug
        const response = await fetch(`/api/products?q=${params.slug}`);
        const res = await response.json();
        if (res.success && res.products && res.products.length > 0) {
          // match exact slug
          const match = res.products.find((p: any) => p.slug === params.slug);
          if (match) {
            setProduct(match);
            setSelectedImage(match.productImages?.[0]?.url || '');
            setSelectedVariant(match.productVariants?.[0] || null);
          } else {
            throw new Error('Product not found.');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="animate-pulse">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center space-y-4">
        <p className="text-red-400">{error || 'Product not found.'}</p>
        <Link href="/products" className="text-sm text-blue-500 hover:underline">Back to Catalogue</Link>
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold uppercase tracking-wider">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-white transition">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-200 truncate max-w-[150px]">{product.name}</span>
        </div>

        {/* Core Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Gallery View */}
          <div className="space-y-4">
            <div className="aspect-square w-full rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden relative">
              <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex space-x-3 overflow-x-auto pb-1">
              {product.productImages?.map((img: any) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border transition shrink-0 bg-slate-900 ${
                    selectedImage === img.url ? 'border-blue-500 scale-95' : 'border-slate-850 hover:border-slate-700'
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
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">{product.brand?.name || 'Shopora Special'}</span>
              <h1 className="text-3xl font-extrabold font-display text-white tracking-tight">{product.name}</h1>
              
              <div className="flex items-center space-x-3 pt-1">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-blue-500 text-blue-500" />
                  ))}
                </div>
                <span className="text-xs text-slate-450 font-semibold">(18 reviews)</span>
              </div>
            </div>

            {/* Price Tags */}
            <div className="flex items-baseline space-x-3 border-y border-slate-900 py-4">
              <span className="text-2xl font-bold text-white">
                {formatPrice(product.salePrice || product.price)}
              </span>
              {product.salePrice && (
                <span className="text-base text-slate-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
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
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                        selectedVariant?.id === variant.id
                          ? 'border-blue-500 bg-blue-500/5 text-white'
                          : 'border-slate-800 text-slate-400 hover:border-slate-700 bg-slate-900/50'
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
              <span className="text-slate-400">Availability:</span>
              {selectedVariant && selectedVariant.stock > 0 ? (
                <span className="text-emerald-400 font-semibold">{selectedVariant.stock} In Stock</span>
              ) : (
                <span className="text-rose-400 font-semibold">Out of Stock</span>
              )}
            </div>

            {/* Add to Cart Actions */}
            <div className="flex gap-4 pt-2">
              <div className="flex items-center bg-slate-900 border border-slate-850 rounded-xl px-2">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-2 py-3 text-slate-400 hover:text-white"
                >
                  -
                </button>
                <span className="px-3 font-semibold text-sm min-w-[24px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-2 py-3 text-slate-400 hover:text-white"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
                className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-950/20 text-sm"
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
                className={`p-3 rounded-xl border transition ${
                  isWished
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                    : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-white hover:border-slate-750'
                }`}
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>

            {/* Shipping & Policies summary */}
            <div className="border-t border-slate-900 pt-6 space-y-3 text-xs text-slate-400">
              <div className="flex items-center space-x-2.5">
                <Truck className="w-4 h-4 text-blue-400" />
                <span>Free express shipping on order values over $150.</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <RefreshCcw className="w-4 h-4 text-blue-400" />
                <span>Unopened items returned within 30 days are fully refunded.</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Includes 1 year comprehensive manufacturer warranty.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
