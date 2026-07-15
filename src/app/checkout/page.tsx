'use client';

import { useStore, getCartTotals } from '../../store/useStore';
import { formatPrice } from '../../lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ShieldCheck, Truck, CreditCard, ChevronLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, appliedCoupon, user } = useStore();
  const totals = getCartTotals(useStore.getState());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || '');
  const [addressLine1, setAddressLine1] = useState('123 Enterprise Way');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('California');
  const [postalCode, setPostalCode] = useState('94107');
  const [country, setCountry] = useState('United States');
  const [gateway, setGateway] = useState<'COD' | 'STRIPE' | 'PAYPAL' | 'SSLCOMMERZ'>('STRIPE');

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    setError('');

    try {
      // 1. Submit to checkout endpoint
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          customerEmail: email,
          customerName: name,
          shippingAddressId: 'mock-address-id-123',
          billingAddressId: 'mock-address-id-123',
          couponCode: appliedCoupon?.code,
          items: cart.map(item => ({
            productVariantId: item.id,
            quantity: item.quantity
          })),
          paymentGateway: gateway
        })
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.error || 'Something went wrong during checkout.');
      }

      // 2. Redirect to payment session URL (which redirects to our mock payment sandbox screen)
      if (res.paymentUrl) {
        router.push(res.paymentUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Checkout failed.');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <p>No items in cart to checkout.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/cart" className="inline-flex items-center text-xs text-slate-400 hover:text-white transition space-x-1 uppercase tracking-wider font-semibold">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Checkout Form */}
          <form onSubmit={handleCheckoutSubmit} className="lg:col-span-7 space-y-6">
            {/* Contact Info */}
            <div className="glass rounded-2xl p-6 border border-slate-800/80 space-y-4">
              <h2 className="text-lg font-bold font-display text-white border-b border-slate-900 pb-3 flex items-center space-x-2">
                <span>Contact Information</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="glass rounded-2xl p-6 border border-slate-800/80 space-y-4">
              <h2 className="text-lg font-bold font-display text-white border-b border-slate-900 pb-3 flex items-center space-x-2">
                <Truck className="w-5 h-5 text-blue-400" />
                <span>Shipping Address</span>
              </h2>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold block">Street Address</label>
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold block">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold block">State / Region</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold block">Postal / Zip Code</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold block">Country</label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="glass rounded-2xl p-6 border border-slate-800/80 space-y-4">
              <h2 className="text-lg font-bold font-display text-white border-b border-slate-900 pb-3 flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                <span>Payment Method</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'STRIPE', name: 'Credit Card (Stripe)', desc: 'Secure credit card checkout' },
                  { id: 'PAYPAL', name: 'PayPal Express', desc: 'Direct PayPal redirect transfer' },
                  { id: 'SSLCOMMERZ', name: 'SSLCommerz', desc: 'Regional debit & mobile banking' },
                  { id: 'COD', name: 'Cash on Delivery (COD)', desc: 'Pay when products arrive' }
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start p-4 rounded-xl border cursor-pointer transition select-none ${
                      gateway === item.id
                        ? 'border-blue-500 bg-blue-500/5'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="gateway"
                      value={item.id}
                      checked={gateway === item.id}
                      onChange={() => setGateway(item.id as any)}
                      className="mt-1 mr-3 accent-blue-500"
                    />
                    <div>
                      <span className="font-semibold text-sm text-white block">{item.name}</span>
                      <span className="text-xs text-slate-400 mt-0.5 block">{item.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl p-4 flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center justify-center space-x-3 shadow-xl shadow-blue-950/20 text-base"
            >
              <span>{loading ? 'Processing...' : `Pay ${formatPrice(totals.total)}`}</span>
            </button>
          </form>

          {/* Checkout Sidebar Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass rounded-2xl p-6 border border-slate-800/80 space-y-5">
              <h2 className="text-base font-bold font-display text-white border-b border-slate-900 pb-3">Review Items</h2>
              <div className="max-h-64 overflow-y-auto space-y-4 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-800">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-200 block max-w-[180px] truncate">{item.name}</span>
                        <span className="text-xs text-slate-400 block font-mono">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-semibold text-slate-250 shrink-0">
                      {formatPrice(Number(item.salePrice !== null ? item.salePrice : item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3.5 text-sm border-t border-slate-900 pt-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="font-semibold text-slate-200">{formatPrice(totals.subtotal)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Discount</span>
                    <span>-{formatPrice(totals.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Shipping</span>
                  <span className="font-semibold text-slate-200">
                    {totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tax</span>
                  <span className="font-semibold text-slate-200">{formatPrice(totals.tax)}</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t border-slate-900 pt-3.5 text-white">
                  <span>Grand Total</span>
                  <span>{formatPrice(totals.total)}</span>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-4 border border-slate-800/80 flex items-start space-x-3 text-xs text-slate-500">
              <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
              <span>
                By completing checkout, you acknowledge that you are using a secure, premium, sandbox-based e-commerce adapter system.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
