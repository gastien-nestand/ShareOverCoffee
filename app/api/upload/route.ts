import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from '@/lib/r2';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the file from form data
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Only images are allowed' }, { status: 400 });
        }

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const extension = file.name.split('.').pop();
        const filename = `${timestamp}-${randomString}.${extension}`;
        const key = `uploads/${filename}`;

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to R2
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        });

        await r2Client.send(command);

        // Construct public URL
        const publicUrl = R2_PUBLIC_URL
            ? `${R2_PUBLIC_URL}/${key}`
            : `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev/${key}`;

        return NextResponse.json({
            url: publicUrl,
            filename,
            size: file.size,
        });

    } catch (error: any) {
        console.error('Upload error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            code: error.Code || error.code,
            bucket: R2_BUCKET_NAME,
            hasAccessKey: !!process.env.R2_ACCESS_KEY_ID,
            hasSecretKey: !!process.env.R2_SECRET_ACCESS_KEY,
            hasAccountId: !!process.env.R2_ACCOUNT_ID,
        });

        return NextResponse.json(
            {
                error: 'Upload failed',
                details: error.message,
                code: error.Code || error.code
            },
            { status: 500 }
        );
    }
}
