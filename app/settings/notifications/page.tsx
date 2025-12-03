'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/lib/hooks/useNotifications';

export default function NotificationSettingsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const { supported, permission, subscription, subscribe, unsubscribe } = useNotifications();

    const [preferences, setPreferences] = useState({
        notifyOnComment: true,
        notifyOnLike: true,
        notifyOnFollow: true,
        notifyOnNewPost: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (session?.user) {
            fetchPreferences();
        }
    }, [session]);

    const fetchPreferences = async () => {
        try {
            // In a real app, you'd fetch these from the user's profile
            // For now, we'll use default values
            setLoading(false);
        } catch (error) {
            console.error('Error fetching preferences:', error);
            setLoading(false);
        }
    };

    const handleTogglePushNotifications = async () => {
        try {
            if (subscription) {
                await unsubscribe();
            } else {
                if (permission !== 'granted') {
                    // Permission will be requested by useNotifications
                }
                await subscribe();
            }
        } catch (error) {
            console.error('Error toggling push notifications:', error);
        }
    };

    const handlePreferenceChange = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // In a real app, save preferences to the backend
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulated delay
            alert('Preferences saved successfully!');
        } catch (error) {
            console.error('Error saving preferences:', error);
            alert('Failed to save preferences');
        } finally {
            setSaving(false);
        }
    };

    if (!session?.user) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Please sign in to manage settings</h1>
                <button
                    onClick={() => router.push('/auth/signin')}
                    className="btn-primary px-6 py-3"
                >
                    Sign In
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Notification Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage how and when you receive notifications
                </p>
            </div>

            <div className="space-y-6">
                {/* Push Notifications */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Push Notifications
                    </h2>

                    {!supported ? (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                Push notifications are not supported in your browser.
                            </p>
                        </div>
                    ) : permission === 'denied' ? (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-800 dark:text-red-200 mb-2">
                                You have blocked notifications for this site.
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-300">
                                To enable notifications, please update your browser settings.
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    Browser Notifications
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Receive push notifications even when the app is closed
                                </p>
                            </div>
                            <button
                                onClick={handleTogglePushNotifications}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${subscription
                                        ? 'bg-blue-600'
                                        : 'bg-gray-200 dark:bg-gray-700'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${subscription ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    )}
                </div>

                {/* Notification Preferences */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Notification Types
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    Comments
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    When someone comments on your posts
                                </p>
                            </div>
                            <button
                                onClick={() => handlePreferenceChange('notifyOnComment')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.notifyOnComment
                                        ? 'bg-blue-600'
                                        : 'bg-gray-200 dark:bg-gray-700'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.notifyOnComment ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    Likes
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    When someone likes your posts
                                </p>
                            </div>
                            <button
                                onClick={() => handlePreferenceChange('notifyOnLike')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.notifyOnLike
                                        ? 'bg-blue-600'
                                        : 'bg-gray-200 dark:bg-gray-700'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.notifyOnLike ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    Follows
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    When someone follows you
                                </p>
                            </div>
                            <button
                                onClick={() => handlePreferenceChange('notifyOnFollow')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.notifyOnFollow
                                        ? 'bg-blue-600'
                                        : 'bg-gray-200 dark:bg-gray-700'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.notifyOnFollow ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    New Posts
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    When people you follow publish new posts
                                </p>
                            </div>
                            <button
                                onClick={() => handlePreferenceChange('notifyOnNewPost')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.notifyOnNewPost
                                        ? 'bg-blue-600'
                                        : 'bg-gray-200 dark:bg-gray-700'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.notifyOnNewPost ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>
            </div>
        </div>
    );
}
