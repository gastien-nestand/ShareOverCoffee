'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/utils';

interface Comment {
    id: string;
    content: string;
    createdAt: Date;
    author: {
        id: string;
        name: string | null;
        avatar: string | null;
    };
    replies?: Comment[];
}

interface CommentItemProps {
    comment: Comment;
    onReply: (commentId: string, content: string) => void;
    depth?: number;
}

function CommentItem({ comment, onReply, depth = 0 }: CommentItemProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const handleReply = () => {
        if (replyContent.trim()) {
            onReply(comment.id, replyContent);
            setReplyContent('');
            setShowReplyForm(false);
        }
    };

    const maxDepth = 3;
    const canReply = depth < maxDepth;

    return (
        <div className={`${depth > 0 ? 'ml-8 mt-4' : 'mt-6'}`}>
            <div className="flex gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {comment.author.avatar ? (
                        <img
                            src={comment.author.avatar}
                            alt={comment.author.name || 'User'}
                            className="w-10 h-10 rounded-full"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium">
                                {(comment.author.name || 'U').charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

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
                            />
                            <div className="flex gap-2 mt-2">
                                <button onClick={handleReply} className="btn-primary px-4 py-2 text-sm">
                                    Post Reply
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
    initialComments?: Comment[];
}

export default function CommentSection({ postId, initialComments = [] }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            // TODO: Replace with actual user ID from session
            const userId = 'demo-user-id';

            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newComment,
                    postId,
                    userId,
                }),
            });

            if (response.ok) {
                const comment = await response.json();
                setComments([comment, ...comments]);
                setNewComment('');
            } else {
                console.error('Failed to post comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReply = async (parentId: string, content: string) => {
        try {
            // TODO: Replace with actual user ID from session
            const userId = 'demo-user-id';

            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    postId,
                    parentId,
                    userId,
                }),
            });

            if (response.ok) {
                // Refresh comments to show the new reply
                // In a real app, you'd update the state more efficiently
                const commentsResponse = await fetch(`/api/comments?postId=${postId}`);
                if (commentsResponse.ok) {
                    const updatedComments = await commentsResponse.json();
                    setComments(updatedComments);
                }
            } else {
                console.error('Failed to post reply');
            }
        } catch (error) {
            console.error('Error posting reply:', error);
        }
    };

    return (
        <section className="mt-16 pt-16 border-t border-border">
            <h2 className="text-2xl font-bold mb-6">
                Comments ({comments.length})
            </h2>

            {/* New Comment Form */}
            <div className="mb-8">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    rows={4}
                />
                <div className="flex justify-end mt-3">
                    <button
                        onClick={handleSubmitComment}
                        disabled={isSubmitting || !newComment.trim()}
                        className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                    </button>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onReply={handleReply}
                        />
                    ))
                ) : (
                    <div className="text-center py-12 glass-card">
                        <p className="text-muted-foreground">
                            No comments yet. Be the first to share your thoughts!
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
