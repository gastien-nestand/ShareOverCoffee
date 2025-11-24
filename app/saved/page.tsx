import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';

async function getSavedPosts(userId: string) {
    const bookmarks = await prisma.bookmark.findMany({
        where: { userId },
        include: {
            post: {
                include: {
                    author: {
                        select: {
                            name: true,
                            avatar: true,
                        },
                    },
                    tags: {
                        include: {
                            tag: true,
                        },
                    },
                    _count: {
                        select: {
                            likes: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return bookmarks.map(bookmark => bookmark.post);
}

export default async function SavedPostsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect('/auth/signin');
    }

    const savedPosts = await getSavedPosts(session.user.id);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-8">
                <h1 className="text-4xl font-bold mb-2">📚 Saved Posts</h1>
                <p className="text-muted-foreground">
                    Posts you've bookmarked for later reading
                </p>
            </div>

            {/* Saved Posts Grid */}
            <div className="max-w-6xl mx-auto">
                {savedPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedPosts.map((post, index) => (
                            <div
                                key={post.id}
                                className="animate-fade-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <ArticleCard post={post} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 glass-card">
                        <div className="mb-6">
                            <svg
                                className="mx-auto h-16 w-16 text-muted-foreground"
                                fill="none"
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
                        </div>
                        <h2 className="text-2xl font-bold mb-2">No saved posts yet</h2>
                        <p className="text-muted-foreground mb-6">
                            Start exploring and bookmark posts you want to read later!
                        </p>
                        <Link href="/search" className="btn-primary px-6 py-3 inline-flex">
                            Explore Posts
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export const metadata = {
    title: 'Saved Posts - ShareOverCoffee',
    description: 'View your bookmarked posts',
};
