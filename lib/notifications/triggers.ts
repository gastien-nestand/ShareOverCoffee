import { prisma } from '@/lib/prisma';
import { createNotification } from './send-notification';

/**
 * Notify all followers when a new post is published
 */
export async function notifyNewPost(postId: string, authorId: string) {
    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { author: true },
        });

        if (!post) return;

        // Get all followers who have notifications enabled for new posts
        const followers = await prisma.follow.findMany({
            where: {
                followingId: authorId,
                follower: { notifyOnNewPost: true },
            },
            include: { follower: true },
        });

        // Create notifications for all followers
        const notifications = followers.map((follow: any) =>
            createNotification(
                follow.followerId,
                'new_post',
                `New post from ${post.author.name || 'a user'}`,
                post.title,
                `/blog/${post.slug}`,
                authorId
            )
        );

        await Promise.allSettled(notifications);
        console.log(`Sent ${notifications.length} new post notifications`);
    } catch (error) {
        console.error('Error in notifyNewPost:', error);
    }
}

/**
 * Notify post author when someone comments
 */
export async function notifyComment(commentId: string, postId: string, commentAuthorId: string) {
    try {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            include: {
                author: true,
                post: { include: { author: true } },
            },
        });

        if (!comment) return;

        const postAuthorId = comment.post.authorId;

        // Don't notify if author is commenting on their own post
        if (postAuthorId === commentAuthorId) return;

        // Check if post author has comment notifications enabled
        const postAuthor = await prisma.user.findUnique({
            where: { id: postAuthorId },
        });

        if (!postAuthor?.notifyOnComment) return;

        await createNotification(
            postAuthorId,
            'comment',
            `${comment.author.name || 'Someone'} commented on your post`,
            comment.content.substring(0, 100),
            `/blog/${comment.post.slug}#comment-${commentId}`,
            commentAuthorId
        );

        console.log(`Sent comment notification to post author`);
    } catch (error) {
        console.error('Error in notifyComment:', error);
    }
}

/**
 * Notify post author when someone likes their post
 */
export async function notifyLike(postId: string, likerId: string) {
    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { author: true },
        });

        if (!post) return;

        // Don't notify if author is liking their own post
        if (post.authorId === likerId) return;

        // Check if post author has like notifications enabled
        if (!post.author.notifyOnLike) return;

        const liker = await prisma.user.findUnique({
            where: { id: likerId },
        });

        if (!liker) return;

        await createNotification(
            post.authorId,
            'like',
            `${liker.name || 'Someone'} liked your post`,
            post.title,
            `/blog/${post.slug}`,
            likerId
        );

        console.log(`Sent like notification to post author`);
    } catch (error) {
        console.error('Error in notifyLike:', error);
    }
}

/**
 * Notify user when someone follows them
 */
export async function notifyFollow(followerId: string, followingId: string) {
    try {
        // Check if the followed user has follow notifications enabled
        const followedUser = await prisma.user.findUnique({
            where: { id: followingId },
        });

        if (!followedUser?.notifyOnFollow) return;

        const follower = await prisma.user.findUnique({
            where: { id: followerId },
        });

        if (!follower) return;

        await createNotification(
            followingId,
            'follow',
            `${follower.name || 'Someone'} started following you`,
            `Check out their profile to see their posts`,
            `/profile/${follower.id}`,
            followerId
        );

        console.log(`Sent follow notification`);
    } catch (error) {
        console.error('Error in notifyFollow:', error);
    }
}
