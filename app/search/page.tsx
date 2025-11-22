'use client';

import { useState, useEffect, Suspense } from 'react';
import ArticleCard from '@/components/ArticleCard';
import { useSearchParams, useRouter } from 'next/navigation';

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string | null;
    readingTime: number;
    createdAt: Date;
    author: {
        name: string | null;
        avatar: string | null;
    };
    tags: {
        tag: {
            id: string;
            name: string;
            slug: string;
        };
    }[];
    _count: {
        likes: number;
    };
}

interface Tag {
    id: string;
    name: string;
    slug: string;
    _count: {
        posts: number;
    };
}

function SearchContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [posts, setPosts] = useState<Post[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTags();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [searchQuery, selectedTag]);

    const fetchTags = async () => {
        try {
            const response = await fetch('/api/tags');
            const data = await response.json();
            setTags(data.tags || []);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.set('search', searchQuery);
            if (selectedTag) params.set('tag', selectedTag);
            params.set('limit', '50');

            const response = await fetch(`/api/posts?${params.toString()}`);
            const data = await response.json();
            setPosts(data.posts || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateURL();
    };

    const handleTagClick = (tagSlug: string) => {
        if (selectedTag === tagSlug) {
            setSelectedTag('');
        } else {
            setSelectedTag(tagSlug);
        }
        updateURL();
    };

    const updateURL = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.set('q', searchQuery);
        if (selectedTag) params.set('tag', selectedTag);
        const queryString = params.toString();
        router.push(`/search${queryString ? `?${queryString}` : ''}`, { scroll: false });
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedTag('');
        router.push('/search', { scroll: false });
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-12 text-center space-y-6 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold">Explore Articles</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Discover stories, thinking, and expertise from writers on any topic.
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSearch}>
                        <div className="relative">
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search articles..."
                                className="w-full pl-12 pr-4 py-3 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Tags */}
            <section className="mb-12">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Popular Topics</h2>
                    {(searchQuery || selectedTag) && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-primary hover:underline"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <button
                            key={tag.id}
                            onClick={() => handleTagClick(tag.slug)}
                            className={`px-4 py-2 rounded-full transition-colors ${selectedTag === tag.slug
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground hover:bg-accent'
                                }`}
                        >
                            {tag.name}
                            <span className="ml-2 text-xs opacity-70">
                                ({tag._count.posts})
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            {/* All Posts */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                        {searchQuery || selectedTag ? 'Search Results' : 'All Articles'}
                    </h2>
                    <div className="text-sm text-muted-foreground">
                        {isLoading ? 'Loading...' : `${posts.length} article${posts.length !== 1 ? 's' : ''}`}
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="glass-card p-6 animate-pulse">
                                <div className="h-48 bg-secondary rounded-lg mb-4"></div>
                                <div className="h-6 bg-secondary rounded mb-2"></div>
                                <div className="h-4 bg-secondary rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                ) : posts.length > 0 ? (
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
                        <svg
                            className="mx-auto h-12 w-12 text-muted-foreground mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <p className="text-muted-foreground mb-4">
                            {searchQuery || selectedTag
                                ? 'No articles found matching your search.'
                                : 'No articles available yet.'}
                        </p>
                        {(searchQuery || selectedTag) && (
                            <button onClick={clearFilters} className="btn-secondary px-6 py-2">
                                Clear filters
                            </button>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center">Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}
