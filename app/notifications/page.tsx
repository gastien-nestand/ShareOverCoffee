'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    url?: string;
    read: boolean;
    createdAt: string;
    sender?: {
        id: string;
        name: string | null;
        avatar: string | null;
    };
}

export default function NotificationsPage() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    useEffect(() => {
        if (session?.user) {
            fetchNotifications();
        }
    }, [session, filter]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const url = filter === 'unread'
                ? '/api/notifications?unread=true&limit=50'
                : '/api/notifications?limit=50';
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/api/notifications/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ read: true }),
            });
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch('/api/notifications/mark-all-read', {
                method: 'POST',
            });
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    if (!session?.user) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Please sign in to view notifications</h1>
                <Link href="/auth/signin" className="btn-primary px-6 py-3">
                    Sign In
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Notifications
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Stay updated with your latest interactions
                </p>
            </div>

            {/* Filter and Actions */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'unread'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                    >
                        Unread {unreadCount > 0 && `(${unreadCount})`}
                    </button>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Notifications List */}
            <div className="space-y-2">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <svg
                            className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No notifications yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            We&apos;ll notify you when something interesting happens!
                        </p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <Link
                            key={notification.id}
                            href={notification.url || '#'}
                            onClick={() => {
                                if (!notification.read) {
                                    markAsRead(notification.id);
                                }
                            }}
                            className={`block p-4 rounded-lg border transition-colors ${!notification.read
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                }`}
                        >
                            <div className="flex gap-4">
                                {notification.sender?.avatar ? (
                                    <img
                                        src={notification.sender.avatar}
                                        alt={notification.sender.name || 'User'}
                                        className="h-12 w-12 rounded-full flex-shrink-0"
                                    />
                                ) : (
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                        {notification.sender?.name?.charAt(0).toUpperCase() || 'N'}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {notification.title}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {notification.message}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <span className="inline-block h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-2" />
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                        {formatDistanceToNow(new Date(notification.createdAt), {
                                            addSuffix: true,
                                        })}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
