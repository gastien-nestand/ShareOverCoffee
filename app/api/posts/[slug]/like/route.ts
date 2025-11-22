import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/posts/[slug]/like - Toggle like on a post
export async function POST(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const body = await request.json();
        const { userId } = body;

        // TODO: Get userId from session
        if (!userId) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Check if post exists
        const post = await prisma.post.findUnique({
            where: { slug: params.slug },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Check if user already liked the post
        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId: post.id,
                    userId,
                },
            },
        });

        if (existingLike) {
            // Unlike: Delete the like
            await prisma.like.delete({
                where: {
                    id: existingLike.id,
                },
            });

            const likeCount = await prisma.like.count({
                where: { postId: post.id },
            });

            return NextResponse.json({
                liked: false,
                likeCount,
                message: 'Post unliked',
            });
        } else {
            // Like: Create a new like
            await prisma.like.create({
                data: {
                    postId: post.id,
                    userId,
                },
            });

            const likeCount = await prisma.like.count({
                where: { postId: post.id },
            });

            return NextResponse.json({
                liked: true,
                likeCount,
                message: 'Post liked',
            });
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        return NextResponse.json(
            { error: 'Failed to toggle like' },
            { status: 500 }
        );
    }
}

// GET /api/posts/[slug]/like - Check if user liked the post
export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID required' },
                { status: 400 }
            );
        }

        const post = await prisma.post.findUnique({
            where: { slug: params.slug },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const like = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId: post.id,
                    userId,
                },
            },
        });

        const likeCount = await prisma.like.count({
            where: { postId: post.id },
        });

        return NextResponse.json({
            liked: !!like,
            likeCount,
        });
    } catch (error) {
        console.error('Error checking like:', error);
        return NextResponse.json(
            { error: 'Failed to check like status' },
            { status: 500 }
        );
    }
}
