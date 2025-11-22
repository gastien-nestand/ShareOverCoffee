import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/posts/[slug]/bookmark - Toggle bookmark on a post
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

        // Check if user already bookmarked the post
        const existingBookmark = await prisma.bookmark.findUnique({
            where: {
                postId_userId: {
                    postId: post.id,
                    userId,
                },
            },
        });

        if (existingBookmark) {
            // Remove bookmark
            await prisma.bookmark.delete({
                where: {
                    id: existingBookmark.id,
                },
            });

            return NextResponse.json({
                bookmarked: false,
                message: 'Bookmark removed',
            });
        } else {
            // Add bookmark
            await prisma.bookmark.create({
                data: {
                    postId: post.id,
                    userId,
                },
            });

            return NextResponse.json({
                bookmarked: true,
                message: 'Post bookmarked',
            });
        }
    } catch (error) {
        console.error('Error toggling bookmark:', error);
        return NextResponse.json(
            { error: 'Failed to toggle bookmark' },
            { status: 500 }
        );
    }
}

// GET /api/posts/[slug]/bookmark - Check if user bookmarked the post
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

        const bookmark = await prisma.bookmark.findUnique({
            where: {
                postId_userId: {
                    postId: post.id,
                    userId,
                },
            },
        });

        return NextResponse.json({
            bookmarked: !!bookmark,
        });
    } catch (error) {
        console.error('Error checking bookmark:', error);
        return NextResponse.json(
            { error: 'Failed to check bookmark status' },
            { status: 500 }
        );
    }
}
