import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/posts/[slug]/like - Toggle like on a post
export async function POST(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
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
                    userId: session.user.id,
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
                    userId: session.user.id,
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
        const session = await getServerSession(authOptions);

        const post = await prisma.post.findUnique({
            where: { slug: params.slug },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        let liked = false;

        if (session?.user?.id) {
            const like = await prisma.like.findUnique({
                where: {
                    postId_userId: {
                        postId: post.id,
                        userId: session.user.id,
                    },
                },
            });
            liked = !!like;
        }

        const likeCount = await prisma.like.count({
            where: { postId: post.id },
        });

        return NextResponse.json({
            liked,
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
