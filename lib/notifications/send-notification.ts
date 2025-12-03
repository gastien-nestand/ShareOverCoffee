import webpush, { PushSubscription as WebPushSubscription } from 'web-push';
import { prisma } from '@/lib/prisma';

// Initialize VAPID keys
const vapidKeys = {
    publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    privateKey: process.env.VAPID_PRIVATE_KEY!,
};

webpush.setVapidDetails(
    'mailto:your-email@example.com', // Change this to your email
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

interface NotificationPayload {
    title: string;
    message: string;
    icon?: string;
    badge?: string;
    url?: string;
    data?: Record<string, any>;
}

export async function sendPushNotification(
    userId: string,
    payload: NotificationPayload
) {
    try {
        // Get all push subscriptions for the user
        const subscriptions = await prisma.pushSubscription.findMany({
            where: { userId },
        });

        if (subscriptions.length === 0) {
            console.log(`No push subscriptions found for user ${userId}`);
            return { success: false, message: 'No subscriptions found' };
        }

        const notificationPayload = JSON.stringify({
            title: payload.title,
            body: payload.message,
            icon: payload.icon || '/icons/icon-192x192.png',
            badge: payload.badge || '/icons/icon-192x192.png',
            data: {
                url: payload.url || '/',
                ...payload.data,
            },
        });

        // Send to all user subscriptions
        const results = await Promise.allSettled(
            subscriptions.map(async (sub: any) => {
                const pushSubscription: WebPushSubscription = {
                    endpoint: sub.endpoint,
                    keys: {
                        p256dh: sub.p256dh,
                        auth: sub.auth,
                    },
                };

                try {
                    await webpush.sendNotification(
                        pushSubscription,
                        notificationPayload
                    );
                    return { success: true, subscriptionId: sub.id };
                } catch (error: any) {
                    // If subscription is no longer valid (410 Gone), remove it
                    if (error.statusCode === 410) {
                        await prisma.pushSubscription.delete({
                            where: { id: sub.id },
                        });
                        console.log(`Removed expired subscription ${sub.id}`);
                    }
                    throw error;
                }
            })
        );

        const successful = results.filter((r: any) => r.status === 'fulfilled').length;
        const failed = results.filter((r: any) => r.status === 'rejected').length;

        console.log(
            `Push notifications sent: ${successful} successful, ${failed} failed`
        );

        return {
            success: true,
            successful,
            failed,
            total: subscriptions.length,
        };
    } catch (error) {
        console.error('Error sending push notification:', error);
        return { success: false, error };
    }
}

export async function createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    url?: string,
    senderId?: string
) {
    try {
        // Create notification in database
        const notification = await prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                url,
                senderId,
            },
        });

        // Send push notification
        await sendPushNotification(userId, {
            title,
            message,
            url,
            data: { notificationId: notification.id, type },
        });

        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
}
