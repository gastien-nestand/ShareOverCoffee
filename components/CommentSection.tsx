'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author: {
        id: string;
        name: string | null;
        avatar: string | null;
    };
    replies?: Comment[];
}

interface CommentItemProps {
    comment: Comment;
    postId: string;
    onReply: (commentId: string, content: string) => void;
    depth?: number;
}

function CommentItem({ comment, postId, onReply, depth = 0 }: CommentItemProps) {
    const { data: session } = useSession();
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReply = async () => {
        if (replyContent.trim()) {
            setIsSubmitting(true);
            await onReply(comment.id, replyContent);
            setReplyContent('');
            setShowReplyForm(false);
            setIsSubmitting(false);
        }
    };

    const maxDepth = 2;
    const canReply = session && depth < maxDepth;

    return (
        <div className={`${depth > 0 ? 'ml-8 mt-4' : 'mt-6'}`}>
            <div className="flex gap-3">
                {/* Avatar */}
                <Link href={`/profile/${comment.author.id}`} className="flex-shrink-0">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted">
                        {comment.author.avatar ? (
                            <Image
                                src={comment.author.avatar}
                                alt={comment.author.name || 'User'}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground text-sm font-medium">
                                {(comment.author.name || 'U').charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </Link>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                    <div className="glass-card p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{comment.author.name || 'Unknown User'}</span>
                            <span className="text-xs text-muted-foreground">
                                {formatDate(new Date(comment.createdAt))}
                            </span>
                        </div>
                        <p className="text-foreground/90 whitespace-pre-wrap">
                            {comment.content}
                        </p>
                    </div>

                    {/* Actions */}
                    {canReply && (
                        <div className="mt-2 flex gap-4 text-sm">
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                Reply
                            </button>
                        </div>
                    )}

                    {/* Reply Form */}
                    {showReplyForm && (
                        <div className="mt-3">
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write a reply..."
                                className="w-full px-4 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                rows={3}
                                disabled={isSubmitting}
                            />
                            <div className="flex gap-2 mt-2">
                                <button onClick={handleReply} disabled={isSubmitting || !replyContent.trim()} className="btn-primary px-4 py-2 text-sm disabled:opacity-50">
                                    {isSubmitting ? 'Posting...' : 'Post Reply'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowReplyForm(false);
                                        setReplyContent('');
                                    }}
                                    className="btn-secondary px-4 py-2 text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-2">
                            {comment.replies.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    postId={postId}
                                    onReply={onReply}
                                    depth={depth + 1}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

interface CommentSectionProps {
    postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
    const { data: session } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/comments?postId=${postId}`);
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitComment = async () => {
        if (!session?.user?.id) {
            setError('You must be signed in to comment');
            return;
        }

        if (!newComment.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        setError('');
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newComment,
                    postId,
                    userId: session.user.id,
                }),
            });

            if (response.ok) {
                const comment = await response.json();
                setComments([comment, ...comments]);
                setNewComment('');
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to post comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            setError('An error occurred while posting your comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReply = async (parentId: string, content: string) => {
        if (!session?.user?.id) return;

        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    postId,
                    parentId,
                    userId: session.user.id,
                }),
            });

            if (response.ok) {
                // Refresh comments to show the new reply
                await fetchComments();
            }
        } catch (error) {
            console.error('Error posting reply:', error);
        }
    };

    return (
        <section className="mt-12 pt-12 border-t border-border">
            <h2 className="text-2xl font-bold mb-6">
                Comments ({comments.length})
            </h2>

            {/* Comment Form */}
            {session ? (
                <div className="mb-8">
                    <div className="flex items-start space-x-3">
                        {/* User Avatar */}
                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                            {session.user.image ? (
                                <Image
                                    src={session.user.image}
                                    alt={session.user.name || 'You'}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground text-sm font-medium">
                                    {(session.user.name || 'U').charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Comment Input */}
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your thoughts..."
                                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                rows={3}
                                disabled={isSubmitting}
                            />
                            {error && (
                                <p className="mt-2 text-sm text-red-500">{error}</p>
                            )}
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={handleSubmitComment}
                                    disabled={isSubmitting || !newComment.trim()}
                                    className="btn-primary px-4 py-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                                </button>
                                {newComment && (
                                    <button
                                        onClick={() => setNewComment('')}
                                        className="btn-secondary px-4 py-2"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="glass-card p-6 mb-8 text-center">
                    <p className="text-muted-foreground mb-3">
                        Sign in to join the conversation
                    </p>
                    <Link href="/auth/signin" className="btn-primary px-6 py-2 inline-block">
                        Sign In
                    </Link>
                </div>
            )}

            {/* Comments List */}
            {isLoading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : comments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                    No comments yet. Be the first to share your thoughts!
                </p>
            ) : (
                <div className="space-y-2">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            postId={postId}
                            onReply={handleReply}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
