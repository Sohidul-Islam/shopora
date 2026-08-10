'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore, CartItem } from '../../store/useStore';
import { formatPrice } from '../../lib/utils';
import Link from 'next/link';
import { 
  Heart, ShoppingCart, Trash2, ArrowRight, Loader2, Sparkles, AlertCircle, ShoppingBag, Eye, CheckCircle2 
} from 'lucide-react';

export default function WishlistPage() {
  const router = useRouter();
  const { sessionToken, wishlist, toggleWishlist, syncWishlist, addToCart } = useStore();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionToken) {
      router.push('/login?redirect=/wishlist');
    } else {
      const loadWishlist = async () => {
        try {
          await syncWishlist();
        } catch (err: any) {
          setError('Failed to load wishlist items.');
        } finally {
          setLoading(false);
        }
      };
      loadWishlist();
    }
  }, [sessionToken]);

  const handleRemove = async (prodId: string, name: string, slug: string, price: number, image: string) => {
    // toggleWishlist handles state update and server request under the hood
    toggleWishlist({ id: prodId, name, slug, price, image });
  };

  const handleAddToCart = (item: any) => {
    const firstVariant = item.variants?.[0];
    if (!firstVariant) {
      alert('Product cannot be added to cart: No variants available.');
      return;
    }

    const cartItem: CartItem = {
      id: firstVariant.id,
      productId: item.id,
      name: item.name,
      sku: firstVariant.sku,
      image: item.image,
      price: Number(item.price),
      salePrice: item.salePrice ? Number(item.salePrice) : null,
      quantity: 1,
      stock: firstVariant.stock,
    };

    addToCart(cartItem);
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fafafa] via-[#fafafa] to-purple-50/20 dark:from-[#05060b] dark:via-[#090b11] dark:to-[#040508] py-16 px-4 sm:px-6 lg:px-8 space-y-8 transition-colors duration-300">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-10 w-48 bg-black/10 dark:bg-white/5 rounded-2xl animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-[390px] bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl p-5 space-y-4 animate-pulse flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="aspect-square bg-black/10 dark:bg-white/10 rounded-2xl w-full h-[180px]"></div>
                  <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-2/3"></div>
                  <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-1/2"></div>
                </div>
                <div className="h-10 bg-black/10 dark:bg-white/10 rounded-2xl w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-red-500 font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="py-2.5 px-6 rounded-xl bg-purple-650 dark:bg-purple-600 text-white font-bold text-xs"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafafa] via-[#fafafa] to-purple-50/20 dark:from-[#05060b] dark:via-[#090b11] dark:to-[#040508] py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center space-x-2 py-1 px-3 bg-purple-500/10 border border-purple-500/25 rounded-full text-purple-650 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Fulfillment Center</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Your Wishlist
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review and easily add items to your cart or remove items from your curated collections.
          </p>
        </div>

        {/* Wishlist Items Grid */}
        {wishlist.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl p-8 space-y-6 max-w-xl mx-auto shadow-xl">
            <div className="mx-auto w-16 h-16 bg-purple-500/10 border border-purple-500/20 text-purple-650 dark:text-purple-400 rounded-2xl flex items-center justify-center">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Your Wishlist is Empty</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                Explore our catalog of premium products, find your favorites, and save them here.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center space-x-2 py-3 px-6 rounded-2xl bg-purple-650 dark:bg-purple-600 text-sm font-bold text-white hover:bg-purple-700 dark:hover:bg-purple-500 shadow-lg shadow-purple-650/20 dark:shadow-purple-600/30 transition duration-300"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item: any) => {
              const firstVariant = item.variants?.[0];
              const isOutOfStock = item.status === 'OUT_OF_STOCK' || (firstVariant && firstVariant.stock <= 0);
              const isAdded = addedItem === item.id;
              
              const activePrice = item.salePrice !== null ? item.salePrice : item.price;
              const hasDiscount = item.salePrice !== null && item.salePrice < item.price;
              const discountPercentage = hasDiscount 
                ? Math.round(((item.price - item.salePrice) / item.price) * 100) 
                : 0;

              return (
                <div key={item.id} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/15 rounded-3xl p-5 flex flex-col justify-between h-[410px] relative group hover:shadow-2xl hover:shadow-purple-655/5 transition-all duration-500">
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.id, item.name, item.slug, Number(item.price), item.image)}
                    className="absolute top-4 right-4 z-10 p-2.5 rounded-2xl border text-gray-400 bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition duration-300"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Product Info Block */}
                  <div className="space-y-4">
                    {/* Image */}
                    <div className="aspect-square bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] rounded-2xl w-full h-[180px] relative overflow-hidden flex items-center justify-center shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="object-contain max-h-[160px] w-full group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                      )}
                      
                      {/* Discount Badge */}
                      {hasDiscount && (
                        <span className="absolute bottom-3 left-3 py-0.5 px-2 bg-pink-500 border border-pink-400/20 text-white text-[9px] font-black rounded-lg">
                          -{discountPercentage}% OFFER
                        </span>
                      )}
                    </div>

                    {/* Brand & Name & Stock */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-slate-400">
                        <span>Shopora Selection</span>
                        {isOutOfStock ? (
                          <span className="text-red-500 font-bold lowercase normal-case">out of stock</span>
                        ) : (
                          <span className="text-green-500 font-bold lowercase normal-case">in stock</span>
                        )}
                      </div>
                      
                      <Link 
                        href={`/products/${item.slug}`} 
                        className="block font-bold text-slate-900 dark:text-white hover:text-purple-650 dark:hover:text-purple-400 transition line-clamp-2 h-10 text-sm leading-snug"
                      >
                        {item.name}
                      </Link>
                    </div>

                    {/* Price details */}
                    <div className="flex items-baseline space-x-2">
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        {formatPrice(activePrice)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatPrice(item.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Link
                      href={`/products/${item.slug}`}
                      className="p-3 rounded-2xl border border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-350 hover:bg-black/5 dark:hover:bg-white/5 transition duration-300 flex items-center justify-center"
                      title="View Product Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={isOutOfStock}
                      className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs shadow-md transition duration-300 flex items-center justify-center space-x-2 ${
                        isOutOfStock
                          ? 'bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-400 cursor-not-allowed shadow-none'
                          : isAdded
                          ? 'bg-green-600 text-white shadow-green-600/10'
                          : 'bg-purple-650 dark:bg-purple-600 hover:bg-purple-700 dark:hover:bg-purple-500 text-white shadow-purple-650/15'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 shrink-0" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
