import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/users/[id]/bookmarks - Get user's bookmarked posts
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Only allow users to view their own bookmarks
        if (session.user.id !== params.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const bookmarks = await prisma.bookmark.findMany({
            where: { userId: params.id },
            include: {
                post: {
                    include: {
                        author: {
                            select: {
                                name: true,
                                avatar: true,
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
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Extract posts from bookmarks
        const posts = bookmarks.map(bookmark => bookmark.post);

        return NextResponse.json({ posts, count: posts.length });
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch bookmarks' },
            { status: 500 }
        );
    }
}
