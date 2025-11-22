'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
    postId: string;
    initialLikes: number;
    initialLiked?: boolean;
}

export default function LikeButton({
    postId,
    initialLikes,
    initialLiked = false,
}: LikeButtonProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(initialLiked);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleLike = async () => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);

        // Optimistic update
        if (liked) {
            setLikes((prev) => prev - 1);
            setLiked(false);
        } else {
            setLikes((prev) => prev + 1);
            setLiked(true);
        }

        // TODO: Make API call to toggle like
        // await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
    };

    return (
        <button
            onClick={handleLike}
            className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-full transition-all',
                liked
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent',
                isAnimating && 'animate-clap'
            )}
            aria-label={liked ? 'Unlike' : 'Like'}
        >
            <svg
                className={cn('h-5 w-5', isAnimating && 'animate-clap')}
                fill={liked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
            </svg>
            <span className="font-medium">{likes}</span>
        </button>
    );
}
