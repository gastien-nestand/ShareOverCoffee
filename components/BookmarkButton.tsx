'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
    postId: string;
    initialBookmarked?: boolean;
}

export default function BookmarkButton({
    postId,
    initialBookmarked = false,
}: BookmarkButtonProps) {
    const [bookmarked, setBookmarked] = useState(initialBookmarked);

    const handleBookmark = async () => {
        setBookmarked(!bookmarked);
        // TODO: Make API call to toggle bookmark
        // await fetch(`/api/posts/${postId}/bookmark`, { method: 'POST' });
    };

    return (
        <button
            onClick={handleBookmark}
            className={cn(
                'p-2 rounded-full transition-colors',
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
