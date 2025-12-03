'use client';

import { useEffect, useState } from 'react';

export function useNotifications() {
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        // Check if notifications and service workers are supported
        const isSupported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
        setSupported(isSupported);

        if (isSupported) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if (!supported) {
            throw new Error('Push notifications are not supported');
        }

        const result = await Notification.requestPermission();
        setPermission(result);
        return result;
    };

    const subscribe = async () => {
        if (!supported || permission !== 'granted') {
            throw new Error('Notification permission not granted');
        }

        try {
            // Wait for service worker to be ready
            const registration = await navigator.serviceWorker.ready;

            // Get VAPID public key from env
            const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

            // Convert VAPID key from base64 to Uint8Array
            const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

            // Subscribe to push notifications
            const pushSubscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey,
            });

            // Send subscription to server
            const response = await fetch('/api/notifications/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pushSubscription.toJSON()),
            });

            if (!response.ok) {
                throw new Error('Failed to save subscription');
            }

            setSubscription(pushSubscription);
            return pushSubscription;
        } catch (error) {
            console.error('Error subscribing to push notifications:', error);
            throw error;
        }
    };

    const unsubscribe = async () => {
        if (!subscription) {
            return;
        }

        try {
            // Unsubscribe from push manager
            await subscription.unsubscribe();

            // Remove subscription from server
            await fetch('/api/notifications/subscribe', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ endpoint: subscription.endpoint }),
            });

            setSubscription(null);
        } catch (error) {
            console.error('Error unsubscribing from push notifications:', error);
            throw error;
        }
    };

    return {
        supported,
        permission,
        subscription,
        requestPermission,
        subscribe,
        unsubscribe,
    };
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
