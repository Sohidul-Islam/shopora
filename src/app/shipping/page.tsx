import Link from 'next/link';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-[#05060b] via-[#090b11] to-[#040508] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto glass border border-slate-800/40 rounded-3xl p-8 sm:p-12 space-y-6 shadow-xl shadow-black/35">
        <div className="space-y-2">
          <h1 className="text-3xl font-black font-display text-white tracking-tight">Shipping Policy</h1>
          <p className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">Last Updated: July 15, 2026</p>
        </div>

        <div className="text-sm text-slate-400 leading-relaxed space-y-6 pt-4 border-t border-slate-900">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-display">1. Order Processing Times</h2>
            <p>Orders are dispatched from our fulfillment warehouses within 1–2 business days of payment validation. Processing occurs Monday through Friday, excluding national holidays.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-display">2. Delivery Estimates & Methods</h2>
            <p>We utilize leading express logistics providers. Standard shipping delivery timelines range from 3–5 business days depending on location. Express courier delivery takes 1–2 business days.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-display">3. Shipping Rates & Free Shipping</h2>
            <p>Flat-rate shipping charges are calculated at checkout. We provide free standard shipping for all order values exceeding $150.00.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-display">4. Tracking & Delivery Confirmation</h2>
            <p>Upon order dispatch, you will receive an email confirmation containing secure tracking numbers. Customers are responsible for verifying accurate delivery coordinates during checkout.</p>
          </section>
        </div>

        <div className="pt-6 border-t border-slate-900 flex justify-end">
          <Link href="/products" className="text-xs uppercase tracking-wider font-extrabold text-blue-400 hover:text-white transition">
            Return to Catalogue &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
