import { db } from '../../db';
import { HelpCircle } from 'lucide-react';

export const revalidate = 60; // Revalidate every 60 seconds (Incremental Static Regeneration)

export default async function FaqPage() {
  // Query FAQs directly from database inside Next.js Server Component
  const faqsList = await db.query.faqs.findMany({
    orderBy: (faqs, { asc }) => [asc(faqs.sortOrder)],
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05060b] via-[#090b11] to-[#040508] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center space-x-2 py-1 px-3 bg-blue-500/10 border border-blue-500/25 rounded-full text-blue-400 text-xs font-semibold tracking-wider uppercase">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support Board</span>
          </span>
          <h1 className="text-4xl font-black font-display text-white tracking-tight leading-none">Frequently Asked Questions</h1>
          <p className="text-sm text-slate-450 max-w-xl mx-auto text-slate-400">Everything you need to know about our products, express logistics, custom coupons, and return policies.</p>
        </div>

        {/* FAQs list */}
        {faqsList.length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl border border-slate-800/40">
            <p className="text-slate-450 text-sm">No FAQs defined in the Admin panel yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqsList.map((faq) => (
              <div key={faq.id} className="glass border border-slate-800/40 rounded-3xl p-6 sm:p-8 space-y-3 shadow-lg shadow-black/10 hover:border-slate-800 transition duration-300">
                <h3 className="font-bold text-white text-base font-display flex items-start">
                  <span className="text-blue-400 mr-2">Q:</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed pl-6 border-l border-slate-900">{faq.answer}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
