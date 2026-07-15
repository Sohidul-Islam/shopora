'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { formatPrice } from '../../../lib/utils';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

function PaymentMockContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const paymentId = searchParams.get('paymentId') || '';
  const amount = searchParams.get('amount') || '0';
  const gateway = searchParams.get('gateway') || 'stripe';

  const handleSimulate = async (status: 'SUCCESS' | 'FAILED') => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/payment/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId,
          transactionId: `${gateway.toUpperCase()}-SIM-${Date.now()}`,
          status,
          gateway: gateway.toUpperCase(),
          rawPayload: { simulated: true, method: gateway, timestamp: new Date() }
        })
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.error || 'Failed to process payment callback.');
      }

      // Redirect depending on success or failure status
      const orderSearch = await fetch(`/api/checkout`); // stub
      if (status === 'SUCCESS') {
        router.push(`/checkout/success?paymentId=${paymentId}`);
      } else {
        router.push(`/checkout/fail`);
      }
    } catch (err: any) {
      setError(err.message || 'Payment simulation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full glass rounded-2xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight">Shopora Payment Gateway</h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">{gateway} Simulator</p>
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800/80 mb-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Transaction Amount</span>
            <span className="font-bold text-white text-base">{formatPrice(amount)}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-slate-800 pt-3">
            <span className="text-slate-400">Merchant</span>
            <span className="text-slate-300">Shopora Enterprise</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Payment ID</span>
            <span className="text-slate-300 font-mono text-xs">{paymentId || 'N/A'}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3 flex items-start space-x-2 mb-6">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => handleSimulate('SUCCESS')}
            disabled={loading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/20"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Simulate Successful Payment</span>
          </button>

          <button
            onClick={() => handleSimulate('FAILED')}
            disabled={loading}
            className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 disabled:opacity-50 text-white font-semibold rounded-xl transition flex items-center justify-center space-x-2"
          >
            <AlertTriangle className="w-5 h-5" />
            <span>Simulate Failed Payment</span>
          </button>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Secured by Shopora mock SSL connection. No real money will be charged.
        </p>
      </div>
    </div>
  );
}

export default function PaymentMockPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">Loading gateway...</div>}>
      <PaymentMockContent />
    </Suspense>
  );
}
