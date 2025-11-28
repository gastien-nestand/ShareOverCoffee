import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

interface ArticleCardProps {
    post: {
        id: string;
        title: string;
        slug: string;
        excerpt: string;
        coverImage?: string | null;
        readingTime: number;
        createdAt: Date;
        author: {
            name: string | null;
            avatar?: string | null;
        };
        _count?: {
            likes: number;
        };
        tags?: Array<{
            tag: {
                name: string;
                slug: string;
            };
        }>;
    };
    featured?: boolean;
}

export default function ArticleCard({ post, featured = false }: ArticleCardProps) {
    if (featured) {
        // Featured article - horizontal layout
        return (
            <article className="group card-hover">
                <Link href={`/blog/${post.slug}`} className="block">
                    <div className="glass-card overflow-hidden">
                        <div className="md:flex md:flex-row">
                            {/* Cover Image - Left side on desktop */}
                            {post.coverImage && (
                                <div className="relative overflow-hidden bg-muted md:w-1/2 h-64 md:h-96">
                                    <Image
                                        src={post.coverImage}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                            )}

                            {/* Content - Right side on desktop */}
                            <div className={`p-8 space-y-4 ${post.coverImage ? 'md:w-1/2' : 'w-full'} flex flex-col justify-center`}>
                                {/* Tags */}
                                {post.tags && post.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.slice(0, 3).map((postTag) => (
                                            <span
                                                key={postTag.tag.slug}
                                                className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                                            >
                                                {postTag.tag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Title */}
                                <h2 className="text-3xl md:text-4xl font-bold text-balance group-hover:text-primary transition-colors">
                                    {post.title}
                                </h2>

                                {/* Excerpt */}
                                <p className="text-muted-foreground text-lg line-clamp-3">
                                    {post.excerpt}
                                </p>

                                {/* Meta */}
                                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                    <div className="flex items-center space-x-3">
                                        {/* Author Avatar */}
                                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted">
                                            {post.author.avatar ? (
                                                <Image
                                                    src={post.author.avatar}
                                                    alt={post.author.name || 'Author'}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground font-medium">
                                                    {(post.author.name || 'U').charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        {/* Author & Date */}
                                        <div className="text-sm">
                                            <p className="font-medium">{post.author.name || 'Unknown Author'}</p>
                                            <p className="text-muted-foreground text-xs">
                                                {formatDate(post.createdAt)} · {post.readingTime} min read
                                            </p>
                                        </div>
                                    </div>

                                    {/* Likes */}
                                    {post._count && (
                                        <div className="flex items-center space-x-1 text-muted-foreground">
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
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
                                            <span className="text-xs">{post._count.likes}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </article>
        );
    }

    // Regular article - vertical card
    return (
        <article className="group card-hover">
            <Link href={`/blog/${post.slug}`} className="block">
                <div className="glass-card overflow-hidden h-full">
                    {/* Cover Image */}
                    {post.coverImage && (
                        <div className="relative overflow-hidden bg-muted h-48">
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6 space-y-3">
                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {post.tags.slice(0, 3).map((postTag) => (
                                    <span
                                        key={postTag.tag.slug}
                                        className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                                    >
                                        {postTag.tag.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Title */}
                        <h2 className="text-xl font-bold text-balance group-hover:text-primary transition-colors">
                            {post.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-muted-foreground line-clamp-2">
                            {post.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                            <div className="flex items-center space-x-3">
                                {/* Author Avatar */}
                                <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted">
                                    {post.author.avatar ? (
                                        <Image
                                            src={post.author.avatar}
                                            alt={post.author.name || 'Author'}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground text-sm font-medium">
                                            {(post.author.name || 'U').charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                {/* Author & Date */}
                                <div className="text-sm">
                                    <p className="font-medium">{post.author.name || 'Unknown Author'}</p>
                                    <p className="text-muted-foreground text-xs">
                                        {formatDate(post.createdAt)} · {post.readingTime} min read
                                    </p>
                                </div>
                            </div>

                            {/* Likes */}
                            {post._count && (
                                <div className="flex items-center space-x-1 text-muted-foreground">
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
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
                                    <span className="text-xs">{post._count.likes}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
}
