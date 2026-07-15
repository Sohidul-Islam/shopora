import { db } from '../../../db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatPrice } from '../../../lib/utils';
import { Sparkles, Star, Award, ShieldCheck, Tag } from 'lucide-react';

export const revalidate = 60; // ISR validation

export default async function BrandLandingPage({ params }: { params: { slug: string } }) {
  // Query Brand
  const brand = await db.query.brands.findFirst({
    where: (brands, { eq }) => eq(brands.slug, params.slug),
  });

  if (!brand) {
    notFound();
  }

  // Query products matching this brand
  const brandProducts = await db.query.products.findMany({
    where: (products, { eq }) => eq(products.brandId, brand.id),
    with: {
      productImages: true,
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05060b] via-[#090b11] to-[#040508] py-16 px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Brand Hero Banner */}
      <div className="max-w-5xl mx-auto glass border border-slate-800/40 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl shadow-black/25 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 md:max-w-xl">
          <span className="inline-flex items-center space-x-2 py-1 px-3 bg-blue-500/10 border border-blue-500/25 rounded-full text-blue-400 text-xs font-semibold tracking-wider uppercase">
            <Award className="w-3.5 h-3.5" />
            <span>Official Brand Partner</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight leading-none">{brand.name}</h1>
          <p className="text-sm text-slate-400 leading-relaxed">Experience precision engineering and premium quality with our certified collection. All models are covered under official brand warranty logs.</p>
        </div>

        {brand.logoUrl && (
          <div className="w-32 h-32 bg-[#0c0f17] border border-slate-800/60 rounded-3xl p-4 flex items-center justify-center shrink-0">
            <img src={brand.logoUrl} alt={brand.name} className="max-w-full max-h-full object-contain rounded-xl" />
          </div>
        )}
      </div>

      {/* Brand Story block */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { title: 'Authorized Store', desc: 'Guaranteed 100% genuine products directly imported from official manufacturing centers.', icon: <ShieldCheck className="w-5 h-5 text-blue-400" /> },
          { title: 'Exclusive Releases', desc: 'Be the first to access limited-edition product drops and premium variant listings.', icon: <Sparkles className="w-5 h-5 text-purple-400" /> },
          { title: 'Promotional Offers', desc: 'Receive seasonal coupon codes and flat reward points on qualifying items.', icon: <Tag className="w-5 h-5 text-emerald-400" /> }
        ].map((item, idx) => (
          <div key={idx} className="glass border border-slate-800/40 rounded-2xl p-6 space-y-3">
            <div>{item.icon}</div>
            <h3 className="font-bold text-white text-base">{item.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Brand Products Listing */}
      <div className="max-w-5xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold font-display text-white tracking-tight">{brand.name} Collection</h2>
        
        {brandProducts.length === 0 ? (
          <div className="text-center py-16 glass rounded-3xl border border-slate-850">
            <p className="text-xs text-slate-400">No products found under this brand catalog.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {brandProducts.map((p) => {
              const image = p.productImages?.[0]?.url || '';
              return (
                <div key={p.id} className="glass border border-slate-800/40 rounded-3xl p-5 hover-premium flex flex-col justify-between space-y-4 shadow-lg shadow-black/10">
                  <div className="space-y-4">
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#0d0f17] border border-slate-850">
                      <img src={image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-white text-sm line-clamp-1">{p.name}</h3>
                      <p className="text-[10px] text-slate-500 font-extrabold">{p.sku}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                    <span className="text-sm font-extrabold text-white font-display">{formatPrice(p.salePrice || p.price)}</span>
                    <Link
                      href={`/products/${p.slug}`}
                      className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
