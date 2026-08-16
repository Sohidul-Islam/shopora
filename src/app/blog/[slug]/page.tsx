import { db } from '../../../db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, User, Clock, ArrowLeft, Share2, AlertCircle } from 'lucide-react';
import { CmsBlock } from '../../../components/admin/CmsSectionBuilder';

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

  let blocks: CmsBlock[] = [];
  let isJsonContent = false;

  try {
    if (post.content && post.content.trim().startsWith('[')) {
      blocks = JSON.parse(post.content);
      isJsonContent = true;
    }
  } catch {
    isJsonContent = false;
  }

  // Schema structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'image': post.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600',
    'datePublished': post.publishedAt || post.createdAt,
    'author': {
      '@type': 'Person',
      'name': post.authorName,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Shopora',
      'logo': {
        '@type': 'ImageObject',
        'url': 'http://localhost:3001/logo.png',
      },
    },
    'description': post.content.replace(/<[^>]*>/g, '').substring(0, 150),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafafa] via-[#fafafa] to-purple-50/20 dark:from-[#05060b] dark:via-[#090b11] dark:to-[#040508] py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-4xl mx-auto space-y-10">
        
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400 hover:text-purple-650 dark:hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Blog Articles</span>
        </Link>

        {/* Title & Metadata */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-900 dark:text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800/80 pb-6">
            <span className="flex items-center space-x-1.5">
              <User className="w-4 h-4 text-purple-500" />
              <span>By {post.authorName}</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>{post.readTime}</span>
            </span>
            {post.publishedAt && (
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </span>
            )}
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
                  <div className="relative rounded-3xl overflow-hidden aspect-[21/9] bg-slate-900 flex items-center justify-center p-8 text-center text-white my-4 shadow-xl">
                    {block.imageUrl && <img src={block.imageUrl} alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-50" />}
                    <div className="relative z-10 space-y-3">
                      <h2 className="text-2xl sm:text-4xl font-black">{block.bannerTitle || 'Featured Section Banner'}</h2>
                      <p className="text-sm opacity-90 max-w-xl mx-auto">{block.bannerSubtitle}</p>
                    </div>
                  </div>
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
                          <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-3.5 text-slate-700 dark:text-slate-300">{cell}</td>
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
              className="text-slate-700 dark:text-slate-300 leading-relaxed space-y-6 text-base sm:text-lg border-t border-slate-100 dark:border-slate-900/60 pt-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}
        </div>

        {/* Share Section */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">Share this article</span>
          <button className="flex items-center space-x-2 py-2 px-4 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white transition">
            <Share2 className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </button>
        </div>

      </article>
    </div>
  );
}
