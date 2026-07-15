import Link from 'next/link';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-[#05060b] via-[#090b11] to-[#040508] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto glass border border-slate-800/40 rounded-3xl p-8 sm:p-12 space-y-6 shadow-xl shadow-black/35">
        <div className="space-y-2">
          <h1 className="text-3xl font-black font-display text-white tracking-tight">Refund Policy</h1>
          <p className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">Last Updated: July 15, 2026</p>
        </div>

        <div className="text-sm text-slate-400 leading-relaxed space-y-6 pt-4 border-t border-slate-900">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-display">1. 30-Day Moneyback Guarantee</h2>
            <p>We want you to be fully satisfied with your purchase. You can return any unopened, unused items in their original packaging within 30 days of shipment delivery for a full refund or exchange.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-display">2. Return Eligibility Requirements</h2>
            <p>To be eligible for a refund, the product must be in pristine condition, containing all original documentation, accessories, labels, and packaging. Items showing physical signs of wear, liquid damage, or cosmetic scratches are not eligible.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-display">3. Processing Refunds</h2>
            <p>Once your returned package is received and audited by our warehouse team, we will process the refund to your original payment method (e.g. credit card/payment token) within 5–7 business days.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-display">4. Shipping Charges</h2>
            <p>Original shipping charges are non-refundable unless the return is due to a manufacturer defect or fulfillment error by Shopora. Return transit shipping costs are the responsibility of the customer.</p>
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
