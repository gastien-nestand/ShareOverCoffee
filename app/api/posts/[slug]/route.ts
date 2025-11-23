import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
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
        // Get user from session
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title, content, excerpt, coverImage, tags, published } = body;

        // Validate required fields
        if (!title?.trim() || !content?.trim() || !excerpt?.trim()) {
            return NextResponse.json(
                { error: 'Title, content, and excerpt are required' },
                { status: 400 }
            );
        }

        // Check if post exists and user is the author
        const existingPost = await prisma.post.findUnique({
            where: { slug: params.slug },
        });

        if (!existingPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        if (existingPost.authorId !== session.user.id) {
            return NextResponse.json(
                { error: 'Unauthorized - You can only edit your own posts' },
                { status: 403 }
            );
        }

        // Calculate reading time if content changed
        let readingTime = existingPost.readingTime;
        if (content) {
            const wordsPerMinute = 200;
            const words = content.trim().split(/\s+/).length;
            readingTime = Math.ceil(words / wordsPerMinute);
        }

        // Update post with tags in a transaction
        const post = await prisma.$transaction(async (tx) => {
            // Delete existing tags
            await tx.postTag.deleteMany({
                where: { postId: existingPost.id },
            });

            // Update post (keep original slug)
            const updatedPost = await tx.post.update({
                where: { slug: params.slug },
                data: {
                    title,
                    content,
                    excerpt,
                    coverImage: coverImage || null,
                    readingTime,
                    published: published ?? existingPost.published,
                    // Note: slug is NOT updated to preserve URLs
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                        },
                    },
                },
            });

            // Add new tags if provided
            if (tags && Array.isArray(tags) && tags.length > 0) {
                await tx.postTag.createMany({
                    data: tags.map((tagId: string) => ({
                        postId: updatedPost.id,
                        tagId,
                    })),
                });
            }

            // Fetch the complete post with tags
            return await tx.post.findUnique({
                where: { id: updatedPost.id },
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
