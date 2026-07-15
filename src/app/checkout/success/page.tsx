'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStore } from '../../../store/useStore';
import { useEffect, Suspense } from 'react';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const clearCart = useStore((state) => state.clearCart);

  useEffect(() => {
    // Clear storefront cart after successful order placement
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full glass rounded-2xl p-8 border border-slate-800 text-center shadow-2xl space-y-6">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto border border-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-display text-white">Order Placed Successfully!</h1>
          <p className="text-slate-400 text-sm">
            Thank you for your purchase. Your payment has been confirmed and we are processing your order.
          </p>
        </div>

        {searchParams.get('paymentId') && (
          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 max-w-xs mx-auto">
            <span className="text-xs text-slate-500 block mb-1">PAYMENT REFERENCE</span>
            <span className="font-mono text-sm text-slate-300 block break-all">{searchParams.get('paymentId')}</span>
          </div>
        )}

        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-950/20 text-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
          <Link
            href="/admin"
            className="flex-1 py-3 px-4 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium rounded-xl transition flex items-center justify-center space-x-2 text-sm"
          >
            <span>Manage Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
