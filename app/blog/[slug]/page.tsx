import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import ReadingProgress from '@/components/ReadingProgress';
import LikeButton from '@/components/LikeButton';
import BookmarkButton from '@/components/BookmarkButton';
import ShareButtons from '@/components/ShareButtons';
import CommentSection from '@/components/CommentSection';
import EditButton from '@/components/EditButton';
import FollowButton from '@/components/FollowButton';

// Enable ISR - Revalidate every hour
export const revalidate = 3600;

async function getPost(slug: string) {
    const post = await prisma.post.findUnique({
        where: { slug, published: true },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                    bio: true,
                },
            },
            tags: {
                select: {
                    tag: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
            },
            _count: {
                select: {
                    likes: true,
                    comments: true,
                },
            },
        },
    });

    return post;
}

async function getRelatedPosts(postId: string, tagIds: string[]) {
    if (tagIds.length === 0) return [];

    const posts = await prisma.post.findMany({
        where: {
            published: true,
            NOT: { id: postId },
            tags: {
                some: {
                    tagId: {
                        in: tagIds,
                    },
                },
            },
        },
        include: {
            author: {
                select: {
                    name: true,
                    avatar: true,
                },
            },
            _count: {
                select: {
                    likes: true,
                },
            },
        },
        take: 3,
    });

    return posts;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const post = await getPost(params.slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: `${post.title} | ShareOverCoffee`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.createdAt.toISOString(),
            authors: [post.author.name],
            images: post.coverImage ? [post.coverImage] : [],
        },
    };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
    const post = await getPost(params.slug);

    if (!post) {
        notFound();
    }

    const tagIds = post.tags.map((t) => t.tag.id);
    const relatedPosts = await getRelatedPosts(post.id, tagIds);

    const currentUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/blog/${post.slug}`;

    return (
        <>
            <ReadingProgress />

            <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <header className="mb-12 space-y-6 animate-fade-in">
                        {/* Edit Button */}
                        <div className="flex justify-end">
                            <EditButton postSlug={post.slug} authorId={post.author.id} />
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((postTag) => (
                                <Link
                                    key={postTag.tag.slug}
                                    href={`/search?tag=${postTag.tag.slug}`}
                                    className="text-xs font-medium px-3 py-1 rounded-full bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
                                >
                                    {postTag.tag.name}
                                </Link>
                            ))}
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance">
                            {post.title}
                        </h1>

                        {/* Excerpt */}
                        <p className="text-xl text-muted-foreground">{post.excerpt}</p>

                        {/* Author & Meta */}
                        <div className="flex items-center justify-between py-6 border-y border-border">
                            <div className="flex items-center space-x-4">
                                {/* Author Avatar */}
                                <Link href={`/profile/${post.author.id}`}>
                                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted">
                                        {post.author.avatar ? (
                                            <Image
                                                src={post.author.avatar}
                                                alt={post.author.name || 'Author'}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground text-lg font-medium">
                                                {(post.author.name || 'U').charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                </Link>

                                {/* Author Info */}
                                <div>
                                    <Link
                                        href={`/profile/${post.author.id}`}
                                        className="font-semibold hover:text-primary transition-colors"
                                    >
                                        {post.author.name || 'Unknown Author'}
                                    </Link>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(post.createdAt)} · {post.readingTime} min read
                                    </p>
                                </div>
                            </div>

                            {/* Engagement */}
                            <div className="flex items-center space-x-4">
                                <LikeButton postId={post.id} initialLikes={post._count.likes} />
                                <BookmarkButton postId={post.id} postSlug={post.slug} />
                            </div>
                        </div>
                    </header>

                    {/* Cover Image */}
                    {post.coverImage && (
                        <div className="relative h-96 mb-12 rounded-lg overflow-hidden">
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div
                        className="prose prose-lg prose-invert max-w-none mb-12
                            prose-headings:font-bold prose-headings:text-foreground
                            prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                            prose-p:text-muted-foreground prose-p:leading-relaxed
                            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-foreground prose-strong:font-semibold
                            prose-code:text-primary prose-code:bg-secondary prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                            prose-pre:bg-secondary prose-pre:border prose-pre:border-border
                            prose-img:rounded-lg prose-img:max-w-full prose-img:h-auto prose-img:my-6
                            prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6
                            prose-li:text-muted-foreground prose-li:my-2
                            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Share */}
                    <div className="py-8 border-y border-border mb-12">
                        <ShareButtons title={post.title} url={currentUrl} />
                    </div>

                    {/* Author Card */}
                    <div className="glass-card p-8 mb-12">
                        <div className="flex items-start space-x-4">
                            <Link href={`/profile/${post.author.id}`}>
                                <div className="relative h-16 w-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                                    {post.author.avatar ? (
                                        <Image
                                            src={post.author.avatar}
                                            alt={post.author.name || 'Author'}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground text-xl font-medium">
                                            {(post.author.name || 'U').charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </Link>
                            <div className="flex-1">
                                <Link
                                    href={`/profile/${post.author.id}`}
                                    className="text-lg font-semibold hover:text-primary transition-colors"
                                >
                                    {post.author.name || 'Unknown Author'}
                                </Link>
                                {post.author.bio && (
                                    <p className="text-muted-foreground mt-2">{post.author.bio}</p>
                                )}
                            </div>
                            <FollowButton userId={post.author.id} />
                        </div>
                    </div>

                    {/* Related Posts */}
                    {relatedPosts.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedPosts.map((relatedPost) => (
                                    <Link
                                        key={relatedPost.id}
                                        href={`/blog/${relatedPost.slug}`}
                                        className="glass-card p-4 card-hover"
                                    >
                                        <h3 className="font-semibold mb-2 line-clamp-2">
                                            {relatedPost.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                            {relatedPost.excerpt}
                                        </p>
                                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                            <span>{relatedPost.author.name}</span>
                                            <span>·</span>
                                            <span>{relatedPost._count.likes} likes</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Comment Section */}
                    <CommentSection postId={post.id} />
                </div>
            </article>
        </>
    );
}
