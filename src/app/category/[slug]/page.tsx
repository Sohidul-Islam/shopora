import { db } from '../../../db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatPrice } from '../../../lib/utils';
import { LayoutGrid, ArrowRight, HelpCircle } from 'lucide-react';

export const revalidate = 60; // ISR validation

export default async function CategoryLandingPage({ params }: { params: { slug: string } }) {
  // Query Category
  const category = await db.query.categories.findFirst({
    where: (categories, { eq }) => eq(categories.slug, params.slug),
  });

  if (!category) {
    notFound();
  }

  // Query products belonging to this category
  const productCategoriesList = await db.query.productCategories.findMany({
    where: (productCategories, { eq }) => eq(productCategories.categoryId, category.id),
    with: {
      product: {
        with: {
          productImages: true,
          brand: true,
        }
      }
    }
  });

  const categoryProducts = productCategoriesList.map((pc) => pc.product).filter(Boolean);

  // Mock Buying Guide FAQs
  const guideFaqs = [
    { q: `How do I choose the best ${category.name}?`, a: 'Focus on your specific use cases, key performance parameters, and dimensions before making a final choice.' },
    { q: 'Is there a product warranty included?', a: 'Yes, all electronic devices and premium apparel items are backed by our comprehensive manufacturer warranty logs.' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05060b] via-[#090b11] to-[#040508] py-16 px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Category Hero Header */}
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <span className="inline-flex items-center space-x-2 py-1 px-3 bg-blue-500/10 border border-blue-500/25 rounded-full text-blue-400 text-xs font-semibold tracking-wider uppercase">
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Category Board</span>
        </span>
        <h1 className="text-4xl sm:text-6xl font-black font-display text-white tracking-tight leading-none uppercase">{category.name}</h1>
        <p className="max-w-2xl mx-auto text-slate-400 text-xs sm:text-sm">
          Browse our curated select models of {category.name.toLowerCase()} featuring elite specifications, verified customer reviews, and promo coupon discounts.
        </p>
      </div>

      {/* Product Showcase Grid */}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold font-display text-white">Featured Products</h2>
          <span className="text-xs text-slate-500 font-extrabold uppercase">{categoryProducts.length} Results</span>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="text-center py-16 glass rounded-3xl border border-slate-850">
            <p className="text-xs text-slate-400">No products categorized here yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {categoryProducts.map((p) => {
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
                      Shop Now
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Buying Guide FAQs */}
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold font-display text-white text-center">Category Buying Guide</h2>
        <div className="space-y-4">
          {guideFaqs.map((faq, idx) => (
            <div key={idx} className="glass border border-slate-800/40 rounded-2xl p-6 space-y-2">
              <h4 className="font-bold text-white text-sm flex items-center">
                <HelpCircle className="w-4 h-4 text-blue-400 mr-2 shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed pl-6 border-l border-slate-900">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
