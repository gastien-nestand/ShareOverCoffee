import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/posts/[slug] - Fetch a single post by slug
export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const post = await prisma.post.findUnique({
            where: { slug: params.slug, published: true },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        bio: true,
                    },
                },
                tags: {
                    include: {
                        tag: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json(
            { error: 'Failed to fetch post' },
            { status: 500 }
        );
    }
}

// PUT /api/posts/[slug] - Update a post (requires authentication)
export async function PUT(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const body = await request.json();
        const { title, content, excerpt, coverImage, tags, published, userId } = body;

        // TODO: Get userId from session
        if (!userId) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Check if post exists and user is the author
        const existingPost = await prisma.post.findUnique({
            where: { slug: params.slug },
        });

        if (!existingPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        if (existingPost.authorId !== userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        // Generate new slug if title changed
        let newSlug = params.slug;
        if (title && title !== existingPost.title) {
            newSlug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        // Calculate reading time if content changed
        let readingTime = existingPost.readingTime;
        if (content) {
            const wordsPerMinute = 200;
            const words = content.trim().split(/\s+/).length;
            readingTime = Math.ceil(words / wordsPerMinute);
        }

        // Update post
        const post = await prisma.post.update({
            where: { slug: params.slug },
            data: {
                title,
                slug: newSlug,
                content,
                excerpt,
                coverImage,
                readingTime,
                published,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json(
            { error: 'Failed to update post' },
            { status: 500 }
        );
    }
}

// DELETE /api/posts/[slug] - Delete a post (requires authentication)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        // TODO: Get userId from session
        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Check if post exists and user is the author
        const existingPost = await prisma.post.findUnique({
            where: { slug: params.slug },
        });

        if (!existingPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        if (existingPost.authorId !== userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        // Delete post (cascades to comments, likes, bookmarks, tags)
        await prisma.post.delete({
            where: { slug: params.slug },
        });

        return NextResponse.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json(
            { error: 'Failed to delete post' },
            { status: 500 }
        );
    }
}
