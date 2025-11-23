'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import RichTextEditor from '@/components/RichTextEditor';
import ImageUpload from '@/components/ImageUpload';

interface Tag {
    id: string;
    name: string;
    slug: string;
}

interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage: string | null;
    published: boolean;
    authorId: string;
    tags: Array<{
        tag: Tag;
    }>;
}

export default function EditPostPage({ params }: { params: { slug: string } }) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [post, setPost] = useState<Post | null>(null);
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch available tags
        fetch('/api/tags')
            .then((res) => res.json())
            .then((data) => setAvailableTags(data.tags || []))
            .catch((err) => console.error('Error fetching tags:', err));
    }, []);

    useEffect(() => {
        // Fetch the post to edit
        const fetchPost = async () => {
            try {
                const response = await fetch(`/api/posts/${params.slug}`);
                if (!response.ok) {
                    throw new Error('Post not found');
                }
                const data = await response.json();

                // Check if user is the author
                if (session?.user?.id && data.authorId !== session.user.id) {
                    setError('You are not authorized to edit this post');
                    setIsLoading(false);
                    return;
                }

                setPost(data);
                setTitle(data.title);
                setExcerpt(data.excerpt);
                setContent(data.content);
                setCoverImage(data.coverImage || '');
                setSelectedTags(data.tags.map((t: any) => t.tag.id));
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching post:', err);
                setError('Failed to load post');
                setIsLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchPost();
        } else if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [params.slug, session, status, router]);

    const handleUpdate = async (published: boolean) => {
        if (!session?.user?.id) {
            setError('You must be signed in to edit a post');
            return;
        }

        if (!title.trim() || !excerpt.trim() || !content.trim()) {
            setError('Please fill in all required fields (title, excerpt, and content)');
            return;
        }

        setError('');
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/posts/${params.slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    excerpt,
                    content,
                    coverImage: coverImage || null,
                    published,
                    tags: selectedTags,
                }),
            });

            if (response.ok) {
                const updatedPost = await response.json();
                router.push(`/blog/${updatedPost.slug}`);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to update post');
            }
        } catch (error) {
            console.error('Error updating post:', error);
            setError('An error occurred while updating the post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleTag = (tagId: string) => {
        setSelectedTags((prev) =>
            prev.includes(tagId)
                ? prev.filter((id) => id !== tagId)
                : [...prev, tagId]
        );
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !post) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="glass-card p-8 text-center">
                        <h1 className="text-2xl font-bold mb-4 text-red-500">Error</h1>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        <button
                            onClick={() => router.push('/')}
                            className="btn-primary px-6 py-3"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Edit Your Story</h1>
                    <p className="text-muted-foreground">
                        Update your article and share your latest thoughts
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-2">
                            Title *
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter your article title..."
                            className="w-full px-4 py-3 text-2xl font-bold rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
                            Excerpt *
                        </label>
                        <textarea
                            id="excerpt"
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="Write a brief summary of your article..."
                            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                            rows={3}
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                            {excerpt.length} characters
                        </p>
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Cover Image
                        </label>
                        <ImageUpload
                            value={coverImage}
                            onChange={setCoverImage}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Tags */}
                    {availableTags.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Tags
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {availableTags.map((tag) => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() => toggleTag(tag.id)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedTags.includes(tag.id)
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-secondary hover:bg-secondary/80'
                                            }`}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Content Editor */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Content *
                        </label>
                        <RichTextEditor
                            content={content}
                            onChange={setContent}
                            placeholder="Tell your story..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-6 border-t border-border">
                        <button
                            onClick={() => handleUpdate(true)}
                            disabled={isSubmitting}
                            className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Updating...' : 'Update & Publish'}
                        </button>
                        <button
                            onClick={() => handleUpdate(false)}
                            disabled={isSubmitting}
                            className="btn-secondary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save as Draft
                        </button>
                        <button
                            onClick={() => router.push(`/blog/${params.slug}`)}
                            disabled={isSubmitting}
                            className="btn-secondary px-6 py-3 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Info */}
                    <div className="glass-card p-4 text-sm text-muted-foreground">
                        <p className="mb-2">
                            <strong>✨ Rich Text Editor:</strong> Use the toolbar to format your content with bold, italic, headings, lists, code blocks, quotes, and more.
                        </p>
                        <p className="mb-2">
                            <strong>📸 Instant Image Uploads:</strong> Click the image icon or drag & drop images directly into the editor. Images are automatically compressed and uploaded to Cloudflare R2.
                        </p>
                        <p>
                            <strong>🔒 Note:</strong> The post URL will remain the same even if you change the title. This ensures existing links continue to work.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
