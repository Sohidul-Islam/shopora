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
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <p className="animate-pulse text-sm font-semibold tracking-wider uppercase">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center space-y-4">
        <p className="text-red-500 font-semibold">{error || 'Product not found.'}</p>
        <Link href="/products" className="text-xs uppercase tracking-wider font-bold py-2.5 px-5 bg-black text-white rounded-lg hover:bg-gray-900 transition">Back to Catalogue</Link>
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
    <div className="min-h-screen bg-white text-black font-sans py-8 px-6 sm:px-12 lg:px-24">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs text-gray-400 mb-8">
        <Link href="/" className="hover:text-black">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/products" className="hover:text-black">Catalog</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-black capitalize font-medium">{product.name}</span>
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
                className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gray-50 border p-1 transition ${
                  selectedImage === img.url ? 'border-black' : 'border-gray-200'
                }`}
              >
                <img src={img.url} alt={product.name} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
          <div className="flex-1 aspect-square bg-[#F6F6F6] rounded-2xl flex items-center justify-center p-8 border border-gray-100">
            <img src={selectedImage} alt={product.name} className="max-h-[360px] object-contain" />
          </div>
        </div>

        {/* Purchase details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">{product.name}</h1>
            <div className="flex items-center space-x-3 text-lg font-bold">
              <span className="text-2xl font-black">{formatPrice(product.salePrice || product.price)}</span>
              {product.salePrice && (
                <span className="text-gray-450 line-through font-normal">{formatPrice(product.price)}</span>
              )}
            </div>
          </div>

          {/* Color selector */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Color</span>
            <div className="flex items-center space-x-3">
              {['#000000', '#5F4B8B', '#FF0000', '#FFD700', '#EDEDED'].map((color, i) => (
                <button
                  key={i}
                  style={{ backgroundColor: color }}
                  className="w-8 h-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black ring-offset-2 transition"
                />
              ))}
            </div>
          </div>

          {/* Specifications selectors */}
          {product.productVariants && product.productVariants.length > 1 && (
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Capacity</span>
              <div className="flex flex-wrap gap-2.5">
                {product.productVariants.map((variant: any) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`py-2 px-5 text-xs font-semibold rounded-lg border transition ${
                      selectedVariant?.id === variant.id
                        ? 'border-black bg-black text-white'
                        : 'border-gray-250 text-gray-600 hover:border-black'
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
              <div key={i} className="bg-[#F6F6F6] rounded-xl p-3 border border-gray-100 flex flex-col justify-center">
                <span className="text-[10px] text-gray-400 font-medium">{spec.label}</span>
                <span className="text-xs font-bold text-gray-800">{spec.val}</span>
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
                  ? 'border-red-500 bg-red-50 text-red-500' 
                  : 'border-gray-300 text-gray-600 hover:border-black hover:text-black'
              }`}
            >
              Add to Wishlist
            </button>
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
              className="flex-1 py-3 px-6 bg-black hover:bg-gray-950 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center justify-center space-x-2 text-xs uppercase tracking-wider"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{addedMessage ? 'Added to Cart ✓' : 'Add to Cart'}</span>
            </button>
          </div>

          {/* Logistics badges */}
          <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
            <div className="flex items-center space-x-2.5">
              <Truck className="w-5 h-5 text-gray-600 shrink-0" />
              <div>
                <span className="text-[11px] font-bold text-gray-800 block">Free Delivery</span>
                <span className="text-[9px] text-gray-400 block">1-2 consecutive days</span>
              </div>
            </div>
            <div className="flex items-center space-x-2.5">
              <RotateCcw className="w-5 h-5 text-gray-600 shrink-0" />
              <div>
                <span className="text-[11px] font-bold text-gray-800 block">In Stock</span>
                <span className="text-[9px] text-gray-400 block">Available today</span>
              </div>
            </div>
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="w-5 h-5 text-gray-600 shrink-0" />
              <div>
                <span className="text-[11px] font-bold text-gray-800 block">Guaranteed</span>
                <span className="text-[9px] text-gray-400 block">1 year warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs description */}
      <div className="border-t border-gray-200 pt-8 mb-16">
        <div className="flex items-center space-x-6 border-b border-gray-150 pb-3 mb-6">
          {[
            { id: 'details', label: 'Details' },
            { id: 'specs', label: 'Specifications' },
            { id: 'reviews', label: 'Reviews' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-sm font-semibold pb-3 transition relative ${
                activeTab === tab.id ? 'text-black' : 'text-gray-400 hover:text-black'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'details' && (
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed max-w-3xl">
            <p>{product.description}</p>
            <p>Experience flagship performance in everyday tasks. Built with sustainability in mind, utilizing recycled components and highly efficient processors that optimize battery cycles.</p>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="max-w-2xl border border-gray-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-gray-150 text-gray-600">
                <tr className="bg-gray-50"><td className="py-3 px-4 font-bold text-black w-1/3">Model SKU</td><td className="py-3 px-4">{selectedVariant?.sku || product.sku}</td></tr>
                <tr><td className="py-3 px-4 font-bold text-black">Brand</td><td className="py-3 px-4">{product.brand?.name || 'Shopora'}</td></tr>
                <tr className="bg-gray-50"><td className="py-3 px-4 font-bold text-black">Warranty</td><td className="py-3 px-4">1 Year Brand Warranty</td></tr>
                <tr><td className="py-3 px-4 font-bold text-black">Logistics Partner</td><td className="py-3 px-4">DHL Express / FedEx</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {/* Reviews Breakdown Header */}
            <div className="flex flex-col md:flex-row gap-8 items-center bg-[#F6F6F6] p-6 rounded-2xl border border-gray-100 max-w-xl">
              <div className="text-center md:border-r border-gray-200 md:pr-8">
                <span className="text-5xl font-black block">4.8</span>
                <span className="text-xs text-gray-400 block mt-1">of 5 stars</span>
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
                    <span className="w-20 font-medium text-gray-650">{stat.label}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div style={{ width: stat.percentage }} className="h-full bg-amber-400 rounded-full" />
                    </div>
                    <span className="w-8 text-right text-gray-400 font-semibold">{stat.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* User comments list */}
            <div className="space-y-6 max-w-2xl">
              {mockReviews.map((rev, i) => (
                <div key={i} className="border-b border-gray-100 pb-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={rev.avatar} alt={rev.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                      <div>
                        <h4 className="font-bold text-sm text-gray-800">{rev.name}</h4>
                        <span className="text-[10px] text-gray-400 block">{rev.date}</span>
                      </div>
                    </div>
                    <div className="flex space-x-0.5">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-250 pt-12 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => {
              const relImage = rel.productImages?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200';
              return (
                <div key={rel.id} className="bg-[#F6F6F6] rounded-xl p-4 flex flex-col justify-between h-[360px] relative group hover:shadow-md transition">
                  <div className="flex-1 flex flex-col items-center justify-center p-2">
                    <img 
                      src={relImage} 
                      alt={rel.name} 
                      className="max-h-[140px] object-contain group-hover:scale-102 transition duration-300" 
                    />
                  </div>

                  <div className="mt-4 space-y-2 text-center">
                    <h4 className="font-semibold text-xs text-gray-800 line-clamp-2 hover:text-black">
                      <Link href={`/products/${rel.slug}`}>{rel.name}</Link>
                    </h4>
                    <p className="font-bold text-sm">
                      {formatPrice(rel.price)}
                    </p>
                    <Link
                      href={`/products/${rel.slug}`}
                      className="inline-block w-full py-2.5 bg-black text-white hover:bg-gray-950 text-xs font-bold rounded-lg text-center transition"
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
