'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    disabled?: boolean;
}

export default function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = (result: any) => {
        setUploading(false);
        if (result.event === 'success') {
            onChange(result.info.secure_url);
        }
    };

    const handleRemove = () => {
        onChange('');
    };

    return (
        <div className="space-y-4">
            {value ? (
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
                    <Image
                        src={value}
                        alt="Upload preview"
                        fill
                        className="object-cover"
                    />
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
                </div>
            ) : (
                <CldUploadWidget
                    uploadPreset="unsigned_upload"
                    onUpload={handleUpload}
                    onOpen={() => setUploading(true)}
                    onClose={() => setUploading(false)}
                    options={{
                        maxFiles: 1,
                        folder: 'overcoffee/posts',
                        resourceType: 'image',
                        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
                        maxFileSize: 5000000, // 5MB
                        sources: ['local', 'url', 'camera'],
                    }}
                >
                    {({ open }) => (
                        <button
                            type="button"
                            onClick={() => open()}
                            disabled={disabled || uploading}
                            className="w-full h-64 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-3 hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
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
                                            PNG, JPG, GIF, WebP up to 5MB
                                        </p>
                                    </div>
                                </>
                            )}
                        </button>
                    )}
                </CldUploadWidget>
            )}
        </div>
    );
}
