'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useNotifications } from '@/lib/hooks/useNotifications';

export default function NotificationPrompt() {
    const { data: session } = useSession();
    const { supported, permission, subscribe, requestPermission } = useNotifications();
    const [show, setShow] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Check if user has already dismissed the prompt
        const isDismissed = localStorage.getItem('notification-prompt-dismissed') === 'true';
        setDismissed(isDismissed);

        // Show prompt after 10 seconds if logged in, supported, not granted, and not dismissed
        if (session?.user && supported && permission === 'default' && !isDismissed) {
            const timer = setTimeout(() => {
                setShow(true);
            }, 10000); // Show after 10 seconds

            return () => clearTimeout(timer);
        }
    }, [session, supported, permission]);

    const handleEnable = async () => {
        try {
            const result = await requestPermission();
            if (result === 'granted') {
                await subscribe();
                setShow(false);
            }
        } catch (error) {
            console.error('Error enabling notifications:', error);
        }
    };

    const handleDismiss = () => {
        setShow(false);
    };

    const handleDontAskAgain = () => {
        localStorage.setItem('notification-prompt-dismissed', 'true');
        setDismissed(true);
        setShow(false);
    };

    if (!show || !supported || permission !== 'default') {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-md animate-slide-up">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <svg
                            className="h-6 w-6 text-blue-600 dark:text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Stay Updated!
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Enable notifications to get notified when people interact with your
                            posts or when you receive new followers.
                        </p>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleEnable}
                                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                            >
                                Enable Notifications
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDismiss}
                                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-md font-medium transition-colors text-sm"
                                >
                                    Maybe Later
                                </button>
                                <button
                                    onClick={handleDontAskAgain}
                                    className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md font-medium transition-colors text-sm"
                                >
                                    Don&apos;t Ask Again
                                </button>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
