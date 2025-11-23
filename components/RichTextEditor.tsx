'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useState, useCallback, useRef } from 'react';
import { compressImage, createObjectURL, revokeObjectURL } from '@/lib/imageCompression';

const lowlight = createLowlight(common);

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({
    content,
    onChange,
    placeholder = 'Start writing...',
}: RichTextEditorProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadingImages = useRef<Map<string, string>>(new Map());

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            Placeholder.configure({
                placeholder,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto',
                },
                inline: true,
                allowBase64: true,
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
        ],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] px-4 py-3',
            },
            handleDrop: (view, event, slice, moved) => {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                    const file = event.dataTransfer.files[0];
                    if (file.type.startsWith('image/')) {
                        event.preventDefault();
                        handleImageUpload(file);
                        return true;
                    }
                }
                return false;
            },
        },
    });

    const handleImageUpload = useCallback(async (file: File) => {
        if (!editor) return;

        try {
            setIsUploading(true);

            // 1. Create instant preview with ObjectURL
            const objectUrl = createObjectURL(file);
            console.log('📸 Showing instant preview:', objectUrl);

            // Insert image immediately with temporary URL
            editor.chain().focus().setImage({
                src: objectUrl,
                alt: 'Uploading...'
            }).run();

            // Track this upload
            uploadingImages.current.set(objectUrl, objectUrl);

            // 2. Compress image
            console.log('🗜️ Compressing image...');
            const compressedFile = await compressImage(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
            });

            // 3. Upload to R2 in background
            console.log('☁️ Uploading to R2...');
            const formData = new FormData();
            formData.append('file', compressedFile);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const { url: r2Url } = await response.json();
            console.log('✅ Upload complete! R2 URL:', r2Url);

            // 4. Replace ObjectURL with R2 URL in editor
            const currentContent = editor.getHTML();
            const updatedContent = currentContent.replace(objectUrl, r2Url);
            editor.commands.setContent(updatedContent);

            // Clean up
            revokeObjectURL(objectUrl);
            uploadingImages.current.delete(objectUrl);

        } catch (error) {
            console.error('❌ Upload error:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    }, [editor]);

    const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        }
        // Reset input so same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [handleImageUpload]);

    if (!editor) {
        return null;
    }

    return (
        <div className="border border-border rounded-lg bg-secondary overflow-hidden flex flex-col max-h-[600px]">
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Toolbar - Sticky */}
            <div className="sticky top-0 z-10 border-b border-border p-2 flex flex-wrap gap-1 bg-background/95 backdrop-blur-sm shadow-sm flex-shrink-0">
                {/* Text Formatting */}
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-accent transition-colors ${editor.isActive('bold') ? 'bg-accent' : ''}`}
                    title="Bold"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
                    </svg>
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-accent transition-colors ${editor.isActive('italic') ? 'bg-accent' : ''}`}
                    title="Italic"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m-4 4h8m-8 8h8" />
                    </svg>
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-2 rounded hover:bg-accent transition-colors ${editor.isActive('strike') ? 'bg-accent' : ''}`}
                    title="Strikethrough"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M9 5h6m-6 14h6" />
                    </svg>
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={`p-2 rounded hover:bg-accent transition-colors ${editor.isActive('code') ? 'bg-accent' : ''}`}
                    title="Inline Code"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Headings */}
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded hover:bg-accent transition-colors font-semibold ${editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}`}
                    title="Heading 1"
                >
                    H1
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-accent transition-colors font-semibold ${editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}`}
                    title="Heading 2"
                >
                    H2
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-2 rounded hover:bg-accent transition-colors font-semibold ${editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''}`}
                    title="Heading 3"
                >
                    H3
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Lists */}
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-accent transition-colors ${editor.isActive('bulletList') ? 'bg-accent' : ''}`}
                    title="Bullet List"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-accent transition-colors ${editor.isActive('orderedList') ? 'bg-accent' : ''}`}
                    title="Numbered List"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 12h18M3 20h18" />
                    </svg>
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`p-2 rounded hover:bg-accent transition-colors ${editor.isActive('codeBlock') ? 'bg-accent' : ''}`}
                    title="Code Block"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded hover:bg-accent transition-colors ${editor.isActive('blockquote') ? 'bg-accent' : ''}`}
                    title="Quote"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Image Upload */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="p-2 rounded hover:bg-accent transition-colors disabled:opacity-50"
                    title="Upload Image"
                >
                    {isUploading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    )}
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Undo/Redo */}
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="p-2 rounded hover:bg-accent transition-colors disabled:opacity-50"
                    title="Undo"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                </button>

                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="p-2 rounded hover:bg-accent transition-colors disabled:opacity-50"
                    title="Redo"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                    </svg>
                </button>
            </div>

            {/* Editor - Scrollable */}
            <div className="overflow-y-auto flex-1">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
