import { db } from '../../db';
import Link from 'next/link';
import { BookOpen, Calendar, User, Search, Sparkles } from 'lucide-react';

export const revalidate = 60; // ISR validation

export default async function BlogPage({ searchParams }: { searchParams: { q?: string } }) {
  // Query all blog posts
  const posts = await db.query.blogPosts.findMany({
    orderBy: (blogPosts, { desc }) => [desc(blogPosts.publishedAt)],
  });

  const query = searchParams.q?.toLowerCase() || '';
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(query) || 
    post.content.toLowerCase().includes(query)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05060b] via-[#090b11] to-[#040508] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center space-x-2 py-1 px-3 bg-blue-500/10 border border-blue-500/25 rounded-full text-blue-400 text-xs font-semibold tracking-wider uppercase">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Shopora Blog</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight leading-none">Latest Insights & Stories</h1>
          <p className="text-sm text-slate-400">Discover tips, trends, and engineering writeups on how we build high-converting e-commerce software.</p>
        </div>

        {/* Search bar */}
        <form className="max-w-md mx-auto relative">
          <input 
            type="text" 
            name="q"
            defaultValue={searchParams.q || ''}
            placeholder="Search articles..." 
            className="w-full bg-[#0a0c14] border border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
        </form>

        {/* Blog Post List */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl border border-slate-800/40">
            <p className="text-slate-400 text-sm">No articles matched your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map((post) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.slug}`}
                className="glass border border-slate-800/40 rounded-3xl overflow-hidden hover-premium group shadow-lg shadow-black/10 flex flex-col"
              >
                <div className="aspect-video w-full bg-[#0d0f17] relative overflow-hidden">
                  <img 
                    src={post.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600'} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                  />
                </div>
                <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">
                      <span className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{post.authorName}</span>
                      </span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h2 className="text-xl font-bold font-display text-white group-hover:text-blue-400 transition leading-tight line-clamp-2">
                      {post.title}
                    </h2>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content.substring(0, 150) + '...' }} />
                  
                  <div className="pt-4 border-t border-slate-900/60 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-blue-400 group-hover:text-white transition">
                    <span>Read Article &rarr;</span>
                    {post.publishedAt && (
                      <span className="text-[10px] text-slate-500">{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
