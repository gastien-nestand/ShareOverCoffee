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

export default function CreatePage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch available tags
        fetch('/api/tags')
            .then((res) => res.json())
            .then((data) => setAvailableTags(data.tags || []))
            .catch((err) => console.error('Error fetching tags:', err));
    }, []);

    const handlePublish = async (published: boolean) => {
        if (!session?.user?.id) {
            setError('You must be signed in to create a post');
            return;
        }

        if (!title.trim() || !excerpt.trim() || !content.trim()) {
            setError('Please fill in all required fields (title, excerpt, and content)');
            return;
        }

        setError('');
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    excerpt,
                    content,
                    coverImage: coverImage || null,
                    published,
                    authorId: session.user.id,
                    tags: selectedTags,
                }),
            });

            if (response.ok) {
                const post = await response.json();
                router.push(`/blog/${post.slug}`);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            setError('An error occurred while creating the post. Please try again.');
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

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Create Your Story</h1>
                    <p className="text-muted-foreground">
                        Share your thoughts and ideas with the world
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
                            onClick={() => handlePublish(true)}
                            disabled={isSubmitting}
                            className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Publishing...' : 'Publish'}
                        </button>
                        <button
                            onClick={() => handlePublish(false)}
                            disabled={isSubmitting}
                            className="btn-secondary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save as Draft
                        </button>
                        <button
                            onClick={() => router.push('/')}
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
                            <strong>📸 Instant Image Uploads:</strong> Click the image icon or drag & drop images directly into the editor. 
                        </p>
                        <p>
                            <strong>🔒 Note:</strong> You must be signed in to publish articles. Posts can be saved as drafts or published immediately.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

