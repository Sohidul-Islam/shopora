'use client';

import Link from 'next/link';
import { XCircle, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CheckoutFailPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full glass rounded-2xl p-8 border border-slate-800 text-center shadow-2xl space-y-6">
        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-400 mx-auto border border-rose-500/20">
          <XCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-display text-white">Payment Failed</h1>
          <p className="text-slate-400 text-sm">
            We could not complete your payment transaction. Please verify your payment details and try again.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <Link
            href="/cart"
            className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-350 border border-slate-750 font-medium rounded-xl transition flex items-center justify-center space-x-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Cart</span>
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition flex items-center justify-center space-x-2 text-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
