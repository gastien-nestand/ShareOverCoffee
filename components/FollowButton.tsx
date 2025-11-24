'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface FollowButtonProps {
    userId: string;
    initialFollowing?: boolean;
    initialFollowerCount?: number;
    onFollowChange?: (following: boolean, count: number) => void;
}

export default function FollowButton({
    userId,
    initialFollowing = false,
    initialFollowerCount = 0,
    onFollowChange,
}: FollowButtonProps) {
    const { data: session } = useSession();
    const [following, setFollowing] = useState(initialFollowing);
    const [followerCount, setFollowerCount] = useState(initialFollowerCount);
    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Fetch initial follow status
    useEffect(() => {
        if (!session?.user?.id) return;

        const fetchFollowStatus = async () => {
            try {
                const response = await fetch(`/api/users/${userId}/follow`);
                if (response.ok) {
                    const data = await response.json();
                    setFollowing(data.following);
                    setFollowerCount(data.followerCount);
                }
            } catch (error) {
                console.error('Error fetching follow status:', error);
            }
        };

        fetchFollowStatus();
    }, [userId, session]);

    const handleFollow = async () => {
        if (!session?.user?.id) {
            // Redirect to sign in
            window.location.href = '/auth/signin';
            return;
        }

        setIsLoading(true);
        const previousFollowing = following;
        const previousCount = followerCount;

        // Optimistic update
        const newFollowing = !following;
        const newCount = newFollowing ? followerCount + 1 : followerCount - 1;
        setFollowing(newFollowing);
        setFollowerCount(newCount);

        try {
            const response = await fetch(`/api/users/${userId}/follow`, {
                method: 'POST',
            });

            if (response.ok) {
                const data = await response.json();
                setFollowing(data.following);
                setFollowerCount(data.followerCount);

                // Notify parent component
                if (onFollowChange) {
                    onFollowChange(data.following, data.followerCount);
                }
            } else {
                // Revert on error
                setFollowing(previousFollowing);
                setFollowerCount(previousCount);
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
            // Revert on error
            setFollowing(previousFollowing);
            setFollowerCount(previousCount);
        } finally {
            setIsLoading(false);
        }
    };

    // Don't show button for own profile (AFTER all hooks)
    if (session?.user?.id === userId) {
        return null;
    }

    return (
        <button
            onClick={handleFollow}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={isLoading}
            className={cn(
                'px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50',
                following
                    ? 'bg-secondary text-secondary-foreground hover:bg-red-500 hover:text-white'
                    : 'btn-primary'
            )}
        >
            {isLoading ? (
                'Loading...'
            ) : following ? (
                isHovered ? 'Unfollow' : 'Following'
            ) : (
                'Follow'
            )}
        </button>
    );
}
