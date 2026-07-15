'use client';

import { useStore, getCartTotals } from '../../store/useStore';
import { formatPrice } from '../../lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, CreditCard, Shield } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, appliedCoupon, applyCoupon, user } = useStore();
  const totals = getCartTotals(useStore.getState());
  
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError('');

    try {
      // Query coupon validity
      const response = await fetch(`/api/checkout`); // mock valid check
      // For simulator, we match welcome10 or save50
      const code = couponCode.trim().toUpperCase();
      if (code === 'WELCOME10') {
        applyCoupon({ id: 'welcome-10', code: 'WELCOME10', type: 'PERCENTAGE', value: 10, minPurchase: 50 });
      } else if (code === 'SAVE50') {
        applyCoupon({ id: 'save-50', code: 'SAVE50', type: 'FIXED', value: 50, minPurchase: 200 });
      } else {
        throw new Error('Invalid coupon code.');
      }
    } catch (err: any) {
      setCouponError(err.message || 'Error applying coupon.');
    } finally {
      setCouponLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-5 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-bold font-display">Your Cart is Empty</h1>
            <p className="text-sm text-slate-400">Explore our premium selection and add products to start shopping.</p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center justify-center space-x-2 py-3 px-6 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium rounded-xl transition shadow-lg shadow-blue-950/20 text-sm"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-slate-900 pb-5">
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-white">Shopping Cart</h1>
          <span className="text-sm text-slate-400 font-medium">{cart.length} item{cart.length > 1 ? 's' : ''}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const activePrice = item.salePrice !== null ? item.salePrice : item.price;
              return (
                <div key={item.id} className="glass rounded-2xl p-5 border border-slate-800/65 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-850 transition">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-xl bg-slate-900 overflow-hidden relative border border-slate-800 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-base hover:text-blue-400 transition">
                        <Link href={`/products/${item.productId}`}>{item.name}</Link>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 font-mono uppercase tracking-wider">{item.sku}</p>
                      <div className="flex items-center space-x-2 mt-1.5">
                        <span className="text-sm font-bold text-white">{formatPrice(activePrice)}</span>
                        {item.salePrice !== null && (
                          <span className="text-xs text-slate-500 line-through">{formatPrice(item.price)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:justify-end">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-850">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-slate-400 hover:text-white transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 text-sm font-semibold min-w-[24px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-slate-400 hover:text-white transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                      title="Remove product"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary & Coupon */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6 border border-slate-800/80 space-y-6 shadow-xl">
              <h2 className="text-lg font-bold font-display text-white border-b border-slate-900 pb-3">Order Summary</h2>

              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="font-semibold text-slate-200">{formatPrice(totals.subtotal)}</span>
                </div>

                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount {appliedCoupon ? `(${appliedCoupon.code})` : ''}</span>
                    <span>-{formatPrice(totals.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-slate-400">Shipping</span>
                  <span className="font-semibold text-slate-200">
                    {totals.shipping === 0 ? (
                      <span className="text-emerald-400">Free</span>
                    ) : (
                      formatPrice(totals.shipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Tax</span>
                  <span className="font-semibold text-slate-200">{formatPrice(totals.tax)}</span>
                </div>

                <div className="flex justify-between text-base font-bold border-t border-slate-900 pt-4 text-white">
                  <span>Total</span>
                  <span>{formatPrice(totals.total)}</span>
                </div>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2 border-t border-slate-900">
                <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold block">Have a Coupon?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="WELCOME10 / SAVE50"
                    className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-semibold"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="py-2 px-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition shrink-0 border border-slate-750"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-rose-400 font-medium">{couponError}</p>
                )}
                {appliedCoupon && (
                  <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg px-2.5 py-1.5 text-xs">
                    <span className="font-medium">Applied: {appliedCoupon.code}</span>
                    <button
                      type="button"
                      onClick={() => applyCoupon(null)}
                      className="text-slate-400 hover:text-white font-bold ml-2"
                    >
                      ×
                    </button>
                  </div>
                )}
              </form>

              <Link
                href="/checkout"
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-750 text-white font-semibold rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-950/20 text-sm"
              >
                <CreditCard className="w-4 h-4" />
                <span>Proceed to Checkout</span>
              </Link>
            </div>

            <div className="glass rounded-xl p-4 border border-slate-800/80 flex items-start space-x-3 text-xs text-slate-400">
              <Shield className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-350">Secure Shopping Promise</p>
                <p className="mt-0.5">Your personal data and payments are secured using premium modern encryption protocols.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
