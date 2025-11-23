'use client';

import { useState } from 'react';
import Image from 'next/image';
import { compressImage } from '@/lib/imageCompression';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    disabled?: boolean;
}

export default function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const handleUpload = async (file: File) => {
        try {
            setUploading(true);
            console.log('📸 Cover image upload started');

            // 1. Show instant preview
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            console.log('✨ Showing preview');

            // 2. Compress image
            const compressedFile = await compressImage(file, {
                maxSizeMB: 2,
                maxWidthOrHeight: 2400,
            });

            // 3. Upload to R2
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
            console.log('✅ Cover image uploaded:', r2Url);

            // 4. Update with R2 URL
            onChange(r2Url);

            // Clean up preview
            URL.revokeObjectURL(objectUrl);
            setPreview(null);

        } catch (error) {
            console.error('❌ Upload error:', error);
            alert('Failed to upload image. Please try again.');
            setPreview(null);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleUpload(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleUpload(file);
        }
    };

    const handleRemove = () => {
        onChange('');
        setPreview(null);
    };

    const displayImage = value || preview;

    return (
        <div className="space-y-4">
            {displayImage ? (
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
                    <Image
                        src={displayImage}
                        alt="Upload preview"
                        fill
                        className="object-cover"
                    />
                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                                <p className="text-white text-sm">Uploading...</p>
                            </div>
                        </div>
                    )}
                    {!uploading && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            disabled={disabled}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            ) : (
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="relative"
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={disabled || uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className="w-full h-64 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-3 hover:border-primary transition-colors">
                        {uploading ? (
                            <>
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                <p className="text-sm text-muted-foreground">Uploading...</p>
                            </>
                        ) : (
                            <>
                                <svg
                                    className="w-12 h-12 text-muted-foreground"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                                <div className="text-center">
                                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        PNG, JPG, GIF, WebP up to 10MB
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
