import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/users/[id]/follow - Toggle follow on a user
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
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

        const userId = session.user.id;

        // Can't follow yourself
        if (userId === params.id) {
            return NextResponse.json(
                { error: 'Cannot follow yourself' },
                { status: 400 }
            );
        }

        // Check if target user exists
        const targetUser = await prisma.user.findUnique({
            where: { id: params.id },
        });

        if (!targetUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if already following
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: userId,
                    followingId: params.id,
                },
            },
        });

        if (existingFollow) {
            // Unfollow
            await prisma.follow.delete({
                where: {
                    id: existingFollow.id,
                },
            });

            const followerCount = await prisma.follow.count({
                where: { followingId: params.id },
            });

            return NextResponse.json({
                following: false,
                followerCount,
                message: 'Unfollowed user',
            });
        } else {
            // Follow
            await prisma.follow.create({
                data: {
                    followerId: userId,
                    followingId: params.id,
                },
            });

            const followerCount = await prisma.follow.count({
                where: { followingId: params.id },
            });

            return NextResponse.json({
                following: true,
                followerCount,
                message: 'Following user',
            });
        }
    } catch (error) {
        console.error('Error toggling follow:', error);
        return NextResponse.json(
            { error: 'Failed to toggle follow' },
            { status: 500 }
        );
    }
}

// GET /api/users/[id]/follow - Check if user is following
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
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

        const userId = session.user.id;

        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: userId,
                    followingId: params.id,
                },
            },
        });

        const followerCount = await prisma.follow.count({
            where: { followingId: params.id },
        });

        const followingCount = await prisma.follow.count({
            where: { followerId: params.id },
        });

        return NextResponse.json({
            following: !!follow,
            followerCount,
            followingCount,
        });
    } catch (error) {
        console.error('Error checking follow:', error);
        return NextResponse.json(
            { error: 'Failed to check follow status' },
            { status: 500 }
        );
    }
}
