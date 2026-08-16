import { db } from '../../../db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, User, Clock, ArrowLeft, Share2, AlertCircle, ExternalLink, ShoppingBag } from 'lucide-react';
import { CmsBlock } from '../../../components/admin/CmsSectionBuilder';
import { formatPrice } from '../../../lib/utils';

export const revalidate = 60; // ISR validation

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await db.query.blogPosts.findFirst({
    where: (blogPosts, { eq }) => eq(blogPosts.slug, params.slug),
  });

  if (!post) return {};

  const cleanDesc = post.content.replace(/<[^>]*>/g, '').substring(0, 150);

  return {
    title: `${post.title} | Shopora Blog`,
    description: cleanDesc,
    openGraph: {
      title: post.title,
      description: cleanDesc,
      images: [post.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600'],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await db.query.blogPosts.findFirst({
    where: (blogPosts, { eq }) => eq(blogPosts.slug, params.slug),
  });

  if (!post) {
    notFound();
  }

  // Parse JSON content blocks if applicable
  let blocks: CmsBlock[] = [];
  let isJsonContent = false;

  try {
    if (post.content && post.content.startsWith('[')) {
      blocks = JSON.parse(post.content);
      isJsonContent = true;
    }
  } catch (e) {
    isJsonContent = false;
  }

  // Read time & date formatting
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Recent Post';

  return (
    <article className="min-h-screen bg-[#fafafa] dark:bg-[#05060b] text-slate-800 dark:text-slate-100 font-sans py-12 px-6 sm:px-12 lg:px-24 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-purple-650 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Articles</span>
          </Link>
          <button
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition shadow-sm"
            title="Share Article"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Article Meta Header */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-4 text-xs text-purple-600 dark:text-purple-400 font-extrabold uppercase tracking-widest">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime || '5 min read'}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-center sm:justify-start space-x-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-purple-650 text-white flex items-center justify-center font-bold text-sm shadow-md">
              {(post.authorName || 'Shopora Editorial').charAt(0)}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">{post.authorName || 'Shopora Editorial'}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Senior Product Strategist</span>
            </div>
          </div>
        </div>

        {/* Featured Banner Image */}
        {post.imageUrl && (
          <div className="aspect-video w-full rounded-3xl overflow-hidden border border-black/5 dark:border-slate-800/60 shadow-2xl">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Article Content Render */}
        <div className="space-y-8 pt-4">
          {isJsonContent ? (
            blocks.map((block) => (
              <div key={block.id} className="space-y-4">
                {block.type === 'product_card' && (
                  <div className="my-6 bg-slate-50 dark:bg-[#0a0b12] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                    <div className="flex items-center space-x-5">
                      <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center p-3 shrink-0 shadow-md">
                        <img src={block.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200'} alt={block.productName || 'Product'} className="w-full h-full object-contain" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider">Featured Store Product</span>
                        <h4 className="text-lg font-black text-slate-900 dark:text-white line-clamp-1">{block.productName || 'Sample Product'}</h4>
                        <p className="text-base font-black text-slate-900 dark:text-white">{formatPrice(block.productPrice || '29.99')}</p>
                      </div>
                    </div>
                    <Link
                      href={block.buttonUrl || `/products/${block.productSlug || ''}`}
                      target={block.openInNewTab ? '_blank' : '_self'}
                      className="w-full sm:w-auto px-7 py-4 bg-purple-650 dark:bg-purple-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-purple-650/25 hover:bg-purple-700 transition flex items-center justify-center space-x-2 shrink-0"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{block.buttonText || 'View Product Details'}</span>
                    </Link>
                  </div>
                )}

                {block.type === 'button_cta' && (
                  <div
                    className="py-3"
                    style={{
                      display: 'flex',
                      justifyContent: block.align === 'center' ? 'center' : block.align === 'right' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <a
                      href={block.buttonUrl || '#'}
                      target={block.openInNewTab ? '_blank' : '_self'}
                      rel={block.openInNewTab ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center space-x-2 py-4 px-8 bg-purple-650 dark:bg-purple-600 hover:bg-purple-700 text-white font-black text-sm rounded-2xl transition shadow-xl shadow-purple-650/25 group"
                    >
                      <span>{block.buttonText || 'Click Here'}</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                    </a>
                  </div>
                )}

                {block.type === 'heading' && (
                  <div className="pt-3">
                    {block.headingLevel === 'h1' && <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{block.content}</h1>}
                    {block.headingLevel === 'h2' && <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{block.content}</h2>}
                    {block.headingLevel === 'h3' && <h3 className="text-xl font-bold text-slate-900 dark:text-white">{block.content}</h3>}
                  </div>
                )}

                {block.type === 'text' && (
                  <div
                    className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed space-y-3"
                    style={{ textAlign: block.align || 'left' }}
                    dangerouslySetInnerHTML={{ __html: block.content || '' }}
                  />
                )}

                {block.type === 'image' && block.imageUrl && (
                  <div className="space-y-2">
                    <div className="aspect-video w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800/80 shadow-lg">
                      <img src={block.imageUrl} alt={block.caption || 'Article illustration'} className="w-full h-full object-cover" />
                    </div>
                    {block.caption && <p className="text-xs text-center text-slate-500 dark:text-slate-400 italic">{block.caption}</p>}
                  </div>
                )}

                {block.type === 'split_image_text' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-2">
                    {block.imagePosition === 'left' && (
                      <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
                        <img src={block.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600'} alt="Split section" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="text-slate-700 dark:text-slate-300 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: block.content || '' }} />
                    {block.imagePosition === 'right' && (
                      <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
                        <img src={block.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600'} alt="Split section" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                )}

                {block.type === 'banner' && (
                  <Link
                    href={block.bannerUrl || '#'}
                    target={block.openInNewTab ? '_blank' : '_self'}
                    className="block relative rounded-3xl overflow-hidden aspect-[21/9] bg-slate-900 flex items-center justify-center p-8 text-center text-white my-4 shadow-xl group hover:shadow-2xl transition duration-300"
                  >
                    {block.imageUrl && <img src={block.imageUrl} alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition duration-500" />}
                    <div className="relative z-10 space-y-3">
                      <h2 className="text-2xl sm:text-4xl font-black">{block.bannerTitle || 'Featured Section Banner'}</h2>
                      {block.bannerSubtitle && <p className="text-sm opacity-90 max-w-xl mx-auto">{block.bannerSubtitle}</p>}
                    </div>
                  </Link>
                )}

                {block.type === 'quote' && (
                  <blockquote className="p-6 bg-purple-500/10 dark:bg-purple-950/30 border-l-4 border-purple-650 rounded-r-2xl space-y-2 my-4">
                    <p className="text-lg font-bold italic text-slate-900 dark:text-white">"{block.content}"</p>
                    {block.quoteAuthor && <footer className="text-xs font-bold text-purple-600 dark:text-purple-400">— {block.quoteAuthor}</footer>}
                  </blockquote>
                )}

                {block.type === 'callout' && (
                  <div className={`p-4 rounded-2xl border flex items-start space-x-3 text-sm my-4 ${
                    block.calloutType === 'warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300' :
                    block.calloutType === 'tip' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' :
                    'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300'
                  }`}>
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div dangerouslySetInnerHTML={{ __html: block.content || '' }} />
                  </div>
                )}

                {/* Table Render */}
                {block.type === 'table' && (
                  <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm my-4">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white font-extrabold uppercase text-xs">
                        <tr>
                          {(block.tableHeaders || []).map((th, i) => (
                            <th key={i} className="p-3.5 border-b border-slate-200 dark:border-slate-800">{th}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                        {(block.tableRows || []).map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-3 text-slate-700 dark:text-slate-300">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {block.type === 'custom_html' && (
                  <div dangerouslySetInnerHTML={{ __html: block.content || '' }} />
                )}
              </div>
            ))
          ) : (
            <div
              className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}
        </div>
      </div>
    </article>
  );
}
