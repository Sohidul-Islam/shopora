import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-[#fafafa] via-[#fafafa] to-purple-50/20 dark:from-[#05060b] dark:via-[#090b11] dark:to-[#040508] py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#0c0d15] border border-black/5 dark:border-slate-800/40 rounded-3xl p-8 sm:p-12 space-y-6 shadow-xl dark:shadow-2xl">
        <div className="space-y-2">
          <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">Terms & Conditions</h1>
          <p className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">Last Updated: July 15, 2026</p>
        </div>

        <div className="text-sm text-slate-605 dark:text-slate-400 leading-relaxed space-y-6 pt-4 border-t border-slate-100 dark:border-slate-900">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">1. Agreement to Terms</h2>
            <p>By accessing or using Shopora’s e-commerce platform and marketing landing pages, you agree to comply with and be bound by these Terms of Service. If you do not agree, please cease using our services immediately.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">2. Intellectual Property</h2>
            <p>All design systems, source code, visual components, logos, brand content, and landing page templates are the exclusive property of Shopora or licensed partners. Unauthorized duplication is strictly prohibited.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">3. Purchases & Billing</h2>
            <p>You agree to provide accurate, complete purchase and account information for all transactions. We reserve the right to refuse or cancel orders due to catalog errors, stock limits, or suspected fraud.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">4. Limitation of Liability</h2>
            <p>Shopora is provided "as is". In no event shall we be liable for indirect, incidental, or consequential damages arising from database disruptions, inventory discrepancies, or payment adapter simulation failures.</p>
          </section>
        </div>

        <div className="pt-6 border-t border-slate-105 dark:border-slate-900 flex justify-end">
          <Link href="/products" className="text-xs uppercase tracking-wider font-extrabold text-purple-600 dark:text-blue-400 hover:opacity-80 transition">
            Return to Catalogue &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
