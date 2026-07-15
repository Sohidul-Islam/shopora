import { db } from '../../../db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, CheckCircle2, Star, ShieldCheck, Truck, 
  RefreshCcw, HelpCircle, ShoppingBag, Flame, Award, ChevronRight 
} from 'lucide-react';

export const revalidate = 10; // ISR validation

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await db.query.landingPages.findFirst({
    where: (landingPages, { eq }) => eq(landingPages.url, params.slug),
  });

  if (!page || page.status !== 'PUBLISHED') return {};

  return {
    title: page.seoTitle || page.title,
    description: page.metaDescription || '',
    keywords: page.keywords || '',
    alternates: {
      canonical: page.canonicalUrl || undefined,
    },
    openGraph: {
      title: page.title,
      description: page.metaDescription || '',
      images: page.ogImage ? [page.ogImage] : [],
    },
  };
}

export default async function CustomLandingPage({ params }: { params: { slug: string } }) {
  // Query custom page builder entry
  const page = await db.query.landingPages.findFirst({
    where: (landingPages, { eq }) => eq(landingPages.url, params.slug),
  });

  if (!page || page.status !== 'PUBLISHED') {
    notFound();
  }

  // Parse blocks
  let blocks: any[] = [];
  try {
    blocks = JSON.parse(page.content);
  } catch (e) {
    blocks = [];
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05060b] via-[#090b11] to-[#040508] py-16 px-4 sm:px-6 lg:px-8 space-y-20">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {blocks.map((block, index) => {
          
          // 1. PRODUCT-CENTRIC HERO BLOCK
          if (block.type === 'hero') {
            return (
              <div 
                key={index} 
                className="glass border border-slate-800/40 rounded-3xl p-8 sm:p-12 shadow-xl shadow-black/25 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden"
              >
                <div className="space-y-6 md:max-w-xl text-left">
                  <span className="inline-flex items-center space-x-2 py-1 px-3 bg-blue-500/10 border border-blue-500/25 rounded-full text-blue-400 text-xs font-semibold tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{block.tag || 'Special Launch'}</span>
                  </span>
                  <h1 className="text-4xl sm:text-6xl font-black font-display text-white tracking-tight leading-none uppercase">
                    {block.title}
                  </h1>
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                    {block.subtitle}
                  </p>
                  
                  {block.buttonText && (
                    <div className="pt-2">
                      <Link 
                        href={block.buttonUrl || '#sales-section'} 
                        className="inline-flex items-center space-x-2 py-3.5 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-blue-900/20"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>{block.buttonText}</span>
                      </Link>
                    </div>
                  )}
                </div>

                {block.imageUrl && (
                  <div className="w-full md:w-[45%] aspect-square rounded-2xl overflow-hidden bg-[#0d0f17] border border-slate-850 shadow-md">
                    <img src={block.imageUrl} alt={block.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            );
          }

          // 2. PRODUCT STORY & BENEFITS BLOCK
          if (block.type === 'benefits') {
            return (
              <div key={index} className="space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight uppercase">{block.heading || 'Why This Product Matters'}</h2>
                  <p className="text-xs text-slate-400">{block.subheading || 'Engineered to solve your primary pain points and optimize your lifestyle.'}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {block.items?.map((item: any, idx: number) => (
                    <div key={idx} className="glass border border-slate-800/40 rounded-2xl p-6 space-y-3 shadow-lg shadow-black/10">
                      <div className="p-2 w-fit bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-white text-base">{item.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // 3. PRODUCT FEATURE SHOWCASE
          if (block.type === 'features') {
            return (
              <div key={index} className="space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight uppercase">{block.heading || 'Key Feature Specifications'}</h2>
                  <p className="text-xs text-slate-400">Everything you need is included in this premium product layout.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {block.items?.map((feat: any, idx: number) => (
                    <div key={idx} className="glass border border-slate-800/40 rounded-2xl p-5 flex items-start space-x-4 shadow-lg shadow-black/10">
                      <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-sm">{feat.title || feat}</h4>
                        {feat.desc && <p className="text-xs text-slate-450 leading-relaxed text-slate-400">{feat.desc}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // 4. CUSTOMER TESTIMONIALS BLOCK
          if (block.type === 'testimonials') {
            return (
              <div key={index} className="space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight uppercase">{block.heading || 'Verified User Feedback'}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {block.items?.map((rev: any, idx: number) => (
                    <div key={idx} className="glass border border-slate-800/40 rounded-2xl p-6 space-y-4 shadow-lg shadow-black/10">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white text-xs">{rev.name}</span>
                        <div className="flex space-x-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 italic leading-relaxed">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // 5. PRODUCT SALES BOTTOM BLOCK (ENHANCEMENT)
          if (block.type === 'sales') {
            return (
              <div 
                key={index} 
                id="sales-section"
                className="glass border border-blue-900/35 bg-blue-950/5 rounded-3xl p-8 sm:p-12 shadow-xl shadow-black/25 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
              >
                <div className="space-y-6 md:max-w-xl text-left">
                  <div className="space-y-2">
                    <span className="inline-flex items-center space-x-2 py-1 px-3 bg-rose-500/10 border border-rose-500/25 rounded-full text-rose-500 text-xs font-semibold tracking-wider uppercase">
                      <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
                      <span>{block.tag || 'Special Offer'}</span>
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight leading-none uppercase">
                      {block.title || 'Get Yours Today'}
                    </h2>
                  </div>

                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {block.subtitle || 'Order now and receive free express shipping, a 30-day moneyback guarantee, and official manufacturer warranty logs.'}
                  </p>

                  <div className="flex items-baseline space-x-3">
                    <span className="text-3xl font-black text-white font-display">{block.price || '$149.99'}</span>
                    {block.oldPrice && <span className="text-sm text-slate-500 line-through">{block.oldPrice}</span>}
                  </div>

                  {block.buttonText && (
                    <div className="pt-2">
                      <Link 
                        href={block.buttonUrl || '/products'} 
                        className="inline-flex items-center space-x-2 py-3.5 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-blue-900/20"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>{block.buttonText}</span>
                      </Link>
                    </div>
                  )}

                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-900 text-center">
                    <div className="p-2.5 bg-slate-900/40 rounded-xl space-y-1">
                      <Truck className="w-4 h-4 mx-auto text-blue-400" />
                      <span className="text-[9px] text-slate-400 font-extrabold block">Free Express Delivery</span>
                    </div>
                    <div className="p-2.5 bg-slate-900/40 rounded-xl space-y-1">
                      <ShieldCheck className="w-4 h-4 mx-auto text-emerald-400" />
                      <span className="text-[9px] text-slate-400 font-extrabold block">Secure Checkout</span>
                    </div>
                    <div className="p-2.5 bg-slate-900/40 rounded-xl space-y-1">
                      <RefreshCcw className="w-4 h-4 mx-auto text-purple-400" />
                      <span className="text-[9px] text-slate-400 font-extrabold block">30-Day Returns</span>
                    </div>
                  </div>
                </div>

                {block.imageUrl && (
                  <div className="w-full md:w-[40%] aspect-square rounded-2xl overflow-hidden bg-[#0d0f17] border border-slate-850 shadow-md">
                    <img src={block.imageUrl} alt={block.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            );
          }

          // 6. FAQ ACCORDION BLOCK
          if (block.type === 'faq') {
            return (
              <div key={index} className="space-y-6 max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold font-display text-white text-center uppercase">{block.heading || 'Frequently Asked Questions'}</h2>
                <div className="space-y-4">
                  {block.items?.map((item: any, idx: number) => (
                    <div key={idx} className="glass border border-slate-800/40 rounded-2xl p-6 space-y-2">
                      <h4 className="font-bold text-white text-sm flex items-center">
                        <HelpCircle className="w-4 h-4 text-blue-400 mr-2 shrink-0" />
                        <span>{item.q}</span>
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed pl-6 border-l border-slate-900">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })}

      </div>
    </div>
  );
}
