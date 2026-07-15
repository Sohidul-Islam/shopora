import { db } from '../../../db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const revalidate = 10; // ISR for live-updated pages

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
    <div className="min-h-screen bg-gradient-to-b from-[#05060b] via-[#090b11] to-[#040508] py-16 px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="max-w-4xl mx-auto space-y-12">
        {blocks.map((block, index) => {
          if (block.type === 'hero') {
            return (
              <div 
                key={index} 
                className="glass border border-slate-800/40 rounded-3xl p-8 sm:p-16 text-center space-y-6 relative overflow-hidden shadow-xl shadow-black/25"
              >
                <div className="space-y-4">
                  <span className="inline-flex items-center space-x-2 py-1 px-3 bg-blue-500/10 border border-blue-500/25 rounded-full text-blue-400 text-xs font-semibold tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Special Event</span>
                  </span>
                  <h1 className="text-4xl sm:text-6xl font-black font-display text-white tracking-tight leading-none">
                    {block.title}
                  </h1>
                  <p className="max-w-2xl mx-auto text-slate-400 text-sm sm:text-base leading-relaxed">
                    {block.subtitle}
                  </p>
                </div>
                {block.buttonText && (
                  <Link 
                    href={block.buttonUrl || '/products'} 
                    className="inline-block py-3 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-blue-900/20"
                  >
                    {block.buttonText}
                  </Link>
                )}
              </div>
            );
          }

          if (block.type === 'features') {
            return (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {block.items?.map((item: string, idx: number) => (
                  <div key={idx} className="glass border border-slate-800/40 rounded-2xl p-6 flex items-start space-x-3.5 shadow-lg shadow-black/10">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-300 font-semibold leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
