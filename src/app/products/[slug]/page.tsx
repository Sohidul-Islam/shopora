'use client';

import { useEffect, useState } from 'react';
import { useStore, CartItem } from '../../../store/useStore';
import { formatPrice } from '../../../lib/utils';
import { 
  Star, Heart, ChevronRight, Truck, RotateCcw, 
  ShieldCheck, CheckCircle2, ShoppingBag 
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
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');

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
              setRelatedProducts(relRes.products.filter((p: any) => p.id !== match.id).slice(0, 4));
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#05060b] text-slate-800 dark:text-slate-100 flex items-center justify-center">
        <p className="animate-pulse text-sm font-semibold tracking-wider uppercase">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#05060b] text-slate-800 dark:text-slate-100 flex flex-col items-center justify-center space-y-4">
        <p className="text-red-500 font-semibold">{error || 'Product not found.'}</p>
        <Link href="/products" className="text-xs uppercase tracking-wider font-bold py-2.5 px-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition">Back to Catalogue</Link>
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
    { name: 'Grace Curtis', rating: 5, date: '2026-07-01', comment: 'I was looking for a replacement for my previous phone and this was the perfect choice. The design is elegant, battery life is outstanding, and the camera zoom capabilities are exceptional!', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100' },
    { name: 'Ronald Richards', rating: 5, date: '2026-06-18', comment: 'Absolutely stellar performance! The screen is beautifully crisp, colors are perfectly balanced, and the 120Hz refresh rate makes every animation feel butter smooth. Highly recommended.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100' },
    { name: 'Darcy Miller', rating: 4, date: '2026-06-10', comment: 'Incredible camera quality. The dynamic range in night shots is unbelievable. Delivery took a day longer than expected, but the overall service was excellent.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100' }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#05060b] text-slate-800 dark:text-slate-100 font-sans py-8 px-6 sm:px-12 lg:px-24 transition-colors duration-300">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs text-slate-400 mb-8">
        <Link href="/" className="hover:text-purple-650 dark:hover:text-white transition">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/products" className="hover:text-purple-650 dark:hover:text-white transition">Catalog</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-800 dark:text-white capitalize font-medium">{product.name}</span>
      </div>

      {/* Main product showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
        {/* Gallery */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-3 overflow-x-auto shrink-0">
            {product.productImages?.map((img: any) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img.url)}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-white dark:bg-white/5 border p-1 transition ${
                  selectedImage === img.url ? 'border-purple-500 dark:border-white' : 'border-slate-200 dark:border-white/10'
                }`}
              >
                <img src={img.url} alt={product.name} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
          <div className="flex-1 aspect-square bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center p-8 border border-black/5 dark:border-white/10">
            <img src={selectedImage} alt={product.name} className="max-h-[360px] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]" />
          </div>
        </div>

        {/* Purchase details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{product.name}</h1>
            <div className="flex items-center space-x-3 text-lg font-bold">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{formatPrice(product.salePrice || product.price)}</span>
              {product.salePrice && (
                <span className="text-slate-400 dark:text-slate-500 line-through font-normal">{formatPrice(product.price)}</span>
              )}
            </div>
          </div>

          {/* Color selector */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Color</span>
            <div className="flex items-center space-x-3">
              {['#000000', '#5F4B8B', '#FF0000', '#FFD700', '#EDEDED'].map((color, i) => (
                <button
                  key={i}
                  style={{ backgroundColor: color }}
                  className="w-8 h-8 rounded-full border border-slate-350 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 ring-offset-2 transition"
                />
              ))}
            </div>
          </div>

          {/* Specifications selectors */}
          {product.productVariants && product.productVariants.length > 1 && (
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider">Select Capacity</span>
              <div className="flex flex-wrap gap-2.5">
                {product.productVariants.map((variant: any) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`py-2 px-5 text-xs font-semibold rounded-xl border transition ${
                      selectedVariant?.id === variant.id
                        ? 'border-slate-950 dark:border-white bg-slate-950 dark:bg-white text-white dark:text-slate-950'
                        : 'border-slate-205 dark:border-white/10 text-slate-600 dark:text-slate-350 hover:border-slate-900 dark:hover:border-white'
                    }`}
                  >
                    {variant.sku}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Attributes short list */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Screen size', val: '6.7"' },
              { label: 'CPU', val: 'Octa-Core' },
              { label: 'Battery', val: '4323 mAh' },
              { label: 'Main camera', val: '48 MP' },
              { label: 'Front camera', val: '12 MP' },
              { label: 'Warranty', val: '1 Year' },
            ].map((spec, i) => (
              <div key={i} className="bg-white dark:bg-white/5 rounded-2xl p-3 border border-black/5 dark:border-white/10 flex flex-col justify-center">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{spec.label}</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{spec.val}</span>
              </div>
            ))}
          </div>

          {/* Buy actions */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={() => toggleWishlist({
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(product.price),
                image: selectedImage
              })}
              className={`py-3 px-6 border rounded-xl font-bold text-xs uppercase tracking-wider transition ${
                isWished 
                  ? 'border-red-500 bg-red-50 text-red-550' 
                  : 'border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-350 hover:border-slate-900 dark:hover:border-white hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              Add to Wishlist
            </button>
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
              className="flex-1 py-3 px-6 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-50 text-white dark:text-black font-bold rounded-xl transition flex items-center justify-center space-x-2 text-xs uppercase tracking-wider shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{addedMessage ? 'Added to Cart ✓' : 'Add to Cart'}</span>
            </button>
          </div>

          {/* Logistics badges */}
          <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-900 pt-6">
            <div className="flex items-center space-x-2.5">
              <Truck className="w-5 h-5 text-slate-605 dark:text-slate-400 shrink-0" />
              <div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">Free Delivery</span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 block">1-2 consecutive days</span>
              </div>
            </div>
            <div className="flex items-center space-x-2.5">
              <RotateCcw className="w-5 h-5 text-slate-605 dark:text-slate-400 shrink-0" />
              <div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">In Stock</span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 block">Available today</span>
              </div>
            </div>
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="w-5 h-5 text-slate-605 dark:text-slate-400 shrink-0" />
              <div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">Guaranteed</span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 block">1 year warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs description */}
      <div className="border-t border-slate-200 dark:border-slate-900 pt-8 mb-16">
        <div className="flex items-center space-x-6 border-b border-slate-150 dark:border-slate-900 pb-3 mb-6">
          {[
            { id: 'details', label: 'Details' },
            { id: 'specs', label: 'Specifications' },
            { id: 'reviews', label: 'Reviews' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-sm font-semibold pb-3 transition relative ${
                activeTab === tab.id ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-650 dark:bg-purple-500" />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'details' && (
          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            <p>{product.description}</p>
            <p>Experience flagship performance in everyday tasks. Built with sustainability in mind, utilizing recycled components and highly efficient processors that optimize battery cycles.</p>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="max-w-2xl border border-slate-200 dark:border-slate-805 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-slate-600 dark:text-slate-350">
                <tr className="bg-slate-50 dark:bg-[#0c0d15]"><td className="py-3 px-4 font-bold text-slate-900 dark:text-white w-1/3">Model SKU</td><td className="py-3 px-4">{selectedVariant?.sku || product.sku}</td></tr>
                <tr><td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Brand</td><td className="py-3 px-4">{product.brand?.name || 'Shopora'}</td></tr>
                <tr className="bg-slate-50 dark:bg-[#0c0d15]"><td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Warranty</td><td className="py-3 px-4">1 Year Brand Warranty</td></tr>
                <tr><td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Logistics Partner</td><td className="py-3 px-4">DHL Express / FedEx</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {/* Reviews Breakdown Header */}
            <div className="flex flex-col md:flex-row gap-8 items-center bg-white dark:bg-[#0c0d15] p-6 rounded-2xl border border-black/5 dark:border-slate-800/40 max-w-xl shadow-md">
              <div className="text-center md:border-r border-slate-100 dark:border-slate-900 md:pr-8">
                <span className="text-5xl font-black block text-slate-900 dark:text-white">4.8</span>
                <span className="text-xs text-slate-400 dark:text-slate-500 block mt-1">of 5 stars</span>
                <div className="flex items-center space-x-0.5 justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <div className="flex-1 space-y-2 w-full text-xs">
                {[
                  { label: 'Excellent', count: 124, percentage: '75%' },
                  { label: 'Good', count: 32, percentage: '19%' },
                  { label: 'Average', count: 8, percentage: '4%' },
                  { label: 'Below Average', count: 2, percentage: '1%' },
                  { label: 'Poor', count: 1, percentage: '1%' },
                ].map((stat, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <span className="w-20 font-medium text-slate-600 dark:text-slate-400">{stat.label}</span>
                    <div className="flex-1 h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div style={{ width: stat.percentage }} className="h-full bg-amber-400 rounded-full" />
                    </div>
                    <span className="w-8 text-right text-slate-450 dark:text-slate-500 font-semibold">{stat.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* User comments list */}
            <div className="space-y-6 max-w-2xl">
              {mockReviews.map((rev, i) => (
                <div key={i} className="border-b border-slate-100 dark:border-slate-900 pb-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={rev.avatar} alt={rev.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-800" />
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{rev.name}</h4>
                        <span className="text-[10px] text-slate-405 dark:text-slate-500 block">{rev.date}</span>
                      </div>
                    </div>
                    <div className="flex space-x-0.5">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-405 leading-relaxed font-medium">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-850 pt-12 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => {
              const relImage = rel.productImages?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200';
              return (
                <div key={rel.id} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/15 rounded-3xl p-4 flex flex-col justify-between h-[360px] relative group hover:shadow-2xl hover:shadow-purple-650/5 transition-all duration-500">
                  <div className="flex-1 flex flex-col items-center justify-center p-2">
                    <img 
                      src={relImage} 
                      alt={rel.name} 
                      className="max-h-[140px] object-contain group-hover:scale-102 transition duration-300 drop-shadow-[0_10px_10px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]" 
                    />
                  </div>

                  <div className="mt-4 space-y-2.5 text-center">
                    <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 line-clamp-2 hover:text-purple-650 dark:hover:text-white transition">
                      <Link href={`/products/${rel.slug}`}>{rel.name}</Link>
                    </h4>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">
                      {formatPrice(rel.price)}
                    </p>
                    <Link
                      href={`/products/${rel.slug}`}
                      className="inline-block w-full py-2.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-black text-xs font-bold rounded-xl text-center transition shadow-md"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
