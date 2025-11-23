'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface EditButtonProps {
    postSlug: string;
    authorId: string;
}

export default function EditButton({ postSlug, authorId }: EditButtonProps) {
    const { data: session } = useSession();

    // Only show edit button if user is the author
    if (!session?.user?.id || session.user.id !== authorId) {
        return null;
    }

    return (
        <Link
            href={`/edit/${postSlug}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium"
        >
            ✏️ Edit Post
        </Link>
    );
}
