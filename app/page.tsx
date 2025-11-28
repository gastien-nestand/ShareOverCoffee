import { prisma } from '@/lib/prisma';
import ArticleCard from '@/components/ArticleCard';
import NewsletterForm from '@/components/NewsletterForm';
import RecommendedPosts from '@/components/RecommendedPosts';
import Link from 'next/link';

// Revalidate this page every 60 seconds
export const revalidate = 60;

async function getPosts() {
    const posts = await prisma.post.findMany({
        where: { published: true },
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
        orderBy: {
            createdAt: 'desc',
        },
        take: 9,
    });

    return posts;
}

async function getFeaturedPost() {
    const featuredPost = await prisma.post.findFirst({
        where: { published: true, featured: true },
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
    });

    return featuredPost;
}

export default async function Home() {
    let [featuredPost, posts] = await Promise.all([
        getFeaturedPost(),
        getPosts(),
    ]);

    // If no post is explicitly featured, use the most recent one
    if (!featuredPost && posts.length > 0) {
        featuredPost = posts[0];
    }

    // Filter out the featured post from regular posts to avoid duplication
    const regularPosts = posts.filter((post) => post.id !== featuredPost?.id);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section */}
            <section className="mb-16 text-center space-y-6 animate-fade-in">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold gradient-text">
                    Discover Stories & Ideas
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    A modern platform for readers and writers to share knowledge,
                    insights, and creativity.
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/search" className="btn-primary px-6 py-3">
                        Start Reading
                    </Link>
                    <Link href="/create" className="btn-secondary px-6 py-3">
                        Start Writing
                    </Link>
                </div>
            </section>

            {/* Featured Article */}
            {featuredPost && (
                <section className="mb-16">
                    <ArticleCard post={featuredPost} featured />
                </section>
            )}

            {/* Latest Articles */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">More Stories</h2>
                    <Link
                        href="/search"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        View all →
                    </Link>
                </div>

                {regularPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {regularPosts.map((post, index) => (
                            <div
                                key={post.id}
                                className="animate-fade-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <ArticleCard post={post} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 glass-card">
                        <p className="text-muted-foreground">No articles yet. Be the first to write!</p>
                        <Link href="/create" className="btn-primary px-6 py-3 mt-4 inline-flex">
                            Create Article
                        </Link>
                    </div>
                )}
            </section>

            {/* Recommended Posts */}
            <RecommendedPosts />

            {/* Newsletter Section */}
            <section className="mt-20 glass-card p-12 text-center space-y-6">
                <h2 className="text-3xl font-bold">Stay Updated</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Get the latest articles and insights delivered to your inbox weekly.
                </p>
                <NewsletterForm />
            </section>
        </div>
    );
}
