import { NextResponse } from 'next/server';
import { db } from '../../../../../db';
import { blogPosts } from '../../../../../db/schema';
import { requireAdmin } from '../../../../../lib/api-auth';
import { eq } from 'drizzle-orm';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req);
    const post = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, params.id),
    });
    if (!post) {
      return NextResponse.json({ success: false, error: 'Article not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    const status = error.message === 'Forbidden' ? 403 : error.message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    const { title, slug, content, authorName, imageUrl, readTime, publishedAt } = body;

    const existing = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, params.id),
    });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Article not found.' }, { status: 404 });
    }

    if (slug && slug !== existing.slug) {
      const slugCheck = await db.query.blogPosts.findFirst({
        where: eq(blogPosts.slug, slug),
      });
      if (slugCheck) {
        return NextResponse.json({ success: false, error: 'A blog article with this slug already exists.' }, { status: 400 });
      }
    }

    await db.update(blogPosts)
      .set({
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(content !== undefined && { content }),
        ...(authorName !== undefined && { authorName }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(readTime !== undefined && { readTime }),
        ...(publishedAt !== undefined && { publishedAt: publishedAt ? new Date(publishedAt) : null }),
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, params.id));

    const updated = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, params.id),
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error: any) {
    const status = error.message === 'Forbidden' ? 403 : error.message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req);
    await db.delete(blogPosts).where(eq(blogPosts.id, params.id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    const status = error.message === 'Forbidden' ? 403 : error.message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
