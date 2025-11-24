'use client';

import FollowButton from '@/components/FollowButton';

interface ProfileHeaderProps {
    user: {
        id: string;
        name: string | null;
        avatar: string | null;
        bio: string | null;
        _count: {
            posts: number;
            followers: number;
            following: number;
        };
    };
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
    return (
        <div className="max-w-4xl mx-auto mb-12">
            <div className="glass-card p-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name || 'User'}
                                className="w-24 h-24 rounded-full"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-3xl font-bold">
                                    {(user.name || 'U').charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{user.name || 'Unknown User'}</h1>
                        {user.bio && (
                            <p className="text-muted-foreground mb-4">{user.bio}</p>
                        )}

                        {/* Stats */}
                        <div className="flex gap-6 text-sm mb-4">
                            <div>
                                <span className="font-semibold">{user._count.posts}</span>
                                <span className="text-muted-foreground ml-1">
                                    {user._count.posts === 1 ? 'Post' : 'Posts'}
                                </span>
                            </div>
                            <div>
                                <span className="font-semibold">{user._count.followers}</span>
                                <span className="text-muted-foreground ml-1">
                                    {user._count.followers === 1 ? 'Follower' : 'Followers'}
                                </span>
                            </div>
                            <div>
                                <span className="font-semibold">{user._count.following}</span>
                                <span className="text-muted-foreground ml-1">Following</span>
                            </div>
                        </div>

                        {/* Follow Button */}
                        <FollowButton
                            userId={user.id}
                            initialFollowerCount={user._count.followers}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
