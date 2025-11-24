'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';

export default function RecommendedPosts() {
    const { data: session } = useSession();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!session?.user?.id) {
            setLoading(false);
            return;
        }

        const fetchRecommendations = async () => {
            try {
                const response = await fetch(`/api/users/${session.user.id}/recommendations`);
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data.posts);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error('Error fetching recommendations:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [session]);

    // Don't show section if not logged in
    if (!session?.user?.id) {
        return null;
    }

    if (loading) {
        return (
            <section className="mt-16">
                <h2 className="text-2xl font-bold mb-6">✨ Recommended for You</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="glass-card p-6 animate-pulse">
                            <div className="h-40 bg-secondary rounded-lg mb-4"></div>
                            <div className="h-4 bg-secondary rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-secondary rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (error || posts.length === 0) {
        return null; // Silently fail - don't show empty section
    }

    return (
        <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">✨ Recommended for You</h2>
                <p className="text-sm text-muted-foreground">
                    Based on your interests and follows
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.slice(0, 6).map((post, index) => (
                    <div
                        key={post.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <ArticleCard post={post} />
                    </div>
                ))}
            </div>

            {posts.length > 6 && (
                <div className="text-center mt-8">
                    <Link
                        href="/search"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        View more recommendations →
                    </Link>
                </div>
            )}
        </section>
    );
}
