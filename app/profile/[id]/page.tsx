import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ArticleCard from '@/components/ArticleCard';
import ProfileHeader from '@/components/ProfileHeader';

async function getUser(id: string) {
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            _count: {
                select: {
                    posts: true,
                    followers: true,
                    following: true,
                },
            },
        },
    });

    return user;
}

async function getUserPosts(userId: string) {
    const posts = await prisma.post.findMany({
        where: {
            authorId: userId,
            published: true,
        },
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
    });

    return posts;
}

export default async function ProfilePage({ params }: { params: { id: string } }) {
    const [user, posts] = await Promise.all([
        getUser(params.id),
        getUserPosts(params.id),
    ]);

    if (!user) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Profile Header */}
            <ProfileHeader user={user} />

            {/* User's Posts */}
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Published Articles</h2>

                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post, index) => (
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
                    <div className="text-center py-12 glass-card">
                        <p className="text-muted-foreground">
                            No published articles yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export async function generateMetadata({ params }: { params: { id: string } }) {
    const user = await getUser(params.id);

    if (!user) {
        return {
            title: 'User Not Found',
        };
    }

    return {
        title: `${user.name || 'User'} - ShareOverCoffee`,
        description: user.bio || `View ${user.name || 'User'}'s profile and articles on ShareOverCoffee`,
    };
}
