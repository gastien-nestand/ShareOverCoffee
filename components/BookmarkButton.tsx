'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
    postId: string;
    postSlug: string;
    initialBookmarked?: boolean;
}

export default function BookmarkButton({
    postId,
    postSlug,
    initialBookmarked = false,
}: BookmarkButtonProps) {
    const { data: session } = useSession();
    const [bookmarked, setBookmarked] = useState(initialBookmarked);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch initial bookmark status
    useEffect(() => {
        if (!session?.user?.id) return;

        const fetchBookmarkStatus = async () => {
            try {
                const response = await fetch(`/api/posts/${postSlug}/bookmark`);
                if (response.ok) {
                    const data = await response.json();
                    setBookmarked(data.bookmarked);
                }
            } catch (error) {
                console.error('Error fetching bookmark status:', error);
            }
        };

        fetchBookmarkStatus();
    }, [postSlug, session]);

    const handleBookmark = async () => {
        if (!session?.user?.id) {
            // Redirect to sign in
            window.location.href = '/auth/signin';
            return;
        }

        setIsLoading(true);
        const previousState = bookmarked;

        // Optimistic update
        setBookmarked(!bookmarked);

        try {
            const response = await fetch(`/api/posts/${postSlug}/bookmark`, {
                method: 'POST',
            });

            if (response.ok) {
                const data = await response.json();
                setBookmarked(data.bookmarked);
            } else {
                // Revert on error
                setBookmarked(previousState);
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
            // Revert on error
            setBookmarked(previousState);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleBookmark}
            disabled={isLoading}
            className={cn(
                'p-2 rounded-full transition-colors disabled:opacity-50',
                bookmarked
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
            )}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
        >
            <svg
                className="h-5 w-5"
                fill={bookmarked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
            </svg>
        </button>
    );
}
