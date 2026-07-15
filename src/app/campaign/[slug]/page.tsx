import { db } from '../../../db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatPrice } from '../../../lib/utils';
import Countdown from '../../../components/Countdown';
import { Flame, Copy, Gift, HelpCircle } from 'lucide-react';

export const revalidate = 10; // ISR with short window for live campaigns

export default async function CampaignPage({ params }: { params: { slug: string } }) {
  // Query Campaign
  const campaign = await db.query.campaigns.findFirst({
    where: (campaigns, { eq }) => eq(campaigns.slug, params.slug),
  });

  if (!campaign || campaign.status !== 'ACTIVE') {
    notFound();
  }

  // Query products to display on this campaign page
  const products = await db.query.products.findMany({
    with: {
      productImages: true,
      brand: true
    },
    limit: 6
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05060b] via-[#090b11] to-[#040508] py-16 px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Campaign Banner & Timer Header */}
      <div className="max-w-5xl mx-auto glass border border-slate-800/40 rounded-3xl overflow-hidden relative shadow-2xl shadow-black/35 flex flex-col md:flex-row items-stretch min-h-[350px]">
        
        {/* Banner Details */}
        <div className="p-8 sm:p-12 flex-1 flex flex-col justify-between space-y-8 z-10 bg-slate-950/20 backdrop-blur-[1px]">
          <div className="space-y-4">
            <span className="inline-flex items-center space-x-2 py-1 px-3 bg-rose-500/10 border border-rose-500/25 rounded-full text-rose-500 text-xs font-semibold tracking-wider uppercase animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Limited Time Promotion</span>
            </span>
            <h1 className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight leading-none uppercase">{campaign.title}</h1>
            <p className="text-xs sm:text-sm text-slate-450 leading-relaxed max-w-lg text-slate-400">{campaign.promoContent}</p>
          </div>

          {/* Countdown timer */}
          {campaign.countdownEnd && (
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">Offers End In:</span>
              <Countdown endTime={new Date(campaign.countdownEnd).toISOString()} />
            </div>
          )}
        </div>

        {/* Banner Image */}
        {campaign.bannerUrl && (
          <div className="w-full md:w-[40%] relative min-h-[200px] md:min-h-auto">
            <img src={campaign.bannerUrl} alt={campaign.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#05060b] via-transparent to-transparent" />
          </div>
        )}
      </div>

      {/* Coupon banner block */}
      {campaign.couponCode && (
        <div className="max-w-5xl mx-auto glass border border-blue-900/35 bg-blue-950/5 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-lg shadow-black/10">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/15 border border-blue-500/20 rounded-2xl text-blue-400">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Save extra with code: <span className="text-blue-400 font-black">{campaign.couponCode}</span></h3>
              <p className="text-xs text-slate-400">Copy and paste this code at checkout to claim your promotional discount.</p>
            </div>
          </div>

          <button 
            onClick={() => {
              navigator.clipboard.writeText(campaign.couponCode || '');
              alert('Coupon code copied to clipboard!');
            }}
            className="flex items-center justify-center space-x-2 py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-blue-900/20 w-fit self-end sm:self-center"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Code</span>
          </button>
        </div>
      )}

      {/* Campaign Product Catalog */}
      <div className="max-w-5xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold font-display text-white tracking-tight">Campaign Exclusive Deals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {products.map((p) => {
            const image = p.productImages?.[0]?.url || '';
            return (
              <div key={p.id} className="glass border border-slate-800/40 rounded-3xl p-5 hover-premium flex flex-col justify-between space-y-4 shadow-lg shadow-black/10">
                <div className="space-y-4">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#0d0f17] border border-slate-850">
                    <img src={image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-blue-400 font-extrabold">{p.brand?.name || 'Shopora'}</span>
                    <h3 className="font-bold text-white text-sm line-clamp-1">{p.name}</h3>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                  <span className="text-sm font-extrabold text-white font-display">{formatPrice(p.salePrice || p.price)}</span>
                  <Link
                    href={`/products/${p.slug}`}
                    className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition"
                  >
                    Get Deal
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
