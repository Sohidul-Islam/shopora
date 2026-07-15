import { db } from '../../../db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, User, Clock, ArrowLeft, Share2 } from 'lucide-react';

export const revalidate = 60; // ISR validation

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await db.query.blogPosts.findFirst({
    where: (blogPosts, { eq }) => eq(blogPosts.slug, params.slug),
  });

  if (!post) return {};

  return {
    title: `${post.title} | Shopora Blog`,
    description: post.content.replace(/<[^>]*>/g, '').substring(0, 150),
    openGraph: {
      title: post.title,
      description: post.content.replace(/<[^>]*>/g, '').substring(0, 150),
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

  // Schema structured data for SEO (Article Schema)
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
    <div className="min-h-screen bg-gradient-to-b from-[#05060b] via-[#090b11] to-[#040508] py-16 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider font-extrabold text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Blog</span>
        </Link>

        {/* Title & Metadata */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 font-semibold border-b border-slate-900 pb-6">
            <span className="flex items-center space-x-1.5">
              <User className="w-4 h-4 text-slate-500" />
              <span>By {post.authorName}</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{post.readTime}</span>
            </span>
            {post.publishedAt && (
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </span>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {post.imageUrl && (
          <div className="aspect-video w-full rounded-3xl overflow-hidden border border-slate-800/40 shadow-xl shadow-black/25">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Article Body */}
        <div 
          className="text-slate-300 leading-relaxed space-y-6 pt-4 text-sm sm:text-base border-t border-slate-900/60"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share Button Section */}
        <div className="border-t border-slate-900/60 pt-8 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">Share this article</span>
          <button className="flex items-center space-x-2 py-2 px-4 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-350 hover:text-white transition">
            <Share2 className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </button>
        </div>

      </article>
    </div>
  );
}
