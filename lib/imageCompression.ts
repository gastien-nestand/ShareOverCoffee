import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    useWebWorker?: boolean;
    quality?: number;
}

export async function compressImage(
    file: File,
    options: CompressionOptions = {}
): Promise<File> {
    const defaultOptions = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        quality: 0.85,
    };

    const compressionOptions = { ...defaultOptions, ...options };

    try {
        const compressedFile = await imageCompression(file, compressionOptions);
        console.log('Original size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
        console.log('Compressed size:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
        return compressedFile;
    } catch (error) {
        console.error('Error compressing image:', error);
        return file; // Return original if compression fails
    }
}

export function createObjectURL(file: File): string {
    return URL.createObjectURL(file);
}

export function revokeObjectURL(url: string): void {
    URL.revokeObjectURL(url);
}
