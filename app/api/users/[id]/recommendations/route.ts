import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/users/[id]/recommendations - Get personalized post recommendations
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

        const userId = params.id;

        // Get user's liked posts to extract interested tags
        const userLikes = await prisma.like.findMany({
            where: { userId },
            include: {
                post: {
                    include: {
                        tags: {
                            include: {
                                tag: true,
                            },
                        },
                    },
                },
            },
            take: 50, // Limit to recent likes
        });

        // Get user's bookmarked posts
        const userBookmarks = await prisma.bookmark.findMany({
            where: { userId },
            include: {
                post: {
                    include: {
                        tags: {
                            include: {
                                tag: true,
                            },
                        },
                    },
                },
            },
            take: 50,
        });

        // Get users the current user follows
        const following = await prisma.follow.findMany({
            where: { followerId: userId },
            select: { followingId: true },
        });

        const followingIds = following.map(f => f.followingId);

        // Extract tag IDs from liked and saved posts
        const interestedTagIds = [
            ...userLikes.flatMap(like => like.post.tags.map(t => t.tagId)),
            ...userBookmarks.flatMap(bookmark => bookmark.post.tags.map(t => t.tagId)),
        ];

        // Get unique tag IDs
        const uniqueTagIds = [...new Set(interestedTagIds)];

        // Get posts the user has already interacted with
        const interactedPostIds = [
            ...userLikes.map(like => like.postId),
            ...userBookmarks.map(bookmark => bookmark.postId),
        ];

        // Build recommendation query
        // Priority: 40% followed users, 30% similar tags, 30% trending
        const recommendations = await prisma.post.findMany({
            where: {
                published: true,
                // Exclude posts user has already liked or bookmarked
                id: {
                    notIn: interactedPostIds.length > 0 ? interactedPostIds : undefined,
                },
                OR: [
                    // Posts from followed users (highest priority)
                    ...(followingIds.length > 0
                        ? [{ authorId: { in: followingIds } }]
                        : []),
                    // Posts with tags user is interested in
                    ...(uniqueTagIds.length > 0
                        ? [{ tags: { some: { tagId: { in: uniqueTagIds } } } }]
                        : []),
                ],
            },
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
                        comments: true,
                    },
                },
            },
            orderBy: [
                // Prioritize recent posts
                { createdAt: 'desc' },
            ],
            take: 20,
        });

        // If no recommendations based on interests, get trending posts
        if (recommendations.length < 10) {
            const trendingPosts = await prisma.post.findMany({
                where: {
                    published: true,
                    id: {
                        notIn: [
                            ...interactedPostIds,
                            ...recommendations.map(p => p.id),
                        ],
                    },
                },
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
                            comments: true,
                        },
                    },
                },
                orderBy: [
                    { likes: { _count: 'desc' } },
                    { createdAt: 'desc' },
                ],
                take: 10 - recommendations.length,
            });

            recommendations.push(...trendingPosts);
        }

        return NextResponse.json({
            posts: recommendations,
            count: recommendations.length,
            hasFollowing: followingIds.length > 0,
            hasInterests: uniqueTagIds.length > 0,
        });
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch recommendations' },
            { status: 500 }
        );
    }
}
