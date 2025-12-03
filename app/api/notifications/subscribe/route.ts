import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const { endpoint, keys } = await req.json();

        if (!endpoint || !keys?.p256dh || !keys?.auth) {
            return NextResponse.json(
                { error: 'Invalid subscription data' },
                { status: 400 }
            );
        }

        // Check if subscription already exists
        const existing = await prisma.pushSubscription.findFirst({
            where: {
                userId: user.id,
                endpoint,
            },
        });

        if (existing) {
            return NextResponse.json({
                success: true,
                message: 'Subscription already exists',
                subscription: existing,
            });
        }

        // Create new subscription
        const subscription = await prisma.pushSubscription.create({
            data: {
                userId: user.id,
                endpoint,
                p256dh: keys.p256dh,
                auth: keys.auth,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Subscription created successfully',
            subscription,
        });
    } catch (error) {
        console.error('Error creating push subscription:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const { endpoint } = await req.json();

        if (!endpoint) {
            return NextResponse.json(
                { error: 'Endpoint is required' },
                { status: 400 }
            );
        }

        // Delete the subscription
        await prisma.pushSubscription.deleteMany({
            where: {
                userId: user.id,
                endpoint,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Subscription deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting push subscription:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const subscriptions = await prisma.pushSubscription.findMany({
            where: { userId: user.id },
        });

        return NextResponse.json({
            success: true,
            subscriptions,
            count: subscriptions.length,
        });
    } catch (error) {
        console.error('Error fetching push subscriptions:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
