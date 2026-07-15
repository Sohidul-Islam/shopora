import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-[#05060b] via-[#090b11] to-[#040508] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto glass border border-slate-800/40 rounded-3xl p-8 sm:p-12 space-y-6 shadow-xl shadow-black/35">
        <div className="space-y-2">
          <h1 className="text-3xl font-black font-display text-white tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">Last Updated: July 15, 2026</p>
        </div>
        
        <div className="text-sm text-slate-400 leading-relaxed space-y-6 pt-4 border-t border-slate-900">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-display">1. Information We Collect</h2>
            <p>We collect information you provide directly to us when creating an account, making a purchase, subscribing to our newsletter, or contacting customer support. This includes your name, email address, shipping address, billing address, phone number, and payment credentials.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-display">2. How We Use Your Information</h2>
            <p>We use your information to process transactions, manage accounts, improve our storefront experience, deliver targeted marketing campaigns, and ensure security compliance across our SaaS-grade infrastructure.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-display">3. Information Sharing & Third Parties</h2>
            <p>Shopora does not sell your personal data. We only share information with verified third-party partners (such as payment processors and logistics networks) necessary to fulfill orders and services.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white font-display">4. Your Data Protection Rights</h2>
            <p>Depending on your location, you have rights to access, correct, delete, or limit the processing of your personal data. Contact our privacy team at privacy@shopora.com for requests.</p>
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
