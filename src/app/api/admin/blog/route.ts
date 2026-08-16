import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { blogPosts } from '../../../../db/schema';
import { requireAdmin } from '../../../../lib/api-auth';
import { desc, eq } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const posts = await db.query.blogPosts.findMany({
      orderBy: [desc(blogPosts.createdAt)],
    });
    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    const status = error.message === 'Forbidden' ? 403 : error.message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAdmin(req);
    const body = await req.json();
    const { title, slug, content, authorName, imageUrl, readTime, publishedAt } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ success: false, error: 'Title, slug, and content are required.' }, { status: 400 });
    }

    const existing = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.slug, slug),
    });
    if (existing) {
      return NextResponse.json({ success: false, error: 'A blog article with this slug already exists.' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    await db.insert(blogPosts).values({
      id,
      title,
      slug,
      content,
      authorName: authorName || (user as any).name || 'Shopora Team',
      imageUrl: imageUrl || null,
      readTime: readTime || '5 min read',
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
    });

    const newPost = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, id),
    });

    return NextResponse.json({ success: true, post: newPost }, { status: 201 });
  } catch (error: any) {
    const status = error.message === 'Forbidden' ? 403 : error.message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
